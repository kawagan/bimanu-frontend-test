<script setup lang="ts">
import type { Station } from '../../types/station'

defineProps<{ items: Station[]; loading: boolean }>()
const emit = defineEmits<{ edit: [station: Station]; delete: [station: Station] }>()

const headers = [
  { title: 'Object ID', key: 'objectId' },
  { title: 'Address', key: 'address' },
  { title: 'Longitude', key: 'longitude' },
  { title: 'Latitude', key: 'latitude' },
  { title: 'Distance (km)', key: 'distanceKm' },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script>

<template>
  <div class="text-body-2 text-medium-emphasis mb-2">{{ items.length }} station(s)</div>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    item-value="objectId"
    no-data-text="No stations found."
  >
    <template #[`item.actions`]="{ item }">
      <v-btn size="small" variant="text" icon="mdi-pencil" @click="emit('edit', item)" />
      <v-btn
        size="small"
        variant="text"
        color="error"
        icon="mdi-delete"
        @click="emit('delete', item)"
      />
    </template>
  </v-data-table>
</template>
