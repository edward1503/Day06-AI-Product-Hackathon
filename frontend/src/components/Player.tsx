import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Pause,
  SkipForward,
  Volume2,
  Captions,
  Settings,
  Maximize,
  Bot,
  Send,
  List,
  FileText,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Lesson {
  id: number;
  originalId: string; // The backend ID like "lecture-1"
  title: string;
  duration: string;
  status: 'completed' | 'playing' | 'locked';
  videoUrl?: string; // Add video url type
}

interface ChatMessage {
  id: number;
  role: 'ai' | 'user';
  content: string;
}

interface Chapter {
  title: string;
  start_time: string;
  end_time?: string;
  summary?: string;
}

// --- Components ---

const Header = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <header className="h-16 bg-surface-container-low shrink-0 flex items-center justify-between px-6 z-20 border-b border-outline-variant/10">
    <button
      onClick={() => onNavigate('landing')}
      className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-label text-xs uppercase tracking-[0.05em] font-semibold">Back to Course</span>
    </button>
    <div className="flex items-center gap-4">
      <div className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant hidden sm:block">
        CS231N: Deep Learning
      </div>
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
);

const CourseSidebar = ({
  lessons,
  onSelectLesson,
  isCollapsed,
  onToggle
}: {
  lessons: Lesson[],
  onSelectLesson: (id: number) => void,
  isCollapsed: boolean,
  onToggle: () => void
}) => (
  <motion.aside
    initial={false}
    animate={{ width: isCollapsed ? 64 : 288 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="bg-surface-container-low shrink-0 flex flex-col hidden lg:flex relative z-10 border-r border-outline-variant/5 overflow-hidden"
  >
    <div className="p-6 pb-4 flex items-center justify-between">
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 min-w-0"
        >
          <h2 className="font-headline text-lg font-medium text-on-surface truncate">Lectures & Info</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[100%] rounded-full"></div>
            </div>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Click to play</span>
          </div>
        </motion.div>
      )}
      <button
        onClick={onToggle}
        className={`p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant shrink-0 ${isCollapsed ? 'mx-auto' : 'ml-2'}`}
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
      </button>
    </div>

    {!isCollapsed && (
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-y-auto px-4 pb-6 space-y-1 min-w-[288px]"
      >
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors group relative overflow-hidden ${lesson.status === 'playing' ? 'bg-surface-container-highest' : 'hover:bg-surface-container'
              }`}
          >
            {lesson.status === 'playing' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-container" />
            )}

            {lesson.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />}
            {lesson.status === 'playing' && <PlayCircle className="w-5 h-5 text-primary mt-0.5 animate-pulse" />}
            {lesson.status === 'locked' && <PlayCircle className="w-5 h-5 text-on-surface-variant/40 mt-0.5" />}

            <div className="flex-1 text-left">
              <p className={`font-body text-sm font-medium transition-colors ${lesson.status === 'locked' ? 'text-on-surface-variant/60 group-hover:text-on-surface' :
                  lesson.status === 'playing' ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'
                }`}>
                {lesson.id}. {lesson.title}
              </p>
              <p className={`font-label text-xs mt-1 tracking-wide ${lesson.status === 'playing' ? 'text-primary' : 'text-on-surface-variant/60'
                }`}>
                {lesson.duration} {lesson.status === 'playing' ? '• Playing' : '• Ready'}
              </p>
            </div>
          </button>
        ))}
      </motion.nav>
    )}
  </motion.aside>
);

const VideoPlayer = ({ videoUrl, videoRef }: { videoUrl?: string, videoRef: React.RefObject<HTMLVideoElement | null> }) => (
  <div className="flex-1 bg-black m-4 rounded-xl overflow-hidden relative group">
    {videoUrl ? (
      <video ref={videoRef as any} src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
    ) : (
      <>
        {/* Video Placeholder Background fallback */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80"></div>
          <div className="absolute inset-0 flex items-center justify-center font-headline text-on-surface-variant">
            Please pick a lecture to play from the sidebar.
          </div>
        </div>
      </>
    )}
  </div>
);

const AIChatbot = ({
  isCollapsed,
  onToggle,
  lectureId,
  getCurrentTimestamp
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  lectureId?: string;
  getCurrentTimestamp: () => number;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Reset chat on lecture change
  useEffect(() => {
    setMessages([{ id: 1, role: 'ai', content: "Hello! I'm Obsidian AI. Ask me anything about this video, and I'll use the lecture context to explain it." }]);
  }, [lectureId]);

  const handleSend = async () => {
    if (!input.trim() || isThinking || !lectureId) return;

    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/lectures/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lecture_id: lectureId,
          current_timestamp: getCurrentTimestamp(),
          question: input,
        }),
      });

      if (!response.ok) throw new Error("Failed to connect to AI");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const aiMessageId = Date.now() + 1;
      
      setMessages(prev => [...prev, { id: aiMessageId, role: 'ai', content: "" }]);
      setIsThinking(false);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(m => 
            m.id === aiMessageId ? { ...m, content: m.content + chunk } : m
          ));
        }
      }
    } catch (error) {
      console.error(error);
      setIsThinking(false);
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: "Sorry, I ran into an error connecting to the API." }]);
    }
  };

  return (
    <div className="absolute bottom-6 right-8 flex flex-col items-end z-30 pointer-events-none">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] bg-surface-variant/70 backdrop-blur-2xl rounded-xl shadow-[0_0_50px_rgba(205,189,255,0.08)] ring-1 ring-outline-variant/20 overflow-hidden flex flex-col mb-4 pointer-events-auto"
          >
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-outline-variant/15 flex items-center justify-between bg-surface-container-highest/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center relative">
                  <Bot className="w-3.5 h-3.5 text-on-primary" />
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-20"></div>
                </div>
                <span className="font-label text-[10px] uppercase tracking-[0.08em] font-semibold text-primary">Obsidian AI</span>
              </div>
              <button
                onClick={onToggle}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-container transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-container shrink-0 flex items-center justify-center mt-1">
                      <Bot className="w-3.5 h-3.5 text-on-primary" />
                    </div>
                  )}
                  <div className={`p-3 rounded-xl text-sm font-body leading-relaxed whitespace-pre-wrap ${msg.role === 'ai'
                      ? 'bg-surface-container-lowest rounded-tl-sm border border-outline-variant/10 text-on-surface/90'
                      : 'bg-primary/10 border border-primary/20 rounded-tr-sm text-on-surface'
                    }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-container shrink-0 flex items-center justify-center mt-1">
                    <Bot className="w-3.5 h-3.5 text-on-primary" />
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl rounded-tl-sm border border-outline-variant/10 flex gap-2 items-center">
                    <span className="text-xs text-on-surface-variant font-medium mr-1">Obsidian AI is thinking</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-surface-container-highest/30">
              <div className="bg-surface-container-lowest rounded-xl flex items-center p-2 ring-1 ring-outline-variant/20 focus-within:ring-primary/50 transition-shadow">
                <input
                  className="bg-transparent border-none w-full text-sm font-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none p-1"
                  placeholder="Ask about this concept..."
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isThinking || !lectureId}
                />
                <button
                  onClick={handleSend}
                  disabled={isThinking || !lectureId}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isThinking || !lectureId ? 'bg-surface-container-highest text-on-surface-variant/30' : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCollapsed && (
        <button
          onClick={onToggle}
          className="w-14 h-14 rounded-2xl bg-surface-variant/60 backdrop-blur-xl border border-outline-variant/20 flex items-center justify-center shadow-[0_0_30px_rgba(205,189,255,0.1)] hover:scale-105 transition-transform group pointer-events-auto"
        >
          <Bot className="w-6 h-6 text-primary group-hover:text-primary-container transition-colors" />
        </button>
      )}
    </div>
  );
};

