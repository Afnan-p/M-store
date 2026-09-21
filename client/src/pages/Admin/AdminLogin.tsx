import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/mstore-management-portal');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 relative text-zinc-900">
      {/* Glow */}
      <div className="absolute w-96 h-96 bg-[#E50914]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-3xl space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-zinc-800 mx-auto shadow-lg shadow-zinc-950/20 shrink-0">
            <img
              src="/images/mstore-logo.jpg"
              alt="M Store Logo"
              className="w-full h-full object-cover p-0.5"
            />
          </div>
          
          <div className="flex items-center justify-center gap-2 pt-1">
            <img
              src="/images/M-store-word.png"
              alt="mStore"
              className="h-8 w-auto object-contain mix-blend-multiply"
            />
            <span className="text-xl font-black text-zinc-900 tracking-tight">Admin Portal</span>
          </div>
          <p className="text-xs text-zinc-500">Enter your credentials to manage store inventory.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E50914]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="md" fullWidth variant="primary" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
};
