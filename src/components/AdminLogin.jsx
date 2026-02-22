import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const AdminLogin = ({ onCancel }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full mb-4">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-2">Admin Access Disabled</h1>
          <p className="text-slate-400">Client-side password login has been removed for security.</p>
        </div>

        {/* Security Notice */}
        <div className="bg-slate-800/90 backdrop-blur rounded-xl p-8 border border-red-500/30 shadow-2xl">
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-500/50 rounded-lg">
            <p className="text-amber-200 text-sm flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              Admin authentication must be handled by a secure server-side provider.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
          >
            Back
          </button>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              Configure server-side admin authentication before re-enabling this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
