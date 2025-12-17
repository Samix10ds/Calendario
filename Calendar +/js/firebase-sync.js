// js/firebase-sync.js

// INCOLLA QUI SOTTO LA CONFIG DI FIREBASE (Project settings → Web app)
const firebaseConfig = {
  apiKey: "AIzaSyCTxMztnEijklrJxAz1lMyWj7q2o6o8pWw",
  authDomain: "calendario-family-eecbc.firebaseapp.com",
  projectId: "calendario-family-eecbc",
  storageBucket: "calendario-family-eecbc.firebasestorage.app",
  messagingSenderId: "722707097350",
  appId: "1:722707097350:web:77b0315563303933a56087"
};

let db = null;

function initFirebaseSync() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.firestore();
}

// Eventi
async function syncEventsToCloud(events) {
  if (!db) return;
  const batch = db.batch();
  const colRef = db.collection("familyTimeEvents");

  const snap = await colRef.get();
  snap.forEach(doc => batch.delete(doc.ref));

  events.forEach(ev => {
    const docRef = colRef.doc(ev.id.toString());
    batch.set(docRef, ev);
  });

  await batch.commit();
}

async function loadEventsFromCloud() {
  if (!db) return [];
  const snap = await db.collection("familyTimeEvents").get();
  const result = [];
  snap.forEach(doc => result.push(doc.data()));
  return result;
}

// Note
async function syncNotesToCloud(notesObj) {
  if (!db) return;
  await db.collection("familyTimeMeta").doc("dayNotes").set(notesObj);
}

async function loadNotesFromCloud() {
  if (!db) return {};
  const doc = await db.collection("familyTimeMeta").doc("dayNotes").get();
  if (!doc.exists) return {};
  return doc.data() || {};
}

window.FamilyCloud = {
  initFirebaseSync,
  syncEventsToCloud,
  loadEventsFromCloud,
  syncNotesToCloud,
  loadNotesFromCloud
};