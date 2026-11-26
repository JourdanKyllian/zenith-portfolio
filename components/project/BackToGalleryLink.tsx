'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const GALLERY_QS_STORAGE_KEY = 'zenith_gallery_qs';

/**
 * Lien de retour vers la galerie restaurant automatiquement la dernière page,
 * recherche, catégorie et tri utilisés dans la session courante (sans cookie).
 */
export default function BackToGalleryLink() {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    try {
      const savedQs = sessionStorage.getItem(GALLERY_QS_STORAGE_KEY);
      if (savedQs) {
        e.preventDefault();
        router.push(`/projet?${savedQs}`);
      }
    } catch {
      // Navigation par défaut vers /projet si sessionStorage est indisponible
    }
  }

  return (
    <Link
      href="/projet"
      onClick={handleClick}
      className="flex items-center gap-2 text-z-blue text-[13px] font-bold uppercase tracking-widest mb-6 hover:translate-x-2 transition-transform"
    >
      <ArrowLeft size={14} /> Retour à la galerie
    </Link>
  );
}
