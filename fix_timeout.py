import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_effect = """    console.log("Connecting to Firebase...");
    const timeoutId = setTimeout(() => {
      console.warn("Firebase connection timeout after 5s.");
      setDbError("Timeout connecting to database. Please check your network or Firebase config.");
      setLoading(false);
    }, 5000);

    const unsub = onValue(ref(db, 'bistro'), snapshot => {
      clearTimeout(timeoutId);
      console.log("Received data from Firebase!");"""

new_effect = """    console.log("Connecting to Firebase...");
    const timeoutId = setTimeout(() => {
      console.warn("Firebase connection timeout after 15s.");
      setDbError("Koneksi ke database Firebase sangat lambat atau terblokir. Pastikan internet stabil dan tidak ada Ad-Blocker.");
      setLoading(false);
    }, 15000);

    const unsub = onValue(ref(db, 'bistro'), snapshot => {
      clearTimeout(timeoutId);
      setDbError(null); // Clear error if it finally connects
      console.log("Received data from Firebase!");"""

c = c.replace(old_effect, new_effect)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
