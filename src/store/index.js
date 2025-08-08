import { createStore } from 'vuex'

export default createStore({
  state: {
    booking: {
      date: null,
      time: null,
      service: null,
      confirmed: false,
    },
  },
  mutations: {
    setBooking(state, payload) {
      state.booking = { ...state.booking, ...payload }
    },
    confirmBooking(state) {
      state.booking.confirmed = true
    },
  },
})
