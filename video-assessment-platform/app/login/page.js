"use client";

import React, { useState, useEffect } from 'react';
import { Video, Shield, Lock, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { getKeycloakInstance } from '../lib/keycloak';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initKeycloak = async () => {
      if (typeof window === 'undefined') return;

      const kc = getKeycloakInstance();
      
      if (kc && !isInitialized) {
        try {
          const authenticated = await kc.init({ 
            onLoad: 'check-sso'
          });
          
          setIsInitialized(true);
          
          if (authenticated) {
            window.location.href = '/dashboard';
          }
        } catch (err) {
          if (err?.message?.includes('only be initialized once')) {
            setIsInitialized(true);
          } else {
            console.error("Keycloak Init Error:", err);
            setIsInitialized(true);
          }
        }
      }
    };

    initKeycloak();
  }, [isInitialized]);

  // Login Button Handler
  const handleLogin = async () => {
    setIsLoading(true);
    const kc = getKeycloakInstance();
    
    if (kc) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        await kc.login({ 
          redirectUri: `${appUrl}/dashboard` 
        });
      } catch (err) {
        console.error("Login Failed", err);
        const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:9000';
        alert(`Could not connect to Keycloak server. Make sure it is running on ${keycloakUrl}`);
        setIsLoading(false);
      }
    } else {
      alert("Keycloak configuration not found.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full relative">
        
        {/* Glowing Border Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        <div className="relative bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Video className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-4 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              Secure Authentication
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-lg">
              Continue to your assessment portal
            </p>
          </div>

          {/* Login Form Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center text-gray-400 mb-4">
                <UserCheck className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Candidate Login</span>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/25'
              }`}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-white font-semibold">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-3 text-white" />
                    <span className="text-white font-semibold text-lg">Login with Keycloak SSO</span>
                    <ArrowRight className="w-4 h-4 ml-3 text-white transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* Security Info */}
            <div className="mt-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-gray-300 font-medium mb-1">
                    Enterprise Grade Security
                  </p>
                  <p className="text-xs text-gray-400">
                    Protected by Keycloak (OAuth2 / OIDC) with end-to-end encryption
                  </p>
                  <div className="mt-2 text-[10px] text-gray-500 font-mono bg-gray-800/50 px-2 py-1 rounded border border-gray-600/30">
                    Server: {process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:9000'}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8 text-center">
              {[
                { icon: '🔒', label: 'Secure', desc: 'OAuth2' },
                { icon: '⚡', label: 'Fast', desc: 'SSO' },
                { icon: '🎯', label: 'Reliable', desc: 'OIDC' }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-700/20 rounded-lg p-3 border border-gray-600/20 backdrop-blur-sm">
                  <div className="text-lg mb-1">{feature.icon}</div>
                  <div className="text-xs text-gray-300 font-semibold">{feature.label}</div>
                  <div className="text-[10px] text-gray-500">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-900/50 border-t border-gray-700/30 p-4 text-center">
            <p className="text-xs text-gray-500">
              TalentVisio Assessment Platform • Secure Candidate Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;