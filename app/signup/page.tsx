'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { VideoBackground } from "../components/VideoBackground";
import { MobileVideoBackground } from "../components/MobileVideoBackground";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { GoogleSignInButton } from '../components/GoogleSignInButton';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  // Check for error parameter in URL
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Use direct Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific database errors
        if (error.message.includes('Database error')) {
          setError('Account created but there was an issue with profile setup. You can still sign in.');
          // Still redirect to dashboard since the user was created
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setError(error.message);
        }
      } else {
        // Signup succeeded
        if (data.user && !data.session) {
          setError('Please check your email for a confirmation link');
        } else if (data.session) {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-gray-900">
      {/* Mobile Layout - Video Background with Content Overlay */}
      <div className="lg:hidden h-screen w-full relative overflow-hidden bg-black">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <MobileVideoBackground />
        </div>
        {/* Content Overlay */}
        <div className="absolute inset-0 h-full flex flex-col justify-center items-center p-6" style={{ zIndex: 10 }}>
          {/* Content Box */}
          <div className="bg-black/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-700/50 w-full max-w-sm">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cover bg-center bg-no-repeat shadow-sm flex-shrink-0" style={{ backgroundImage: `url(/BuzzberryIcon.png)` }} />
                <img className="w-[80px] h-4 object-contain" alt="Buzzberry Logo" src="/buzzberry-white-logo.png" />
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            {/* Main Content */}
            <div className="text-center space-y-3 mb-6">
              <h1 className="text-2xl font-bold text-white leading-tight">Create Account</h1>
              <p className="text-gray-300 text-sm leading-relaxed">Join BuzzBerry and start discovering creators.</p>
            </div>
            
            {/* Google Sign Up Button */}
            <GoogleSignInButton buttonText="Sign Up With Google" />

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Separator className="flex-1 bg-gray-600" />
              <span className="font-medium text-gray-400 text-sm px-2">Or</span>
              <Separator className="flex-1 bg-gray-600" />
            </div>
            
            {/* Form Fields */}
            <form onSubmit={handleSignUp} className="space-y-3 mb-4">
              {/* Email field */}
              <div className="space-y-1">
                <label className="font-medium text-gray-200 text-xs block">Email</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[42px] px-3 py-2 bg-gray-700 rounded-xl border border-gray-600 font-medium text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-600 transition-all shadow-sm text-white placeholder-gray-400" 
                  required 
                />
              </div>
              
              {/* Password field */}
              <div className="space-y-1">
                <label className="font-medium text-gray-200 text-xs block">Password</label>
                <Input 
                  type="password" 
                  placeholder="Create a password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[42px] px-3 py-2 bg-gray-700 rounded-xl border border-gray-600 font-medium text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-600 transition-all shadow-sm text-white placeholder-gray-400" 
                  required 
                />
              </div>
              
              {/* Confirm Password field */}
              <div className="space-y-1">
                <label className="font-medium text-gray-200 text-xs block">Confirm Password</label>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-[42px] px-3 py-2 bg-gray-700 rounded-xl border border-gray-600 font-medium text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-600 transition-all shadow-sm text-white placeholder-gray-400" 
                  required 
                />
              </div>
              
              {/* Sign Up button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mb-3 border border-gray-600"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            {/* Terms text */}
            <p className="font-medium text-gray-400 text-xs text-center leading-relaxed">By creating an account, you agree to our Terms of Service and Privacy Policy</p>
            
            {/* Login link */}
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button 
                  onClick={handleSignInClick}
                  className="text-white hover:text-gray-300 underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:block h-screen w-full">
        <div className="h-screen w-full flex">
          {/* Sign up section - takes up remaining space */}
          <div className="flex-1 h-full flex items-center justify-center p-8 bg-black">
            <div className="w-full max-w-md">
              <Card className="w-full bg-black border-none shadow-none">
                <CardContent className="p-0 space-y-8">
                  {/* Logo and headline section */}
                  <div className="text-center space-y-4">
                    {/* Logo - much tighter spacing */}
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-cover bg-center bg-no-repeat shadow-sm flex-shrink-0" style={{ backgroundImage: `url(/BuzzberryIcon.png)` }} />
                      <img className="w-[90px] h-4 object-contain" alt="Buzzberry Logo" src="/buzzberry-white-logo.png" />
                    </div>
                    {/* Headline */}
                    <div className="space-y-1">
                      <h1 className="font-bold text-white text-3xl xl:text-4xl text-center tracking-tight leading-tight">Create Account</h1>
                    </div>
                    {/* Tagline */}
                    <p className="text-gray-300 text-base text-center leading-relaxed">Join BuzzBerry and start discovering creators.</p>
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                  )}
                  
                  {/* Google Sign Up Button */}
                  <GoogleSignInButton buttonText="Sign Up With Google" />
                  
                  {/* Divider */}
                  <div className="flex items-center justify-center gap-4">
                    <Separator className="flex-1 bg-gray-600" />
                    <span className="font-medium text-gray-400 text-sm px-2">Or</span>
                    <Separator className="flex-1 bg-gray-600" />
                  </div>
                  
                  {/* Form */}
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                      <label className="font-medium text-gray-200 text-xs block">Email</label>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[50px] px-4 py-3 bg-gray-700 rounded-xl border border-gray-600 font-medium text-base focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-600 transition-all shadow-sm text-white placeholder-gray-400" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-medium text-gray-200 text-xs block">Password</label>
                      <Input 
                        type="password" 
                        placeholder="Create a password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-[50px] px-4 py-3 bg-gray-700 rounded-xl border border-gray-600 font-medium text-base focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-600 transition-all shadow-sm text-white placeholder-gray-400" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-medium text-gray-200 text-xs block">Confirm Password</label>
                      <Input 
                        type="password" 
                        placeholder="Confirm your password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-[50px] px-4 py-3 bg-gray-700 rounded-xl border border-gray-600 font-medium text-base focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-gray-600 transition-all shadow-sm text-white placeholder-gray-400" 
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-[50px] bg-gray-700 hover:bg-gray-600 rounded-xl font-medium text-white text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-gray-600"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                  
                  {/* Terms text */}
                  <p className="font-medium text-gray-400 text-sm text-center leading-relaxed">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                  
                  {/* Login link */}
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      Already have an account?{' '}
                      <button 
                        onClick={handleSignInClick}
                        className="text-white hover:text-gray-300 underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Video panel - takes up more space on larger screens */}
          <div className="flex-[1.2] h-full bg-gradient-to-br from-purple-400 to-indigo-500 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <VideoBackground />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 