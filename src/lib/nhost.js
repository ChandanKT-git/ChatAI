import { NhostClient } from '@nhost/react'

// Check if environment variables are accessible
const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN
const region = import.meta.env.VITE_NHOST_REGION
const backendUrl = import.meta.env.VITE_NHOST_BACKEND_URL

// Validate environment variables
if (!subdomain || !region || !backendUrl) {
  console.error('❌ Missing Nhost environment variables!')
  console.error('Please check your .env.local file')
}

// Create Nhost client with error handling
export const nhost = new NhostClient({
  subdomain: subdomain || 'demo',
  region: region || 'us-east-1',
  backendUrl: backendUrl || 'https://demo.us-east-1.nhost.run',
})

// Test connection
nhost.auth.onAuthStateChanged((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('✅ User signed in successfully')
  } else if (event === 'SIGNED_OUT') {
    console.log('👋 User signed out')
  }
})

// Export for debugging
export const nhostConfig = {
  subdomain,
  region,
  backendUrl,
  isValid: !!(subdomain && region && backendUrl)
}
