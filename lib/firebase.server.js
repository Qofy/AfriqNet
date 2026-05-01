import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let firestoreDb = null;

function initializeFirebase() {
  if (firestoreDb) return firestoreDb;

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    const msg = 'FIREBASE_SERVICE_ACCOUNT environment variable is not set. Set it in your .env.local or deployment platform settings.';
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    }
    console.warn(`⚠️  ${msg}`);
    return null;
  }

  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      });
    }
    firestoreDb = getFirestore();
    return firestoreDb;
  } catch (err) {
    const msg = `Firebase initialization failed: ${err.message}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    }
    console.error(`❌ ${msg}`);
    return null;
  }
}

export const getFirestoreDb = () => {
  const db = initializeFirebase();
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Set FIREBASE_SERVICE_ACCOUNT environment variable.');
  }
  return db;
};
