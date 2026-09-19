import React, { useState } from 'react';
import { useSegments } from '../../hooks/useSegments';
import { SegmentService } from '../../services/segments';
import type { IPhoneSegment, SegmentCategoryType } from '../../types/product';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
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
    <AdminLayout
      title="iPhone Segments Management"
      subtitle="Dynamic model/series navigation shown on '/iphones' & '/used-iphones'."
      action={
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold hover:bg-[#c90812] shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Segment
        </button>
      }
    >
      <div className="space-y-6 text-zinc-900">
        {/* Segments Table Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-zinc-500 font-medium">Loading segments...</div>
          ) : segments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-bold text-zinc-700">No iPhone Segments Found</p>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl hover:bg-[#c90812]"
              >
                Create First Segment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Order</th>
                    <th className="py-4 px-6">Segment</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Slug</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-xs">
                  {segments.map((segment, idx) => (
                    <tr key={segment.id} className="hover:bg-zinc-50/80 transition-colors">
                      
                      {/* Order Controls */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono font-bold text-zinc-700">
                          <span className="w-6 text-center text-zinc-500">{segment.displayOrder}</span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMove(segment.id, 'up')}
                              className="p-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={idx === segments.length - 1}
                              onClick={() => handleMove(segment.id, 'down')}
                              className="p-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Segment Thumbnail & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0">
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
                            <span className="font-bold text-zinc-900 block text-sm">{segment.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">ID: {segment.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Type Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            segment.categoryType === 'NEW'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : segment.categoryType === 'USED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {segment.categoryType}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-6 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                        /{segment.slug}
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(segment.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            segment.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                          }`}
                        >
                          {segment.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-zinc-400" />
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
                            className="p-2 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
                            title="Edit Segment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(segment.id, segment.name)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl text-zinc-900">
            
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h3 className="text-base font-bold text-zinc-900">
                {editingSegment ? 'Edit iPhone Segment' : 'Add New iPhone Segment'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Segment Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700">Segment Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. iPhone 16 Pro"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Thumbnail Image URL */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700">Thumbnail Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="/images/featured-p1-natural.jpg"
                    required
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E50914]"
                  />
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0">
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
                <label className="font-semibold text-zinc-700">Category Type</label>
                <select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value as SegmentCategoryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-[#E50914] font-bold"
                >
                  <option value="BOTH">Both (New & Used Listings)</option>
                  <option value="NEW">New iPhones Only</option>
                  <option value="USED">Used / Pre-Owned iPhones Only</option>
                </select>
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  min={1}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-50 border-zinc-300 text-[#E50914] focus:ring-0"
                />
                <label htmlFor="isActiveToggle" className="font-semibold text-zinc-700">
                  Active (Visible on Frontend)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E50914] text-white font-bold hover:bg-[#c90812] shadow-sm"
                >
                  {editingSegment ? 'Save Changes' : 'Create Segment'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
