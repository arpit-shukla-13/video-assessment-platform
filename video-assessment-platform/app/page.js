"use client";

import React from 'react';
import { Video, Shield, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer">
              <div className="bg-indigo-600 p-2 rounded-lg mr-2">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Talent<span className="text-indigo-600">Visio</span>
              </span>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors hidden md:block">
                How it Works
              </a>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center"
                onClick={() => router.push('/login')}
              >
                Login Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-6 border border-indigo-100">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
            Next-Gen Hiring Platform
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Automate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Technical Interviews
            </span>
          </h1>
          
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Secure, AI-monitored video assessments and coding quizzes. 
            Designed for modern engineering teams to filter candidates faster.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-lg font-bold text-lg hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center"
              onClick={() => router.push('/dashboard')}
            >
              Start Assessment
              <PlayCircle className="ml-2 h-5 w-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center">
              View Demo
            </button>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Built for Integrity & Speed
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to conduct seamless remote technical rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Shield className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrated with Keycloak for enterprise-grade OAuth2/OpenID Connect security and role management.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <Video className="h-6 w-6 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Video Interface</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time webcam access with built-in recording capabilities (WebRTC) for candidate monitoring.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Clock className="h-6 w-6 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Timed Assessments</h3>
              <p className="text-gray-600 leading-relaxed">
                Auto-expiring quizzes and coding challenges that sync directly with our Spring Boot backend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-xl text-white">TalentVisio</span>
            <p className="text-sm mt-1">© 2024 Secure Assessment Platform.</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;