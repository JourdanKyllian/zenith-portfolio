import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { getProjectAssetsFromDrive, DriveAssets } from '@/lib/googleDrive';
import { SousProjet, Projet } from '@/types';
import ProjectMediaContent from '@/components/project/ProjectMediaContent';
import { CategoryBadge } from '@/components/CategoryBadge';
import SocialLinks from '@/components/SocialLinks';
import { AVAILABLE_SOCIALS } from '@/config/socials';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data: projets } = await supabase.from('projet').select('slug').eq('en_ligne', true).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
  if (!projets) return [];
  return projets.map((projet) => ({ slug: projet.slug }));
}

interface ProcessedSousProjet extends SousProjet {
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: { id: string; name: string; previewUrl: string; thumbnailUrl: string; } | null;
  driveVideoUrl: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from('projet').select('*, categorie(*)').eq('slug', slug).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).single();
  if (!data) return { title: 'Projet — ZENITH PRODUCTION' };
  const project = data as unknown as Projet;
  return { title: `${project.titre} — ${project.categorie?.name || 'Général'} | ZENITH PRODUCTION` };
}

function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId;
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];
  const driveViewerMatch = urlOrId.match(/\/drive-viewer\/([a-zA-Z0-9-_]+)/);
  if (driveViewerMatch) return driveViewerMatch[1];
  return null;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('slug', slug)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .single();

  if (!data) return notFound();

  const project = data as unknown as Projet;

  const sousProjets: SousProjet[] = (project.sousprojet || []).sort((a: SousProjet, b: SousProjet) => (a.ordre || 0) - (b.ordre || 0));

  const sousProjetsAvecMedias: ProcessedSousProjet[] = await Promise.all(
    sousProjets.map(async (sp) => {
      const driveAssets: DriveAssets = sp.drive_url 
        ? await getProjectAssetsFromDrive(sp.drive_url)
        : { images: [], youtubeUrl: null, pdf: null, videoUrl: null }; 
      
      return { ...sp, finalYoutubeUrl: driveAssets.youtubeUrl || sp.youtube_url, driveImages: driveAssets.images, pdf: driveAssets.pdf, driveVideoUrl: driveAssets.videoUrl };
    })
  );

  const hasAnyVideo = sousProjetsAvecMedias.some(sp => sp.finalYoutubeUrl || sp.driveVideoUrl);

  const projectLinks = AVAILABLE_SOCIALS.reduce((acc, net) => {
    acc[net.id] = project[`link_${net.id}` as keyof typeof project] as string | null;
    return acc;
  }, {} as Record<string, string | null>);

  const hasSocials = Object.values(projectLinks).some(val => val !== null && val !== '');

  let coverImageUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";
  if (project.miniature_url) {
    if (project.miniature_url.startsWith('http') && !project.miniature_url.includes('drive.google.com')) {
      coverImageUrl = project.miniature_url;
    } else {
      const driveImageId = getDriveFileId(project.miniature_url);
      if (driveImageId) coverImageUrl = `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w2048`;
    }
  }

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img src={coverImageUrl} alt={project.titre} className="w-full h-full object-cover opacity-30" loading="eager" />
        <div className="absolute inset-0 bg-linear-to-t from-z-bg to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-16 max-w-7xl mx-auto z-10">
          <Link href="/projet" className="flex items-center gap-2 text-z-blue text-[13px] font-bold uppercase tracking-widest mb-6 hover:translate-x-2 transition-transform">
            <ArrowLeft size={14} /> Retour à la galerie
          </Link>
          <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter leading-none mb-6">
            {project.titre}
          </h1>
          
          {(project.categorie || hasSocials) && (
            <div className="flex flex-wrap items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CategoryBadge category={project.categorie} className="px-3 py-1 text-[9px]" />
              {hasSocials && <SocialLinks variant="project" links={projectLinks} />}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-1 space-y-10">
          <div>
            <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-6">Introduction</h3>
            {project.description && (
              <div className="font-body text-z-text/80 leading-relaxed whitespace-pre-wrap rich-text" dangerouslySetInnerHTML={{ __html: project.description }} />
            )}
          </div>
          {hasAnyVideo && (
            <div className="flex flex-col gap-4">
              <div className="btn-blue p-4 rounded-lg flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-80 cursor-default">
                <PlayCircle size={18} /> Vidéos disponibles
              </div>
            </div>
          )}
        </div>
        <ProjectMediaContent sousProjets={sousProjetsAvecMedias} coverImageUrl={coverImageUrl} projectTitle={project.titre} />
      </section>
    </main>
  );
}
