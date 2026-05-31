"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FolderGit2, 
  ArrowLeft, 
  Edit3, 
  Github, 
  ExternalLink, 
  Calendar, 
  Cpu, 
  Layers, 
  Sparkles,
  AlertCircle,
  Activity,
  Trash2,
  Archive
} from "lucide-react";
import { getProject, archiveProject, deleteProject, Project } from "@/services/projectsApi";

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch project details. Verify if project exists or if database connection is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const handleArchive = async () => {
    if (!project) return;
    try {
      await archiveProject(project.id);
      alert("Project archived successfully");
      fetchProjectDetails();
    } catch (err: any) {
      alert(err.message || "Failed to archive project");
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!confirm("Are you sure you want to delete (soft-delete) this project?")) return;
    try {
      await deleteProject(project.id);
      alert("Project soft-deleted successfully");
      router.push("/projects");
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  const getStatusBadge = (statusVal: string) => {
    const badges: Record<string, string> = {
      IDEA: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      PLANNING: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      DEVELOPMENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      TESTING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      PUBLISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      PAUSED: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
      ARCHIVED: "bg-rose-500/10 text-rose-400 border-rose-500/20"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badges[statusVal] || badges.IDEA}`}>
        {statusVal}
      </span>
    );
  };

  const getPriorityBadge = (priorityVal: string) => {
    const badges: Record<string, string> = {
      LOW: "bg-slate-500/10 text-slate-400 border-slate-500/10",
      MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/10",
      HIGH: "bg-amber-500/10 text-amber-400 border-amber-500/10",
      CRITICAL: "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${badges[priorityVal] || badges.MEDIUM}`}>
        {priorityVal} Priority
      </span>
    );
  };

  const getProjectTypeLabel = (typeVal: string) => {
    const labels: Record<string, string> = {
      MOBILE_APP: "Mobile App",
      WEB_APP: "Web App",
      SAAS: "SaaS Application",
      API: "API / Gateway",
      AGENT: "Autonomous AI Agent",
      AUTOMATION: "Workflow Automation"
    };
    return labels[typeVal] || typeVal;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Activity className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Querying project workspace details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col">
        <header className="border-b border-white/5 bg-[#0b0c10]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <span className="font-bold text-lg tracking-wider">DevPilot <span className="text-blue-500">AI</span></span>
            <Link href="/projects" className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 border border-white/5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-20 flex flex-col justify-center items-center gap-6">
          <AlertCircle className="w-16 h-16 text-rose-500" />
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white">Project Not Found</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {error || "We couldn't locate the specified project in our systems. It might have been permanently deleted or moved."}
            </p>
          </div>
          <Link href="/projects" className="px-5 py-2.5 bg-slate-900 rounded-xl border border-white/5 hover:bg-slate-800 transition text-xs font-bold">
            Return to Projects List
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080d] bg-[radial-gradient(ellipse_at_top_right,rgba(29,78,216,0.07),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.05),transparent_40%)] text-slate-100 flex flex-col">
      
      {/* Top Header */}
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
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/projects" className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 transition duration-200">
              <ArrowLeft className="w-3.5 h-3.5" /> All Projects
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 flex flex-col gap-6">
        
        {/* Back Link and Quick Action bar */}
        <div className="flex justify-between items-center">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
          </Link>
          
          <div className="flex gap-2">
            <Link 
              href={`/projects/${project.id}/edit`}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Project
            </Link>
            {!project.is_archived && (
              <button 
                onClick={handleArchive}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-amber-500/30 text-amber-500 transition"
              >
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
            )}
            <button 
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-rose-500/30 text-rose-500 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        {/* Project Header Info */}
        <section className="glass-panel rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="space-y-3 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {getProjectTypeLabel(project.project_type)}
              </span>
              {getStatusBadge(project.status)}
              {getPriorityBadge(project.priority)}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {project.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono tracking-wide">
              UUID: {project.uuid}
            </p>
          </div>

          <div className="flex gap-3 z-10 self-stretch md:self-auto">
            {project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-semibold px-4 py-3 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition"
              >
                <Github className="w-4 h-4" /> Codebase
              </a>
            )}
            {project.production_url && (
              <a 
                href={project.production_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-semibold px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.2)] transition"
              >
                <ExternalLink className="w-4 h-4" /> Visit Site
              </a>
            )}
          </div>
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        </section>

        {/* Detailed Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Description details */}
          <div className="md:col-span-2 glass-panel rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Project Overview
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {project.description || "No project overview description provided."}
              </p>
            </div>
            
            {/* Project Status Info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Project Type</span>
                <p className="text-sm text-slate-200 font-bold">{getProjectTypeLabel(project.project_type)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Slug</span>
                <p className="text-sm text-slate-200 font-mono">{project.slug}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            
            {/* Tech Stack */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" /> Technology Stack
              </h3>
              {project.stack && project.stack.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.stack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.02] border border-white/5 text-slate-300 hover:border-blue-500/30 transition duration-150"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No technologies defined.</p>
              )}
            </div>

            {/* Timestamps */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" /> Milestones & Dates
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Initialized</span>
                  <span className="font-semibold text-slate-300">{new Date(project.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Last Sync</span>
                  <span className="font-semibold text-slate-300">{new Date(project.updated_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Deleted State</span>
                  <span className={`font-semibold ${project.is_archived ? 'text-rose-400' : 'text-slate-500'}`}>
                    {project.is_archived ? "Soft Deleted" : "Active Database"}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-[#090a0f] mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevPilot AI. All rights reserved. Platform foundations completed.</p>
        </div>
      </footer>

    </div>
  );
}
