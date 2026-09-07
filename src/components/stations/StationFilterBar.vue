<script setup lang="ts">
const streetSearch = defineModel<string>('streetSearch', { required: true })

const emit = defineEmits<{ add: [] }>()
</script>

<template>
  <v-row class="mb-4" align="center">
    <v-col cols="12" sm="6">
      <v-text-field
        v-model="streetSearch"
        label="Search street"
        placeholder="e.g. Main Street"
        clearable
        hide-details
      />
    </v-col>
    <v-col cols="12" sm="3" class="text-right">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emit('add')"> Add station </v-btn>
    </v-col>
  </v-row>
</template>
