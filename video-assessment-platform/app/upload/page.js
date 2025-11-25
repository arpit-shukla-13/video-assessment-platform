"use client";

import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Loader2, AlertTriangle, Sparkles, Cpu, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getKeycloakInstance } from '../lib/keycloak';

const UploadResumePage = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // User ID extraction from Keycloak (unchanged backend logic)
  useEffect(() => {
    const kc = getKeycloakInstance();

    const setSessionData = () => {
        if (kc.tokenParsed) {
            const realUserId = kc.tokenParsed.sub || kc.tokenParsed.preferred_username;
            console.log("✅ Real User ID Found:", realUserId);
            setUserId(realUserId);
        }
    };

    if (kc.authenticated) {
        setSessionData();
        return;
    }

    kc.init({ onLoad: 'check-sso', pkceMethod: 'S256' })
      .then((authenticated) => {
          if (authenticated) {
              setSessionData();
          } else {
              console.log("❌ Not Authenticated - Please Login");
          }
      })
      .catch((err) => {
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

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      console.log("File Dropped:", droppedFile.name);
      setFile(droppedFile);
    } else {
      alert("Please drop a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    console.log("--- Upload Button Clicked ---");
    console.log("File Status:", file ? "Present" : "Missing");
    console.log("UserID Status:", userId ? userId : "Missing");

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-2xl w-full relative">
        {/* Glowing Border Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8 text-center">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Analysis
            </div>

            <h1 className="text-4xl font-bold text-white mb-3">
              Upload Your Resume
            </h1>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Get a personalized technical assessment generated by our AI based on your skills and experience
            </p>
          </div>

          {/* User ID Warning */}
          {!userId && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <AlertTriangle size={20} className="mr-3 flex-shrink-0"/>
              <span className="text-sm">Warning: User ID not found. Try refreshing or logging in again.</span>
            </div>
          )}

          {/* Upload Box */}
          <div 
            className={`border-3 border-dashed rounded-2xl p-12 mb-8 transition-all duration-300 relative backdrop-blur-sm ${
              isDragging 
                ? 'border-indigo-400 bg-indigo-500/20 scale-105' 
                : file 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-gray-600 hover:border-indigo-400 hover:bg-gray-700/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center">
              {file ? (
                <div className="flex flex-col items-center text-green-400">
                  <CheckCircle className="mb-3" size={48} />
                  <span className="font-semibold text-lg mb-1">{file.name}</span>
                  <span className="text-green-300 text-sm">Ready for analysis</span>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-5 rounded-2xl mb-4 border border-gray-600">
                    <Upload className="text-gray-400" size={40} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-white font-semibold text-lg block">Click to Upload PDF</span>
                    <span className="text-gray-400 text-sm block">or drag and drop your resume</span>
                    <span className="text-gray-500 text-xs block">Maximum file size: 10MB</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Cpu, label: 'AI Analysis', desc: 'Gemini AI Powered' },
              { icon: Shield, label: 'Secure', desc: 'Encrypted Upload' },
              { icon: Zap, label: 'Instant', desc: 'Quick Assessment' }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 backdrop-blur-sm">
                <feature.icon className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
                <div className="text-white text-sm font-semibold">{feature.label}</div>
                <div className="text-gray-400 text-xs">{feature.desc}</div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`group relative w-full py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 hover:shadow-3xl'
            }`}
          >
            <div className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-3" size={24} />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 transform group-hover:scale-110 transition-transform" size={24} />
                  <span>Generate My Assessment</span>
                </>
              )}
            </div>
          </button>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center">
              <Shield className="w-4 h-4 mr-2" />
              Your file is securely processed and never stored permanently
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResumePage;