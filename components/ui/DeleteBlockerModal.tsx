"use client";

import { AlertOctagon, X, ShieldAlert } from "lucide-react";
import SubmitButton from "@/components/ui/SubmitButton";

interface DeleteBlockerModalProps {
  isOpen: boolean;
  title: string;
  dependencyCount: number;
  dependencyName: string;
  explanation: string;
  onClose: () => void;
  onForceDelete: () => void;
  forceDeleteLabel: string;
  isForceDeleting: boolean;
}

/**
 * Boîte de dialogue bloquante intervenant lors d'un conflit de contraintes d'intégrité relationnelle (Clés étrangères).
 * Offre à l'utilisateur la possibilité de procéder à une suppression en cascade sécurisée (Force Delete).
 *
 * @param {DeleteBlockerModalProps} props - Paramètres contextuels du conflit (nombre de dépendances, entité parente, explication).
 */
export default function DeleteBlockerModal({
  isOpen,
  title,
  dependencyCount,
  dependencyName,
  explanation,
  onClose,
  onForceDelete,
  forceDeleteLabel,
  isForceDeleting,
}: DeleteBlockerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-z-card border border-amber-500/30 rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.15)] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-z-border bg-amber-500/5">
          <div className="flex items-center gap-3 text-amber-400">
            <ShieldAlert size={20} />
            <h3 className="font-sub text-xs uppercase tracking-widest font-bold">
              Suppression Bloquée
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isForceDeleting}
            className="text-z-muted hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-z-bg border border-z-border">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <AlertOctagon size={24} />
            </div>
            <div>
              <p className="text-sm font-body text-white mb-1">
                Impossible de supprimer{" "}
                <strong className="font-display tracking-wide">
                  &quot;{title}&quot;
                </strong>{" "}
                de manière classique.
              </p>
              <p className="text-xs text-z-muted">
                Ce contenu est actuellement lié à{" "}
                <strong className="text-amber-400">
                  {dependencyCount} {dependencyName}
                </strong>
                . Les bases de données relationnelles interdisent la suppression
                d'un élément parent s'il possède encore des enfants.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-sub text-[10px] font-bold uppercase tracking-widest text-z-blue">
              Que voulez-vous faire ?
            </h4>
            <p className="text-xs text-z-text/80 leading-relaxed bg-z-blue/5 border border-z-blue/10 p-3 rounded-lg">
              {explanation}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-5 bg-z-bg border-t border-z-border">
          <button
            onClick={onClose}
            disabled={isForceDeleting}
            className="flex-1 bg-z-card border border-z-border text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>

          <SubmitButton
            status={isForceDeleting ? "loading" : "idle"}
            onClick={onForceDelete}
            type="button"
            idleText={forceDeleteLabel}
            variant="primary"
            className="flex-1 bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] border-none py-3 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
