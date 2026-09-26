import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useSettings } from '../../context/SettingsContext';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import {
  MessageSquare,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, loading, updateSettings } = useSettings();
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    if (settings) {
      setWhatsappNumber(settings.whatsappNumber || '');
      setPhone(settings.phone || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      setWorkingHours(settings.workingHours || '');
      setInstagram(settings.instagram || '');
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateSettings({
        whatsappNumber: whatsappNumber.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        workingHours: workingHours.trim(),
        instagram: instagram.trim(),
      });
      setToastMsg('Store contact & WhatsApp settings updated successfully!');
    } catch (err) {
      console.error('Failed updating settings:', err);
      setToastMsg('Error updating settings');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappClean = (whatsappNumber || '').replace(/\D/g, '');
  const phoneClean = (phone || '').replace(/\s+/g, '');

  return (
    <AdminLayout
      title="Store Contact & WhatsApp Settings"
      subtitle="Manage WhatsApp enquiry number, call support phone, email, store location, and timings in real-time."
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        {/* Real-time Status Card */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-black p-5 rounded-2xl border border-zinc-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#E50914]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Real-Time Dynamic Sync Active</h3>
              <p className="text-xs text-zinc-400">
                Changes saved here reflect instantly across all customer WhatsApp links, call buttons, and footer sections without code updates or .env changes.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="bg-[#E50914] text-white hover:bg-red-700 font-bold shrink-0 self-start md:self-auto"
            icon={submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {submitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        {/* Input Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: WhatsApp Enquiry Number */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900">WhatsApp Enquiry Number</h4>
                <p className="text-[11px] text-zinc-500">Connected to product cards & floating WhatsApp CTA</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">WhatsApp Phone Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 88910 03031"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                required
              />
              <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clean API Number: <strong className="text-zinc-800 font-bold">{whatsappClean || 'None'}</strong></span>
              </div>
            </div>
          </div>

          {/* Card 2: Direct Call Phone Number */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900">Direct Support Call Number</h4>
                <p className="text-[11px] text-zinc-500">Used for "Call Store" buttons & phone links</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Store Support Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99463 36587"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                required
              />
              <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Dialer URI: <strong className="text-zinc-800 font-bold">tel:{phoneClean || 'None'}</strong></span>
              </div>
            </div>
          </div>

          {/* Card 3: Support Email Address */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900">Store Contact Email</h4>
                <p className="text-[11px] text-zinc-500">Displayed in footer and contact page</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mstore.in"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                required
              />
            </div>
          </div>

          {/* Card 4: Location & Operating Hours */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900">Head Office Location & Timing</h4>
                <p className="text-[11px] text-zinc-500">Footer contact address & operating hours</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Primary Location / Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Kootanad, Palakkad"
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Operating Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="10:00 AM - 9:00 PM Daily"
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="bg-[#E50914] text-white hover:bg-red-700 font-bold px-8 py-3 rounded-xl shadow-md text-sm"
            icon={submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {submitting ? 'Saving Settings...' : 'Save Settings Changes'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};
