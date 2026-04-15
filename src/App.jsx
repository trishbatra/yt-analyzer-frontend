import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, TrendingUp, Sparkles, LayoutTemplate, Activity, ArrowRight, Loader2, Plus, ChevronDown, X, Cpu, BarChart3, Download, Target, Users, Clock, Flame, Sun, Moon, CheckCircle2, Circle, PenTool, Copy, Check, Languages, Link as LinkIcon, Image as ImageIcon, History, Eye, LogOut, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// --- CONFIGURATION ---
const GOOGLE_CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID; 
const API_BASE_URL = "http://localhost:3001/api";

// --- AUTH CONTEXT ---
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/me`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      })
      .then(res => res.json())
      .then(data => { 
        if (!data.error) {
          setUser(data); 
        } else {
          logout(); 
        }
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- SVG LOGO COMPONENTS ---
const AppLogo = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none">
    <path d="M50 10C65 25 75 40 75 55C75 75 60 85 50 85C40 85 25 75 25 55C25 40 35 25 50 10Z" fill="url(#data_flame_gradient)" />
    <rect x="45" y="45" width="10" height="40" rx="3" fill="#ffffff" />
    <circle cx="50" cy="50" r="4" fill="#6366f1" />
    <defs>
      <linearGradient id="data_flame_gradient" x1="50" y1="10" x2="50" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

const YTAnalyzerEmblem = ({ className, isDark }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none">
    <path d="M50 10C65 25 75 40 75 55C75 75 60 85 50 85C40 85 25 75 25 55C25 40 35 25 50 10Z" fill="url(#data_flame_gradient_emb)" filter="url(#glow)" />
    <rect x="45" y="45" width="10" height="40" rx="3" fill={isDark ? "#ffffff" : "#0f172a"} />
    <circle cx="50" cy="50" r="4" fill="#6366f1" />
    <path d="M50 90C40 90 30 90 30 100C30 110 40 110 50 110C60 110 70 110 70 100C70 90 60 90 50 90Z" fill={isDark ? "#12080a" : "#f1f5f9"} />
    <path d="M46 95L57 100L46 105V95Z" fill="#a1a1aa" />
    <defs>
      <linearGradient id="data_flame_gradient_emb" x1="50" y1="10" x2="50" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="glow" x="-5" y="-5" width="110" height="130" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="3" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.388235 0 0 0 0 0.4 0 0 0 0 0.945098 0 0 0 0.3 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
);

const YTAnalyzerFavicon = ({ className }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <path d="M40 8C52 20 60 32 60 44C60 60 48 68 40 68C32 68 20 60 20 44C20 32 28 20 40 8Z" fill="url(#data_flame_gradient_fav)" filter="url(#glow_fav)" />
    <rect x="36" y="36" width="8" height="32" rx="2" fill="#ffffff" />
    <defs>
       <linearGradient id="data_flame_gradient_fav" x1="40" y1="8" x2="40" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
       <filter id="glow_fav" x="-2" y="-2" width="84" height="84" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation="1.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.388235 0 0 0 0 0.4 0 0 0 0 0.945098 0 0 0 0.2 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
);

// --- AUTHENTICATION PAGES (Login / Register) ---
const AuthPage = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
    const body = mode === 'register' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else { 
        setError(data.error || 'Authentication failed'); 
      }
    } catch (err) { 
      setError("Server connection failed. Is your backend running?"); 
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#0a0a0c]/80 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <AppLogo className="w-16 h-16 shadow-[0_0_30px_rgba(99,102,241,0.2)]" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
          {mode === 'register' ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-zinc-400 text-center mb-8 font-light">Access your strategic AI dashboard.</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Name</label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)} 
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all" 
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-400">Email</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all" 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-400">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg mt-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Lock className="w-4 h-4" /> {mode === 'register' ? 'Sign Up' : 'Secure Login'}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-6 text-sm">
          {mode === 'register' ? 'Already have an account? ' : 'New here? '}
          <button 
            onClick={() => navigate(mode === 'register' ? '/' : '/register')} 
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
          >
            {mode === 'register' ? 'Log In' : 'Create Account'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};


// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  
  // App UI State
  const [inputMode, setInputMode] = useState('oauth'); 
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('strategy'); 
  const [isDark, setIsDark] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  // Data State
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review AI Strategic Verdict", done: true },
    { id: 2, text: "Generate script for 1st Viral Short", done: false },
    { id: 3, text: "Research Long-Form thumbnail ideas", done: false },
    { id: 4, text: "Engage with recent comments", done: false }
  ]);
  
  const fileInputRef = useRef(null);

  // Script Generator State
  const [activeIdea, setActiveIdea] = useState(null); 
  const [scriptPrefs, setScriptPrefs] = useState({ 
    emotion: 'Curiosity / Mystery', 
    pacing: 'Fast & Energetic', 
    cta: 'Subscribe for more', 
    language: 'Hinglish', 
    notes: '' 
  });
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [copied, setCopied] = useState(false);

  const emotionOptions = ['Curiosity / Mystery', 'Shock & Awe', 'Humor / Comedy', 'Inspirational'];
  const pacingOptions = ['Fast & Energetic', 'Suspenseful Slow-Burn', 'Direct & Educational'];
  const ctaOptions = ['Subscribe for more', 'Comment your thoughts', 'Watch the next video', 'None'];
  const languageOptions = ['Hinglish', 'Hindi', 'English'];

  // Theme Constants
  const premiumEase = [0.22, 1, 0.36, 1];
  const bgMain = isDark ? "bg-[#030305]" : "bg-[#f4f4f5]";
  const textMain = isDark ? "text-zinc-300" : "text-zinc-600";
  const bgPanel = isDark ? "bg-[#0a0a0c]/80" : "bg-white/90";
  const ringPanel = isDark ? "ring-white/10" : "ring-black/5";
  const textTitle = isDark ? "text-white" : "text-zinc-900";
  const bgCard = isDark ? "bg-zinc-950/[0.8]" : "bg-white";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1, duration: 0.8, ease: premiumEase } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: premiumEase } }
  };

  // --- LIFECYCLE ---
// --- API CALLS ---
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchHistory();
  }, [token]);

  const connectYouTube = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/analyze-oauth`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ accessToken: tokenResponse.access_token })
        });
        const data = await response.json();
        if (response.ok) {
          setResults(data);
          fetchHistory();
        } else {
          alert(data.error || "API Error.");
        }
      } catch (error) {
        alert("Failed to connect to backend.");
      } finally {
        setLoading(false);
      }
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  const analyzeManual = async () => {
    if (files.length === 0) return;
    setLoading(true); 
    setResults(null);
    
    const formData = new FormData();
    files.forEach(file => formData.append('screenshots', file));

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
        fetchHistory();
      } else {
        alert(data.error || "API Error.");
      }
    } catch (error) {
      alert("Failed to connect.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate-script`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: activeIdea.title,
          type: activeIdea.type,
          emotion: scriptPrefs.emotion,
          pacing: scriptPrefs.pacing,
          cta: scriptPrefs.cta,
          language: scriptPrefs.language,
          extraNotes: scriptPrefs.notes
        })
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedScript(data.script);
      } else {
        alert("Failed to generate script.");
      }
    } catch (error) {
      alert("API Error.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // --- UI INTERACTION HANDLERS ---
  const handleFileChange = (e) => {
    const validFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles].slice(0, 3));
      setPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))].slice(0, 3));
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => { 
    e.preventDefault(); 
    setIsDragging(false); 
    const validFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles].slice(0, 3));
      setPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))].slice(0, 3));
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setFiles([]); 
    setPreviews([]); 
    setResults(null); 
    setActiveTab('strategy');
    if (fileInputRef.current) fileInputRef.current.value = null; 
    setTasks(tasks.map(t => ({ ...t, done: t.id === 1 })));
  };

  const viewPastAnalysis = (pastResult) => {
    setResults(pastResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeScriptModal = () => {
    setActiveIdea(null);
    setGeneratedScript(null);
    setScriptPrefs({ ...scriptPrefs, notes: '' });
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    let y = 20; 
    const margin = 20; 
    const pageWidth = doc.internal.pageSize.getWidth(); 
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(22); 
    doc.text("YT Analyzer: Strategic Roadmap", margin, y); 
    y += 15;
    
    doc.setFontSize(14); 
    doc.setFont("helvetica", "bold"); 
    doc.setTextColor(220, 38, 38); 
    doc.text("The Harsh Reality (Verdict)", margin, y); 
    y += 8;
    
    doc.setFontSize(11); 
    doc.setFont("helvetica", "normal"); 
    doc.setTextColor(40, 40, 40);
    const verdictLines = doc.splitTextToSize(results.verdict, maxLineWidth); 
    doc.text(verdictLines, margin, y);
    y += (verdictLines.length * 6) + 12;

    const printList = (title, items, headingColor) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(headingColor[0], headingColor[1], headingColor[2]); doc.text(title, margin, y); y += 10;
      items?.forEach((item, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0);
        const titleLines = doc.splitTextToSize(`${i + 1}. ${item.title}`, maxLineWidth); doc.text(titleLines, margin, y); y += (titleLines.length * 6) + 2;
        doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(80, 80, 80);
        const reasonLines = doc.splitTextToSize(`Strategy: ${item.reasoning}`, maxLineWidth - 10); doc.text(reasonLines, margin + 5, y); y += (reasonLines.length * 5) + 8;
      }); y += 5;
    };

    printList("Viral Shorts Funnel", results.shorts, [6, 182, 212]);
    printList("Long-Form Content Pillars", results.longForm, [79, 70, 229]);
    doc.save('YT-Analyzer-Report.pdf');
  };

  const chartData = results?.extractedStats ? [
    { name: 'Subscribers', Current: results.extractedStats.subscribers || 0, Goal: 1000 },
    { name: 'Watch Hours', Current: results.extractedStats.watchTimeHours || 0, Goal: 4000 }
  ] : [];

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} relative overflow-x-hidden flex flex-col font-sans transition-colors duration-500`}>
      
      {/* SCRIPT MODAL OVERLAY */}
      <AnimatePresence>
        {activeIdea && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ ease: premiumEase }} className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#0f0f13] ring-white/10' : 'bg-white ring-black/10'} ring-1 rounded-3xl shadow-2xl relative custom-scrollbar`}>
              <button onClick={closeScriptModal} className={`absolute top-6 right-6 p-2 rounded-full ${isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-400' : 'bg-black/5 hover:bg-black/10 text-zinc-600'} transition-colors`}>
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 md:p-10">
                {!generatedScript ? (
                  <>
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold tracking-widest uppercase mb-4">
                        <PenTool className="w-3 h-3" /> AI Writer
                      </div>
                      <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${textTitle}`}>{activeIdea.title}</h2>
                      <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Set the vibe. We'll write the masterpiece.</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${textTitle}`}>What's the core hook?</label>
                        <div className="flex flex-wrap gap-2">
                          {emotionOptions.map(opt => (
                            <button key={opt} onClick={() => setScriptPrefs({...scriptPrefs, emotion: opt})} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scriptPrefs.emotion === opt ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${textTitle}`}>Vibe & Pacing</label>
                        <div className="flex flex-wrap gap-2">
                          {pacingOptions.map(opt => (
                            <button key={opt} onClick={() => setScriptPrefs({...scriptPrefs, pacing: opt})} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scriptPrefs.pacing === opt ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-3 flex items-center gap-2 ${textTitle}`}>
                          <Languages className="w-4 h-4 text-zinc-400" /> Output Language
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {languageOptions.map(opt => (
                            <button key={opt} onClick={() => setScriptPrefs({...scriptPrefs, language: opt})} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scriptPrefs.language === opt ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${textTitle}`}>Call to Action</label>
                        <div className="flex flex-wrap gap-2">
                          {ctaOptions.map(opt => (
                            <button key={opt} onClick={() => setScriptPrefs({...scriptPrefs, cta: opt})} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scriptPrefs.cta === opt ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${textTitle}`}>Specific Details (Optional)</label>
                        <textarea 
                          value={scriptPrefs.notes} 
                          onChange={(e) => setScriptPrefs({...scriptPrefs, notes: e.target.value})} 
                          placeholder="e.g. Shoutout my channel name 'FIF', or mention a specific fact..." 
                          className={`w-full p-4 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-white/5 text-white placeholder-zinc-600' : 'bg-slate-50 text-black placeholder-zinc-400 border border-black/10'}`} 
                        />
                      </div>

                      <button onClick={handleGenerateScript} disabled={isGeneratingScript} className={`w-full py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                        {isGeneratingScript ? <><Loader2 className="w-5 h-5 animate-spin" /> Writing Masterpiece...</> : <><Sparkles className="w-5 h-5" /> Generate Script</>}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className={`text-2xl font-bold ${textTitle}`}>Your Script</h2>
                      <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-500' : isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'}`}>
                        {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                      </button>
                    </div>
                    <div className={`p-6 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-mono ${isDark ? 'bg-black/50 text-zinc-300 ring-1 ring-white/10' : 'bg-slate-50 text-zinc-800 ring-1 ring-black/5'}`}>
                      {generatedScript}
                    </div>
                    <button onClick={() => setGeneratedScript(null)} className={`text-sm underline underline-offset-4 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>
                      ← Adjust settings and regenerate
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND ELEMENTS */}
      <div className={`fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] ${isDark ? 'bg-indigo-600/5' : 'bg-indigo-500/10'} blur-[120px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-500`}></div>
      <div className={`fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] ${isDark ? 'bg-cyan-600/5' : 'bg-cyan-500/10'} blur-[120px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-500`}></div>

      {/* NAVBAR */}
      <nav className={`relative z-50 w-full border-b backdrop-blur-xl transition-colors duration-500 ${isDark ? 'border-white/5 bg-[#030305]/80' : 'border-black/5 bg-white/80 shadow-sm'}`}>
        <div className="max-w-[1500px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <YTAnalyzerFavicon className={`w-8 h-8 rounded-lg ring-1 ${isDark ? 'bg-indigo-500/20 ring-white/10' : 'bg-indigo-50 ring-indigo-100'}`} />
            <span className={`font-bold tracking-wide text-lg ${textTitle}`}>YT Analyzer</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full ring-1 transition-colors ${isDark ? 'bg-white/5 ring-white/10 text-zinc-400 hover:bg-white/10' : 'bg-zinc-100 ring-black/5 text-zinc-600 hover:bg-zinc-200'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${isDark ? 'bg-white/5 ring-white/10 text-zinc-300' : 'bg-white ring-black/5 text-zinc-600'}`}>
                  <span className="text-xs font-medium">Hey, {user.name.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className={`p-2 rounded-full ring-1 transition-colors ${isDark ? 'bg-white/5 ring-white/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 ring-red-100 text-red-500 hover:bg-red-100'}`}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {results && (
              <button onClick={exportPDF} className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'}`}>
                <Download className="w-4 h-4" /> Export
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="max-w-[1500px] mx-auto p-6 md:p-10 relative z-10 w-full flex-grow flex flex-col items-center">
        
        {!results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: premiumEase }} className="w-full max-w-2xl flex flex-col items-center">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-8 text-center ${textTitle}`}>
              Start New Analysis
            </h1>
            
            {/* THE LIQUID ANIMATED TOGGLE */}
            <div className={`relative flex p-1.5 rounded-2xl w-max mx-auto mb-8 shadow-inner transition-colors duration-500 ${isDark ? 'bg-white/5 ring-1 ring-white/10' : 'bg-black/5 ring-1 ring-black/5'}`}>
              {['oauth', 'manual'].map((mode) => (
                <button 
                  key={mode} 
                  onClick={() => setInputMode(mode)} 
                  className={`relative px-8 py-3 text-sm font-bold z-10 transition-colors duration-300 flex items-center gap-2 ${inputMode === mode ? (isDark ? 'text-black' : 'text-white') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-600 hover:text-zinc-800')}`}
                >
                  {inputMode === mode && (
                    <motion.div 
                      layoutId="activePill" 
                      className={`absolute inset-0 rounded-xl shadow-md -z-10 ${isDark ? 'bg-white' : 'bg-indigo-600'}`} 
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} 
                    />
                  )}
                  {mode === 'oauth' ? <LinkIcon className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  {mode === 'oauth' ? 'Auto Connect' : 'Manual Upload'}
                </button>
              ))}
            </div>

            <div className={`relative ${bgPanel} backdrop-blur-2xl ring-1 ${ringPanel} rounded-[2rem] p-8 shadow-2xl w-full min-h-[350px] flex flex-col justify-center overflow-hidden`}>
              <AnimatePresence mode="wait">
                {inputMode === 'oauth' ? (
                  <motion.div key="oauth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="flex flex-col items-center text-center">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ring-1 ${isDark ? 'bg-gradient-to-b from-red-600 to-red-900 ring-white/10 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'bg-red-500 ring-red-600 shadow-md'}`}>
                       <TrendingUp className="w-8 h-8 text-white" />
                     </div>
                     <h3 className={`text-xl font-bold mb-2 ${textTitle}`}>Secure Channel Sync</h3>
                     <p className={`text-sm font-light mb-8 max-w-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Fetch precise subscriber and view data via the YouTube API. No images needed.</p>
                     <button onClick={() => connectYouTube()} disabled={loading} className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'}`}>
                        {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Connecting...</> : 'Connect via Google'}
                     </button>
                  </motion.div>
                ) : (
                  <motion.div key="manual" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="flex flex-col items-center">
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
                     {files.length === 0 ? (
                       <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => fileInputRef.current?.click()} className={`w-full py-16 border border-dashed rounded-2xl flex flex-col items-center cursor-pointer transition-all ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>
                          <Upload className={`w-10 h-10 mb-4 transition-transform ${isDragging ? 'text-indigo-400 scale-110' : isDark ? 'text-zinc-500' : 'text-indigo-500'}`} />
                          <h3 className={`text-lg font-bold ${textTitle}`}>{isDragging ? 'Drop Files Here' : 'Drop Screenshots'}</h3>
                       </div>
                     ) : (
                       <div className="w-full flex flex-col gap-6">
                         <div className="grid grid-cols-3 gap-4">
                           {previews.map((src, i) => (
                             <div key={i} className={`relative rounded-xl overflow-hidden ring-1 ${ringPanel}`}>
                               <img src={src} alt="Preview" className="w-full h-24 object-cover" />
                               <button onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500/80"><X className="w-3 h-3" /></button>
                             </div>
                           ))}
                           {previews.length < 3 && (
                             <button onClick={() => fileInputRef.current?.click()} className={`flex items-center justify-center rounded-xl border border-dashed transition-colors ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>
                               <Plus className={`w-6 h-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                             </button>
                           )}
                         </div>
                         <button onClick={analyzeManual} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'}`}>
                           {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Processing...</> : <><Cpu className="w-5 h-5" /> Analyze Screenshots</>}
                         </button>
                       </div>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* History Table Below Upload */}
            <div className={`mt-10 ${bgPanel} backdrop-blur-2xl ring-1 ${ringPanel} rounded-[2rem] p-8 shadow-2xl w-full`}>
               <div className="flex items-center gap-2 mb-6">
                 <History className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                 <h3 className={`font-bold tracking-wide ${textTitle}`}>Analysis History</h3>
               </div>
               
               {history.length === 0 ? (
                 <div className={`text-center py-8 rounded-xl border border-dashed ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                   <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No past analyses found. Run your first audit above!</p>
                 </div>
               ) : (
                 <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                   {history.map((item, idx) => (
                     <div key={idx} className={`flex items-center justify-between p-4 rounded-xl ring-1 transition-colors ${isDark ? 'bg-white/[0.02] ring-white/10 hover:bg-white/5' : 'bg-slate-50 ring-black/5 hover:bg-slate-100'}`}>
                       <div>
                         <p className={`text-sm font-semibold ${textTitle}`}>
                           {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                         </p>
                         <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                           {item.extractedStats?.subscribers ? `${item.extractedStats.subscribers} Subs` : 'Manual Upload'}
                         </p>
                       </div>
                       <button 
                         onClick={() => viewPastAnalysis(item)} 
                         className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                       >
                         <Eye className="w-3 h-3" /> View Details
                       </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </motion.div>
        )}

        {/* RESULTS SPLIT LAYOUT (Only shows when results exist) */}
        {results && (
          <motion.div layout transition={{ duration: 0.8, ease: premiumEase }} className="w-full flex flex-col lg:flex-row items-start gap-12">
            
            {/* LEFT COLUMN: Diagnostics & Action Plan */}
            <motion.div layout transition={{ duration: 0.8, ease: premiumEase }} className={`transition-all overflow-hidden flex flex-col gap-6 ${activeTab === 'data' ? 'lg:w-0 lg:opacity-0 lg:h-0 m-0 p-0' : 'w-full lg:w-[480px] shrink-0 lg:sticky lg:top-28'}`}>
              
              <div className={`${bgPanel} backdrop-blur-2xl ring-1 ${ringPanel} rounded-[2rem] p-8 shadow-2xl`}>
                <div className="flex justify-between mb-8">
                  <h3 className={`text-sm font-bold tracking-widest uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>System Diagnostics</h3>
                  <BarChart3 className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                </div>
                <div className="space-y-6">
                  {[{ label: "Content Saturation", val: "84%" }, { label: "Algorithm Favorability", val: "12%" }].map((stat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-mono font-semibold">
                        <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>{stat.label}</span>
                        <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>{stat.val}</span>
                      </div>
                      <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
                        <motion.div initial={{ width: 0 }} animate={{ width: stat.val }} transition={{ duration: 1.5, delay: 0.6 }} className={`h-full rounded-full ${isDark ? 'bg-zinc-500' : 'bg-indigo-500'}`}></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${bgPanel} backdrop-blur-2xl ring-1 ${ringPanel} rounded-[2rem] p-8 shadow-2xl`}>
                <div className="flex justify-between mb-6">
                  <h3 className={`text-sm font-bold tracking-widest uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>7-Day Action Plan</h3>
                  <Target className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                </div>
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <li key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                      <button className="mt-0.5 flex-shrink-0">{task.done ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className={`w-5 h-5 ${isDark ? 'text-zinc-600' : 'text-zinc-300'}`} />}</button>
                      <span className={`text-sm font-medium transition-all ${task.done ? (isDark ? 'text-zinc-600 line-through' : 'text-zinc-400 line-through') : (isDark ? 'text-zinc-200' : 'text-zinc-700')}`}>{task.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={resetAll} className={`w-full py-4 ring-1 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-sm ${isDark ? 'ring-white/10 text-zinc-400 hover:text-white hover:bg-white/5' : 'ring-black/5 bg-white text-zinc-500 hover:text-zinc-800 hover:bg-slate-50'}`}>
                ← New Analysis
              </button>
            </motion.div>

            {/* RIGHT COLUMN: Tabbed Results */}
            <motion.div layout transition={{ duration: 0.8, ease: premiumEase }} className="flex-grow min-w-0 w-full relative" id="report-content">
              
              <div className="flex justify-center mb-10">
                <div className={`p-1.5 rounded-2xl inline-flex gap-1 backdrop-blur-md ring-1 shadow-sm ${isDark ? 'bg-white/5 ring-white/10' : 'bg-white ring-black/5'}`}>
                  <button onClick={() => setActiveTab('strategy')} className={`px-8 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'strategy' ? (isDark ? 'bg-white text-black shadow-lg scale-105' : 'bg-indigo-600 text-white shadow-lg scale-105') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700')}`}>
                    Strategic Roadmap
                  </button>
                  <button onClick={() => setActiveTab('data')} className={`px-8 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'data' ? (isDark ? 'bg-white text-black shadow-lg scale-105' : 'bg-indigo-600 text-white shadow-lg scale-105') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700')}`}>
                    Channel Data
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'strategy' ? (
                  <motion.div key="strategy" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-12 w-full">
                    
                    <motion.div variants={itemVariants} className={`${bgPanel} backdrop-blur-md ring-1 ${ringPanel} rounded-3xl p-6 md:p-12 relative overflow-hidden shadow-2xl`}>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
                      <div className="flex items-center gap-3 mb-6"><Flame className="w-5 h-5 text-red-500" /><h2 className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">Brutal Verdict</h2></div>
                      <p className={`text-2xl md:text-3xl font-light leading-[1.7] tracking-tight ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{results.verdict}</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                      <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3 mb-6"><Sparkles className="w-5 h-5 text-cyan-500" /><h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Viral Shorts Deck</h2></div>
                        {results.shorts?.map((item, i) => (
                          <div key={`short-${i}`} className={`relative flex flex-col justify-between ${bgCard} ring-1 ${isDark ? 'ring-white/5 hover:ring-cyan-500/30' : 'ring-black/5 hover:ring-cyan-500/50 shadow-md'} rounded-2xl p-6 transition-all min-h-[220px] ${i === 0 ? 'border-l-4 border-cyan-500' : ''} ${i !== 0 ? '-mt-4 scale-[0.98]' : ''} ${i === results.shorts?.length - 1 ? 'z-10' : ''}`}>
                            <div className="flex gap-4 items-start relative z-10 mb-6">
                              <span className="text-cyan-500 font-mono text-xs font-bold mt-1 tracking-widest">{i + 1}</span>
                              <div className="space-y-3 pr-4">
                                <span className={`font-bold leading-relaxed text-lg block ${textTitle}`}>{item.title}</span>
                                <p className={`font-medium text-sm leading-loose border-l pl-4 ${isDark ? 'text-zinc-400 border-zinc-700' : 'text-zinc-500 border-zinc-200'}`}>{item.reasoning}</p>
                              </div>
                            </div>
                            <button onClick={() => setActiveIdea({ title: item.title, type: 'short' })} className={`self-end flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative z-20 ${isDark ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 ring-1 ring-cyan-500/30' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 ring-1 ring-cyan-200'}`}>
                              <PenTool className="w-4 h-4" /> Write Script
                            </button>
                          </div>
                        ))}
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3 mb-6"><LayoutTemplate className="w-5 h-5 text-indigo-500" /><h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Long-Form Reels</h2></div>
                        {results.longForm?.map((item, i) => (
                          <div key={`long-${i}`} className={`relative flex flex-col justify-between ${bgCard} ring-1 ${isDark ? 'ring-white/5 hover:ring-indigo-500/30' : 'ring-black/5 hover:ring-indigo-500/50 shadow-md'} rounded-2xl p-6 transition-all overflow-hidden min-h-[220px] ${i === 0 ? 'border-l-4 border-indigo-500' : ''} ${i % 2 !== 0 ? 'skew-x-1' : '-skew-x-1'}`}>
                            <div className="flex gap-4 items-start relative z-10 pr-10 mb-6">
                              <span className="text-indigo-500 font-mono text-xs font-bold mt-1 tracking-widest">{i + 1}</span>
                              <div className="space-y-3">
                                 <span className={`font-bold leading-relaxed text-lg block ${textTitle}`}>{item.title}</span>
                                 <p className={`font-medium text-sm leading-loose border-l pl-4 ${isDark ? 'text-zinc-400 border-zinc-700' : 'text-zinc-500 border-zinc-200'}`}>{item.reasoning}</p>
                              </div>
                            </div>
                            <button onClick={() => setActiveIdea({ title: item.title, type: 'long' })} className={`self-start flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative z-20 skew-x-0 ${isDark ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 ring-1 ring-indigo-500/30' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ring-1 ring-indigo-200'}`}>
                              <PenTool className="w-4 h-4" /> Write Script
                            </button>
                            <div className={`absolute right-0 top-3 bottom-3 flex flex-col justify-around py-3 w-8 ring-1 ${isDark ? 'bg-zinc-900 ring-white/5' : 'bg-slate-100 ring-black/5'}`}>
                               {[...Array(5)].map((_, s) => <div key={s} className={`w-3 h-3 rounded ring-1 ${isDark ? 'bg-zinc-950 ring-zinc-800' : 'bg-white ring-slate-200'}`}></div>)}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>

                ) : (
                  
                  <motion.div key="metrics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease: premiumEase }} className="w-full space-y-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className={`${bgPanel} ring-1 ${ringPanel} rounded-3xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300 shadow-xl`}>
                         <Users className="w-8 h-8 text-cyan-500 mb-4" />
                         <p className={`font-bold mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Total Subscribers</p>
                         <h3 className={`text-4xl font-black font-mono ${textTitle}`}>{results.extractedStats?.subscribers || 'N/A'}</h3>
                      </div>
                      <div className={`${bgPanel} ring-1 ${ringPanel} rounded-3xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300 shadow-xl`}>
                         <Activity className="w-8 h-8 text-indigo-500 mb-4" />
                         <p className={`font-bold mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Recent Views (28d)</p>
                         <h3 className={`text-4xl font-black font-mono ${textTitle}`}>{results.extractedStats?.views || 'N/A'}</h3>
                      </div>
                      <div className={`${bgPanel} ring-1 ${ringPanel} rounded-3xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300 shadow-xl`}>
                         <Clock className="w-8 h-8 text-purple-500 mb-4" />
                         <p className={`font-bold mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Watch Hours (28d)</p>
                         <h3 className={`text-4xl font-black font-mono ${textTitle}`}>{results.extractedStats?.watchTimeHours || 'N/A'}</h3>
                      </div>
                    </div>

                    <div className={`w-full ${bgPanel} backdrop-blur-md ring-1 ${ringPanel} rounded-3xl p-6 md:p-12 shadow-2xl`}>
                      <div className="flex items-center gap-3 mb-10"><Target className={`w-5 h-5 ${isDark ? 'text-white/70' : 'text-zinc-400'}`} /><h2 className={`text-2xl font-bold tracking-tight ${textTitle}`}>Extracted Monetization Progress</h2></div>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={60}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff08" : "#00000008"} vertical={false} />
                            <XAxis dataKey="name" stroke={isDark ? "#ffffff30" : "#00000030"} tick={{ fill: isDark ? '#ffffff80' : '#00000080', fontSize: 14 }} axisLine={false} tickLine={false} />
                            <YAxis stroke={isDark ? "#ffffff30" : "#00000030"} tick={{ fill: isDark ? '#ffffff50' : '#00000050', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#0a0a0c' : '#ffffff', border: `1px solid ${isDark ? '#ffffff10' : '#00000010'}`, borderRadius: '12px', color: isDark ? '#fff' : '#000' }} cursor={{fill: 'transparent'}}/>
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="Current" fill="#818cf8" radius={[6, 6, 0, 0]} name=" Extracted Data" />
                            <Bar dataKey="Goal" fill={isDark ? "#3f3f46" : "#e2e8f0"} radius={[6, 6, 0, 0]} name=" YT Threshold" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- ROUTER PROTECTION ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-[#030305] flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8 text-indigo-500" /></div>;
  return user ? children : <Navigate to="/" />;
};

// --- MAIN ENTRY POINT ---
export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}