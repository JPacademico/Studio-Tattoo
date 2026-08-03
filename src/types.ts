export type Artist = {
  id: string
  name: string
  role: string
  instagram: string
  /** E.164 digits, no `+` — wa.me wants it exactly like this. */
  whatsapp: string
  specialties: string[]
  bio: string
  photoId: string
  since: number
  /** 0 = Sunday … 6 = Saturday. */
  workdays: number[]
  /** Slot start times, 24h `HH:MM`. */
  slots: string[]
  sessionMinutes: number
}

export type GalleryPiece = {
  id: string
  photoId: string
  alt: string
  /** Shown handwritten on the polaroid. */
  date: string
  artistId: string
  style: string
  note?: string
  /** Degrees of rotation for the scattered board layout. */
  tilt: number
}

export type ProcessStep = {
  number: string
  title: string
  body: string
  photoId: string
}

export type FaqItem = {
  question: string
  answer: string
}

/** Which half of the booking page the user is on. */
export type BookingMode = 'agendar' | 'planejar'

/**
 * Persisted to localStorage so a refresh mid-booking doesn't lose progress.
 * Attachments are deliberately kept out — object URLs die with the page.
 */
export type BookingDraft = {
  artistId: string | null
  date: string | null
  time: string | null
  name: string
  phone: string
  idea: string
}

export type Attachment = {
  id: string
  name: string
  size: number
  previewUrl: string
}
