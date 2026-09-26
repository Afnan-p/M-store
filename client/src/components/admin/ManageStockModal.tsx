import React, { useState, useEffect } from 'react';
import type { ProductStock, StockHistoryItem, StockReason } from '../../types/stock';
import { StockService, calculateStockStatus } from '../../services/stock';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { X, Package, ArrowRight, History, AlertCircle, Save } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface ManageStockModalProps {
  stockRecord: ProductStock;
  onClose: () => void;
  onStockUpdated: (updated: ProductStock) => void;
}

export const ManageStockModal: React.FC<ManageStockModalProps> = ({
  stockRecord,
  onClose,
  onStockUpdated,
}) => {
  const { stores } = useStore();
  const assignedStore = stores.find((s) => s.id === stockRecord.storeId);
  const storeName = stockRecord.storeId === 'ALL' || stockRecord.storeId === 'all'
    ? 'All Stores'
    : (assignedStore?.name || stockRecord.storeId);

  const [newStock, setNewStock] = useState<number | string>(stockRecord.stock);
  const [reason, setReason] = useState<StockReason>('Sold');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [historyList, setHistoryList] = useState<StockHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [stockRecord.productId, stockRecord.storeId]);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await StockService.getStockHistory(stockRecord.productId, stockRecord.storeId);
      setHistoryList(data);
    } catch (err) {
      console.error('Failed to load stock history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const stockNum = Number(newStock);
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Stock quantity must be 0 or a positive number.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await StockService.updateStock({
        productId: stockRecord.productId,
        storeId: stockRecord.storeId,
        newStock: stockNum,
        reason,
        notes,
        updatedBy: 'M Store Manager',
      });

      onStockUpdated(result.stock);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update stock. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calcNewStatus = calculateStockStatus(Number(newStock) || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 text-base">Manage Stock</h3>
              <p className="text-[11px] text-zinc-500 font-medium">Update showroom inventory & record audit log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 pb-28 space-y-6 overflow-y-auto">
          {/* Target Product & Store Info Summary */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-4">
            {stockRecord.productImage && (
              <div className="w-14 h-14 bg-white border border-zinc-200 rounded-xl p-1 flex items-center justify-center shrink-0">
                <img src={stockRecord.productImage} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <div className="space-y-1 overflow-hidden">
              <h4 className="font-bold text-zinc-950 text-sm truncate">
                {stockRecord.productName || stockRecord.productId}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-semibold">
                <span>Current Stock: <strong className="text-zinc-900 font-black">{stockRecord.stock} units</strong></span>
                <span>•</span>
                <span className={`font-bold ${
                  stockRecord.stock === 0 ? 'text-rose-600' : stockRecord.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {calculateStockStatus(stockRecord.stock)}
                </span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Controls */}
          <form id="manage-stock-form" onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Stock Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 block">New Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-black text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
                <span className="text-[10px] text-zinc-500 font-medium block">
                  New status will be: <strong className="text-zinc-800">{calcNewStatus}</strong>
                </span>
              </div>

              {/* Reason Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 block">Adjustment Reason *</label>
                <CustomSelect
                  options={[
                    { value: 'Sold', label: 'Sold (WhatsApp / Walk-in)' },
                    { value: 'New Stock Added', label: 'New Stock Added' },
                    { value: 'Damaged', label: 'Damaged / Defective' },
                    { value: 'Returned', label: 'Returned by Customer' },
                    { value: 'Stock Correction', label: 'Stock Correction / Audit' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={reason}
                  onChange={(val) => setReason(val as StockReason)}
                  buttonClassName="bg-zinc-50 border-zinc-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800 block">Notes / Reference (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Sold via WhatsApp order #1042 to customer in Kootanad"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#E50914] resize-none"
              />
            </div>
          </form>

          {/* Audit Log / Stock History Timeline */}
          <div className="space-y-3 pt-2 border-t border-zinc-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#E50914]" />
                Recent Stock Audit History
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Last 20 updates</span>
            </div>

            {historyLoading ? (
              <div className="py-4 text-center text-xs text-zinc-400 font-medium">Loading history...</div>
            ) : historyList.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-400 font-medium bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                No past stock changes logged for this item yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                {historyList.map((hist) => (
                  <div key={hist.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-zinc-900 text-[11px] flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-black ${
                          hist.changeAmount < 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {hist.reason} ({hist.changeAmount > 0 ? `+${hist.changeAmount}` : hist.changeAmount})
                        </span>
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold">
                        {new Date(hist.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-600 font-medium">
                      <span>Stock change:</span>
                      <span className="font-bold text-zinc-700">{hist.previousStock}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-400" />
                      <span className="font-black text-zinc-900">{hist.newStock} units</span>
                    </div>

                    {hist.notes && (
                      <div className="text-[10.5px] text-zinc-500 italic bg-white p-1.5 rounded-lg border border-zinc-200/80">
                        "{hist.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="manage-stock-form"
            variant="primary"
            size="sm"
            disabled={submitting}
            icon={<Save className="w-4 h-4" />}
          >
            {submitting ? 'Updating Stock...' : 'Update Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};
