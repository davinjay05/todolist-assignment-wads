import admin from "firebase-admin";

let initialized = false;

function ensureInitialized() {
  if (initialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase admin credentials are not configured");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  }

  initialized = true;
}

export function getAdminAuth() {
  ensureInitialized();
  return admin.auth();
}

// NOTE: avoid initializing on module import to prevent build-time errors
