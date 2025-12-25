import React, { useState } from "react";
import { AppState, MeetingResult } from "./types";
import { processMeeting } from "./services/ai";

const CloudUploadIcon = () => (
  <svg className="w-12 h-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
);

export default function App() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleUpload(file: File) {
    if (!file.type.startsWith("video/")) {
      setError("Analysis Engine Fault: Protocol requires valid video containers (MP4, MOV, WEBM).");
      setState("error");
      return;
    }
    setFileName(file.name);
    setState("processing");
    try {
      const data = await processMeeting(file);
      setResult(data);
      setState("success");
    } catch (e: any) {
      setError(e.message || "Deterministic synthesis failed. System integrity check required.");
      setState("error");
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center bg-[#050810] text-gray-200 selection:bg-indigo-500/30">
      <header className="w-full max-w-7xl mb-12 flex justify-between items-end border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-3xl shadow-2xl shadow-indigo-500/20 text-white">M</div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">MeetingMind <span className="text-indigo-500 font-light">PRO</span></h1>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-1">Production-Grade Intelligence</p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">System Stable</span>
          </div>
          <span className="text-[9px] text-gray-600 font-bold">CORE v3.0.0-PRO • STABLE-SYNC</span>
        </div>
      </header>

      <main className="w-full max-w-7xl">
        {state === "idle" && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-5xl mx-auto pt-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-4 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-indigo-500/20">Enterprise Deployment Active</span>
              <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter text-white leading-[0.9] text-balance">
                Deterministic <span className="text-indigo-500">Meeting Synthesis.</span>
              </h2>
              <p className="text-gray-400 text-2xl max-w-3xl mx-auto font-light leading-snug text-pretty">
                Engineered for leadership teams. Our multi-stage digestion protocol guarantees completeness for recordings up to 120 minutes with zero detail loss.
              </p>
            </div>
            
            <label className="glass glow-border block w-full aspect-[21/6] rounded-[48px] flex flex-col items-center justify-center cursor-pointer transition-all border-dashed border-2 border-indigo-500/20 group hover:bg-indigo-500/[0.04] active:scale-[0.995]">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              <div className="p-8 bg-indigo-500/10 rounded-3xl group-hover:scale-105 transition-transform duration-700 group-hover:bg-indigo-500/20 shadow-2xl border border-white/5">
                <CloudUploadIcon />
              </div>
              <span className="text-3xl font-black mt-8 text-white tracking-tight">Deploy Record for Extraction</span>
              <span className="text-gray-500 mt-4 text-[10px] font-black tracking-[0.4em] uppercase opacity-70">MP4 • MOV • WEBM • FULL DURATION SUPPORT</span>
            </label>
          </div>
        )}

        {state === "processing" && (
          <div className="flex flex-col items-center justify-center py-44 space-y-12 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-44 h-44 border-[1px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 bg-indigo-500/5 rounded-full animate-pulse border border-indigo-500/20 shadow-[0_0_60px_rgba(99,102,241,0.1)]"></div>
              </div>
            </div>
            <div className="text-center space-y-6">
              <h3 className="text-4xl font-black text-white tracking-tighter">Executing Synthesis Protocol</h3>
              <p className="text-gray-400 text-xl max-w-xl mx-auto font-light leading-relaxed">
                Analyzing segments of <span className="text-indigo-400 font-mono italic px-2 bg-indigo-500/10 rounded">{fileName}</span>. <br/>
                Aggregating decisions and resolving duplicate context strings...
              </p>
            </div>
          </div>
        )}

        {state === "success" && result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Left Content - Primary Deep Notes */}
            <section className="lg:col-span-8 space-y-12">
              <div className="glass p-14 rounded-[56px] shadow-2xl border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent opacity-50"></div>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"></div>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Executive Synthesis</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">PROTOCOL: STABLE</span>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[22px] leading-[1.7] text-gray-200 font-light whitespace-pre-wrap selection:bg-indigo-500/40">{result.summary}</p>
                </div>
              </div>

              <div className="glass p-14 rounded-[56px] shadow-2xl border-white/5 relative">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Action Deliverables Matrix</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.action_items.map((item, i) => (
                    <div key={i} className="flex flex-col p-10 rounded-[32px] bg-white/[0.01] border border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.03] transition-all duration-700 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"><CheckIcon /></div>
                      <div className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-3 inline-block">Item Segment {String(i+1).padStart(2, '0')}</div>
                      <p className="text-white font-bold text-2xl mb-10 flex-grow leading-[1.2] tracking-tight">{item.task}</p>
                      <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">Responsible</p>
                          <p className="text-indigo-300 text-[16px] font-bold tracking-tight">{item.owner}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2">Target Date</p>
                          <p className="text-gray-300 text-[16px] font-bold tracking-tight">{item.deadline}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Right Sidebar - Strategic & Comms */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="glass p-10 rounded-[44px] border-l-[12px] border-l-indigo-600 shadow-2xl bg-gradient-to-br from-indigo-500/[0.04] to-transparent">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-10 border-b border-white/10 pb-6">Strategic Decisions</h3>
                <ul className="space-y-8">
                  {result.decisions.map((decision, i) => (
                    <li key={i} className="text-gray-200 text-lg leading-snug flex gap-5 group">
                      <span className="text-indigo-500 font-black mt-1 opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0">{String(i+1).padStart(2, '0')}</span>
                      <span className="font-semibold tracking-tight group-hover:text-white transition-colors">{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <div className="glass p-10 rounded-[44px] shadow-2xl relative overflow-hidden border-white/5 group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[80px] group-hover:bg-emerald-500/10 transition-colors"></div>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Comms: WhatsApp
                    </h3>
                    <button 
                      onClick={() => copyToClipboard(result.whatsapp_followup)}
                      className="flex items-center gap-2 text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-full hover:bg-emerald-500/20 active:scale-90 transition-all border border-emerald-500/20"
                    >
                      <CopyIcon /> COPY
                    </button>
                  </div>
                  <div className="p-8 bg-black/60 rounded-[32px] border border-white/5 font-mono text-[13px] text-gray-400 leading-relaxed italic border-l-4 border-l-emerald-500/40">
                    {result.whatsapp_followup}
                  </div>
                </div>

                <div className="glass p-10 rounded-[44px] shadow-2xl relative overflow-hidden border-white/5 group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[80px] group-hover:bg-indigo-500/10 transition-colors"></div>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div> Comms: Email
                    </h3>
                    <button 
                      onClick={() => copyToClipboard(result.email_followup)}
                      className="flex items-center gap-2 text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-5 py-2.5 rounded-full hover:bg-indigo-500/20 active:scale-90 transition-all border border-indigo-500/20"
                    >
                      <CopyIcon /> COPY
                    </button>
                  </div>
                  <div className="p-8 bg-black/60 rounded-[32px] border border-white/5 font-mono text-[13px] text-gray-400 leading-relaxed italic border-l-4 border-l-indigo-500/40">
                    {result.email_followup}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setState("idle")}
                className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-[32px] hover:bg-indigo-50 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-[0.98] border-b-4 border-gray-300"
              >
                Reset Engine Protocol
              </button>
            </aside>
          </div>
        )}

        {state === "error" && (
          <div className="glass border-red-500/40 p-24 rounded-[72px] text-center max-w-4xl mx-auto shadow-2xl bg-gradient-to-b from-red-500/[0.03] to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20"></div>
            <div className="w-28 h-28 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
              <svg className="w-14 h-14 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-5xl font-black text-white mb-8 tracking-tighter">System Intelligence Fault</h3>
            <p className="text-gray-400 mb-14 text-2xl leading-relaxed font-light text-balance">{error}</p>
            <button 
              onClick={() => setState("idle")}
              className="px-20 py-6 bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-[0_15px_40px_rgba(239,68,68,0.3)]"
            >Re-initialize Sync</button>
          </div>
        )}
      </main>

      <footer className="mt-32 py-16 w-full max-w-7xl border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-gray-700 font-black uppercase tracking-[0.4em] text-[9px]">
        <div className="flex items-center gap-6">
          <span className="text-indigo-500/50">EST. 2025</span>
          <span className="text-gray-800">|</span>
          <span>MeetingMind Neural-Div</span>
          <span className="text-gray-800">|</span>
          <span className="text-emerald-500/40">SLA PRO-LEVEL ACTIVE</span>
        </div>
        <div className="flex gap-16">
          <span className="hover:text-indigo-400 cursor-pointer transition-colors duration-300">ISO-27001</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors duration-300">Compliance</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors duration-300">Enterprise Cloud</span>
        </div>
      </footer>
    </div>
  );
}
