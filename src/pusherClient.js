import { db } from './firebaseClient';
import { ref, push, serverTimestamp } from 'firebase/database';

export const trackEvent = (boutiqueId, eventType, data = {}) => {
  try {
    const eventsRef = ref(db, `tracking/${boutiqueId}/events`);
    push(eventsRef, {
      type: eventType,
      data,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error('Firebase tracking error:', err);
  }
};