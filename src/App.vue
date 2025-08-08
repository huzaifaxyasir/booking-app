<template>
  <div :class="['app', theme]">
    <div class="card">
      <header class="header">
        <h1>🧡 Book Your Appointment</h1>
        
      </header>

      <div class="progress">
        <div :class="['step', currentState === 'idle' ? 'active' : '']">Start</div>
        <div :class="['step', currentState === 'selecting' ? 'active' : '']">Details</div>
        <div :class="['step', currentState === 'confirming' ? 'active' : '']">Confirm</div>
        <div :class="['step', currentState === 'confirmed' ? 'active' : '']">Done</div>
      </div>

      <transition name="fade-slide">
        <div class="content" :key="currentState">
          <p class="state-label">Current state: <strong>{{ currentState }}</strong></p>

          <!-- Idle -->
          <div v-if="currentState === 'idle'">
            <p>Welcome! Click below to begin your booking.</p>
            <button class="btn primary" @click="send({ type: 'START' })">Start Booking</button>
          </div>

          <!-- Selecting -->
          <div v-else-if="currentState === 'selecting'">
            <h2>📋 Booking Details</h2>

            <label for="name">Full Name</label>
            <input v-model="form.name" type="text" id="name" class="input" placeholder="Your name" />

            <label for="email">Email Address</label>
            <input v-model="form.email" type="email" id="email" class="input" placeholder="you@example.com" />

            <label for="phone">Phone Number</label>
            <input v-model="form.phone" type="tel" id="phone" class="input" placeholder="+92 300 1234567" />

            <label for="date">Date</label>
            <input v-model="form.date" type="date" id="date" class="input" />

            <label for="event">Event Type</label>
            <select v-model="form.event" class="dropdown" id="event">
              <option disabled value="">Choose an event</option>
              <option>Consultation</option>
              <option>Therapy Session</option>
              <option>Coaching Call</option>
              <option>Design Review</option>
              <option>Technical Interview</option>
              <option>Product Demo</option>
              <option>Strategy Meeting</option>
            </select>

            <label for="slot">Time Slot</label>
            <select v-model="form.slot" class="dropdown" id="slot">
              <option disabled value="">Choose a slot</option>
              <option>10:00 AM</option>
              <option>12:00 PM</option>
              <option>3:00 PM</option>
              <option>5:00 PM</option>
            </select>

            <label for="notes">Additional Notes</label>
            <textarea v-model="form.notes" id="notes" class="textarea" placeholder="Any special requests?"></textarea>

            <div class="actions">
              <button class="btn secondary" @click="send({ type: 'BACK' })">Back</button>
              <button class="btn primary" :disabled="!isFormValid" @click="send({ type: 'NEXT' })">Next</button>
            </div>
          </div>

          <!-- Confirming -->
          <div v-else-if="currentState === 'confirming'">
            <h2>✅ Confirm Your Booking</h2>

            <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>

            <ul class="summary">
              <li><strong>Name:</strong> {{ form.name }}</li>
              <li><strong>Email:</strong> {{ form.email }}</li>
              <li><strong>Phone:</strong> {{ form.phone }}</li>
              <li><strong>Date:</strong> {{ form.date }}</li>
              <li><strong>Event:</strong> {{ form.event }}</li>
              <li><strong>Time:</strong> {{ form.slot }}</li>
              <li><strong>Notes:</strong> {{ form.notes || 'None' }}</li>
            </ul>

            <div class="actions">
              <button class="btn secondary" @click="send({ type: 'BACK' })">Back</button>
              <button class="btn primary" @click="send({ type: 'CONFIRM' })">Confirm</button>
            </div>
          </div>

          <!-- Confirmed -->
          <div v-else-if="currentState === 'confirmed'">
            <p class="success">
              🎉 Your <strong>{{ form.event }}</strong> on <strong>{{ form.date }}</strong> at <strong>{{ form.slot }}</strong> is confirmed!
            </p>
            <button class="btn secondary" @click="reset">Book Another</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { createMachine, interpret } from 'xstate'

export default {
  setup() {
    const currentState = ref('idle')
  
    const form = ref({
      name: '',
      email: '',
      phone: '',
      date: '',
      event: '',
      slot: '',
      notes: ''
    })

    const bookedEmails = ref(new Set())
    const errorMessage = ref('')
    let service

    const bookingMachine = createMachine({
      id: 'booking',
      initial: 'idle',
      states: {
        idle: { on: { START: 'selecting' } },
        selecting: {
          on: {
            NEXT: 'confirming',
            BACK: 'idle'
          }
        },
        confirming: {
          on: {
            CONFIRM: 'confirmed',
            BACK: 'selecting'
          }
        },
        confirmed: {
          type: 'final'
        }
      }
    })

    const startMachine = () => {
      service = interpret(bookingMachine)
        .onTransition((state) => {
          currentState.value = state.value
        })
        .start()
    }

    onMounted(() => {
      startMachine()
    })

    const send = (event) => {
      if (!service) return

      if (event.type === 'CONFIRM') {
        const email = form.value.email.trim().toLowerCase()
        if (bookedEmails.value.has(email)) {
          errorMessage.value = '❌ This email has already been used to book. Only one booking per email is allowed.'
          return
        } else {
          bookedEmails.value.add(email)
          errorMessage.value = ''
        }
      }

      service.send(event)
    }

    const reset = () => {
      form.value = {
        name: '',
        email: '',
        phone: '',
        date: '',
        event: '',
        slot: '',
        notes: ''
      }
      errorMessage.value = ''
      currentState.value = 'idle'
      startMachine()
    }

    const isFormValid = computed(() => {
      const f = form.value
      return f.name && f.email && f.phone && f.date && f.event && f.slot
    })

    return {
      currentState,
      form,
      send,
      reset,
      isFormValid,
      errorMessage,
      
    }
  }
}
</script>


<style scoped>
.app {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
  background-color: #fff7f0;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #ff6b00;
  margin-bottom: 30px;
  font-size: 28px;
  text-align: center;
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.step {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-bottom: 4px solid #ccc;
  color: #999;
  font-weight: bold;
}

.step.active {
  border-color: #ff6b00;
  color: #ff6b00;
}

.state-label {
  margin-bottom: 20px;
  font-size: 15px;
  color: #555;
}

label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.input,
.dropdown,
.textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.textarea {
  min-height: 80px;
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;
}

.btn.primary {
  background-color: #ff6b00;
  color: white;
}

.btn.primary:hover {
  background-color: #e65c00;
}

.btn.secondary {
  background-color: #fff;
  color: #ff6b00;
  border: 2px solid #ff6b00
}
.btn.secondary:hover {
  background-color: #fff3e6;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  color: #28a745;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
}

.summary {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.summary li {
  margin-bottom: 8px;
  font-size: 16px;
}

.error-box {
  background-color: #ffe6e6;
  color: #cc0000;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: bold;
}

fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>