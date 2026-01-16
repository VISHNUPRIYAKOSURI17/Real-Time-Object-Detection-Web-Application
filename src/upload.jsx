// import React, { useState } from "react";
// import { storage, ref, uploadBytes, getDownloadURL } from "./firebase";

// function Upload() {
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState("");

//   const handleUpload = async () => {
//     if (!file) return;
//     const storageRef = ref(storage, `images/${file.name}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);
//     setUrl(downloadURL);
//     alert("File uploaded!");
//   };

//   return (
//     <div>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>Upload</button>
//       {url && <img src={url} alt="uploaded" width="200" />}
//     </div>
//   );
// }

// export default Upload;
