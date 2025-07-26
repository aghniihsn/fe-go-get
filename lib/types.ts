export interface User {
  _id: string
  id: string
  email: string
  username: string
  firstname: string
  lastname: string
  gender: "male" | "female"
  phone_number: string
  address: string
  role: "user" | "admin"
  profile_picture_url?: string
  created_at: string
  updated_at: string
}

export interface Film {
  _id: string
  id: string
  title: string
  description: string
  genre: string[]
  duration: number
  rating: "Semua Umur" | "Anak-anak" | "Remaja" | "Dewasa"
  poster_url: string
  release_date?: string
  created_at?: string
  updated_at?: string
}

export interface Schedule {
  _id: string
  id: string
  film_id: string
  film?: Film
  // Updated fields to match API
  tanggal: string // date in YYYY-MM-DD format
  waktu: string // time in HH:MM format
  ruangan: string // "Studio 1", "Studio 2", etc.
  harga: number // price in IDR
  film_title?: string // populated film title
  created_at?: string
  updated_at?: string
  // Legacy fields for backward compatibility
  studio?: string
  show_time?: string
  price?: number
  available_seats?: string[]
}

export interface AvailableSeats {
  available_seats: string[]
  total_seats: number
  occupied_seats: string[]
}

export interface Ticket {
  _id: string
  user_id: string
  user?: User
  jadwal_id: string
  schedule?: Schedule
  kursi: string // Single seat like "A1", "B2", etc.
  status: "confirmed" | "cancelled" | "waiting_for_payment" | "used"
  tanggal_pembelian: string // booking date
  created_at: string
  updated_at: string
  // Computed fields that might be added by frontend
  total_price?: number
  booking_date?: string
  id?: string
  schedule_id?: string
}

export interface TicketSummary {
  tiket: Ticket
  film_title: string
  film_poster: string
  jadwal_waktu: string
  jadwal_tanggal: string
  jadwal_ruangan: string
  harga_tiket: number
  status_pembayaran: "pending" | "completed" | "failed"
  tanggal_pembayaran?: string
}

export interface Payment {
  _id: string
  id: string
  ticket_id: string
  ticket?: Ticket
  user_id: string
  user?: User
  metode_pembayaran: string
  jumlah: number
  status: "pending" | "paid" | "failed"
  bukti_pembayaran?: string
  tanggal_pembayaran?: string
  created_at: string
  updated_at: string
  // Legacy fields for compatibility
  tiket_id: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  logo: string
}

export interface AuthResponse {
  message: string
  token: string
  user: {
    _id: string
    username: string
    email: string
    role: string
  }
}

export interface TicketReceipt {
  ticket: Ticket
  qrCode: string
  receiptUrl?: string
}
