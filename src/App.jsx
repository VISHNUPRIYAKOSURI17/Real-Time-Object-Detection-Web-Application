// src/App.jsx
import React, { useRef, useEffect, useState } from "react";
import { firestore, storage, collection, addDoc, ref, uploadBytes, getDownloadURL } from "./firebase";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [objectCounts, setObjectCounts] = useState({});
  const [currentObjects, setCurrentObjects] = useState([]);
  const uploadedObjectsRef = useRef(new Set());

  const colors = {
    person: "#00FFFF",
    cup: "#FF00FF",
    bottle: "#FFFF00",
    default: "#00FF00",
  };

  const CONFIDENCE_THRESHOLD = 0.6;

  useEffect(() => {
    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    async function detectObjects() {
      const model = await cocoSsd.load();

      const detectFrame = async () => {
        if (!videoRef.current) return;

        const predictions = await model.detect(videoRef.current);
        const ctx = canvasRef.current.getContext("2d");

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        const frameCounts = {};
        const objectsDetectedThisFrame = [];

        for (const prediction of predictions) {
          const { class: className, bbox, score } = prediction;
          if (score < CONFIDENCE_THRESHOLD) continue;

          const [x, y, width, height] = bbox;
          frameCounts[className] = (frameCounts[className] || 0) + 1;
          objectsDetectedThisFrame.push(className);

          // Semi-transparent overlay
          ctx.fillStyle = "rgba(0,255,255,0.2)";
          ctx.fillRect(x, y, width, height);

          // Bounding box with glow for new objects
          ctx.strokeStyle = colors[className] || colors.default;
          ctx.lineWidth = 3;
          ctx.shadowColor = !uploadedObjectsRef.current.has(className) ? "#FFFF00" : "transparent";
          ctx.shadowBlur = !uploadedObjectsRef.current.has(className) ? 15 : 0;
          ctx.strokeRect(x, y, width, height);
          ctx.shadowBlur = 0;

          // Confidence label
          ctx.font = "16px Arial";
          ctx.fillStyle = colors[className] || colors.default;
          ctx.fillText(`${className} (${(score * 100).toFixed(0)}%)`, x, y > 20 ? y - 5 : y + 20);

          // Upload cropped object only once
          if (!uploadedObjectsRef.current.has(className)) {
            uploadedObjectsRef.current.add(className);

            const objectCanvas = document.createElement("canvas");
            objectCanvas.width = width;
            objectCanvas.height = height;
            const objectCtx = objectCanvas.getContext("2d");
            objectCtx.drawImage(videoRef.current, x, y, width, height, 0, 0, width, height);

            objectCanvas.toBlob(async (blob) => {
              if (!blob) return;
              try {
                const fileName = `${className}_${Date.now()}.png`;
                const file = new File([blob], fileName, { type: "image/png" });
                const storageRef = ref(storage, `objects/${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);

                await addDoc(collection(firestore, "detectedObjects"), {
                  name: className,
                  confidence: score,
                  imageUrl: url,
                  createdAt: new Date(),
                });

                console.log("✅ Uploaded:", className);
              } catch (err) {
                console.error("❌ Upload failed:", err);
              }
            }, "image/png");
          }
        }

        setCurrentObjects([...new Set(objectsDetectedThisFrame)]); // only unique names
        setObjectCounts(frameCounts);
        requestAnimationFrame(detectFrame);
      };

      detectFrame();
    }

    setupCamera().then(detectObjects);
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Real-Time Object Detection</h1>

      <div className="video-container">
        <video ref={videoRef} className="video-feed" width="640" height="480" />
        <canvas ref={canvasRef} className="canvas-overlay" width="640" height="480" />

        <div className="object-count-overlay">
          {Object.keys(objectCounts).map(key => (
            <div key={key}>{key}: {objectCounts[key]}</div>
          ))}
        </div>
      </div>
      <div className="detected-names">
        {currentObjects.length > 0 ? currentObjects.join(", ") : "No objects detected"}
      </div>

    </div>
  );
}

export default App;
