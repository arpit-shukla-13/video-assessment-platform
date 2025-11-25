"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Video, FileText, LogOut, User, Cpu, Clock, CheckCircle, XCircle, X, ChevronRight, Award, BarChart3, AlertCircle, Calendar, Zap, Sparkles, TrendingUp, Play, Download, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getKeycloakInstance } from '../lib/keycloak';

const Dashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('Loading...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Refs for animations
  const statsRef = useRef(null);
  const chartRef = useRef(null);

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

  // Calculate statistics
  const completedTests = history.filter(item => item.score !== null).length;
  const totalTests = history.length;
  const averageScore = completedTests > 0 
    ? (history.reduce((sum, item) => sum + (item.score || 0), 0) / completedTests).toFixed(1)
    : 0;

  // Performance data for charts
  const performanceData = [
    { label: 'Last Week', score: 4.2 },
    { label: 'Last Month', score: 3.8 },
    { label: 'Current', score: parseFloat(averageScore) }
  ];

  // Skill distribution data
  const skillDistribution = [
    { skill: 'JavaScript', percentage: 85 },
    { skill: 'React', percentage: 78 },
    { skill: 'Node.js', percentage: 72 },
    { skill: 'Database', percentage: 65 }
  ];

  // Enhanced Modal with Advanced Features
  const renderTestDetails = () => {
    if (!selectedTest) return null;

    let questions = [];
    let userAnswers = {};

    try {
        const parsedQuestions = JSON.parse(selectedTest.technicalQuestionsJson);
        questions = parsedQuestions.technicalQuestions || [];
        
        if (selectedTest.userAnswersJson) {
            userAnswers = JSON.parse(selectedTest.userAnswersJson);
        }
    } catch (e) {
        console.error("Parsing Error", e);
        return null;
    }

    const correctAnswers = questions.filter((q, index) => {
      const userAnswer = userAnswers[index];
      return userAnswer?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
    }).length;

    const scorePercentage = (correctAnswers / questions.length) * 100;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-700/50">
          
          {/* Enhanced Modal Header */}
          <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Assessment Analytics</h2>
                <div className="flex items-center space-x-6">
                  <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <p className="text-white/80 text-sm">Score</p>
                    <p className="text-2xl font-bold text-white">{selectedTest.score} / {questions.length}</p>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <p className="text-white/80 text-sm">Percentage</p>
                    <p className="text-2xl font-bold text-white">{scorePercentage.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <p className="text-white/80 text-sm">Correct</p>
                    <p className="text-2xl font-bold text-white">{correctAnswers}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTest(null)}
                className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 text-white hover:scale-110"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-800 px-8 py-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>Performance Score</span>
              <span>{scorePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-1000 ease-out"
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Modal Body with Enhanced Layout */}
          <div className="flex-1 overflow-y-auto bg-gray-900">
            <div className="p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Questions List */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FileText className="mr-3 text-indigo-400" />
                    Question Breakdown
                  </h3>
                  {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const correctAnswer = q.correctAnswer;
                    const isCorrect = userAnswer?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();
                    const isSkipped = !userAnswer;

                    return (
                      <div 
                        key={index} 
                        className={`p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                          isCorrect 
                            ? 'border-green-500/50 bg-green-500/10' 
                            : 'border-red-500/50 bg-red-500/10'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white mb-3 text-lg">
                              {index + 1}. {q.question}
                            </p>
                            
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <span className="w-28 text-gray-400 text-sm">Your Answer:</span>
                                {isSkipped ? (
                                  <span className="text-orange-400 flex items-center bg-orange-500/20 px-3 py-1 rounded-lg text-sm">
                                    <AlertCircle size={14} className="mr-2"/> Skipped
                                  </span>
                                ) : (
                                  <span className={`font-medium flex items-center px-3 py-1 rounded-lg text-sm ${
                                    isCorrect 
                                      ? 'text-green-400 bg-green-500/20' 
                                      : 'text-red-400 bg-red-500/20'
                                  }`}>
                                    {userAnswer}
                                  </span>
                                )}
                              </div>

                              {!isCorrect && !isSkipped && (
                                <div className="flex items-center">
                                  <span className="w-28 text-gray-400 text-sm">Correct Answer:</span>
                                  <span className="text-green-400 font-medium bg-green-500/20 px-3 py-1 rounded-lg text-sm">
                                    {correctAnswer}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Analytics Sidebar */}
                <div className="space-y-8">
                  {/* Performance Chart */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <TrendingUp className="mr-2 text-cyan-400" />
                      Performance Trend
                    </h4>
                    <div className="space-y-4">
                      {performanceData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">{item.label}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                style={{ width: `${(item.score / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-bold w-8">{item.score}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill Distribution */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <BarChart3 className="mr-2 text-purple-400" />
                      Skill Analysis
                    </h4>
                    <div className="space-y-4">
                      {skillDistribution.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{skill.skill}</span>
                            <span className="text-gray-400">{skill.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                              style={{ width: `${skill.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-bold text-white mb-4">Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-all duration-300 hover:scale-105">
                        <Download size={16} />
                        <span className="text-sm">Export PDF</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-all duration-300 hover:scale-105">
                        <Eye size={16} />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">Verifying Secure Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {renderTestDetails()}

      {/* Enhanced Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">
                Talent<span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Visio</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-600/50 backdrop-blur-sm">
                <User size={18} className="text-indigo-400" />
                <span className="text-sm font-medium text-gray-200">{userName}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-600/50"
                title="Logout"
              >
                <LogOut size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Performance Dashboard</h1>
          <p className="text-gray-400 text-lg">Welcome back, {userName}. Track your assessment journey.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-2xl p-2 mb-8 backdrop-blur-sm border border-gray-700/50 w-fit">
          {['overview', 'analytics', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Grid with Enhanced Design */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Assessments', 
              value: totalTests, 
              icon: BarChart3, 
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'bg-blue-500/10'
            },
            { 
              label: 'Completed Tests', 
              value: completedTests, 
              icon: CheckCircle, 
              color: 'from-green-500 to-emerald-500',
              bgColor: 'bg-green-500/10'
            },
            { 
              label: 'Average Score', 
              value: averageScore, 
              icon: Award, 
              color: 'from-purple-500 to-pink-500',
              bgColor: 'bg-purple-500/10',
              suffix: '/5'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className={`relative bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 transition-all duration-300 ${
                hoveredCard === index ? 'scale-105' : 'scale-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                      {stat.suffix && <span className="text-xl text-gray-400">{stat.suffix}</span>}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <div className={`mt-4 w-full bg-gray-700 rounded-full h-2`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${(stat.value / (stat.suffix ? 5 : Math.max(totalTests, 1))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Video Introduction Card */}
          <div 
            className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/50 cursor-pointer transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:shadow-2xl overflow-hidden"
            onClick={() => router.push('/interview')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl transform group-hover:scale-110 transition-all duration-300">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-white">Video Introduction</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Complete a 2-minute video introduction with AI monitoring and real-time analysis.
              </p>
              <span className="text-indigo-400 font-bold flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Start Session <Play className="ml-2 w-4 h-4" />
              </span>
            </div>
          </div>

          {/* AI Assessment Card */}
          <div 
            className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-green-500/50 cursor-pointer transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:shadow-2xl overflow-hidden"
            onClick={() => router.push('/upload')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl transform group-hover:scale-110 transition-all duration-300">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-white">AI Skill Assessment</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Upload your resume and generate a personalized technical quiz powered by Gemini AI.
              </p>
              <span className="text-green-400 font-bold flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Start Assessment <Zap className="ml-2 w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Clock className="mr-3 text-indigo-400" /> 
              Assessment History
              <span className="ml-4 text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                {history.length} records
              </span>
            </h2>
          </div>
          
          {loadingHistory ? (
            <div className="p-8 text-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              Loading assessment history...
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-lg mb-2">No assessments yet</p>
              <p className="text-sm">Start with an AI Skill Assessment to begin your journey!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {history.map((item) => {
                    let totalQuestions = 0;
                    try {
                      if(item.technicalQuestionsJson) {
                        const json = JSON.parse(item.technicalQuestionsJson);
                        totalQuestions = json.technicalQuestions?.length || 0;
                      }
                    } catch(e) {}

                    const percentage = totalQuestions > 0 ? (item.score / totalQuestions) * 100 : 0;
                    const performanceColor = percentage >= 80 ? 'text-green-400' : 
                                           percentage >= 60 ? 'text-yellow-400' : 'text-red-400';

                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => item.score !== null && setSelectedTest(item)}
                        className={`transition-all duration-300 ${
                          item.score !== null 
                            ? 'cursor-pointer hover:bg-indigo-500/10' 
                            : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                            <div>
                              <div className="text-white font-medium">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {new Date(item.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.score !== null ? (
                            <div>
                              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                {item.score}/{totalQuestions}
                              </span>
                              <div className="text-gray-400 text-sm">
                                {percentage.toFixed(1)}%
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.score !== null && (
                            <div className="flex items-center space-x-3">
                              <div className="w-20 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-medium ${performanceColor}`}>
                                {percentage >= 80 ? 'Excellent' : 
                                 percentage >= 60 ? 'Good' : 'Needs Improvement'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.score !== null ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              <CheckCircle size={12} className="mr-1" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              In Progress
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.score !== null && (
                            <span className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-medium">
                              View Analytics <ChevronRight size={16} className="ml-1" />
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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