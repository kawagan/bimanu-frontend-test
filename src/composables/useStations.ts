import { ref } from 'vue'
import type { Station } from '../types/station'
import { fetchNearbyStations } from '../services/stationApi'

export function useStations() {
  const lat = ref(50.916095)
  const lng = ref(6.9606449)
  const radius = ref(10)

  const stations = ref<Station[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchStations() {
    loading.value = true
    error.value = ''
    try {
      stations.value = await fetchNearbyStations({
        lat: lat.value,
        lng: lng.value,
        radius: radius.value,
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      stations.value = []
    } finally {
      loading.value = false
    }
  }

  return { lat, lng, radius, stations, loading, error, fetchStations }
}
