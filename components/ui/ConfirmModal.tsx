"use client";

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, onConfirm, onCancel }: ConfirmModalProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (dontAskAgain) {
      const expiry = Date.now() + 15 * 60 * 1000;
      localStorage.setItem('skipDeleteConfirmUntil', expiry.toString());
    }
    setDontAskAgain(false);
    onConfirm();
  };

  const handleCancel = () => {
    setDontAskAgain(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-z-card border border-z-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-z-border bg-white/5">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={18} />
            <h3 className="font-sub text-xs uppercase tracking-widest font-bold">Confirmation requise</h3>
          </div>
          <button onClick={handleCancel} className="text-z-muted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm font-body text-z-text">
            Êtes-vous sûr de vouloir supprimer <strong className="text-white">&quot;{title}&quot;</strong> ?
          </p>
          <p className="text-xs text-z-muted italic">
            Cette action est irréversible et supprimera également toutes les données qui y sont liées.
          </p>

          <label className="flex items-center gap-2 mt-4 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="rounded border-z-border bg-z-bg text-z-blue focus:ring-z-blue focus:ring-offset-z-card"
            />
            <span className="text-xs text-z-muted group-hover:text-white transition-colors">
              Ne plus demander d'autorisation pendant 15 minutes
            </span>
          </label>
        </div>

        <div className="flex gap-2 p-4 bg-white/5 border-t border-z-border">
          <button 
            onClick={handleCancel} 
            className="flex-1 bg-z-bg border border-z-border text-white py-2.5 rounded-lg text-xs font-bold hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleConfirm} 
            className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
          >
            Oui, Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
