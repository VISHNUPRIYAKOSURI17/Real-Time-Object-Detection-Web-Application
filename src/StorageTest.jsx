import React, { useState } from "react";
import { storage, ref, uploadBytes, getDownloadURL } from "./firebase"; // path to your firebase.js

function StorageTest() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first!");
    try {
      const storageRef = ref(storage, `test-files/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setUrl(downloadURL);
      alert("File uploaded!");
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div>
      <h2>Firebase Storage Test</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload File</button>
      {url && (
        <div>
          <p>File uploaded! Preview:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          <br />
          <img src={url} alt="Uploaded" style={{ maxWidth: "300px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
}

export default StorageTest;
