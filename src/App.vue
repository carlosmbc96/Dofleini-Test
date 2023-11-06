<script setup>
import RolePermissionManagement from './components/RolePermissionManagement.vue'

const permissions = ['PROJECT:WRITE_W', 'ACCOUNT:WRITE_W', 'PRODUCT:WRITE_W', 'PROJECT:READ', 'ACCOUNT:READ_AFTER', 'PRODUCT:READ', 'PROJECT:DELETE', 'ACCOUNT:DELETE', 'PRODUCT:DELETE', 'PRODUCT:COPY', 'ACCOUNT:UPDATE', 'PRODUCT:UPDATE', 'STORE:BEFORE_READ', 'STORE:WRITE_W', 'CAPTION:BEFORE_READ_AFTER', 'USER:READ', 'USER:UPDATE', 'USER:WRITE_W', 'USER:DELETE', 'USER_ACCOUNT:READ', 'USER_ACCOUNT:UPDATE', 'USER_ACCOUNT:WRITE_W', 'USER_ACCOUNT:DELETE']
const roles = [
  {
    id: '6543bc8607ee6d0914a3d8a6',
    name: 'writer',
    permissions: ['PROJECT:WRITE_W', 'ACCOUNT:WRITE_W', 'PRODUCT:WRITE_W']
  },
  {
    id: '6543bc93bf7aab4bf8982cd0',
    name: 'reader',
    permissions: ['ACCOUNT:READ_AFTER', 'PROJECT:READ', 'PRODUCT:READ']
  },
  {
    id: '6543bc93bf7aab4tf8982cg4',
    name: 'accounter',
    permissions: ['ACCOUNT:READ_AFTER', 'ACCOUNT:UPDATE', 'ACCOUNT:WRITE_W', 'ACCOUNT:DELETE']
  },
  {
    id: '6543bc9c98f9c2320a3cedd9',
    name: 'admin',
    permissions: ['PROJECT:WRITE_W', 'ACCOUNT:WRITE_W', 'PRODUCT:WRITE_W', 'PROJECT:READ', 'ACCOUNT:READ_AFTER', 'PRODUCT:READ', 'PROJECT:DELETE', 'ACCOUNT:DELETE', 'PRODUCT:DELETE', 'PRODUCT:COPY', 'ACCOUNT:UPDATE', 'PRODUCT:UPDATE', 'STORE:BEFORE_READ', 'STORE:WRITE_W', 'CAPTION:BEFORE_READ_AFTER', 'USER:READ', 'USER:UPDATE', 'USER:WRITE_W', 'USER:DELETE', 'USER_ACCOUNT:READ', 'USER_ACCOUNT:UPDATE', 'USER_ACCOUNT:WRITE_W', 'USER_ACCOUNT:DELETE']
  },
  {
    id: '4543bc9c98f9c2320a3cedd9',
    name: 'manager',
    permissions: ['PROJECT:READ', 'ACCOUNT:READ_AFTER', 'PRODUCT:READ', 'PROJECT:DELETE', 'ACCOUNT:DELETE', 'PRODUCT:DELETE', 'ACCOUNT:UPDATE', 'PRODUCT:UPDATE']
  },
  {
    id: '7543bc9c98f9c2320a3cedd9',
    name: 'deleter',
    permissions: ['PROJECT:DELETE', 'ACCOUNT:DELETE', 'PRODUCT:DELETE', 'USER:DELETE', 'USER_ACCOUNT:DELETE']
  },
  {
    id: '1543bc9c98f9c2320a3cedd9',
    name: 'updater',
    permissions: ['ACCOUNT:UPDATE', 'PRODUCT:UPDATE', 'USER:UPDATE', 'USER_ACCOUNT:UPDATE']
  },
  {
    id: '8543bc9c98f9c2320a3cedd9',
    name: 'copier',
    permissions: ['PRODUCT:COPY']
  },
  {
    id: '2543bc2c98f9c2320a3cedd9',
    name: 'storer',
    permissions: ['STORE:BEFORE_READ', 'STORE:WRITE_W']
  },
]
</script>

<template>
  <RolePermissionManagement :roles="roles" :permissions="permissions" />
</template>
