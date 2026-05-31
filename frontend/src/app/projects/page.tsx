"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Github, 
  ExternalLink, 
  Edit3, 
  Archive, 
  Trash2, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getProjects, archiveProject, deleteProject, Project } from "@/services/projectsApi";

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters State
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projectType, setProjectType] = useState("");
  const [search, setSearch] = useState("");

  const fetchProjectsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects({
        status: status || undefined,
        priority: priority || undefined,
        project_type: projectType || undefined,
        search: search || undefined,
        page,
        limit: 8,
        include_archived: true
      });
      setProjects(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch projects list. Verify if backend is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, [page, status, priority, projectType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProjectsList();
  };

  const handleClearFilters = () => {
    setStatus("");
    setPriority("");
    setProjectType("");
    setSearch("");
    setPage(1);
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveProject(id);
      showToast("Project archived successfully");
      fetchProjectsList();
    } catch (err: any) {
      showToast(err.message || "Failed to archive project", true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete (soft-delete) this project?")) return;
    try {
      await deleteProject(id);
      showToast("Project soft-deleted successfully");
      fetchProjectsList();
    } catch (err: any) {
      showToast(err.message || "Failed to delete project", true);
    }
  };

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 4000);
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
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badges[statusVal] || badges.IDEA}`}>
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
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${badges[priorityVal] || badges.MEDIUM}`}>
        {priorityVal}
      </span>
    );
  };

  const getProjectTypeBadge = (typeVal: string) => {
    const labels: Record<string, string> = {
      MOBILE_APP: "Mobile App",
      WEB_APP: "Web App",
      SAAS: "SaaS",
      API: "API Gateway",
      AGENT: "AI Agent",
      AUTOMATION: "Automation"
    };
    return (
      <span className="text-xs text-slate-300 font-medium">
        {labels[typeVal] || typeVal}
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
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/projects" className="text-white border-b-2 border-blue-500 pb-1 font-bold transition">
              Projects
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchProjectsList}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 transition duration-200 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              Sync
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
        
        {/* Header Action Section */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <FolderGit2 className="text-blue-400 w-8 h-8" />
              Workspace Projects
            </h1>
            <p className="text-slate-400 text-sm">
              Manage your engineering applications, agent scopes, and codebases.
            </p>
          </div>
          
          <Link 
            href="/projects/new" 
            className="flex items-center justify-center gap-2 text-xs font-bold px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition duration-200 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> New Project
          </Link>
        </section>

        {/* Global Toast Messages */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-xs font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Filters and Search Workspace */}
        <section className="glass-panel rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-200 transition"
              />
            </div>

            {/* Status Select */}
            <div className="md:col-span-2">
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-300 transition"
              >
                <option value="" className="bg-[#0b0c10]">All Statuses</option>
                <option value="IDEA" className="bg-[#0b0c10]">Idea</option>
                <option value="PLANNING" className="bg-[#0b0c10]">Planning</option>
                <option value="DEVELOPMENT" className="bg-[#0b0c10]">Development</option>
                <option value="TESTING" className="bg-[#0b0c10]">Testing</option>
                <option value="PUBLISHED" className="bg-[#0b0c10]">Published</option>
                <option value="PAUSED" className="bg-[#0b0c10]">Paused</option>
                <option value="ARCHIVED" className="bg-[#0b0c10]">Archived</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="md:col-span-2">
              <select
                value={priority}
                onChange={(e) => { setPriority(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-300 transition"
              >
                <option value="" className="bg-[#0b0c10]">All Priorities</option>
                <option value="LOW" className="bg-[#0b0c10]">Low</option>
                <option value="MEDIUM" className="bg-[#0b0c10]">Medium</option>
                <option value="HIGH" className="bg-[#0b0c10]">High</option>
                <option value="CRITICAL" className="bg-[#0b0c10]">Critical</option>
              </select>
            </div>

            {/* Type Select */}
            <div className="md:col-span-2">
              <select
                value={projectType}
                onChange={(e) => { setProjectType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 focus:border-blue-500/50 focus:outline-none text-sm text-slate-300 transition"
              >
                <option value="" className="bg-[#0b0c10]">All Types</option>
                <option value="MOBILE_APP" className="bg-[#0b0c10]">Mobile App</option>
                <option value="WEB_APP" className="bg-[#0b0c10]">Web App</option>
                <option value="SAAS" className="bg-[#0b0c10]">SaaS</option>
                <option value="API" className="bg-[#0b0c10]">API Gateway</option>
                <option value="AGENT" className="bg-[#0b0c10]">AI Agent</option>
                <option value="AUTOMATION" className="bg-[#0b0c10]">Automation</option>
              </select>
            </div>

            {/* Search & Reset Buttons */}
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-blue-400" /> Filter
              </button>
              {(status || priority || projectType || search) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition"
                  title="Clear Filters"
                >
                  Reset
                </button>
              )}
            </div>

          </form>
        </section>

        {/* Table Workspace */}
        <section className="glass-panel rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-slate-400 text-sm">Querying projects database...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No projects found</h3>
              <p className="text-slate-400 max-w-sm mx-auto text-xs leading-relaxed">
                We couldn't find any workspace matching your filter conditions. Try adjusting your query parameters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Project Name</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Priority</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">GitHub</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Updated</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((project) => (
                    <tr 
                      key={project.id} 
                      className={`hover:bg-white/[0.01] transition duration-150 ${project.is_archived ? 'opacity-60 bg-rose-950/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <Link 
                            href={`/projects/${project.id}`} 
                            className="font-bold text-white hover:text-blue-400 transition text-sm flex items-center gap-1.5"
                          >
                            {project.name}
                            {project.is_archived && (
                              <span className="text-[9px] uppercase font-bold bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">
                                Archived
                              </span>
                            )}
                          </Link>
                          <p className="text-xs text-slate-400 max-w-xs truncate">{project.description || "No description provided."}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(project.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getProjectTypeBadge(project.project_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.github_url ? (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-slate-400 hover:text-white transition inline-flex p-1.5 rounded-lg bg-slate-900 border border-white/5 hover:border-white/10"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-600 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View details */}
                          <Link 
                            href={`/projects/${project.id}`}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 text-blue-400 hover:text-blue-300 transition"
                            title="View Details"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit Project */}
                          <Link 
                            href={`/projects/${project.id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Archive Project (only if not archived) */}
                          {!project.is_archived && (
                            <button 
                              onClick={() => handleArchive(project.id)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-amber-500 transition"
                              title="Archive"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Soft Delete */}
                          <button 
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 text-rose-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing <strong className="text-slate-300">{(page-1)*8+1}</strong> to <strong className="text-slate-300">{Math.min(page*8, total)}</strong> of <strong className="text-slate-300">{total}</strong> projects
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-400 px-3">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-[#090a0f] mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevPilot AI. All rights reserved. Platform foundations completed.</p>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-slate-300 transition">Dashboard</Link>
            <Link href="/projects" className="hover:text-slate-300 transition">Projects</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
