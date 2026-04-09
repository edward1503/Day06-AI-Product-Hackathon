import { 
  Bell, 
  Settings, 
  LayoutGrid, 
  BookOpen, 
  FileText, 
  MonitorPlay, 
  Folder, 
  Bot, 
  Play, 
  Database, 
  Server, 
  Cloud, 
  ChevronDown, 
  CheckCircle2, 
  PlayCircle, 
  Lock 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Landing({ onNavigate }: { onNavigate: (view: 'login' | 'landing' | 'player' | 'admin') => void }) {
  const [lectures, setLectures] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/lectures')
      .then(res => res.json())
      .then(data => {
        // Filter strictly for lecture-1 and lecture-2
        const filtered = data.filter((l: any) => l.id === 'lecture-1' || l.id === 'lecture-2');
        setLectures(filtered);
      })
      .catch(err => console.error("Error fetching lectures:", err));
  }, []);

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden selection:bg-primary-container/30 selection:text-primary">
      {/* Top Navigation */}
      <header className="h-16 bg-surface-container-low shrink-0 flex items-center justify-between px-6 z-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <div className="font-headline text-lg font-bold text-primary tracking-widest uppercase">
            OBSIDIAN LENS
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button className="font-label text-sm font-semibold text-on-surface border-b-2 border-primary pb-1">Browse</button>
            <button className="font-label text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors pb-1">My Learning</button>
            <button className="font-label text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors pb-1">Resources</button>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors"><Bell className="w-5 h-5" /></button>
          <button 
            onClick={() => onNavigate('admin')}
            title="Admin Dashboard"
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden ring-1 ring-outline-variant/15 cursor-pointer">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbOySjIso_LcLPsBy2NpjWURdw_bqQaHZOti58VunfPZSMSfHDJYBoOYbO3rSctAAZGDIXnfyg_lMSvymC0IqtNqz5WqZOpU79Heu9-BGK0DSakgZICBTN99ffzNy_goznPqtVSufQK2nj5hiqOSuLvySKsNLr6MJvKtOoMuiPEZIlF8LPYprA7IhkCmpBJs2VMOtE18qEH3es-dcOvq3wjYPwNRD1RLYS5QcDpq30KLwh_skH3SYwkolTJwVj4fRG80I3xBNrfkK_"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-surface-container-low shrink-0 flex flex-col relative z-10 border-r border-outline-variant/5">
          <div className="p-5 border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center ring-1 ring-outline-variant/20">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Active Course</p>
                <p className="font-body text-sm font-semibold text-on-surface truncate">Stanford CS231N</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-container-highest text-on-surface transition-colors">
              <LayoutGrid className="w-4.5 h-4.5 text-primary" />
              <span className="font-body text-sm font-medium">Overview</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
              <BookOpen className="w-4.5 h-4.5" />
              <span className="font-body text-sm font-medium">Curriculum</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
              <FileText className="w-4.5 h-4.5" />
              <span className="font-body text-sm font-medium">Transcript</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
              <MonitorPlay className="w-4.5 h-4.5" />
              <span className="font-body text-sm font-medium">Slides</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
              <Folder className="w-4.5 h-4.5" />
              <span className="font-body text-sm font-medium">Resources</span>
            </button>
          </nav>

          <div className="p-4 border-t border-outline-variant/10 space-y-4">
            <div className="bg-surface-container-highest rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Course Progress</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary w-[50%] rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] text-on-surface-variant">1/2 Lectures</span>
                <span className="font-label text-[10px] text-on-surface-variant">50%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent">
          <div className="max-w-5xl mx-auto p-8 space-y-8">
            
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
              
              <div className="relative p-10 md:p-14 flex flex-col items-start">
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-surface-variant/80 text-on-surface font-label text-[10px] uppercase tracking-widest font-bold backdrop-blur-sm">Computer Vision</span>
                  <span className="px-2 py-1 rounded bg-surface-variant/80 text-on-surface font-label text-[10px] uppercase tracking-widest font-bold backdrop-blur-sm">Deep Learning</span>
                </div>
                
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-6 max-w-2xl leading-tight">
                  CS231N: Deep Learning for Computer Vision
                </h1>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden ring-1 ring-outline-variant/20">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=FeiFei" alt="Instructor" className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Instructor</p>
                    <p className="font-body text-sm font-semibold text-on-surface">Fei-Fei Li / Stanford</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => onNavigate('player')}
                    className="bg-gradient-to-r from-primary to-primary-container hover:from-primary/90 hover:to-primary-container/90 text-on-primary font-label text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(205,189,255,0.2)]"
                  >
                    <Play className="w-4 h-4 fill-current" /> Start Watching
                  </button>
                  <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/20 font-label text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
                    View Syllabus
                  </button>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10">
                <h2 className="font-headline text-xl font-bold text-on-surface mb-4">About this course</h2>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
                  Computer Vision has become ubiquitous in our society. This course is a deep dive into details of neural network based deep learning methods for computer vision. During this course, students will learn to implement, train and debug their own neural networks and gain a detailed understanding of cutting-edge research in computer vision.
                </p>
                <div className="flex gap-8">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Duration</p>
                    <p className="font-headline text-lg font-bold text-on-surface">2h 15m</p>
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Modules</p>
                    <p className="font-headline text-lg font-bold text-on-surface">2 Lectures</p>
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Resources</p>
                    <p className="font-headline text-lg font-bold text-on-surface">Slides & Transcripts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10">
                <h2 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6">Tech Stack</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center"><Server className="w-4 h-4 text-on-surface-variant" /></div>
                    <span className="font-body text-sm font-medium text-on-surface">Python / PyTorch</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center"><Database className="w-4 h-4 text-on-surface-variant" /></div>
                    <span className="font-body text-sm font-medium text-on-surface">FastAPI / SQLite</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center"><Bot className="w-4 h-4 text-on-surface-variant" /></div>
                    <span className="font-body text-sm font-medium text-on-surface">Google Gemini 2.5 AI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center"><Cloud className="w-4 h-4 text-on-surface-variant" /></div>
                    <span className="font-body text-sm font-medium text-on-surface">React / Tailwind V4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-headline text-2xl font-bold text-on-surface">Curriculum</h2>
                <span className="font-label text-xs text-on-surface-variant">{lectures.length} Lectures Total</span>
              </div>
              
              <div className="space-y-4">
                {lectures.length === 0 ? (
                  <div className="text-on-surface-variant text-sm p-4 text-center">Loading lectures or no lectures found...</div>
                ) : (
                  lectures.map((lecture, idx) => (
                    <div key={lecture.id} className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
                      <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="font-headline text-2xl font-bold text-on-surface-variant/40">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="font-body text-base font-bold text-on-surface">{lecture.title || `Lecture ${idx + 1}`}</h3>
                            <p className="font-label text-xs text-on-surface-variant mt-1">Video Ready</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => onNavigate('player')}
                          className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-label text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" /> Watch
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="h-20"></div> {/* Spacer for floating button */}
          </div>
        </main>
      </div>

      {/* Floating AI Button */}
      <button className="absolute bottom-8 right-8 w-14 h-14 rounded-2xl bg-surface-variant/60 backdrop-blur-xl border border-outline-variant/20 flex items-center justify-center shadow-[0_0_30px_rgba(205,189,255,0.1)] hover:scale-105 transition-transform group z-50">
        <Bot className="w-6 h-6 text-primary group-hover:text-primary-container transition-colors" />
      </button>
    </div>
  );
}

// Add Shield icon since it was missing from imports
function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2c3 0 5 1 7 2a1 1 0 0 1 1 1z" />
    </svg>
  )
}
