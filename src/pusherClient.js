import { db } from './firebaseClient';
import { ref, push, serverTimestamp } from 'firebase/database';

export const trackEvent = (boutiqueId, eventType, data = {}) => {
  try {
    const normalizedId = boutiqueId
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
    const eventsRef = ref(db, `tracking/${normalizedId}/events`);
    push(eventsRef, {
      type: eventType,
      data,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error('Firebase tracking error:', err);
  }
};