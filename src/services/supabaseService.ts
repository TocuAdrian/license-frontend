import type { Plate } from '@/models/platenumber'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://duvjstquhvjtnrlvetku.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dmpzdHF1aHZqdG5ybHZldGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMTM0NDgsImV4cCI6MjA0MDU4OTQ0OH0.7Hg8NgaBSe_gwIoNtQ2kHC-IYDcDlRBXoNByQTsp6Ek'
)

export async function getPlatesNumber() {
  const { data } = await supabase.from('Plate').select()
  return data
}

export async function savePlateNumber(plateNumber: Plate) {
  try {
    if (!plateNumber) {
      return
    }

    const { error } = await supabase.from('Plate').upsert(plateNumber)

    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('An unknown error occurred')
    }
  }
}

export async function deletePlateNumber(id: number) {
  try {
    const { error } = await supabase.from('Plate').delete().eq('id', id)

    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('An unknown error occurred')
    }
  }
}