const RightSidebar = ({ isCollapsed, onToggle, lectureId }: { isCollapsed: boolean, onToggle: () => void, lectureId?: string }) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [slides, setSlides] = useState<{name: string, url: string}[]>([]);

  useEffect(() => {
    if (!lectureId) {
      setChapters([]);
      setSlides([]);
      return;
    }
    fetch(`/data/cs231n/ToC_Summary/${lectureId.replace('_', '-')}.json`)
      .then(res => {
        if (!res.ok) throw new Error("No TOC File");
        return res.json();
      })
      .then(data => {
        // Handle data map according to the actual JSON structure
        if (data.table_of_contents) {
          setChapters(data.table_of_contents);
        } else if (Array.isArray(data)) {
          setChapters(data);
        } else {
          setChapters([]);
        }
      })
      .catch(err => {
        console.error("ToC fetch error:", err);
        setChapters([]);
      });
      
    // Fetch dynamic slides
    fetch(`/api/lectures/${lectureId}/slides`)
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => {
        console.error("Slides fetch error:", err);
        setSlides([]);
      });
  }, [lectureId]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface-container-low shrink-0 flex flex-col relative z-10 border-l border-outline-variant/5 overflow-hidden"
    >
      {/* Unified Header */}
      <div className="p-4 border-b border-outline-variant/10 shrink-0 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 min-w-0"
          >
            <List className="w-4 h-4 text-primary shrink-0" />
            <span className="font-label text-xs uppercase tracking-widest font-bold text-on-surface truncate">Course Insights</span>
          </motion.div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-2'}`}
        >
          {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Content Area */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent min-w-[320px]"
        >
          {/* T.O.C. Section */}
          <div className="space-y-4">
            <h3 className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 font-bold px-3">Lecture Outline</h3>
            <div className="space-y-1">
              {chapters.length === 0 ? (
                <div className="px-3 text-xs text-on-surface-variant">No outline available.</div>
              ) : (
                chapters.map((chap, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer group">
                    <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30 mt-1.5 shrink-0 group-hover:bg-primary transition-colors"></div>
                    <div className="flex-1">
                      <p className="font-body text-sm text-on-surface-variant group-hover:text-on-surface leading-tight transition-colors">{chap.topic_title || chap.title}</p>
                      <p className="font-label text-[10px] text-on-surface-variant/50 mt-1">{chap.timestamp || chap.start_time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resources Section */}
          {lectureId && slides.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 font-bold px-3">Resources & Slides</h3>
                <div className="grid grid-cols-1 gap-2 px-3">
                  {slides.map((s, idx) => (
                    <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high border border-outline-variant/10 hover:bg-surface-container-highest transition-colors text-left group">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-on-surface">{s.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.aside>
  );
};

export default function Player({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    fetch('/api/lectures')
      .then(res => res.json())
      .then(data => {
        // Load whatever lectures exist dynamically
        const cs231n = data.filter((l: any) => l.id.startsWith('lecture-'));
        const formattedLessons = cs231n.map((l: any, i: number) => ({
          id: i + 1,
          originalId: l.id,
          title: l.title || `Lecture ${i+1}`,
          duration: 'Various',
          status: i === 0 ? 'playing' : 'locked', // locked but we allow select
          videoUrl: `/${l.video_url}` 
        }));
        setLessons(formattedLessons);
      })
      .catch(console.error);
  }, []);

  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  
  // Start with Chatbot collapsed since it obscures the video
  const [isChatCollapsed, setIsChatCollapsed] = useState(true);

  const handleSelectLesson = (id: number) => {
    setLessons(prev => prev.map(lesson => {
      if (lesson.id === id) return { ...lesson, status: 'playing' };
      if (lesson.status === 'playing') return { ...lesson, status: 'completed' };
      return { ...lesson, status: 'locked' };
    }));
  };

  const activeLesson = lessons.find(l => l.status === 'playing');

  const getCurrentTimestamp = () => {
    if (videoRef.current) {
      return videoRef.current.currentTime;
    }
    return 0;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden selection:bg-primary-container/30 selection:text-primary">
      <Header onNavigate={onNavigate} />
      <main className="flex-1 flex overflow-hidden">
        <CourseSidebar
          lessons={lessons}
          onSelectLesson={handleSelectLesson}
          isCollapsed={isLeftSidebarCollapsed}
          onToggle={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        />
        <section className="flex-1 bg-surface flex flex-col relative min-w-0">
          <VideoPlayer videoUrl={activeLesson?.videoUrl} videoRef={videoRef} />
          <AIChatbot
            isCollapsed={isChatCollapsed}
            onToggle={() => setIsChatCollapsed(!isChatCollapsed)}
            lectureId={activeLesson?.originalId}
            getCurrentTimestamp={getCurrentTimestamp}
          />
        </section>
        <RightSidebar
          isCollapsed={isRightSidebarCollapsed}
          onToggle={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          lectureId={activeLesson?.originalId}
        />
      </main>
    </div>
  );
}
