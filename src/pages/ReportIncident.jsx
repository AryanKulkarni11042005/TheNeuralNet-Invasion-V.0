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
import { createIncident } from '../api/mockApi';
import { severityOptions } from '../data/mockData';

export default function ReportIncident() {
  const navigate = useNavigate();
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
    await createIncident(form);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => navigate('/incidents'), 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: '#151E15' }}
        >
          <CheckCircle2 className="w-8 h-8" style={{ color: '#4A7A4A' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#F0EAEA' }}>Incident Reported</h2>
        <p className="text-sm" style={{ color: '#7A6A6A' }}>Redirecting to incidents list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#F0EAEA' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#2A0E0E' }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: '#E05252' }} />
          </div>
          Report New Incident
        </h1>
        <p className="text-sm mt-2 ml-[52px]" style={{ color: '#7A6A6A' }}>
          Submit critical information to initiate a response
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="glass-card p-5 space-y-4">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#C4A9A9' }}>
              <FileText className="w-4 h-4" style={{ color: '#5A4A4A' }} /> Incident Title
            </span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Chemical spill at warehouse"
              className="w-full rounded-xl px-4 py-3 text-sm transition"
              style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#F0EAEA' }}
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#C4A9A9' }}>
              <FileText className="w-4 h-4" style={{ color: '#5A4A4A' }} /> Description
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Describe the incident in detail..."
              className="w-full rounded-xl px-4 py-3 text-sm resize-none transition"
              style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#F0EAEA' }}
            />
          </label>
        </div>

        {/* Severity + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#C4A9A9' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: '#5A4A4A' }} /> Severity
              </span>
              <select
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 text-sm transition appearance-none cursor-pointer"
                style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#F0EAEA' }}
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
              <span className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#C4A9A9' }}>
                <MapPin className="w-4 h-4" style={{ color: '#5A4A4A' }} /> Location
              </span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Downtown, Block 4"
                className="w-full rounded-xl px-4 py-3 text-sm transition"
                style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#F0EAEA' }}
              />
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="glass-card p-5">
          <span className="flex items-center gap-2 text-sm font-medium mb-3" style={{ color: '#C4A9A9' }}>
            <Upload className="w-4 h-4" style={{ color: '#5A4A4A' }} /> Attach Image (optional)
          </span>
          <label
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition"
            style={{ borderColor: '#2A1818' }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageName ? (
              <div className="text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1" style={{ color: '#4A7A4A' }} />
                <p className="text-sm" style={{ color: '#C4A9A9' }}>{imageName}</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-6 h-6 mx-auto mb-1" style={{ color: '#5A4A4A' }} />
                <p className="text-sm" style={{ color: '#7A6A6A' }}>Click to upload</p>
                <p className="text-xs" style={{ color: '#5A4A4A' }}>PNG, JPG up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#9B2C2C', color: '#F0EAEA' }}
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
