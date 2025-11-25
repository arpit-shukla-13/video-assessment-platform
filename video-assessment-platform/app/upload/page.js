"use client";

// FIX: Backend URL logic for Vercel vs Localhost
// FIX: Added Console Logs for Debugging

import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getKeycloakInstance } from '../lib/keycloak';

const UploadResumePage = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // 1. User ID nikalna Keycloak se
  // 1. User ID nikalna Keycloak se (CORRECTED VERSION)
  // 1. User ID nikalna Keycloak se (Smart Check Added)
  useEffect(() => {
    const kc = getKeycloakInstance();

    // Helper function: ID set karne ke liye
    const setSessionData = () => {
        if (kc.tokenParsed) {
            const realUserId = kc.tokenParsed.sub || kc.tokenParsed.preferred_username;
            console.log("✅ Real User ID Found:", realUserId);
            setUserId(realUserId);
        }
    };

    // CASE A: Agar Keycloak pehle se hi logged in hai (Already Initialized)
    if (kc.authenticated) {
        setSessionData();
        return; // Yahi ruk jao, dobara init mat karo
    }

    // CASE B: Agar Initialize karna zaroori hai
    kc.init({ onLoad: 'check-sso', pkceMethod: 'S256' })
      .then((authenticated) => {
          if (authenticated) {
              setSessionData();
          } else {
              console.log("❌ Not Authenticated - Please Login");
              // alert("Please login first"); 
          }
      })
      .catch((err) => {
          // Agar error ye hai ki "Already initialized", toh daro mat, bas data utha lo
          const errorMsg = err?.message || err?.toString();
          if (errorMsg.includes('only be initialized once')) {
              console.log("⚠️ Keycloak already running, grabbing ID...");
              if (kc.authenticated) {
                  setSessionData();
              }
          } else {
              console.error("Keycloak Init Error:", err);
          }
      });

  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log("File Selected:", e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    console.log("--- Upload Button Clicked ---");
    console.log("File Status:", file ? "Present" : "Missing");
    console.log("UserID Status:", userId ? userId : "Missing");

    // VALIDATION CHECKS WITH ALERTS
    if (!file) {
        alert("Please select a PDF file first!");
        return;
    }
    if (!userId) {
        alert("User Session not found! Please Login again.");
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      // Environment Variable Check
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      console.log("Sending request to:", `${apiBaseUrl}/api/resume/upload`);

      const response = await fetch(`${apiBaseUrl}/api/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload Failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Success! AI Data:", data);

      localStorage.setItem('current_assessment_questions', data.aiData);
      localStorage.setItem('current_assessment_id', data.assessmentId);

      router.push('/assessment');

    } catch (error) {
      console.error("Upload Error:", error);
      alert(`Error: ${error.message}`);
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
          AI-Powered Analysis
        </p>

        {/* Debug Info (Visible on screen for help) */}
        {!userId && (
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded flex items-center justify-center">
                <AlertTriangle size={16} className="mr-2"/>
                Warning: User ID not found. Try refreshing or logging in again.
            </div>
        )}

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
          // Disabled hata diya taaki click karke alert dekh sakein
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
            loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Analyzing...
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