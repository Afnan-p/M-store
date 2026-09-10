import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSegments } from '../../hooks/useSegments';
import { SegmentService } from '../../services/segments';
import type { IPhoneSegment, SegmentCategoryType } from '../../types/product';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';

export const AdminSegments: React.FC = () => {
  const { segments, loading, refreshSegments } = useSegments();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<IPhoneSegment | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryType, setCategoryType] = useState<SegmentCategoryType>('BOTH');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingSegment(null);
    setName('');
    setThumbnail('/images/featured-p1-natural.jpg');
    setCategoryType('BOTH');
    setDisplayOrder(segments.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (segment: IPhoneSegment) => {
    setEditingSegment(segment);
    setName(segment.name);
    setThumbnail(segment.thumbnail);
    setCategoryType(segment.categoryType);
    setDisplayOrder(segment.displayOrder);
    setIsActive(segment.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSegment) {
      await SegmentService.updateSegment(editingSegment.id, {
        name,
        thumbnail,
        categoryType,
        displayOrder: Number(displayOrder),
        isActive,
      });
    } else {
      await SegmentService.addSegment({
        name,
        thumbnail,
        categoryType,
        displayOrder: Number(displayOrder),
        isActive,
      });
    }

    setModalOpen(false);
    refreshSegments();
  };

  const handleDelete = async (id: string, segmentName: string) => {
    if (window.confirm(`Are you sure you want to delete "${segmentName}"? Existing products assigned to this segment will remain intact.`)) {
      await SegmentService.deleteSegment(id);
      refreshSegments();
    }
  };

  const handleToggleStatus = async (id: string) => {
    await SegmentService.toggleSegmentStatus(id);
    refreshSegments();
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    await SegmentService.moveSegment(id, direction);
    refreshSegments();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10 pt-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
              <span>/</span>
              <span className="text-zinc-200">Product Management</span>
              <span>/</span>
              <span className="text-[#E50914] font-semibold">iPhone Segments</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-[#E50914]" />
              iPhone Segments Management
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Dynamic model/series navigation shown on `/iphones` & `/used-iphones`.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] text-white text-xs font-bold hover:bg-[#c90812] shadow-lg shadow-[#E50914]/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Segment
            </button>
          </div>
        </div>

        {/* Segments Table */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center text-xs text-zinc-400">Loading segments...</div>
          ) : segments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-bold text-zinc-300">No iPhone Segments Found</p>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl"
              >
                Create First Segment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Order</th>
                    <th className="py-4 px-6">Segment</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Slug</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-xs">
                  {segments.map((segment, idx) => (
                    <tr key={segment.id} className="hover:bg-zinc-800/40 transition-colors">
                      
                      {/* Order Controls */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-300">
                          <span className="w-6 text-center text-zinc-400">{segment.displayOrder}</span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMove(segment.id, 'up')}
                              className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={idx === segments.length - 1}
                              onClick={() => handleMove(segment.id, 'down')}
                              className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Segment Thumbnail & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg bg-zinc-950 border border-zinc-800 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={segment.thumbnail}
                              alt={segment.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-zinc-100 block text-sm">{segment.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">ID: {segment.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Type Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            segment.categoryType === 'NEW'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : segment.categoryType === 'USED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {segment.categoryType}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-6 whitespace-nowrap text-zinc-400 font-mono text-[11px]">
                        /{segment.slug}
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(segment.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            segment.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                          }`}
                        >
                          {segment.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-zinc-500" />
                              Disabled
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(segment)}
                            className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                            title="Edit Segment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(segment.id, segment.name)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete Segment"
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
        </div>

      </div>

      {/* Add / Edit Segment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingSegment ? 'Edit iPhone Segment' : 'Add New iPhone Segment'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Segment Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Segment Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. iPhone 16 Pro"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Thumbnail Image URL */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Thumbnail Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="/images/featured-p1-natural.jpg"
                    required
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
                  />
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={thumbnail}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Type */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Category Type</label>
                <select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value as SegmentCategoryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#E50914]"
                >
                  <option value="BOTH">Both (New & Used Listings)</option>
                  <option value="NEW">New iPhones Only</option>
                  <option value="USED">Used / Pre-Owned iPhones Only</option>
                </select>
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  min={1}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-[#E50914] focus:ring-0"
                />
                <label htmlFor="isActiveToggle" className="font-semibold text-zinc-300">
                  Active (Visible on Frontend)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E50914] text-white font-bold hover:bg-[#c90812] shadow-lg shadow-[#E50914]/20"
                >
                  {editingSegment ? 'Save Changes' : 'Create Segment'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
