export interface Station {
  objectId?: number
  address?: string
  longitude?: string
  latitude?: string
  distanceKm?: number
}

export interface StationFormData {
  address: string
  longitude: string
  latitude: string
}
