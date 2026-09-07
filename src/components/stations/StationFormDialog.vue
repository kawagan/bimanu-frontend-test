<script setup lang="ts">
import type { StationFormData } from '../../types/station'

const showModal = defineModel<boolean>({ required: true })
const form = defineModel<StationFormData>('form', { required: true })

defineProps<{
  mode: 'add' | 'edit'
  formError: string
  saving: boolean
}>()

const emit = defineEmits<{ save: []; cancel: [] }>()
</script>

<template>
  <v-dialog v-model="showModal" max-width="480">
    <v-card>
      <v-card-title>{{ mode === 'add' ? 'Add station' : 'Edit station' }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="emit('save')">
          <v-text-field v-model="form.address" label="Address" required />
          <v-text-field v-model="form.longitude" label="Longitude" required />
          <v-text-field v-model="form.latitude" label="Latitude" required />
          <v-alert v-if="formError" type="error" class="mb-2">{{ formError }}</v-alert>
          <v-card-actions class="pl-0">
            <v-spacer />
            <v-btn variant="text" @click="emit('cancel')">Cancel</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
