import { computed, ref, type Ref } from 'vue'
import type { Station } from '../types/station'

export function useStationFilters(stations: Ref<Station[]>) {
  const streetSearch = ref('')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  const displayedStations = computed(() => {
    const query = streetSearch.value.trim().toLowerCase()
    const filtered = query
      ? stations.value.filter((station) => station.address?.toLowerCase().includes(query))
      : stations.value

    return [...filtered].sort((a, b) => {
      const distA = a.distanceKm ?? Number.POSITIVE_INFINITY
      const distB = b.distanceKm ?? Number.POSITIVE_INFINITY
      return sortOrder.value === 'asc' ? distA - distB : distB - distA
    })
  })

  return { streetSearch, sortOrder, displayedStations }
}
