import { useEffect, useState } from 'react';
import { Loader2, Download, FileSpreadsheet } from 'lucide-react';
import { getAllComplaintsAdmin, exportComplaintsCSV } from '../../services/api.js';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const CATEGORIES = ['Civic', 'Society', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Other'];
const DEPARTMENTS = ['Water', 'Electricity', 'Sanitation', 'Roads', 'Civic', 'Society', 'General'];

export default function AdminReportsExportPage() {
  const [filters, setFilters] = useState({ status: '', category: '', department: '' });
  const [matchCount, setMatchCount] = useState(null);
  const [counting, setCounting] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const loadCount = async (activeFilters) => {
    setCounting(true);
    try {
      const params = {};
      if (activeFilters.status) params.status = activeFilters.status;
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.department) params.department = activeFilters.department;
      const res = await getAllComplaintsAdmin(params);
      setMatchCount(res.data.length);
    } catch {
      setMatchCount(null);
    } finally {
      setCounting(false);
    }
  };

  useEffect(() => {
    loadCount(filters);
  }, []);

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    loadCount(next);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.department) params.department = filters.department;

      const res = await exportComplaintsCSV(params);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `urbanvoice-complaints-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Export fail ho gaya.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl text-text-dark">Reports & Export</h1>
        <p className="font-body text-sm text-text-dark-muted mt-1">
          Complaints ka CSV export, optional filters ke saath
        </p>
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full sm:w-auto bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full sm:w-auto bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full sm:w-auto bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ink-800 border border-ink-700">
          <FileSpreadsheet size={18} className="text-signal shrink-0" />
          <p className="font-body text-sm text-text-dark-muted min-w-0">
            {counting ? (
              'Count ho raha hai...'
            ) : matchCount === null ? (
              'Count load nahi ho paaya.'
            ) : (
              <>
                <span className="text-text-dark font-medium">{matchCount}</span> complaints is filter se match karte hain
              </>
            )}
          </p>
        </div>

        {error && (
          <p className="font-body text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleDownload}
          disabled={downloading || matchCount === 0}
          className="flex items-center justify-center gap-2 w-full bg-signal hover:bg-signal-dim disabled:opacity-50 text-ink-950 font-body font-medium text-sm rounded-xl px-4 py-2.5 transition-colors"
        >
          {downloading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Download size={16} />
          )}
          {downloading ? 'Downloading...' : 'Download CSV'}
        </button>
      </div>
    </div>
  );
}