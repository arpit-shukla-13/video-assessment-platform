"use client";

import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getKeycloakInstance } from '../lib/keycloak';

const UploadResumePage = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // 1. User ID nikalna Keycloak se
  useEffect(() => {
    const kc = getKeycloakInstance();
    // Agar user logged in hai to token se ID ya Email nikal lo
    if (kc && kc.tokenParsed) {
      const id = kc.tokenParsed.sub || kc.tokenParsed.preferred_username;
      setUserId(id);
    } else {
        // Fallback agar direct access kiya bina login ke
        const localToken = localStorage.getItem('user_token');
        if(!localToken) router.push('/login');
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      // Backend API Call (Localhost 8080)
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/resume/upload`, {
        method: 'POST',
        body: formData, // Content-Type header mat lagana, browser khud set karega boundary ke saath
      });

      if (!response.ok) {
        throw new Error("Upload Failed");
      }

      const data = await response.json();
      console.log("AI Questions Generated:", data);

      // 2. Data ko LocalStorage me save karte hain taaki agle page pe dikha sakein
      // (Backend me DB me save ho chuka hai, par ye quick access ke liye hai)
      localStorage.setItem('current_assessment_questions', data.aiData);
      localStorage.setItem('current_assessment_id', data.assessmentId);

      // 3. Redirect to Assessment Page
      router.push('/assessment');

    } catch (error) {
      console.error(error);
      alert("Error processing resume. Make sure Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText size={32} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h1>
        <p className="text-gray-500 mb-8">
          Our AI will analyze your skills and generate a personalized technical assessment for you.
        </p>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 mb-6 hover:bg-gray-50 transition-colors relative">
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
             {file ? (
                <div className="flex items-center text-green-600 font-medium">
                    <CheckCircle className="mr-2" />
                    {file.name}
                </div>
             ) : (
                <>
                    <Upload className="text-gray-400 mb-3" size={40} />
                    <span className="text-indigo-600 font-semibold">Click to Upload PDF</span>
                </>
             )}
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
            !file || loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Analyzing with AI...
            </span>
          ) : (
            "Generate My Assessment"
          )}
        </button>

      </div>
    </div>
  );
};

export default UploadResumePage;