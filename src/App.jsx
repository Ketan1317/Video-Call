import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const App = () => {
  const [peerId, setPeerId] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState("");

  // Reference to hold the PeerJS instance
  const peerInstance = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Create a new Peer instance
    const peer = new Peer();

    // When the peer connects and gets an ID from the server
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setPeerId(id);
    });

    // When someone calls me
    peer.on("call", (call) => {
      // Ask for permission to access camera + microphone
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
          // Show my video on the screen
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }

          // Answer the incoming call with my stream
          call.answer(mediaStream);

          // When I receive the remote video stream, show it
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        })
        .catch((err) => console.error("Failed to get local stream", err));
    });

    peerInstance.current = peer; // Save instance
  }, []);

  // Function to call another peer
  const call = (remotePeerIdValue) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((mediaStream) => {
        // Show my video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }

        // Call the other peer with my stream
        const call = peerInstance.current.call(remotePeerIdValue, mediaStream);

        // Show the remote stream when received
        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });
      })
      .catch((err) => console.error("Failed to get local stream", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white flex flex-col items-center justify-center font-sans px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">
          PeerConnect — Video Call 📽️
        </h1>
        <p className="text-gray-400 max-w-lg">
          Connect securely with anyone using their Peer ID. Experience seamless,
          real-time video powered by{" "}
          <span className="font-medium text-white">WebRTC + PeerJS</span>.
        </p>
      </div>

      <div className="mb-6 p-4 bg-neutral-900/70 border border-neutral-700 rounded-xl shadow-lg w-full max-w-md text-center backdrop-blur-sm">
        <p className="text-sm text-gray-400">Your ID</p>
        <p className="text-lg font-mono font-semibold mt-1 text-blue-400">
          {peerId || "Loading..."}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter remote peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 text-gray-200 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
        />
        <button
          onClick={() => call(remotePeerId)}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold  active:scale-95 transition"
        >
          Call
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        <div className="flex flex-col items-center bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 shadow-lg backdrop-blur-sm">
          <h3 className="mb-2 text-gray-300 font-medium">My Video</h3>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-72 h-48 rounded-lg border border-neutral-700 bg-black object-cover"
          />
        </div>

        <div className="flex flex-col items-center bg-neutral-900/60 p-4 rounded-lg border border-neutral-800 shadow-lg backdrop-blur-sm">
          <h3 className="mb-2 text-gray-300 font-medium">Remote Video</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-72 h-48 rounded-lg border border-neutral-700 bg-black object-cover"
          />
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        Built For Fun By {" "}
        <span className="font-medium text-white">Ketan1317</span>
      </footer>
    </div>
  );
};

export default App;
