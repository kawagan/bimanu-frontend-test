import type { StationFormData, Station } from '../types/station'

// Backend routes and the "adresse" field are fixed by the existing API contract.
const NEARBY_URL = 'http://localhost:3000/api/gasstations/nearby'
const CRUD_BASE = 'http://localhost:3000/api/gasstations'

interface NearbyParams {
  lat: number
  lng: number
  radius: number
}

interface RawStation {
  objectId?: number
  adresse?: string
  longitude?: string
  latitude?: string
  distanceKm?: number
}

function toStation(raw: RawStation): Station {
  return {
    objectId: raw.objectId,
    address: raw.adresse,
    longitude: raw.longitude,
    latitude: raw.latitude,
    distanceKm: raw.distanceKm,
  }
}

function toRawPayload(payload: StationFormData) {
  return {
    adresse: payload.address,
    longitude: payload.longitude,
    latitude: payload.latitude,
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  const text = await response.text()
  return text ? JSON.parse(text) : (undefined as T)
}

export async function fetchNearbyStations(params: NearbyParams): Promise<Station[]> {
  const url = `${NEARBY_URL}?lat=${encodeURIComponent(params.lat)}&lng=${encodeURIComponent(params.lng)}&radius=${encodeURIComponent(params.radius)}`
  const response = await fetch(url)
  const data = await handleResponse<RawStation[] | { data?: RawStation[]; results?: RawStation[] }>(
    response,
  )
  const rawStations = Array.isArray(data) ? data : (data.data ?? data.results ?? [])
  return rawStations.map(toStation)
}

export async function createStation(payload: StationFormData): Promise<void> {
  const response = await fetch(CRUD_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toRawPayload(payload)),
  })
  await handleResponse(response)
}

export async function updateStation(objectId: number, payload: StationFormData): Promise<void> {
  const response = await fetch(`${CRUD_BASE}/${objectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toRawPayload(payload)),
  })
  await handleResponse(response)
}

export async function deleteStation(objectId: number): Promise<void> {
  const response = await fetch(`${CRUD_BASE}/${objectId}`, { method: 'DELETE' })
  await handleResponse(response)
}
