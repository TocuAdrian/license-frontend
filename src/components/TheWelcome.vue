<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getPlatesNumber, savePlateNumber, deletePlateNumber } from '../services/supabaseService'
import type { Plate } from '@/models/platenumber'
import { germanPlateRegex } from '../utils/utils'

const plateNumberValue = ref('')
const plates = ref<Plate[]>([])
const loading = ref(false)
const selectedPlate = ref<Plate | null>(null)

async function handleGetPlatesNumber() {
  loading.value = true
  try {
    const data = await getPlatesNumber()
    plates.value = data || []
  } catch (error) {
    alert('Error fetching plates: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}

async function handleInsertPlateNumber() {
  if (!plateNumberValue.value.trim()) {
    alert('Plate number cannot be empty')
    return
  }

  if (!germanPlateRegex.test(plateNumberValue.value)) {
    alert('Please use the format "AA-123AAA" or "A-1AA23".')
    return
  }

  loading.value = true
  try {
    const newPlate: Plate = {
      id: selectedPlate.value?.id,
      PlateNumber: plateNumberValue.value
    }
    await savePlateNumber(newPlate)
    await handleGetPlatesNumber()
    plateNumberValue.value = ''
  } catch (error) {
    alert('Error inserting plate: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}

async function handleDeletePlateNumber() {
  if (!selectedPlate.value?.id) {
    alert('Please select a plate to delete')
    return
  }

  loading.value = true
  try {
    await deletePlateNumber(selectedPlate.value?.id)
    await handleGetPlatesNumber()
    selectedPlate.value = null
  } catch (error) {
    alert('Error deleting plate: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}

watch(selectedPlate, (newPlate) => {
  plateNumberValue.value = newPlate ? newPlate.PlateNumber : ''
})

onMounted(() => {
  handleGetPlatesNumber()
})
</script>

<template>
  <div v-if="!loading">
    <select v-model="selectedPlate">
      <option :value="null">None</option>
      <option v-for="plate in plates" :key="plate.id" :value="plate">
        {{ plate.PlateNumber }}
      </option>
    </select>
    <input v-model="plateNumberValue" placeholder="Enter some text" />
    <button @click="handleInsertPlateNumber">SAVE</button>
    <button @click="handleDeletePlateNumber" :disabled="loading">DELETE</button>
  </div>

  <div v-if="loading">Loading...</div>
</template>
