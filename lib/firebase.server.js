import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let firestoreDb = null;

if (!getApps().length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
    firestoreDb = getFirestore();
  } catch (err) {
    console.error('Firebase initialization error:', err.message);
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
  }
} else if (getApps().length > 0) {
  firestoreDb = getFirestore();
}

export { firestoreDb };
