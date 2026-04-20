import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // DEBUG: See if Auth is working
        console.log("Auth detected UID:", firebaseUser.uid);

        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("FIRESTORE USER DATA FOUND:", data); // <--- LOOK FOR THIS IN CONSOLE
            setUserData(data);
          } else {
            console.error("No document found in 'users' collection for UID:", firebaseUser.uid);
          }
        } catch (err) {
          console.error("Firestore Fetch Error:", err);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, userData, loading };
}