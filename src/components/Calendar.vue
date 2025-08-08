<template>
  <div>
    <label>Select a Date:</label>
    <input type="date" @change="updateDate" />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
const updateDate = (e) => {
  store.commit('setBooking', { date: e.target.value })
}
</script>
