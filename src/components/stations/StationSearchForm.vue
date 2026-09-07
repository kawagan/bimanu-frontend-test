<script setup lang="ts">
const lat = defineModel<number>('lat', { required: true })
const lng = defineModel<number>('lng', { required: true })
const radius = defineModel<number>('radius', { required: true })

defineProps<{ loading: boolean }>()
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <v-form class="mb-6" @submit.prevent="emit('submit')">
    <v-row dense align="center">
      <v-col cols="12" sm="3">
        <v-text-field
          v-model.number="lat"
          label="Lat"
          type="number"
          step="any"
          required
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field
          v-model.number="lng"
          label="Lng"
          type="number"
          step="any"
          required
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="radius" :items="[2, 5, 10]" label="Radius (km)" required hide-details />
      </v-col>
      <v-col cols="12" sm="3" class="d-flex align-center justify-start">
        <v-btn type="submit" color="primary" :loading="loading">Search</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
