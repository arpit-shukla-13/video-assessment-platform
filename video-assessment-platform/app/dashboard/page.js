"use client";

import React, { useEffect, useState } from 'react';
import { Video, FileText, LogOut, User, Cpu, Clock, CheckCircle, XCircle, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getKeycloakInstance } from '../lib/keycloak';

const Dashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('Loading...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // --- STATE FOR MODAL (POPUP) ---
  const [selectedTest, setSelectedTest] = useState(null); // Jo test click kiya uska data yahan aayega

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;
      
      const kc = getKeycloakInstance();
      try {
        const authenticated = await kc.init({ onLoad: 'check-sso', pkceMethod: 'S256' });
        if (authenticated) {
          setupSession(kc);
        } else {
          router.push('/login');
        }
      } catch (error) {
        if (error?.message?.includes('only be initialized once')) {
          if (kc.authenticated) setupSession(kc);
          else router.push('/login');
        }
      }
    };

    const setupSession = (kc) => {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') localStorage.setItem('user_token', kc.token);
      const name = kc.tokenParsed?.name || kc.tokenParsed?.preferred_username;
      const userId = kc.tokenParsed?.sub || kc.tokenParsed?.preferred_username;
      setUserName(name || 'Candidate');
      fetchHistory(userId);
    };

    checkAuth();
  }, [router]);

  const fetchHistory = async (userId) => {
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${apiBaseUrl}/api/resume/history/${userId}`);
        if (response.ok) {
            const data = await response.json();
            setHistory(data);
        }
    } catch (error) {
        console.error("Failed to fetch history", error);
    } finally {
        setLoadingHistory(false);
    }
  };

  const handleLogout = () => {
    const kc = getKeycloakInstance();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    kc.logout({ redirectUri: `${appUrl}/login` });
    localStorage.clear();
  };

  // --- HELPER TO PARSE & DISPLAY RESULT ---
  const renderTestDetails = () => {
    if (!selectedTest) return null;

    let questions = [];
    let userAnswers = {};

    try {
        // Database se string format me aata hai, usse JSON banana padega
        const parsedQuestions = JSON.parse(selectedTest.technicalQuestionsJson);
        questions = parsedQuestions.technicalQuestions || [];
        
        if (selectedTest.userAnswersJson) {
            userAnswers = JSON.parse(selectedTest.userAnswersJson);
        }
    } catch (e) {
        console.error("Parsing Error", e);
        return <div className="p-4 text-red-500">Error loading details. Data corrupted.</div>;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Modal Header */}
                <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Assessment Result</h2>
                        <p className="text-indigo-100 text-sm">
                            Score: {selectedTest.score} / {questions.length}
                        </p>
                    </div>
                    <button 
                        onClick={() => setSelectedTest(null)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto bg-gray-50 space-y-6">
                    {questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const correctAnswer = q.correctAnswer;
                        const isCorrect = userAnswer?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();
                        const isSkipped = !userAnswer;

                        return (
                            <div key={index} className={`p-5 rounded-xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-white'}`}>
                                <p className="font-semibold text-gray-900 mb-3">
                                    {index + 1}. {q.question}
                                </p>
                                
                                <div className="space-y-2 text-sm">
                                    {/* User Answer */}
                                    <div className="flex items-center">
                                        <span className="font-bold w-32 text-gray-500">Your Answer:</span>
                                        {isSkipped ? (
                                            <span className="text-orange-500 font-medium flex items-center">
                                                <AlertCircle size={16} className="mr-1"/> Skipped
                                            </span>
                                        ) : (
                                            <span className={`font-bold flex items-center ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                                                {isCorrect ? <CheckCircle size={16} className="mr-2"/> : <XCircle size={16} className="mr-2"/>}
                                                {userAnswer}
                                            </span>
                                        )}
                                    </div>

                                    {/* Correct Answer (Show only if wrong) */}
                                    {!isCorrect && (
                                        <div className="flex items-center text-green-700 bg-green-100 px-3 py-2 rounded-lg mt-2">
                                            <span className="font-bold w-28">Correct Answer:</span>
                                            <span>{correctAnswer}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t bg-white flex justify-end">
                    <button 
                        onClick={() => setSelectedTest(null)}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">Verifying Secure Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Render Modal if a test is selected --- */}
      {renderTestDetails()}

      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight">TalentVisio</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-indigo-700 px-3 py-1 rounded-full">
                <User size={16} />
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-indigo-500" title="Logout"><LogOut size={20} /></button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>
        
        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white shadow rounded-lg p-5 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/interview')}>
             <div className="flex items-center mb-4">
                <div className="bg-indigo-500 p-3 rounded text-white"><Video /></div>
                <div className="ml-4"><h3 className="text-lg font-bold">Video Introduction</h3></div>
             </div>
             <p className="text-gray-500 text-sm mb-4">Complete a 2-minute video introduction with AI monitoring.</p>
             <span className="text-indigo-600 font-bold">Start Session &rarr;</span>
          </div>
          
          <div className="bg-white shadow rounded-lg p-5 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500" onClick={() => router.push('/upload')}>
             <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded text-green-600"><Cpu /></div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold">AI Skill Assessment</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">New</span>
                </div>
             </div>
             <p className="text-gray-500 text-sm mb-4">Upload your resume and generate a personalized technical quiz instantly.</p>
             <span className="text-green-600 font-bold">Start AI Assessment &rarr;</span>
          </div>
        </div>

        {/* Recent Activity Table */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="mr-2" /> Recent Assessments
        </h2>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {loadingHistory ? (
                <div className="p-8 text-center text-gray-500">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No assessments taken yet.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history.map((item) => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => item.score !== null && setSelectedTest(item)} // Click Handler
                                    className={`transition-colors ${item.score !== null ? 'cursor-pointer hover:bg-indigo-50' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                        {item.score !== null ? <span className="text-indigo-600">{item.score} / 5</span> : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.score !== null ? (
                                            <span className="text-green-600 flex items-center text-sm font-medium"><CheckCircle size={16} className="mr-1"/> Completed</span>
                                        ) : (
                                            <span className="text-yellow-600 text-sm">Incomplete</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {item.score !== null && <span className="text-indigo-600 flex items-center justify-end">View Details <ChevronRight size={16}/></span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;