import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, Check, X, Pencil } from 'lucide-react';
import {
  getCategories,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
} from '../../services/api.js';

const DEPARTMENTS = ['Water', 'Electricity', 'Sanitation', 'Roads', 'Civic', 'Society', 'General'];

export default function AdminCategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newCategory, setNewCategory] = useState({ name: '', department: 'General', priorityWeight: 1 });
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Categories load nahi ho paayi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await createCategoryAdmin(newCategory);
      setCategories((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory({ name: '', department: 'General', priorityWeight: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Category add nahi ho paayi.');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditDraft({ name: cat.name, department: cat.department, priorityWeight: cat.priorityWeight });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const handleSaveEdit = async (id) => {
    setSavingId(id);
    setError('');
    try {
      const res = await updateCategoryAdmin(id, editDraft);
      setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Update fail ho gaya.');
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (cat) => {
    setSavingId(cat._id);
    try {
      const res = await updateCategoryAdmin(cat._id, { isActive: !cat.isActive });
      setCategories((prev) => prev.map((c) => (c._id === cat._id ? res.data : c)));
    } catch (err) {
      setError(err.response?.data?.message || 'Update fail ho gaya.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError('');
    try {
      await deleteCategoryAdmin(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete fail ho gaya.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl text-text-dark">Category Management</h1>
        <p className="font-body text-sm text-text-dark-muted mt-1">
          Categories, department mapping aur priority weight manage karein
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3"
      >
        <div className="flex-1 min-w-0 sm:min-w-[160px]">
          <label className="font-body text-xs text-text-dark-muted block mb-1.5">Category Name</label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="e.g. Streetlights"
            className="w-full bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal"
          />
        </div>

        <div className="w-full sm:w-auto">
          <label className="font-body text-xs text-text-dark-muted block mb-1.5">Department</label>
          <select
            value={newCategory.department}
            onChange={(e) => setNewCategory({ ...newCategory, department: e.target.value })}
            className="w-full sm:w-auto bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
          >
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label className="font-body text-xs text-text-dark-muted block mb-1.5">Priority Weight</label>
          <select
            value={newCategory.priorityWeight}
            onChange={(e) => setNewCategory({ ...newCategory, priorityWeight: Number(e.target.value) })}
            className="w-full sm:w-auto bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
          >
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <button
          type="submit"
          disabled={creating || !newCategory.name.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-signal hover:bg-signal-dim disabled:opacity-50 text-ink-950 font-body font-medium text-sm rounded-xl px-4 py-2.5 transition-colors"
        >
          {creating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
          Add
        </button>
      </form>

      {error && (
        <p className="font-body text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-signal" size={24} />
          </div>
        ) : categories.length === 0 ? (
          <p className="font-body text-sm text-text-dark-muted p-6">Koi category nahi hai.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-ink-700">
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Name</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Department</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Weight</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Active</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editingId === cat._id;
                return (
                  <tr key={cat._id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800 transition-colors">
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                          className="bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1.5 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
                        />
                      ) : (
                        <span className="font-body text-sm text-text-dark">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <select
                          value={editDraft.department}
                          onChange={(e) => setEditDraft({ ...editDraft, department: e.target.value })}
                          className="bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1.5 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
                        >
                          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      ) : (
                        <span className="font-body text-sm text-text-dark-muted">{cat.department}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <select
                          value={editDraft.priorityWeight}
                          onChange={(e) => setEditDraft({ ...editDraft, priorityWeight: Number(e.target.value) })}
                          className="bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1.5 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
                        >
                          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      ) : (
                        <span className="font-body text-sm text-text-dark">{cat.priorityWeight}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        disabled={savingId === cat._id}
                        className={`text-xs font-body font-medium px-2.5 py-1 rounded-full transition-colors ${
                          cat.isActive
                            ? 'text-emerald-400 bg-emerald-400/10'
                            : 'text-text-dark-muted bg-ink-700'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(cat._id)}
                              disabled={savingId === cat._id}
                              className="text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              {savingId === cat._id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            </button>
                            <button onClick={cancelEdit} className="text-text-dark-muted hover:text-text-dark transition-colors">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(cat)} className="text-text-dark-muted hover:text-signal transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat._id)}
                              disabled={deletingId === cat._id}
                              className="text-text-dark-muted hover:text-red-400 transition-colors"
                            >
                              {deletingId === cat._id ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}