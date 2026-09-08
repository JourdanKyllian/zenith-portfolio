import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning';
  children: React.ReactNode;
}

export default function Alert({ type, children }: AlertProps) {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const icons = {
    success: <CheckCircle2 size={16} className="shrink-0 mt-0.5" />,
    error: <AlertCircle size={16} className="shrink-0 mt-0.5" />,
    warning: <AlertCircle size={16} className="shrink-0 mt-0.5" />,
  };

  return (
    <div className={`flex items-start gap-2.5 p-4 rounded-lg border text-xs font-bold leading-relaxed animate-in fade-in zoom-in duration-200 ${styles[type]}`}>
      {icons[type]}
      <span>{children}</span>
    </div>
  );
}
