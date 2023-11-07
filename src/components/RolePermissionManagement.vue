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
  if (checkboxStates[role.id]) {
    permissionsByEntity.forEach(entity => {
      entity[1].forEach(permission => role.permissions.push(`${entity[0][0]}:${permission}`))
    })
  }
}

const setPermissionsByEntity = (entity) => {
  roles.forEach(role => {
    role.permissions = role.permissions.filter(perm => perm.split(':')[0] !== entity)
  });
  const permissionsEntity = permissionsByEntity.filter(ent => ent[0][0] === entity)
  if (checkboxStates[entity]) {
    roles.forEach(role => {
      permissionsEntity[0][1].forEach(permission => {
        role.permissions.push(`${entity}:${permission}`)
      });
    })
  }
}

const setPermissionsByPermission = (handlePermission) => {
  roles.forEach((role) => {
    role.permissions = role.permissions.filter((permission) => permission !== handlePermission);
  });
  if (checkboxStates[handlePermission]) {
    roles.forEach(role => {
      role.permissions.push(handlePermission)
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
  permissionsByEntity.forEach(el => {
    if (el[0][0] === entity) {
      el[1] = []
      const indexEntity = permissionsByEntity.findIndex(ent => ent[0][0] === entity);
      if (indexEntity !== -1) {
        const removedEntity = permissionsByEntity.splice(indexEntity, 1);
        permissionsByEntity.push(removedEntity[0]);
      }
    }
  })
  roles.forEach((role) => {
    role.permissions = role.permissions.filter((permission) => permission.split(':')[0] !== entity);
  });
}

const deletePermission = (entity, permissionToRemove) => {
  const entityFiltered = permissionsByEntity.filter(ent => ent[0].includes(entity))
  const permissionIndexToDelete = entityFiltered[0][1].findIndex((perm) => perm === permissionToRemove);
  if (permissionIndexToDelete !== -1) {
    entityFiltered[0][1].splice(permissionIndexToDelete, 1);
  }
  if (entityFiltered[0][1].length === 0) {
    const indexEntity = permissionsByEntity.findIndex(ent => ent[0][0] === entity);
    if (indexEntity !== -1) {
      const removedEntity = permissionsByEntity.splice(indexEntity, 1);
      permissionsByEntity.push(removedEntity[0]);
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

const entities = reactive(filterPermissions(0))

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

const addRole = () => {
  if (validateNewRole()) {
    roles.push({
      id: Date.now().toString(),
      name: newRoleName.value.trim(),
      permissions: addReadPermission()
    })
    newRoleName.value = ''

  }
}

const validateNewRole = () => {
  let validated = false
  const newRoleNameWithoutSpace = newRoleName.value.trim()
  if (roles.every(role => role.name !== newRoleNameWithoutSpace)) {
    if (/^[a-zA-Z ]+$/.test(newRoleNameWithoutSpace) && newRoleNameWithoutSpace.length < 20) {
      validated = true
    }
  }
  return validated
}

const addReadPermission = () => {
  const readPermission = []
  const regex = /(^|[:_])READ($|[:_])/;
  permissionsByEntity.forEach(entity => {
    entity[1].forEach(permission => {
      if (regex.test(`${entity[0][0]}:${permission}`)) {
        readPermission.push(`${entity[0][0]}:${permission}`)
      }
    })
  })
  return readPermission
}

const addPermission = () => {
  const entity = newPermission.value.split(':')[0]
  const newPerm = newPermission.value.split(':')[1]
  if (entities.includes(entity)) {
    permissionsByEntity.forEach(ent => {
      if (ent[0][0] === entity) {
        if (!ent[1].includes(newPerm)) {
          ent[1].push(newPerm)
        }
      }
    })
  } else {
    entities.push(entity)
    permissionsByEntity.push([[entity], [newPerm]])
  }
  closeModal()
}

const validateNewPermission = () => {
  const regex = /^[A-Z]+(_[A-Z]+)?:[A-Z]+(_[A-Z]+)?$/;
  if (regex.test(newPermission.value) && newPermission.value.length < 30) {
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

const returnRolesUpdated = () => {
  console.log(roles);
}

const entityHavePermissions = entity => {
  const entityFound = permissionsByEntity.find(ent => ent[0][0] === entity)
  hover.value = entityFound[1].length !== 0 ? entity : null
}

const permissionsByEntity = reactive(permissionsByEntityFormated())

const showModal = () => modal.value.showModal()
</script>

<template>
  <div class="container">
    <div class="table-wrapper">
      <table>
        <thead>
          <!-- ENTITIES ROW -->
          <tr>
            <th id="cell-invisible">
              <div class="size-cell"></div>
            </th>
            <th :title="modifyText(entity[0][0])" class="entity-head" :colspan="entity[1].length"
              v-for="entity in permissionsByEntity" :key="entity[0][0]" @mouseover="entityHavePermissions(entity[0][0])"
              @mouseleave="setHover(null)">
              <div class="size-cell-container">
                <div class="size-cell">
                  <span v-if="hover !== entity[0][0]">{{ modifyText(entity[0][0]) }}</span>
                  <template v-else>
                    <input type="checkbox" :name="entity[0][0]" :id="entity[0][0]" v-model="checkboxStates[entity[0][0]]"
                      @click="toggleCheckboxEntity(entity[0][0])">
                    <label :for="entity[0][0]"></label>
                    <img src="/trash.svg" @click="deletePermissionsByEntity(entity[0][0])" />
                  </template>
                </div>
              </div>
            </th>
          </tr>
          <!-- ENTITIES ROW -->

          <!-- PERMISSIONS ROW -->
          <tr>
            <th id="fixed-cell">
              <div class="size-cell">
                Roles
              </div>
            </th>
            <template v-for="entity in permissionsByEntity" :key="entity[0][0]">
              <template v-if="entity[1].length !== 0">
                <th :title="modifyText(permission)" class="permission-head" v-for="permission in entity[1]"
                  :key="permission" @mouseover="setHover(`${entity[0][0]}:${permission}`)" @mouseleave="setHover(null)">
                  <div class="size-cell">
                    <span v-if="hover !== `${entity[0][0]}:${permission}`">{{ modifyText(permission) }}</span>
                    <template v-else>
                      <input type="checkbox" :name="`${entity[0][0]}:${permission}`" :id="`${entity[0][0]}:${permission}`"
                        v-model="checkboxStates[`${entity[0][0]}:${permission}`]"
                        @click="toggleCheckboxPermission(`${entity[0][0]}:${permission}`)">
                      <label :for="`${entity[0][0]}:${permission}`"></label>
                      <img src="/trash.svg" @click="deletePermission(entity[0][0], permission)" />
                    </template>
                  </div>
                </th>
              </template>
              <th v-else id="empty-entity"></th>

            </template>
          </tr>
          <!-- PERMISSIONS ROW -->

        </thead>

        <tbody>
          <!-- ROLES ROW -->
          <tr v-for="role in roles" :key="role.id">
            <td :title="role.name" class="role-col" @mouseover="setHover(role.id)" @mouseleave="setHover(null)">
              <div class="size-cell">
                <span v-if="hover !== role.id">{{ role.name }}</span>
                <template v-else>
                  <input style="width: fit-content;" type="checkbox" :name="role.name" :id="role.id"
                    v-model="checkboxStates[role.id]" @click="toggleCheckboxRole(role)">
                  <label :for="role.id"></label>
                  <img src="/trash.svg" @click="deleteRole(role.id)" />
                </template>
              </div>
            </td>

            <!-- X CELL -->
            <template v-for="entity in permissionsByEntity" :key="entity[0][0]">
              <template v-if="entity[1].length !== 0">
                <template v-for="permission in entity[1]" :key="permission">
                  <td class="mark">
                    {{ havePermission(role.permissions, `${entity[0][0]}:${permission}`) }}
                  </td>
                </template>
              </template>
              <td v-else></td>
            </template>
            <!-- X CELL -->

          </tr>
          <!-- ROLES ROW -->

        </tbody>
      </table>

    </div>
    <!-- INPUT ADD ROLE -->
    <div class="add-role-wrapper">
      <input class="add-role" type="text" placeholder="+ Add Role" v-model="newRoleName" @keyup.enter="addRole">
      <button @click="addRole" :style="{ cursor: !validateNewRole() ? 'not-allowed' : 'pointer' }"
        :disabled="!validateNewRole()">+</button>
    </div>
    <!-- INPUT ADD ROLE -->

    <!-- BUTTON ADD PERMISSION -->
    <div class="add-permission" @click="showModal">+ Add Permission</div>
    <!-- BUTTON ADD PERMISSION -->

    <!-- BUTTON SAVE -->
    <button class="btn-save" @click="returnRolesUpdated">Save</button>
    <!-- BUTTON SAVE -->
  </div>

  <!-- MODAL -->
  <dialog ref="modal">
    <button class="btn-close-modal" @click="closeModal">✖️</button>
    <div>
      <input placeholder="ENTITY:ACTION" type="text" v-model="newPermission" @input="validateNewPermission">
      <button :style="{ cursor: !newPermissionIsCorrect ? 'not-allowed' : 'pointer' }" class="btn-ok"
        @click="addPermission" :disabled="!newPermissionIsCorrect">Ok</button>
    </div>
  </dialog>
  <!-- MODAL -->
</template>

<style scoped>
.add-role-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 40px;
}

.add-role-wrapper button {
  position: absolute;
  right: 7px;
  background: transparent linear-gradient(171deg, #4f2d80, #351c58) 0 0 no-repeat;
  border: none;
  padding: 3px 8px;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all .2s;
}

.add-role-wrapper button:active {
  transform: scale(90%);
}

.add-role-wrapper button[disabled] {
  filter: opacity(.3);
}

tr:nth-child(even) {
  background-color: #351c5849;
}

tr:hover {
  background: transparent linear-gradient(171deg, #4f2d80, #351c58) 0 0 no-repeat;
}

dialog div {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 15px;
  padding: 10px 20px;
  justify-content: center;
  height: inherit;
}

.btn-close-modal {
  background-color: transparent;
  border: none;
  filter: brightness(100);
  z-index: 5;
  position: absolute;
  top: 6px;
  right: 6px;
  width: 15px;
  height: 15px;
  font-size: 10px;
  cursor: pointer;
  outline: none;
  transition: transform .2s;
}

.btn-close-modal:hover {
  transform: scale(120%);
}

.btn-save {
  position: absolute;
  bottom: -60px;
  right: 0;
  padding: 10px 30px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  transition: all .2s;
  background: transparent linear-gradient(171deg, #4f2d80, #351c58) 0 0 no-repeat;
}

.btn-save:hover {
  box-shadow: 0 0 10px -1px #553089;
}

.btn-save:active {
  transform: scale(95%);
}

dialog::backdrop {
  background-color: #000000bf;
  backdrop-filter: blur(4px);
}

dialog {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 150px;
  border-radius: 5px;
  border: 0;
  z-index: 10;
  background: transparent linear-gradient(171deg, #4f2d80, #351c58) 0 0 no-repeat;
}


dialog button.btn-ok {
  text-transform: uppercase;
  padding: 5px 15px;
  color: #4f2d80;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  transition: all .2s;
  background: transparent linear-gradient(171deg, white, rgb(181, 181, 181)) 0 0 no-repeat;
}

dialog button.btn-ok[disabled] {
  filter: opacity(.3);
}

dialog input {
  width: 100%;
  height: 40px;
  background-color: #242424;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  color: white;
}

dialog input:focus {
  outline: none;
}

.container {
  position: relative;
  min-width: 300px;
  width: 1200px;
}

.add-permission {
  border: 1px solid white;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
  width: 40px;
  height: 100%;
  cursor: pointer;
  writing-mode: vertical-lr;
  transform: rotate(360deg);
  white-space: nowrap;
  line-height: 2.5;
  border-radius: 5px;
  transition: all .2s;
}

.add-permission:hover {
  background-color: #ffffff0d;
}

.table-wrapper {
  max-height: 400px;
  overflow: auto;
  min-height: 400px;
  margin-right: 40px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-height: 390px;
}

td,
th {
  padding: 10px;
}

input.add-role {
  width: var(--table-wrapper-width);
  text-align: center;
  background-color: #242424;
  border: 1px solid white;
  outline: none;
  color: white;
  padding: 10px 40px 10px 10px;
  font-size: 16px;
  border-radius: 5px;
  transition: all .2s;
}

input.add-role:hover {
  background-color: #ffffff0d;
}

input.add-role::placeholder {
  color: white;
}

th {
  background: transparent linear-gradient(171deg, #4f2d80, #351c58) 0 0 no-repeat;
}

img {
  filter: invert();
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  transition: all .2s;
}

img:active {
  transform: scale(90%);
}

input[type=checkbox] {
  display: none;
}

input[type=checkbox]+label {
  cursor: pointer;
}

label:before {
  content: '';
  background: white;
  border-radius: 5px;
  display: inline-block;
  height: 16px;
  width: 16px;
  text-align: center;
  vertical-align: middle;
}

input[type=checkbox]:checked+label:before {
  content: '✔';
  font-size: 12px;
  font-weight: bolder;
  color: #242424;
}


#cell-invisible {
  border: none;
  background: #242424;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3;
}

#fixed-cell {
  position: sticky;
  top: 41.6px;
  left: 0;
  z-index: 3;
  width: 100px;
}

.role-col {
  background-color: #231339;
  position: sticky;
  left: 0;
  z-index: 1;
}

.entity-head {
  position: relative;
}

.permission-head {
  position: sticky;
  top: 41.6px;
}

.size-cell {
  min-width: 100px;
  max-width: 100px;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.size-cell-container {
  display: flex;
  justify-content: center;
}

.mark {
  filter: brightness(100);
}

thead {
  position: sticky;
  top: 0;
  z-index: 2;
}

#empty-entity {
  background: #242424;
}
</style>
