<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  roles: Array,
  permissions: Array
})

const roles = reactive(props.roles)
const checkboxStates = reactive({})
const hover = ref(null)
const newRoleName = ref('')
const showModal = ref(false)
const newPermission = ref('')
const newPermissionIsCorrect = ref(false)
const modal = ref(null)

const setHover = cell => {
  hover.value = cell
}

const toggleCheckboxRole = cell => {
  checkboxStates[cell.id] = !checkboxStates[cell.id]
  setPermissionsByRole(cell)
}

const toggleCheckboxEntity = cell => {
  checkboxStates[cell] = !checkboxStates[cell]
  setPermissionsByEntity(cell)
}

const toggleCheckboxPermission = cell => {
  checkboxStates[cell] = !checkboxStates[cell]
  setPermissionsByPermission(cell)
}

const setPermissionsByRole = (role) => {
  role.permissions = []
  return checkboxStates[role.id] ? role.permissions = props.permissions : role.permissions
}

const setPermissionsByEntity = (entity) => {
  roles.forEach(role => {
    role.permissions = role.permissions.filter(perm => !perm.includes(entity))
  });
  if (checkboxStates[entity]) {
    roles.forEach(role => {
      permissions.forEach(permission => {
        role.permissions.push(`${entity}:${permission}`)
      })
    })
  }
}

const setPermissionsByPermission = (handlePermission) => {
  roles.forEach((role) => {
    role.permissions = role.permissions.filter((permission) => permission !== handlePermission);
  });
  if (checkboxStates[handlePermission]) {
    roles.forEach(role => {
      permissions.forEach(permission => {
        role.permissions.push(handlePermission)
      })
    })
  }
}

const deleteRole = idToDelete => {
  const indexToDelete = roles.findIndex((role) => role.id === idToDelete);

  if (indexToDelete !== -1) {
    roles.splice(indexToDelete, 1);
  }
}

const deletePermissionsByEntity = entity => {
  permissionsByEntity.value.forEach(el => {
    if (el[0][0] === entity) {
      el[1] = []
      const indexEntity = permissionsByEntity.value.findIndex(ent => ent[0][0] === entity);
      if (indexEntity !== -1) {
        const removedEntity = permissionsByEntity.value.splice(indexEntity, 1);
        permissionsByEntity.value.push(removedEntity[0]);
      }
    }
  })
  roles.forEach((role) => {
    role.permissions = role.permissions.filter((permission) => permission.split(':')[0] !== entity);
  });
}

const deletePermission = (entity, permissionToRemove) => {
  const entityFiltered = permissionsByEntity.value.filter(ent => ent[0].includes(entity))
  const permissionIndexToDelete = entityFiltered[0][1].findIndex((perm) => perm === permissionToRemove);
  if (permissionIndexToDelete !== -1) {
    entityFiltered[0][1].splice(permissionIndexToDelete, 1);
  }
  if (entityFiltered[0][1].length === 0) {
    const indexEntity = permissionsByEntity.value.findIndex(ent => ent[0][0] === entity);
    if (indexEntity !== -1) {
      const removedEntity = permissionsByEntity.value.splice(indexEntity, 1);
      permissionsByEntity.value.push(removedEntity[0]);
    }
  }
  roles.forEach((role) => {
    role.permissions = role.permissions.filter((permission) => permission !== `${entity}:${permissionToRemove}`);
  });
}

const filterPermissions = (element) => {  // element=0 -> entidades, element=1 -> permisos
  const elementNeeds = props.permissions.map(permission => permission.split(':')[element]) // quitar el map para optimizar
  const elementNeedsClean = elementNeeds.filter((val, index, self) => self.indexOf(val) === index)
  return elementNeedsClean
}

const havePermission = (permissionsRole, entityPermission) => permissionsRole.includes(entityPermission) ? '✖️' : ''

const entities = ref(filterPermissions(0))
const permissions = filterPermissions(1)

const permissionsByEntityFormated = () => {
  const result = {};

  props.permissions.forEach((permission) => {
    const [entity, action] = permission.split(':');

    if (!result[entity]) {
      result[entity] = [];
    }

    if (!result[entity].includes(action)) {
      result[entity].push(action);
    }
  });

  const formattedResult = Object.keys(result).map((entity) => ({
    [entity]: result[entity]
  }));

  const finalResult = formattedResult.map((item) => {
    const entity = Object.keys(item)[0];
    const actions = item[entity];
    return [[entity], actions];
  });

  return finalResult
}

const modifyText = text => {
  const words = text.split('_');

  let firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();

  if (words.length > 1) {
    for (let i = 1; i < words.length; i++) {
      firstWord += ' ' + words[i].toLowerCase();
    }
  }

  return firstWord;
}

const addReadPermission = () => {
  const readPermission = []
  entities.value.forEach(entity => {
    readPermission.push(`${entity}:READ`)
  });
  return readPermission
}

const addRole = () => {
  roles.push({
    id: Date.now().toString(),
    name: newRoleName.value,
    permissions: addReadPermission()
  })
  newRoleName.value = ''
}

const addPermission = () => {
  const entity = newPermission.value.split(':')[0]
  const newPerm = newPermission.value.split(':')[1]
  if (entities.value.includes(entity)) {
    permissionsByEntity.value.forEach(ent => {
      if (ent[0][0] === entity) { //hacer que cuando encuentre la entidad pare de buscar
        if (!ent[1].includes(newPerm)) {
          ent[1].push(newPerm)
        }
      }
    })
  } else {
    entities.value.push(entity)
    permissionsByEntity.value.push([[entity], [newPerm]])
  }
  closeModal()
}

