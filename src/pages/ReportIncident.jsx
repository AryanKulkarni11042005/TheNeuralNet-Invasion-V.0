import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  FileText,
  MapPin,
  Upload,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createIncident } from '../api/mockApi';
import { severityOptions } from '../data/mockData';

export default function ReportIncident() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 'medium',
    location: '',
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageName, setImageName] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      setForm({ ...form, image: file.name }); // mock — just store file name
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await createIncident({
      ...form,
      reportedBy: role === 'viewer' ? 'Viewer Submission' : 'Manual Report',
      reporterRole: role,
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => navigate('/incidents'), 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Incident Reported</h2>
        <p className="text-sm text-zinc-500 mb-2">
          {role === 'viewer'
            ? 'Your report is pending volunteer validation before it appears in the public log.'
            : 'Redirecting to incidents list...'}
        </p>
        {role !== 'viewer' && <p className="text-sm text-zinc-500">Redirecting to incidents list...</p>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          Report New Incident
        </h1>
        <p className="text-sm text-zinc-500 mt-2 ml-[52px]">
          Submit critical information to initiate a response
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="glass-card p-5 space-y-4">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <FileText className="w-4 h-4 text-zinc-500" /> Incident Title
            </span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Chemical spill at warehouse"
              className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 transition"
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <FileText className="w-4 h-4 text-zinc-500" /> Description
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Describe the incident in detail..."
              className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 resize-none transition"
            />
          </label>
        </div>

        {/* Severity + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <AlertTriangle className="w-4 h-4 text-zinc-500" /> Severity
              </span>
              <select
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 transition appearance-none cursor-pointer"
              >
                {severityOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="glass-card p-5">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                <MapPin className="w-4 h-4 text-zinc-500" /> Location
              </span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Downtown, Block 4"
                className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 transition"
              />
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="glass-card p-5">
          <span className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
            <Upload className="w-4 h-4 text-zinc-500" /> Attach Image (optional)
          </span>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700/50 rounded-xl cursor-pointer hover:border-zinc-600/50 hover:bg-white/[0.02] transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageName ? (
              <div className="text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-sm text-zinc-300">{imageName}</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-6 h-6 text-zinc-600 mx-auto mb-1" />
                <p className="text-sm text-zinc-500">Click to upload</p>
                <p className="text-xs text-zinc-600">PNG, JPG up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Incident Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
