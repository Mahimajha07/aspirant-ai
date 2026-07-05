import React, { useState } from "react";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  TrendingUp, 
  Award, 
  FileEdit,
  PieChart,
  CheckCircle2,
  FolderOpen
} from "lucide-react";
import { ApplicationTrackerItem } from "../types";

interface ApplicationTrackerProps {
  applications: ApplicationTrackerItem[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationTrackerItem[]>>;
  onAddApplication: (app: Partial<ApplicationTrackerItem>) => void;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function ApplicationTracker({
  applications,
  setApplications,
  onAddApplication,
  showToast,
}: ApplicationTrackerProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("AI");
  const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      alert("Please complete the title and company fields.");
      return;
    }

    onAddApplication({
      title: title.trim(),
      company: company.trim(),
      domain,
      status: "Draft",
      deadline,
      notes: notes.trim() || undefined
    });

    setTitle("");
    company && setCompany("");
    setNotes("");
  };

  const handleUpdateStatus = (id: string, nextStatus: ApplicationTrackerItem["status"]) => {
    let appName = "Application";
    setApplications(prev => prev.map((app) => {
      if (app.id === id) {
        appName = `${app.title} at ${app.company}`;
        return {
          ...app,
          status: nextStatus,
          dateApplied: nextStatus === "Applied" ? new Date().toLocaleDateString() : app.dateApplied
        };
      }
      return app;
    }));
    showToast?.(`"${appName}" status updated to ${nextStatus}!`, "info");
  };

  const handleDelete = (id: string) => {
    const target = applications.find(a => a.id === id);
    setApplications(prev => prev.filter(app => app.id !== id));
    showToast?.(`Deleted application: ${target ? target.title : "item"}`, "warning");
  };

  // Analytics helper calculations
  const totalApps = applications.length;
  const draftApps = applications.filter(a => a.status === "Draft");
  const appliedApps = applications.filter(a => a.status === "Applied");
  const interviewingApps = applications.filter(a => a.status === "Interviewing");
  const offersApps = applications.filter(a => a.status === "Offer Received");
  const rejectedApps = applications.filter(a => a.status === "Rejected");

  // Calculate success rates
  const responseRate = totalApps > 0 ? Math.round(((totalApps - draftApps.length - rejectedApps.length) / totalApps) * 100) : 0;
  const conversionRate = totalApps > 0 ? Math.round((offersApps.length / totalApps) * 100) : 0;

  // Domain categorization counts
  const getDomainCounts = () => {
    const domainsMap: Record<string, number> = {};
    applications.forEach(a => {
      domainsMap[a.domain] = (domainsMap[a.domain] || 0) + 1;
    });
    return Object.entries(domainsMap);
  };

  const domainData = getDomainCounts();

  return (
    <div className="space-y-6" id="application-tracker-root">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-400" /> Professional Application Tracker
        </h1>
        <p className="text-slate-400 text-sm">
          Keep a comprehensive timeline of your active submission deadlines, record scheduled interviews, and evaluate your final conversion success.
        </p>
      </div>

      {/* Analytics widgets row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <span className="text-slate-400 text-[10px] font-mono block">PIPELINE TOTAL</span>
          <span className="text-2xl font-bold text-white mt-1 block">{totalApps}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">{interviewingApps.length} interviewing, {offersApps.length} offers</span>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <span className="text-slate-400 text-[10px] font-mono block">INTERVIEW RESPONSE</span>
          <span className="text-2xl font-bold text-indigo-400 mt-1 block">{responseRate}%</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Recruiter follow-up rate</span>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <span className="text-slate-400 text-[10px] font-mono block">CONVERSION RATIO</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{conversionRate}%</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Offer placement density</span>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <span className="text-slate-400 text-[10px] font-mono block">DOMAIN SPREAD</span>
          <span className="text-sm font-semibold text-slate-300 block mt-1 line-clamp-1">
            {domainData.map(([dom, count]) => `${dom}: ${count}`).join(", ") || "No records added"}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Focus area distribution</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Manually Register Application Form */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 h-fit">
          <h3 className="font-bold text-lg text-slate-100">Add Open Position</h3>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Role Title</label>
              <input
                type="text"
                placeholder="e.g., Software Engineering Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Company / Organization</label>
              <input
                type="text"
                placeholder="e.g., Google DeepMind"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Domain Focus</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-200"
                >
                  <option value="AI">AI / ML</option>
                  <option value="CS">Computer Science</option>
                  <option value="Research">Academic Research</option>
                  <option value="Web Dev">Full-Stack / Web</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Target Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Internal Notes</label>
              <textarea
                placeholder="e.g., Connected with lead advisor on LinkedIn. Reference required by October."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-20 text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" /> Register Target Role
            </button>
          </form>
        </div>

        {/* Timeline Timeline Grid */}
        <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-100">Submission Pipeline</h3>
          
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 transition-all hover:border-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{app.title}</span>
                      <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
                        {app.domain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{app.company}</p>
                  </div>

                  {/* Status pills selector */}
                  <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 h-fit self-start sm:self-center">
                    {(["Draft", "Applied", "Interviewing", "Offer Received", "Rejected"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(app.id, st)}
                        className={`px-1.5 py-1 text-[9px] font-bold rounded-md transition-all ${
                          app.status === st 
                            ? st === "Offer Received" ? "bg-emerald-600 text-white" : st === "Rejected" ? "bg-rose-600 text-white" : st === "Interviewing" ? "bg-amber-600 text-white" : "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {st === "Offer Received" ? "Offer" : st}
                      </button>
                    ))}
                  </div>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-white/5 italic">
                    "{app.notes}"
                  </p>
                )}

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <div className="flex gap-4">
                    <span>Deadline: {app.deadline}</span>
                    {app.dateApplied && <span>Applied date: {app.dateApplied}</span>}
                  </div>

                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-white/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                No applications registered yet. Browse the listing board or add positions manually.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
