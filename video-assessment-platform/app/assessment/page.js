"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, FileText, Loader2, AlertCircle, Clock, Award, Zap, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AssessmentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

  // Timer countdown
  useEffect(() => {
    if (submitted || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, questions.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = async () => {
    setLoading(true);
    const assessmentId = localStorage.getItem('current_assessment_id');
    
    if (!assessmentId) {
      alert("Assessment ID missing! Please upload resume again.");
      router.push('/upload');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/resume/submit-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, answers })
      });

      const result = await response.json();
      if (response.ok) {
        setScoreData(result);
        setSubmitted(true);
      } else {
        alert("Auto-submission Failed: " + result.message);
      }
    } catch (error) {
      console.error("Auto-submit Error:", error);
      alert("Server Connection Failed during auto-submission");
    } finally {
      setLoading(false);
    }
  };

  // Load Questions
  useEffect(() => {
    const storedData = localStorage.getItem('current_assessment_questions');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.technicalQuestions && Array.isArray(parsedData.technicalQuestions)) {
          setQuestions(parsedData.technicalQuestions);
        } else {
          alert("Error loading quiz data. Please upload resume again.");
          router.push('/upload');
        }
      } catch (e) {
        console.error("JSON Parse Error", e);
      }
    } else {
      alert("No assessment found. Please upload resume first.");
      router.push('/upload');
    }
  }, [router]);

  const handleOptionSelect = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  // Submit Answers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const assessmentId = localStorage.getItem('current_assessment_id');
    
    if (!assessmentId) {
      alert("Assessment ID missing! Please upload resume again.");
      router.push('/upload');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      
      console.log("Submitting Answers for ID:", assessmentId);

      const response = await fetch(`${apiBaseUrl}/api/resume/submit-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, answers })
      });

      const result = await response.json();
      console.log("Backend Response:", result);

      if (response.ok) {
        setScoreData(result);
        setSubmitted(true);
      } else {
        alert("Submission Failed: " + result.message);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Server Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-2xl w-full relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-indigo-600 rounded-3xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Assessment Submitted!</h2>
            
            {/* Score Card Display */}
            {scoreData && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-gray-700/50 shadow-lg">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-semibold mb-4">
                  <Award className="w-4 h-4 mr-2" />
                  Your Performance Score
                </div>
                <p className="text-lg text-gray-300 mb-4">You scored</p>
                <p className="text-6xl font-extrabold text-white mb-2 bg-gradient-to-r from-green-400 to-indigo-400 bg-clip-text text-transparent">
                  {scoreData.score}
                </p>
                <p className="text-xl text-gray-400">
                  out of <span className="text-white font-semibold">{scoreData.total}</span> points
                </p>
              </div>
            )}

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Your result has been securely saved to your profile and is ready for review.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center mx-auto"
            >
              Go to Dashboard
              <Zap className="ml-3 w-5 h-5 transform group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-400 mx-auto mb-4" size={50} />
          <p className="text-gray-300 text-xl font-medium">Preparing your personalized questions...</p>
          <p className="text-gray-500 mt-2">Powered by AI Technology</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm mb-8 overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                <FileText className="text-white h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Technical Assessment</h1>
                <p className="text-gray-400">AI-Generated Questions based on your Resume</p>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-xl border ${
              timeRemaining < 300 ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
            } backdrop-blur-sm`}>
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-800/50 rounded-full h-2 mb-8 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(Object.keys(answers).length / questions.length) * 100}%` 
            }}
          ></div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {questions.map((q, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 group backdrop-blur-sm"
              >
                <label className="block text-xl font-semibold text-white mb-6">
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {index + 1}. {q.question}
                  </span>
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="space-y-3">
                  {q.options.map((opt, i) => (
                    <label 
                      key={i} 
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 group/option backdrop-blur-sm ${
                        answers[index] === opt 
                          ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/25' 
                          : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={`question-${index}`} 
                        value={opt}
                        required
                        onChange={() => handleOptionSelect(index, opt)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-800"
                      />
                      <span className={`ml-4 text-lg ${
                        answers[index] === opt ? 'text-white font-semibold' : 'text-gray-300 group-hover/option:text-white'
                      }`}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-sm">
              Completed: <span className="text-white font-semibold">{Object.keys(answers).length}</span> of <span className="text-white font-semibold">{questions.length}</span> questions
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`group relative px-10 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:scale-105'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-3" size={20}/>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center">
                  Submit Assessment
                  <Sparkles className="ml-3 w-5 h-5 transform group-hover:scale-110 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentPage;