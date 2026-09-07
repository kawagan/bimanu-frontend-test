import { reactive, ref } from 'vue'
import type { StationFormData, Station } from '../types/station'
import { createStation, updateStation } from '../services/stationApi'

export function useStationForm(
  onSaved: () => void | Promise<void>,
  onSuccess?: (mode: 'add' | 'edit') => void,
) {
  const showModal = ref(false)
  const modalMode = ref<'add' | 'edit'>('add')
  const formError = ref('')
  const saving = ref(false)
  const editingObjectId = ref<number | null>(null)

  const form = reactive<StationFormData>({
    address: '',
    longitude: '',
    latitude: '',
  })

  function resetForm() {
    form.address = ''
    form.longitude = ''
    form.latitude = ''
    formError.value = ''
  }

  function openAddModal() {
    modalMode.value = 'add'
    editingObjectId.value = null
    resetForm()
    showModal.value = true
  }

  function openEditModal(station: Station) {
    modalMode.value = 'edit'
    editingObjectId.value = station.objectId ?? null
    form.address = station.address ?? ''
    form.longitude = station.longitude ?? ''
    form.latitude = station.latitude ?? ''
    formError.value = ''
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
  }

  async function saveStation() {
    saving.value = true
    formError.value = ''
    try {
      const payload: StationFormData = {
        address: form.address,
        longitude: form.longitude,
        latitude: form.latitude,
      }
      if (modalMode.value === 'add') {
        await createStation(payload)
      } else if (editingObjectId.value != null) {
        await updateStation(editingObjectId.value, payload)
      }
      showModal.value = false
      onSuccess?.(modalMode.value)
      await onSaved()
    } catch (err) {
      formError.value = err instanceof Error ? err.message : String(err)
    } finally {
      saving.value = false
    }
  }

  return {
    showModal,
    modalMode,
    formError,
    saving,
    form,
    openAddModal,
    openEditModal,
    closeModal,
    saveStation,
  }
}
