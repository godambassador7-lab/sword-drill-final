import React from 'react';
import './App.css';

export default function AppSimple() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sword Drill</h1>
        <p className="text-xl">App is loading correctly!</p>
        <p className="text-sm mt-4 text-slate-400">If you see this, React is working.</p>
      </div>
    </div>
  );
}
