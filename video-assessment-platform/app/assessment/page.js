"use client";

import React, { useState } from 'react';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AssessmentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    q1: '',
    q2: [],
    q3: ''
  });

  // --- REAL API CALL TO SPRING BOOT ---
  const submitAssessmentToBackend = async (data) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const result = await response.json();
      console.log("Backend Response:", result);
      return result;
    } catch (error) {
      console.error("Error submitting to backend:", error);
      alert(`Connection Failed! Make sure Spring Boot is running on ${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
      await submitAssessmentToBackend(formData);
      
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCheckbox = (val) => {
    setFormData(prev => {
      const newQ2 = prev.q2.includes(val) 
        ? prev.q2.filter(item => item !== val)
        : [...prev.q2, val];
      return { ...prev, q2: newQ2 };
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Assessment Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Your answers have been successfully sent to the Spring Boot Backend.
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
            <p className="text-gray-500 text-sm">Spring Boot & React Proficiency Test</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-lg overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Q1 */}
            <div className="border border-gray-100 rounded-xl p-6 hover:border-indigo-100 transition-colors">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                1. What is the default scope of a bean in Spring Boot? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Prototype', 'Singleton', 'Request', 'Session'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all group">
                    <input 
                      type="radio" 
                      name="q1" 
                      value={opt}
                      required
                      onChange={(e) => setFormData({...formData, q1: e.target.value})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="border border-gray-100 rounded-xl p-6 hover:border-indigo-100 transition-colors">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                2. Which of the following are features of React? (Select all that apply)
              </label>
              <div className="space-y-3">
                {['Virtual DOM', 'Two-way Binding (Default)', 'JSX', 'Component-Based'].map((opt) => (
                  <label key={opt} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all group">
                    <input 
                      type="checkbox" 
                      value={opt}
                      checked={formData.q2.includes(opt)}
                      onChange={() => handleCheckbox(opt)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded border-gray-300"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="border border-gray-100 rounded-xl p-6 hover:border-indigo-100 transition-colors">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                3. Explain how OAuth2 works with Keycloak in your own words. <span className="text-red-500">*</span>
              </label>
              <textarea 
                required
                rows={5}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
                placeholder="Type your answer here (min 50 words)..."
                onChange={(e) => setFormData({...formData, q3: e.target.value})}
              ></textarea>
            </div>
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
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentPage;