"use client";

import React from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface SubmitButtonProps {
  status: SubmitStatus;
  idleText?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  icon?: React.ReactNode;
  // CORRECTION LINTER: Le type 'any' est remplacé par le type React officiel
  onClick?: (e?: React.SyntheticEvent) => void; 
  type?: 'button' | 'submit';
  className?: string;
  textClassName?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}

export default function SubmitButton({
  status,
  idleText = "Enregistrer",
  loadingText = "En cours...",
  successText = "Enregistré !",
  errorText = "Erreur",
  icon = <Save size={16} />,
  onClick,
  type = 'submit',
  className = '',
  textClassName = '',
  fullWidth = false,
  disabled = false,
  variant = 'primary'
}: SubmitButtonProps) {
  
  const getStyles = () => {
    if (status === 'success') return 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105 border-emerald-500';
    if (status === 'error') return 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] border-red-500 animate-shake';
    if (status === 'loading') return 'bg-z-blue/70 text-white cursor-wait border-transparent';
    
    if (variant === 'ghost') return 'bg-z-bg border border-z-border text-white hover:bg-white/5';
    return 'btn-blue hover:scale-105 shadow-lg shadow-z-blue/20 border-transparent';
  };

  const getIcon = () => {
    if (status === 'success') return <CheckCircle2 size={16} className="shrink-0" />;
    if (status === 'error') return <AlertCircle size={16} className="shrink-0" />;
    if (status === 'loading') return <Loader2 size={16} className="shrink-0 animate-spin" />;
    return icon;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || status === 'loading' || status === 'success'}
      className={`rounded-lg flex items-center justify-center gap-2 font-bold tracking-widest transition-all duration-300 ${fullWidth ? 'w-full' : ''} ${getStyles()} ${className}`}
    >
      {getIcon()}
      <span className={textClassName}>
        {status === 'success' ? successText : status === 'error' ? errorText : status === 'loading' ? loadingText : idleText}
      </span>
    </button>
  );
}
