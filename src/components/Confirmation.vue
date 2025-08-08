<template>
  <div>
    <h2>Review Your Booking</h2>
    <p><strong>Date:</strong> {{ booking.date }}</p>
    <p><strong>Time:</strong> {{ booking.time }}</p>
    <p><strong>Service:</strong> {{ booking.service }}</p>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
const booking = store.state.booking
</script>
