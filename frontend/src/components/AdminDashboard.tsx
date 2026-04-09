import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Activity } from 'lucide-react';

interface CorrectionLog {
  id: number;
  question: string;
  answer: string;
  correction_exact?: string;
  confidence_score?: number;
  latency_ms?: number;
  created_at: string;
}

interface Stats {
  understood_rate: number;
  hallucination_rate: number;
  latency_p95: number;
  corrections: CorrectionLog[];
}

export default function AdminDashboard({ onNavigate }: { onNavigate: (view: 'login' | 'landing' | 'player' | 'admin') => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-surface">
        <div className="animate-spin text-primary m-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-8 text-on-surface">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-6">
          <button 
            onClick={() => onNavigate('landing')}
            className="p-2 hover:bg-surface-container rounded-full transition-colors border border-outline-variant/20"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> 
            AI Tutor System Dashboard
          </h1>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${stats.understood_rate >= 80 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <h3 className="text-sm font-bold opacity-70 mb-2">Tỷ lệ Đã hiểu (Understood Rate)</h3>
            <div className={`text-4xl font-black ${stats.understood_rate >= 80 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.understood_rate}%
            </div>
            <p className="text-xs mt-2 opacity-60">Target: {'>'}80%</p>
          </div>

          <div className={`p-6 rounded-2xl border ${stats.hallucination_rate <= 10 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <h3 className="text-sm font-bold opacity-70 mb-2">Tỷ lệ Hallucination (Error Rate)</h3>
            <div className={`text-4xl font-black ${stats.hallucination_rate <= 10 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.hallucination_rate}%
            </div>
            <p className="text-xs mt-2 opacity-60">Target: {'<'}10%</p>
          </div>

          <div className={`p-6 rounded-2xl border ${stats.latency_p95 <= 20000 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <h3 className="text-sm font-bold opacity-70 mb-2">Latency P95 (Ms)</h3>
            <div className={`text-4xl font-black ${stats.latency_p95 <= 20000 ? 'text-green-500' : 'text-red-500'}`}>
              {(stats.latency_p95 / 1000).toFixed(1)}s
            </div>
            <p className="text-xs mt-2 opacity-60">Target: {'<'}20s</p>
          </div>
        </div>

        {/* Correction Log */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 overflow-hidden">
          <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-red-500" />
            Correction Log (Báo Sai)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="py-3 px-4 opacity-70 font-bold">Thời gian</th>
                  <th className="py-3 px-4 opacity-70 font-bold">Câu hỏi User</th>
                  <th className="py-3 px-4 opacity-70 font-bold min-w-[200px]">Câu trả lời sai của AI</th>
                  <th className="py-3 px-4 opacity-70 text-red-500 font-bold min-w-[200px]">User sửa lại thành</th>
                </tr>
              </thead>
              <tbody>
                {stats.corrections.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center opacity-50">Không có dữ liệu báo sai. Tuyệt vời!</td>
                  </tr>
                ) : (
                  stats.corrections.map((c) => (
                    <tr key={c.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                      <td className="py-3 px-4 text-xs opacity-60">{new Date(c.created_at).toLocaleString('vi-VN')}</td>
                      <td className="py-3 px-4 truncate max-w-[200px]" title={c.question}>{c.question}</td>
                      <td className="py-3 px-4 text-amber-500 truncate max-w-[300px]" title={c.answer}>{c.answer}</td>
                      <td className="py-3 px-4 text-green-500 font-bold truncate max-w-[300px]" title={c.correction_exact}>{c.correction_exact || '--- Chưa cung cấp ---'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
