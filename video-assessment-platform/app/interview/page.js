"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Clock, LogOut, Play, User, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VideoInterviewPage = () => {
  const router = useRouter();
  const videoRef = useRef(null);
  
  // State management
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (120 seconds)
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  // Camera start karne ka function
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
        setIsInterviewActive(true);
      }
    } catch (err) {
      setError("Camera access denied. Please allow permissions in your browser.");
      console.error("Error accessing media devices.", err);
    }
  };

  // Camera stop karne ka function (Cleanup)
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setStreamActive(false);
      setIsInterviewActive(false);
    }
  };

  // Component unmount hone par camera band karo
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Timer Logic
  useEffect(() => {
    let intervalId;
    if (isInterviewActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(intervalId);
  }, [isInterviewActive, timeLeft]);

  const handleSessionEnd = () => {
    stopCamera();
    // Agla step: Assessment Form
    router.push('/assessment');
  };

  // Time format helper (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Technical Round</h1>
            <p className="text-sm text-gray-500">Live Video Session</p>
          </div>
          
          {isInterviewActive && (
            <div className={`flex items-center space-x-2 text-xl font-mono font-bold px-6 py-2 rounded-lg border-2 ${timeLeft < 30 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
              <Clock size={24} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* 1. Local User Camera */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative shadow-lg border-4 border-gray-800 group">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />
            
            {/* Overlay States */}
            {!streamActive && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900/90">
                <Camera size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Camera is currently off</p>
                <p className="text-sm text-gray-400">Click "Start Session" to begin</p>
              </div>
            )}
            
            {/* Candidate Label */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm flex items-center font-medium">
              <div className={`w-2 h-2 rounded-full mr-2 ${streamActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              You (Candidate)
            </div>
            
            {/* Mic Icon */}
            <div className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full text-white">
               <Mic size={16} />
            </div>
          </div>

          {/* 2. Remote Interviewer (Placeholder) */}
          <div className="bg-gray-800 rounded-2xl aspect-video relative shadow-lg border-4 border-gray-800 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-indigo-400/30">
              <User size={40} className="text-white" />
            </div>
            <h3 className="text-xl text-white font-semibold">AI Evaluator</h3>
            <p className="text-indigo-300 text-sm mt-1">Monitoring Session...</p>

            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/50">
               <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
               <span className="text-xs font-bold text-red-400 tracking-wider">REC</span>
            </div>
          </div>
        </div>

        {/* Controls / Action Area */}
        <div className="flex justify-center">
          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm max-w-2xl w-full">
              <p className="font-bold">Camera Error</p>
              <p>{error}</p>
              <button 
                onClick={startCamera}
                className="mt-3 text-sm underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          ) : (
            !isInterviewActive ? (
              <button 
                onClick={startCamera}
                className="group flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1"
              >
                <Play className="fill-current" size={24} />
                <span>Start Session</span>
              </button>
            ) : (
              <button 
                onClick={handleSessionEnd}
                className="flex items-center space-x-3 bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm"
              >
                <LogOut size={24} />
                <span>End & Proceed to Quiz</span>
              </button>
            )
          )}
        </div>
        
      </div>
    </div>
  );
};

export default VideoInterviewPage;