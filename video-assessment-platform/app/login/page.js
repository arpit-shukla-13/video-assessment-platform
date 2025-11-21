"use client";

import React, { useState, useEffect } from 'react';
import { Video } from 'lucide-react';
import { getKeycloakInstance } from '../lib/keycloak';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Check karo agar user pehle se logged in hai
  useEffect(() => {
  const initKeycloak = async () => {
    if (typeof window === 'undefined') return;

    const kc = getKeycloakInstance();
    
    if (kc && !isInitialized) {
      try {
        // SILENT CHECK HATA DO - Simple init use karo
        const authenticated = await kc.init({ 
          onLoad: 'check-sso'
          // ❌ silentCheckSsoRedirectUri: remove this line temporarily
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
          // Error aane par bhi continue karo
          setIsInitialized(true);
        }
      }
    }
  };

  initKeycloak();
}, [isInitialized]);

  // 2. Login Button Handler
  const handleLogin = async () => {
    setIsLoading(true);
    const kc = getKeycloakInstance();
    
    if (kc) {
      try {
        // Environment variable se redirect URI lo
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        // User ko Keycloak server par redirect karo
        await kc.login({ 
          redirectUri: window.location.origin + '/dashboard' 
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Video className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Candidate</h2>
          <p className="text-gray-500 mb-8">Please sign in using your secure ID.</p>
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting...
              </span>
            ) : (
              "Login with Keycloak SSO"
            )}
          </button>
          
          <div className="mt-6 text-xs text-gray-400 border-t pt-4">
            <p>Secured by Keycloak (OAuth2 / OIDC)</p>
            <p className="mt-1 text-[10px]">
              Server: {process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:9000'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;