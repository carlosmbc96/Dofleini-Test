<script setup>
import RolePermissionManagement from './components/RolePermissionManagement.vue'
import { ROLES, PERMISSIONS } from './data.js'

</script>

<template>
  <RolePermissionManagement :roles="ROLES" :permissions="PERMISSIONS" />
</template>