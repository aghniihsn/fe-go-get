export interface User {
  id: string
  email: string
  username: string
  firstname: string
  lastname: string
  gender: "male" | "female"
  phone_number: string
  address: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Film {
  _id: string // Changed from id to _id
  title: string
  description: string
  genre: string[] // Changed from string to string[] (array)
  duration: number
  rating: string
  poster_url: string
  release_date: string
  created_at: string
  updated_at: string
}

export interface Schedule {
  id: string
  film_id: string
  studio: string
  show_time: string
  price: number
  available_seats: string[]
  film?: Film
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  user_id: string
  jadwal_id: string
  kursi: string[]
  status: "active" | "used" | "cancelled"
  total_price: number
  booking_date: string
  schedule?: Schedule
  user?: User
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  tiket_id: string
  user_id: string
  metode_pembayaran: string
  jumlah: number
  status: "pending" | "paid" | "failed"
  bukti_pembayaran?: string
  ticket?: Ticket
  user?: User
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  name: string
  type: string
  icon?: string
}
