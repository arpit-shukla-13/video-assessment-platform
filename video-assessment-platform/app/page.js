"use client";

import React from 'react';
import { Video, Shield, Clock, ArrowRight, PlayCircle, FileText, Cpu, Star, Zap, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-xl z-50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl mr-3 transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/25">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Talent<span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Visio</span>
              </span>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-300 hover:text-white font-medium text-sm transition-all duration-300 hover:scale-105 hidden md:block">
                How it Works
              </a>
              <button 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center group"
                onClick={() => router.push('/login')}
              >
                Login Portal
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Premium Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold tracking-wide uppercase mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Now Powered by Gemini AI
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
            Assessment Based on <br />
            <span className="text-transparent bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300 bg-clip-text bg-[length:200%_auto] animate-gradient">
              Your Resume
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Upload your PDF resume and let our AI generate a personalized technical assessment instantly. 
            No more generic tests—showcase what you truly know with our intelligent evaluation system.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-16">
            <button 
              className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-2xl font-bold text-lg text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center overflow-hidden"
              onClick={() => router.push('/dashboard')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center">
                Start Assessment
                <PlayCircle className="ml-3 h-5 w-5 transform group-hover:scale-110 transition-transform" />
              </span>
            </button>
            
            <button className="group w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-gray-600 rounded-2xl font-bold text-lg hover:border-gray-400 transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:bg-white/5">
              View AI Demo
              <Zap className="ml-3 h-5 w-5 transform group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { number: '50K+', label: 'Assessments' },
              { number: '98%', label: 'Accuracy' },
              { number: '4.9/5', label: 'Rating' },
              { number: '2min', label: 'Setup Time' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white sm:text-5xl mb-4">
              Next-Gen Hiring Process
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From intelligent resume parsing to AI-powered evaluation, experience the future of technical assessments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Resume Parsing</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Advanced analysis of your PDF resume to understand your tech stack, experience level, and key skills using Apache PDFBox technology.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-purple-500/50 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Cpu className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Question Generation</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Powered by Google Gemini AI, creating unique, non-repetitive technical questions tailored specifically to your profile and experience.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-green-500/50 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Secure & Timed</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Professional time-bound assessments secured via Keycloak authentication to ensure complete integrity and fairness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">
                Talent<span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Visio</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 AI-Powered Assessment Platform</p>
          </div>
          <div className="flex space-x-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;