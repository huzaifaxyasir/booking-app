<template>
  <div>
    <label>Select Time:</label>
    <input type="time" @change="updateTime" />

    <label>Select Service:</label>
    <select @change="updateService">
      <option disabled selected>Select service</option>
      <option>Consultation</option>
      <option>Therapy</option>
      <option>Follow-up</option>
    </select>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
const updateTime = (e) => {
  store.commit('setBooking', { time: e.target.value })
}
const updateService = (e) => {
  store.commit('setBooking', { service: e.target.value })
}
</script>
