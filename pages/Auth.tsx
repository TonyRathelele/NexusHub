
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && !isPasswordValid) {
      setError("Password does not meet academic security standards.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (signUpError) throw signUpError;
        setIsEmailSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-slate-100 animate-fadeIn">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
            <i className="fa-solid fa-paper-plane animate-bounce"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Verify Your Account</h2>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">We've sent an encrypted link to <span className="text-indigo-600 font-bold">{email}</span>. Please verify to continue.</p>
          <button onClick={() => setIsEmailSent(false)} className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all">Back to Authentication</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Plus_Jakarta_Sans']">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-2xl z-50 border-b border-slate-200/60 shadow-sm h-20 flex items-center px-6 justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200 transition-transform group-hover:rotate-6">
            <i className="fa-solid fa-graduation-cap text-white"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-950 tracking-tighter">NexusHub</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Back to Landing</span>
          </div>
        </Link>
        <Link to="/" className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors flex items-center space-x-2">
          <i className="fa-solid fa-arrow-left"></i>
          <span>Return to Site</span>
        </Link>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row pt-20">
        <div className="hidden md:flex flex-1 sidebar-gradient relative overflow-hidden flex-col justify-between p-20 text-white">
          <div className="relative z-10">
            <h2 className="text-6xl font-black leading-tight mb-8">Secure Access to <br/><span className="text-indigo-400">Knowledge.</span></h2>
            <p className="text-indigo-100 text-xl font-medium max-w-md opacity-80 leading-relaxed">Join thousands of students sharing verified institutional resources in a secure, AI-powered environment.</p>
          </div>
          <div className="relative z-10 flex space-x-12">
            <div><p className="text-4xl font-black">10K+</p><p className="text-[10px] uppercase font-black tracking-widest opacity-50">Resources</p></div>
            <div><p className="text-4xl font-black">100%</p><p className="text-[10px] uppercase font-black tracking-widest opacity-50">Encrypted</p></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.15),transparent)]"></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white">
          <div className="max-w-md w-full">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-950 mb-2 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Profile'}</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institutional Identity Verification</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start space-x-3 text-[11px] font-bold">
                  <i className="fa-solid fa-triangle-exclamation mt-1"></i>
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Academic Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all" placeholder="name@university.ac.za" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secure Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all" placeholder="••••••••" />
                
                {!isLogin && password.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2">
                    {Object.entries(passwordCriteria).map(([key, valid]) => (
                      <div key={key} className={`flex items-center space-x-2 text-[9px] font-black uppercase ${valid ? 'text-emerald-500' : 'text-slate-300'}`}>
                        <i className={`fa-solid ${valid ? 'fa-circle-check' : 'fa-circle'}`}></i>
                        <span>{key === 'length' ? '8+ Chars' : key}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading || (!isLogin && !isPasswordValid)} className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all border-b-4 border-indigo-800">
                {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (isLogin ? 'Enter Repository' : 'Establish Profile')}
              </button>
            </form>

            <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-slate-900 transition-colors text-center block">
              {isLogin ? "Need a student account? Join Hub" : "Already registered? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
