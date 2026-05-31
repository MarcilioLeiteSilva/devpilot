"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  CheckSquare, 
  Cpu, 
  Database, 
  Activity, 
  RefreshCw, 
  Server, 
  ArrowUpRight, 
  Sparkles, 
  Link2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";
import { getProjects } from "@/services/projectsApi";

interface HealthData {
  app: string;
  version: string;
  api: string;
  postgres: string;
  redis: string;
  qdrant: string;
}

export default function Dashboard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Projects stats state
  const [projectStats, setProjectStats] = useState({
    total: 0,
    development: 0,
    published: 0,
    archived: 0
  });

  const fetchHealthAndStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/health`, {
        headers: {
          "Accept": "application/json",
        },
      });
      if (!response.ok && response.status !== 503) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealth(data);
      setLastUpdated(new Date().toLocaleTimeString());

      // Fetch projects to compute metrics
      try {
        const projectsData = await getProjects({ limit: 100, include_archived: true });
        const items = projectsData.items;
        const total = items.filter(p => !p.is_archived).length;
        const development = items.filter(p => p.status === "DEVELOPMENT" && !p.is_archived).length;
        const published = items.filter(p => p.status === "PUBLISHED" && !p.is_archived).length;
        const archived = items.filter(p => p.is_archived || p.status === "ARCHIVED").length;
        
        setProjectStats({
          total,
          development,
          published,
          archived
        });
      } catch (projErr) {
        console.error("Failed to fetch project stats:", projErr);
      }

    } catch (err: any) {
      console.error("Failed to fetch backend health status:", err);
      setError("Backend unreachable. Please verify if the API server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthAndStats();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchHealthAndStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      title: "Total Projects",
      value: projectStats.total.toString(),
      description: "Active development workspaces",
      icon: FolderGit2,
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
    },
    {
      title: "In Development",
      value: projectStats.development.toString(),
      description: "Active programming phase",
      icon: Cpu,
      color: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    },
    {
      title: "Published",
      value: projectStats.published.toString(),
      description: "Live production platforms",
      icon: CheckSquare,
      color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
    },
    {
      title: "Archived Projects",
      value: projectStats.archived.toString(),
      description: "Soft deleted or paused spaces",
      icon: Database,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
    }
  ];

  const getStatusBadge = (statusValue: string | undefined) => {
    if (statusValue === "ok") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
          <CheckCircle2 className="w-3 h-3" /> Connected
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse">
        <AlertCircle className="w-3 h-3" /> Error
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#07080d] bg-[radial-gradient(ellipse_at_top_right,rgba(29,78,216,0.07),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.05),transparent_40%)] text-slate-100 flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-white/5 bg-[#0b0c10]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                DevPilot <span className="text-blue-500 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 ml-2 font-mono border border-slate-800 px-1.5 py-0.5 rounded">
                v0.1.0-alpha
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link href="/dashboard" className="text-white border-b-2 border-blue-500 pb-1 font-bold transition">
              Dashboard
            </Link>
            <Link href="/projects" className="text-slate-400 hover:text-white transition">
              Projects
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchHealthAndStats}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 transition duration-200 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              Sync Status
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Console Active
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-10">
        
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-2xl glass-panel p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-3 h-3" /> Core Infrastructure Validated
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Platform Foundations Active
            </h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
              Welcome to the DevPilot orchestration base. Stage 1 has established PostgreSQL, Redis queue workers, and Qdrant vector spaces. Ready for AI orchestrations.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-3 self-stretch md:self-auto flex-wrap sm:flex-nowrap">
            <Link 
              href="/projects" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-semibold px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition duration-200 hover:-translate-y-0.5"
            >
              Explore Projects <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        </section>

        {/* Metrics Grid */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
            Platform Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((card, i) => {
              const Icon = card.icon;
              return (
                <div 
                  key={i} 
                  className={`group relative overflow-hidden rounded-2xl glass-panel p-6 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:-translate-y-1 ${card.glow}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-400 font-medium">{card.title}</p>
                      <h3 className="text-4xl font-bold text-white tracking-tight">{card.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 leading-normal">{card.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Healthchecks & Services Status */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Health Diagnostics Panel */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    Live System Diagnostics
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time connectivity reports with backing storage systems.
                  </p>
                </div>
                {lastUpdated && (
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-white/5 px-2.5 py-1 rounded">
                    Synced: {lastUpdated}
                  </span>
                )}
              </div>

              {error ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">Diagnostic Connection Error</p>
                    <p className="text-slate-400 leading-normal">{error}</p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                
                {/* Postgres Card */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">PostgreSQL</span>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">Relational & relational settings store.</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-mono text-slate-400">Port 5432</span>
                    {getStatusBadge(health?.postgres)}
                  </div>
                </div>

                {/* Redis Card */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Redis Queue</span>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">Worker queue and temporary cache flow.</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-mono text-slate-400">Port 6379</span>
                    {getStatusBadge(health?.redis)}
                  </div>
                </div>

                {/* Qdrant Card */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Qdrant Vector</span>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">High-performance semantic long-term memory.</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-mono text-slate-400">Port 6333</span>
                    {getStatusBadge(health?.qdrant)}
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
              <span className="text-xs text-slate-500 font-mono">
                API gateway connectivity: {health?.api === "ok" ? "ACTIVE" : "PENDING"}
              </span>
              <button 
                onClick={fetchHealthAndStats} 
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1.5 py-1 px-3 rounded hover:bg-blue-500/5 transition self-end sm:self-auto"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Diagnostics
              </button>
            </div>

          </div>

          {/* Quick Actions / Integration Info */}
          <div className="glass-panel rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-400" />
                Integration Workspace
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your workspace to deploy agents directly. EasyPanel configurations are mapped inside documentation modules.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-xs font-semibold text-slate-300">GitHub Branch</span>
                  <span className="text-[10px] font-mono text-slate-400 ml-auto bg-slate-900 border border-white/5 px-2 py-0.5 rounded">main</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-xs font-semibold text-slate-300">Docker Network</span>
                  <span className="text-[10px] font-mono text-slate-400 ml-auto bg-slate-900 border border-white/5 px-2 py-0.5 rounded">devpilot-net</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex justify-between items-center pt-4 border-t border-white/5">
              <span>Environment: <strong className="text-slate-400">Development</strong></span>
              <span>Region: <strong className="text-slate-400">Localhost</strong></span>
            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-[#090a0f] mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevPilot AI. All rights reserved. Platform foundations completed.</p>
          <div className="flex gap-6">
            <a href="http://localhost:8000/health" target="_blank" className="hover:text-slate-300 transition">API Health</a>
            <a href="http://localhost:8000/api/status" target="_blank" className="hover:text-slate-300 transition">System Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
