<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStations } from '../composables/useStations'
import { useStationFilters } from '../composables/useStationFilters'
import { useStationForm } from '../composables/useStationForm'
import { deleteStation as deleteStationApi } from '../services/stationApi'
import StationSearchForm from './stations/StationSearchForm.vue'
import StationFilterBar from './stations/StationFilterBar.vue'
import StationDataTable from './stations/StationDataTable.vue'
import StationFormDialog from './stations/StationFormDialog.vue'
import ConfirmDialog from './stations/ConfirmDialog.vue'
import type { Station } from '../types/station'

const { lat, lng, radius, stations, loading, error, fetchStations } = useStations()
const { streetSearch, sortOrder, displayedStations, toggleSortOrder } = useStationFilters(stations)

const showSnackbar = ref(false)
const snackbarText = ref('')

function handleFormSuccess(mode: 'add' | 'edit') {
  snackbarText.value =
    mode === 'add' ? 'Station created successfully.' : 'Station updated successfully.'
  showSnackbar.value = true
}

const {
  showModal,
  modalMode,
  formError,
  saving,
  form,
  openAddModal,
  openEditModal,
  closeModal,
  saveStation,
} = useStationForm(fetchStations, handleFormSuccess)

onMounted(fetchStations)

const showDeleteConfirm = ref(false)
const stationToDelete = ref<Station | null>(null)

function handleDelete(station: Station) {
  stationToDelete.value = station
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  const station = stationToDelete.value
  showDeleteConfirm.value = false
  if (!station || station.objectId == null) {
    return
  }
  error.value = ''
  try {
    await deleteStationApi(station.objectId)
    stations.value = stations.value.filter((s) => s.objectId !== station.objectId)
    snackbarText.value = 'Station deleted successfully.'
    showSnackbar.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    stationToDelete.value = null
  }
}
</script>

<template>
  <v-container class="stations">
    <h1 class="text-h4 mb-4">Nearby Stations</h1>

    <StationSearchForm
      v-model:lat="lat"
      v-model:lng="lng"
      v-model:radius="radius"
      :loading="loading"
      @submit="fetchStations"
    />

    <StationFilterBar
      v-model:street-search="streetSearch"
      :sort-order="sortOrder"
      @toggle-sort="toggleSortOrder"
      @add="openAddModal"
    />

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

    <StationDataTable
      :items="displayedStations"
      :loading="loading"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <StationFormDialog
      v-model="showModal"
      v-model:form="form"
      :mode="modalMode"
      :form-error="formError"
      :saving="saving"
      @save="saveStation"
      @cancel="closeModal"
    />

    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Delete station"
      :message="`Really delete station '${stationToDelete?.address ?? ''}'?`"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <v-snackbar v-model="showSnackbar" color="success" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.stations {
  max-width: 960px;
}
</style>
