import React, { useState } from "react";
import { firestore, collection, addDoc, getDocs } from "./firebase"; // your firebase.js path

function FirestoreTest() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [docs, setDocs] = useState([]);

  const addData = async () => {
    if (!name || !age) return alert("Fill all fields!");
    try {
      await addDoc(collection(firestore, "users"), {
        name,
        age: Number(age),
        createdAt: new Date(),
      });
      alert("Document added!");
      setName("");
      setAge("");
      fetchData();
    } catch (err) {
      console.error("Error adding doc:", err);
    }
  };

  const fetchData = async () => {
    const snapshot = await getDocs(collection(firestore, "users"));
    const allDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDocs(allDocs);
  };

  return (
    <div>
      <h2>Firestore Test</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={addData}>Add Document</button>
      <button onClick={fetchData}>Fetch Documents</button>

      <h3>Documents in Firestore:</h3>
      <ul>
        {docs.map((doc) => (
          <li key={doc.id}>{doc.name} - {doc.age}</li>
        ))}
      </ul>
    </div>
  );
}

export default FirestoreTest;
