"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FolderGit2, 
  ArrowLeft, 
  Save, 
  Sparkles,
  AlertCircle,
  Code,
  Activity
} from "lucide-react";
import { getProject, updateProject } from "@/services/projectsApi";

export default function EditProject() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("IDEA");
  const [priority, setPriority] = useState("MEDIUM");
  const [projectType, setProjectType] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [productionUrl, setProductionUrl] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      setFetching(true);
      setError(null);
      try {
        const data = await getProject(id);
        setName(data.name);
        setSlug(data.slug);
        setDescription(data.description || "");
        setStatus(data.status);
        setPriority(data.priority);
        setProjectType(data.project_type);
        setStackInput(data.stack ? data.stack.join(", ") : "");
        setGithubUrl(data.github_url || "");
        setProductionUrl(data.production_url || "");
        setIsArchived(data.is_archived);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch project details for editing. Check if backend database is reachable.");
      } finally {
        setFetching(false);
      }
    };
    if (id) {
      loadProject();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Project name is required.");
      setLoading(false);
      return;
    }
    if (!slug.trim()) {
      setError("Project slug is required.");
      setLoading(false);
      return;
    }
    if (!projectType) {
      setError("Please select a project type.");
      setLoading(false);
      return;
    }

    // Parse comma-separated stack into list of strings
    const stack = stackInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    try {
      await updateProject(Number(id), {
        name,
        slug,
        description: description || undefined,
        status,
        priority,
        project_type: projectType,
        stack,
        github_url: githubUrl || undefined,
        production_url: productionUrl || undefined,
        is_archived: isArchived
      });

      router.push(`/projects/${id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update project details. Please ensure slug remains unique.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#07080d] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Activity className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Querying project workspace details...</p>
        </div>
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
          
          <Link href={`/projects/${id}`} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 transition duration-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to details
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 flex flex-col gap-6">
        
        {/* Navigation back */}
        <div>
          <Link href={`/projects/${id}`} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
            <ArrowLeft className="w-3 h-3" /> Back to details view
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <FolderGit2 className="text-blue-400 w-8 h-8" />
            Edit Workspace Project
          </h1>
          <p className="text-slate-400 text-sm">
            Modify structural information, update links or technology integrations.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-semibold">Failed to process form</p>
              <p className="text-slate-400 leading-normal">{error}</p>
            </div>
          </div>
        )}

        {/* Glassmorphic Form Card */}
        <section className="glass-panel rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Project Name & Slug Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Job Pilot AI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={150}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-200 transition"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Slug *</label>
                <input
                  type="text"
                  placeholder="e.g. job-pilot-ai"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"))}
                  required
                  maxLength={150}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-200 transition font-mono"
                />
              </div>

            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Description</label>
              <textarea
                rows={4}
                maxLength={5000}
                placeholder="Describe your workspace project purpose, core features, or structural milestones..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-200 transition resize-none leading-relaxed"
              />
            </div>

            {/* Status, Priority & ProjectType Select Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-300 transition"
                >
                  <option value="IDEA">Idea</option>
                  <option value="PLANNING">Planning</option>
                  <option value="DEVELOPMENT">Development</option>
                  <option value="TESTING">Testing</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="PAUSED">Paused</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-300 transition"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* Project Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Project Type *</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  required
                  className="w-full px-3 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-300 transition"
                >
                  <option value="" disabled>Select Type...</option>
                  <option value="MOBILE_APP">Mobile App</option>
                  <option value="WEB_APP">Web App</option>
                  <option value="SAAS">SaaS Application</option>
                  <option value="API">API Gateway / Library</option>
                  <option value="AGENT">Autonomous AI Agent</option>
                  <option value="AUTOMATION">Workflow Automation</option>
                </select>
              </div>

            </div>

            {/* Stack Tags Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-400" /> Technology Stack
                </label>
                <span className="text-[10px] text-slate-500">Comma-separated values</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Flutter, FastAPI, PostgreSQL, TailwindCSS"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-200 transition"
              />
            </div>

            {/* Links Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* GitHub URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">GitHub Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-200 transition"
                />
              </div>

              {/* Production URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Live Production URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={productionUrl}
                  onChange={(e) => setProductionUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-200 transition"
                />
              </div>

            </div>

            {/* Soft Deleted Toggle */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Archive / Soft-Delete Workspace</label>
                <p className="text-[10px] text-slate-500">Soft-deleting removes it from default project pipelines.</p>
              </div>
              <input
                type="checkbox"
                checked={isArchived}
                onChange={(e) => setIsArchived(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-900 border border-white/5 text-blue-500 focus:ring-0 focus:outline-none transition cursor-pointer"
              />
            </div>

            {/* Form Footer Action */}
            <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
              <Link 
                href={`/projects/${id}`}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-xs font-bold transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-[0_4px_20px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-[#090a0f] mt-auto">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevPilot AI. All rights reserved. Platform foundations completed.</p>
        </div>
      </footer>

    </div>
  );
}
