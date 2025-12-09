import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const listenToDiaryEntries = (callback) => {
  const user = auth.currentUser;

  if (!user) return () => {};

  const entriesRef = collection(db, "users", user.uid, "entries");

  const q = query(entriesRef, orderBy("date", "desc"));

  // Listen for realtime updates
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(entries);
  });

  return unsubscribe;
};
