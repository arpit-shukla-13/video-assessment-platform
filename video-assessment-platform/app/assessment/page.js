"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AssessmentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // State questions aur answers ko store karne ke liye
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // Dynamic object: { 0: "Option A", 1: "Option C" }

  // --- 1. Load Questions from LocalStorage ---
  useEffect(() => {
    const storedData = localStorage.getItem('current_assessment_questions');
    
    if (storedData) {
      try {
        // Backend se data string format me aaya tha, usse JSON banayenge
        const parsedData = JSON.parse(storedData);
        
        // Check karenge ki questions sahi format me hain ya nahi
        if (parsedData.technicalQuestions && Array.isArray(parsedData.technicalQuestions)) {
            setQuestions(parsedData.technicalQuestions);
        } else {
            console.error("Format mismatch or empty questions", parsedData);
            // Agar format galat hai to wapas upload pe bhej do
             alert("Error loading quiz data. Please upload resume again.");
             router.push('/upload');
        }
      } catch (e) {
        console.error("JSON Parse Error", e);
      }
    } else {
        // Agar koi data nahi hai to wapas upload page par bhejo
        alert("No assessment found. Please upload resume first.");
        router.push('/upload');
    }
  }, [router]);

  // --- 2. Handle Answer Selection ---
  const handleOptionSelect = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
        ...prev,
        [questionIndex]: selectedOption
    }));
  };

  // --- 3. Submit Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Abhi hum Backend API call simulate kar rahe hain
    // Kyunki abhi humne "Save Answers" API nahi banayi hai
    console.log("Submitting Answers:", answers);

    setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
    }, 1500);
  };

  // --- 4. Render Success Screen ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Assessment Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Your answers have been successfully recorded. Our AI is evaluating your response.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- 5. Loading State ---
  if (questions.length === 0) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <Loader2 className="animate-spin text-indigo-600" size={40} />
              <p className="ml-4 text-gray-600 font-medium">Preparing your personalized questions...</p>
          </div>
      )
  }

  // --- 6. Main Quiz UI ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 p-6 flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <FileText className="text-indigo-600 h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Technical Assessment</h1>
            <p className="text-gray-500 text-sm">AI-Generated Questions based on your Resume</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-lg overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Dynamic Questions Mapping */}
            {questions.map((q, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-6 hover:border-indigo-100 transition-colors">
                    <label className="block text-lg font-medium text-gray-900 mb-4">
                        {index + 1}. {q.question} <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <label 
                                key={i} 
                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all group ${
                                    answers[index] === opt ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'hover:bg-gray-50 border-gray-200'
                                }`}
                            >
                                <input 
                                    type="radio" 
                                    name={`question-${index}`} // Unique name for each question group
                                    value={opt}
                                    required
                                    checked={answers[index] === opt}
                                    onChange={() => handleOptionSelect(index, opt)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-3 text-gray-700 group-hover:text-gray-900">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-medium shadow-md transition-all transform hover:-translate-y-0.5 ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                 <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2" size={20}/> Submitting...
                 </span>
              ) : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentPage;