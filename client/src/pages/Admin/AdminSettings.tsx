import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../hooks/useAuth';
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
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, loading, updateSettings } = useSettings();
  const { user, updateCredentials } = useAuth();
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Store Contact Form State
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [instagram, setInstagram] = useState('');

  // Admin Account & Login Security Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingAuth, setUpdatingAuth] = useState(false);
  const [authError, setAuthError] = useState('');

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

  useEffect(() => {
    if (user?.email) {
      setAdminEmail(user.email);
    }
  }, [user]);

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

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!currentPassword.trim()) {
      setAuthError('Please enter your current password to authorize security changes.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setAuthError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setAuthError('New password and confirm password do not match.');
      return;
    }

    try {
      setUpdatingAuth(true);
      await updateCredentials({
        currentPassword: currentPassword.trim(),
        newEmail: adminEmail.trim() !== user?.email ? adminEmail.trim() : undefined,
        newPassword: newPassword.trim() || undefined,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setToastMsg('Admin login credentials updated successfully! New credentials are now active.');
    } catch (err: any) {
      console.error('Failed to update credentials:', err);
      setAuthError(err.message || 'Failed to update credentials. Please verify your current password.');
    } finally {
      setUpdatingAuth(false);
    }
  };

  const whatsappClean = (whatsappNumber || '').replace(/\D/g, '');
  const phoneClean = (phone || '').replace(/\s+/g, '');

  return (
    <AdminLayout
      title="Store Settings & Admin Security"
      subtitle="Manage WhatsApp enquiry number, store contact details, and update admin portal login credentials."
    >
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      <div className="space-y-8 max-w-5xl">
        {/* Real-time Status Card */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-black p-5 rounded-2xl border border-zinc-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#E50914]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Real-Time Dynamic Sync Active</h3>
              <p className="text-xs text-zinc-400">
                Changes saved here reflect instantly across customer WhatsApp links, call buttons, and admin authentication without needing to edit .env files.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: ADMIN LOGIN CREDENTIALS (EMAIL & PASSWORD) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E50914] border border-red-200 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900">Admin Login & Security Credentials</h3>
                <p className="text-xs text-zinc-500">
                  Update your admin portal email and password. Once changed, credentials persist securely in your database.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active Admin: {user?.email || 'admin@mstore.in'}</span>
            </div>
          </div>

          {authError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCredentials} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Login Email */}
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span>Admin Login Email *</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Used to log in at /mstore-management-portal/login</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@mstore.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Current Password (Mandatory to verify identity) */}
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span>Current Password *</span>
                  <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Required to confirm identity
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-0.5"
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span>New Password</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Min. 6 chars (Leave blank if keeping existing)</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-0.5"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#E50914]"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-0.5"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={updatingAuth}
                variant="primary"
                className="bg-zinc-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-xs flex items-center gap-2"
                icon={updatingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              >
                {updatingAuth ? 'Updating Credentials...' : 'Update Login Credentials'}
              </Button>
            </div>
          </form>
        </div>

        {/* SECTION 2: STORE CONTACT & WHATSAPP SETTINGS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900">Customer Contact & Showroom Settings</h3>
            <Button
              type="submit"
              disabled={submitting}
              variant="primary"
              className="bg-[#E50914] text-white hover:bg-red-700 font-bold px-5 py-2 rounded-xl shadow-sm text-xs"
              icon={submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {submitting ? 'Saving...' : 'Save Contact Settings'}
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
                  placeholder="+91 XXXXX XXXXX (Official WhatsApp Number)"
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
                  placeholder="+91 XXXXX XXXXX (Official Phone Number)"
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
              {submitting ? 'Saving Settings...' : 'Save Contact Settings'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

