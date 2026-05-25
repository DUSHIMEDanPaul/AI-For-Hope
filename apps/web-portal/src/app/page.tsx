"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Users, 
  Calendar, 
  Brain, 
  ShieldAlert, 
  Smartphone, 
  ArrowUpRight, 
  Terminal, 
  FileText, 
  HardDrive, 
  Lock,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"triage" | "imaging" | "metrics">("triage");
  const [inputSymptoms, setInputSymptoms] = useState("Constant dry cough, high fever at night, chest tightness, heavy fatigue for 2 weeks");
  const [triageResponse, setTriageResponse] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const simulateTriage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setTriageResponse({
        urgency: "HIGH (RED TIER)",
        score: 0.89,
        endemic_risk: "Tuberculosis (T.B.) / Malaria overlapping possibility",
        recommended_actions: [
          "Route directly to Nurse Intake Station #3 for immediate blood smear test",
          "Initiate rapid chest X-ray screening module",
          "Assign Queue Priority Level 1 (Expected wait time: < 7 minutes)"
        ],
        diagnostic_confidence: "94.2%"
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <main className="min-height-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-400/30 text-brand-400">
                <Brain className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                AI for <span className="text-gradient">Hope</span>
              </h1>
            </div>
            <p className="text-sm text-slate-400 max-w-xl">
              High-performance healthcare platform for clinics in Rwanda. Decoupling clinical workflows, mobile transactions, and GPU-driven Triton diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="./docs/system_architecture.md" 
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass hover:bg-white/5 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-brand-400" />
              System Blueprint
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 transition duration-200 flex items-center gap-2 shadow-lg shadow-brand-500/20"
            >
              <Terminal className="w-4 h-4" />
              Git Repository
            </a>
          </div>
        </header>

        {/* Global Simulated Metrics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-premium p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Patient Intake</p>
                <h3 className="text-3xl font-bold tracking-tight">14,842</h3>
              </div>
              <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 group-hover:scale-110 transition duration-200">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-brand-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% monthly increase</span>
            </div>
          </div>

          <div className="glass-premium p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Diagnostics Run</p>
                <h3 className="text-3xl font-bold tracking-tight text-brand-300">9,241</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition duration-200">
                <Cpu className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>Triton Cluster: 99.98% uptime</span>
            </div>
          </div>

          <div className="glass-premium p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Waiting Time</p>
                <h3 className="text-3xl font-bold tracking-tight">12.5 <span className="text-lg font-medium text-slate-400">mins</span></h3>
              </div>
              <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 group-hover:scale-110 transition duration-200">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-pink-400 font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>Reduced by 45% using AI Triage</span>
            </div>
          </div>

          <div className="glass-premium p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">MoMo Payments settled</p>
                <h3 className="text-3xl font-bold tracking-tight text-green-400">8.4M <span className="text-xs text-slate-400">RWF</span></h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition duration-200">
                <Smartphone className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-green-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>MTN / Airtel settled instantly</span>
            </div>
          </div>

        </section>

        {/* Core Architecture Split Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Interactive AI Sandbox */}
          <div className="lg:col-span-7 glass-premium p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-brand-400" />
                <h2 className="text-xl font-bold tracking-tight">AI Sandbox Inference Simulator</h2>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/20 uppercase tracking-wider">
                FastAPI / Triton
              </span>
            </div>

            {/* Simulated Tabs */}
            <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActiveTab("triage")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition duration-150 flex items-center justify-center gap-2 ${activeTab === "triage" ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white"}`}
              >
                <Activity className="w-3.5 h-3.5" />
                Symptom Triage
              </button>
              <button 
                onClick={() => setActiveTab("imaging")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition duration-150 flex items-center justify-center gap-2 ${activeTab === "imaging" ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white"}`}
              >
                <Layers className="w-3.5 h-3.5" />
                Medical Imaging
              </button>
              <button 
                onClick={() => setActiveTab("metrics")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition duration-150 flex items-center justify-center gap-2 ${activeTab === "metrics" ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white"}`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Model Details
              </button>
            </div>

            {activeTab === "triage" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Enter Clinical Symptoms</label>
                  <textarea 
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-brand-400 transition"
                    rows={4}
                    value={inputSymptoms}
                    onChange={(e) => setInputSymptoms(e.target.value)}
                  />
                </div>

                <button 
                  onClick={simulateTriage}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-brand-500 hover:bg-brand-600 active:scale-[0.99] transition duration-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white shadow-lg shadow-brand-500/20"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing via PyTorch Engine...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Perform Triage Check
                    </>
                  )}
                </button>

                {triageResponse && (
                  <div className="mt-4 p-5 rounded-2xl bg-brand-950/40 border border-brand-800/40 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center pb-2 border-b border-brand-900/40">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Analysis Result</span>
                      <span className="text-xs font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                        {triageResponse.urgency}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-300">
                        <strong className="text-brand-300">Risk Assessment:</strong> {triageResponse.endemic_risk}
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-brand-300">Inference Confidence:</strong> {triageResponse.diagnostic_confidence}
                      </p>
                      <div className="space-y-1.5 pt-2">
                        <strong className="text-xs text-slate-400 block uppercase tracking-wider">Clinical Guidance Protocol:</strong>
                        {triageResponse.recommended_actions.map((act: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/40 p-2 rounded-lg border border-slate-800/40">
                            <ChevronRight className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "imaging" && (
              <div className="space-y-5 py-6 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                <HardDrive className="w-12 h-12 text-slate-600 animate-pulse" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-slate-300">Drag & Drop Radiology DICOM Image</p>
                  <p className="text-xs text-slate-500">Supports .dcm, .png formats up to 15MB</p>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-xl text-xs font-semibold text-slate-300">
                  Select File
                </button>
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Triage Classifier</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">XGBoost (V4.2)</p>
                    <span className="text-[10px] text-brand-400 mt-1 block">Accuracy: 95.8% (Validated on clinical data)</span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">DICOM Classifier</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">ResNet-50 PyTorch Weights</p>
                    <span className="text-[10px] text-indigo-400 mt-1 block">Latency: 140ms per inference</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Both models are deployed as isolated containers in the `/ml-services` layer, communicating via gRPC with Triton for hardware-accelerated processing.
                </p>
              </div>
            )}

          </div>

          {/* Right panel: Active Live Feed & Architecture Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Live Operational Feed */}
            <div className="glass-premium p-6 rounded-3xl flex-1 flex flex-col space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Activity className="w-5 h-5 text-brand-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Live Clinical Activity</h3>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[300px] flex-1 pr-1">
                
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0 animate-ping" />
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300">
                      <strong>Patient check-in:</strong> Ndayishimiye K. registered at intake kiosk #2.
                    </p>
                    <span className="text-[10px] text-slate-500">Just now • Patient Service</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300">
                      <strong>Triage inference complete:</strong> Urgency Tier Green (Expected wait: 14 mins).
                    </p>
                    <span className="text-[10px] text-slate-500">3 mins ago • Triage AI Engine</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300">
                      <strong>MTN MoMo transaction:</strong> settled 5,000 RWF for clinic consult fee.
                    </p>
                    <span className="text-[10px] text-slate-500">8 mins ago • Billing Service</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300">
                      <strong>Critical Anomaly Detected:</strong> Tuberculosis indicators flagged in DICOM X-ray analysis.
                    </p>
                    <span className="text-[10px] text-slate-500">12 mins ago • Imaging Service</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Architecture Details Container */}
            <div className="glass-premium p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">HIPAA Security Standard</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demographics and EMR data fields use AES-GCM-256 column-level encryption. Network boundaries are locked down using private AWS VPC configurations, with full logging for every database read/write event.
              </p>
            </div>

          </div>

        </section>

        {/* Footer info */}
        <footer className="text-center py-6 text-xs text-slate-600 border-t border-slate-900">
          <p>© 2026 AI for Hope. All rights reserved. Architected for secure regional clinics.</p>
        </footer>

      </div>
    </main>
  );
}
