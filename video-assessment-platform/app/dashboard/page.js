"use client";

import React, { useEffect, useState } from 'react';
import { Video, FileText, AlertCircle, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getKeycloakInstance } from '../lib/keycloak'; // Local lib import

const Dashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('Loading...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;
      
      const kc = getKeycloakInstance();
      try {
        const authenticated = await kc.init({ 
          onLoad: 'check-sso',
          pkceMethod: 'S256'
        });

        if (authenticated) {
          setupSession(kc);
        } else {
            // Agar login nahi hai, to Login page par bhejo
            router.push('/login');
        }
      } catch (error) {
        // Agar pehle se initialized hai (refresh case), toh session set karo
        if (error?.message?.includes('only be initialized once')) {
             if (kc.authenticated) {
                 setupSession(kc);
             } else {
                 router.push('/login');
             }
        } else {
             console.error("Auth Failed", error);
        }
      }
    };

    const setupSession = (kc) => {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
            // Token save kar lo taaki backend call mein use ho sake
            localStorage.setItem('user_token', kc.token);
        }
        const name = kc.tokenParsed?.name || kc.tokenParsed?.preferred_username;
        setUserName(name || 'Candidate');
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    const kc = getKeycloakInstance();
    // Logout karke login page par wapas bhejo
    kc.logout({ redirectUri: 'http://localhost:3000/login' });
    if (typeof window !== 'undefined') {
        localStorage.clear();
    }
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
      {/* Navbar */}
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
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-indigo-500" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Video */}
          <div className="bg-white shadow rounded-lg p-5 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/interview')}>
             <div className="flex items-center mb-4">
                <div className="bg-indigo-500 p-3 rounded text-white"><Video /></div>
                <div className="ml-4"><h3 className="text-lg font-bold">Video Introduction</h3></div>
             </div>
             <p className="text-gray-500 text-sm mb-4">Complete a 2-minute video introduction with AI monitoring.</p>
             <span className="text-indigo-600 font-bold">Start Session &rarr;</span>
          </div>
          
          {/* Card 2: Quiz */}
          <div className="bg-white shadow rounded-lg p-5 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/assessment')}>
             <div className="flex items-center mb-4">
                <div className="bg-green-500 p-3 rounded text-white"><FileText /></div>
                <div className="ml-4"><h3 className="text-lg font-bold">Technical Quiz</h3></div>
             </div>
             <p className="text-gray-500 text-sm mb-4">Answer technical questions related to Java and React.</p>
             <span className="text-green-600 font-bold">Take Assessment &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;