const validateNewPermission = () => {
  const regex = /^[A-Z]+(_[A-Z]+)?:[A-Z]+(_[A-Z]+)?$/;
  if (regex.test(newPermission.value)) {
    newPermissionIsCorrect.value = true;
  } else {
    newPermissionIsCorrect.value = false;
  }
}

const closeModal = () => {
  modal.value.close()
  showModal.value = false
  newPermission.value = ''
  newPermissionIsCorrect.value = false
}

const permissionsByEntity = ref(permissionsByEntityFormated())

</script>

<template>
  <div class="container">
    <div class="table-wrapper">
      <table border>
        <!-- ENTITIES ROW -->
        <thead>
          <tr>
            <th id="cell-invisible">
              <div class="min-w"></div>
            </th>
            <th class="entity-head" :colspan="entity[1].length" v-for="entity in permissionsByEntity" :key="entity[0][0]"
              @mouseover="setHover(entity[0][0])" @mouseleave="setHover(null)">
              <div class="min-w">
                <span v-if="hover !== entity[0][0]">{{ modifyText(entity[0][0]) }}</span>
                <template v-else>
                  <input type="checkbox" :name="entity[0][0]" :id="entity[0][0]" v-model="checkboxStates[entity[0][0]]"
                    @click="toggleCheckboxEntity(entity[0][0])">
                  <img src="/trash_icon.svg" @click="deletePermissionsByEntity(entity[0][0])" />
                </template>
              </div>
            </th>
          </tr>

          <!-- PERMISSIONS ROW -->
          <tr>
            <th id="fixed-cell">
              <div class="min-w">
                Roles
              </div>
            </th>
            <template v-for="entity in permissionsByEntity" :key="entity[0][0]">
              <th class="permission-head" v-for="permission in entity[1]" :key="permission"
                @mouseover="setHover(`${entity[0][0]}:${permission}`)" @mouseleave="setHover(null)">
                <div class="min-w">
                  <span v-if="hover !== `${entity[0][0]}:${permission}`">{{ modifyText(permission) }}</span>
                  <template v-else>
                    <input type="checkbox" :name="`${entity[0][0]}:${permission}`" :id="`${entity[0][0]}:${permission}`"
                      v-model="checkboxStates[`${entity[0][0]}:${permission}`]"
                      @click="toggleCheckboxPermission(`${entity[0][0]}:${permission}`)">
                    <img src="/trash_icon.svg" @click="deletePermission(entity[0][0], permission)" />
                  </template>
                </div>
              </th>
            </template>
          </tr>
        </thead>

        <tbody>
          <!-- ROLES ROW -->
          <tr v-for="role in roles" :key="role.id">
            <td class="role-col" @mouseover="setHover(role.id)" @mouseleave="setHover(null)">
              <div class="min-w">
                <span v-if="hover !== role.id">{{ role.name }}</span>
                <template v-else>
                  <input style="width: fit-content;" type="checkbox" :name="role.name" :id="role.id"
                    v-model="checkboxStates[role.id]" @click="toggleCheckboxRole(role)">
                  <img src="/trash_icon.svg" @click="deleteRole(role.id)" />
                </template>
              </div>
            </td>

            <!-- X CELL -->
            <template v-for="entity in permissionsByEntity" :key="entity[0][0]">
              <template v-for="permission in entity[1]" :key="permission">
                <td class="mark">
                  {{ havePermission(role.permissions, `${entity[0][0]}:${permission}`) }}
                </td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>

    </div>
    <input class="add-role" type="text" placeholder="+ Add Role" v-model="newRoleName" @keyup.enter="addRole">
    <div class="add-permission" @click="showModal = true"></div>
  </div>

  <dialog :open="showModal" ref="modal">
    <button @click="closeModal">X</button>
    <input type="text" v-model="newPermission" @input="validateNewPermission">
    <button @click="addPermission" :disabled="!newPermissionIsCorrect">Ok</button>
  </dialog>
</template>

<style scoped>
dialog {
  position: absolute;
  top: 40%;
  margin: 0 auto;
  width: 300px;
  height: 170px;
  padding: 10px;
}

dialog button {
  width: 50px;
  height: 50px;
}

dialog input {
  width: 100%;
  height: 40px;
}

.container {
  position: relative;
}

.add-permission {
  border: 1px solid white;
  position: absolute;
  top: 0;
  right: -40px;
  z-index: 5;
  width: 40px;
  height: 100%;
  cursor: pointer;
}

.table-wrapper {
  width: var(--table-wrapper-width);
  height: auto;
  max-height: 400px;
  overflow: auto;
}

table {
  /* border: 1px solid #553089; */
  width: 100%;
  border-collapse: collapse;
}

td,
th {
  padding: 10px;
}

td.mark {
  /* border: 1px solid #553089; */
}

input.add-role {
  width: var(--table-wrapper-width);
  float: left;
  position: sticky;
  left: 0;
  text-align: center;
  background-color: #242424;
  border: 1px solid white;
  outline: none;
  color: white;
  text-shadow: 0 0 1px white;
  padding: 10px;
  font-size: 16px;
}

th {
  background-color: #553089;
}

img {
  filter: invert();
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}

input[type=checkbox] {
  cursor: pointer;
}

#cell-invisible {
  border: none;
  background-color: #242424;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3;
}

#fixed-cell {
  position: sticky;
  top: 41.6px;
  left: 0;
  z-index: 2;
}

.role-col {
  background-color: #553089;
  position: sticky;
  left: 0;
  z-index: 1;
}

.entity-head {
  position: sticky;
  top: 0;
  left: 100px;
  z-index: 2;
}

.permission-head {
  position: sticky;
  top: 41.6px;
  z-index: 1;
}

.min-w {
  min-width: 100px;
}

.mark {
  filter: brightness(100);
}
</style>
