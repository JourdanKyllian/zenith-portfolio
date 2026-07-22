import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Film, Palette, Target, ArrowRight } from 'lucide-react';
import SoundwaveTimeline, {
  type TimelineItem,
} from '@/components/SoundwaveTimeline';

export const metadata: Metadata = {
  title: 'À Propos | ZENITH PRODUCTION',
  description: 'Découvrez le parcours de Gabin Husson, l\'esprit créatif derrière Zenith Production. Graphisme, cadrage, montage vidéo & marketing.',
};

/**
 * Server Component : Page de présentation du profil et des expertises.
 * Contenu entièrement statique favorisant un rendu optimal pour le SEO.
 */
export default function AboutPage() {
  const expertises = [
    {
      icon: <Camera className="w-6 h-6 text-z-blue" />,
      title: "Cadrage & Captation",
      description: "Maîtrise des caméras cinémas, de la lumière et des mouvements pour capturer l'essence de chaque instant sur le terrain."
    },
    {
      icon: <Film className="w-6 h-6 text-z-blue" />,
      title: "Montage & Post-Production",
      description: "Rythme, colorimétrie et sound design. L'art de couper au bon moment pour raconter une histoire percutante."
    },
    {
      icon: <Palette className="w-6 h-6 text-z-blue" />,
      title: "Design Graphique",
      description: "Création d'identités visuelles uniques, de chartes graphiques modernes et de visuels à fort impact."
    },
    {
      icon: <Target className="w-6 h-6 text-z-blue" />,
      title: "Stratégie Marketing",
      description: "Parce qu'une belle image doit servir un objectif. Conception de contenus optimisés pour engager votre audience."
    }
  ];

  // Icônes réelles (fournies par le graphiste) : next/image les redimensionne
  // et les optimise automatiquement (elles partent de 1500x1500 en source,
  // affichées en grand comme sur la maquette — l'optimisation évite quand
  // même d'envoyer l'image brute à pleine résolution).
  const iconEtude = (
    <Image src="/icons/etude.png" alt="" width={96} height={96} className="h-14 w-14 object-contain sm:h-20 sm:w-20" />
  );
  const iconSalarie = (
    <Image src="/icons/salarie.png" alt="" width={96} height={96} className="h-14 w-14 object-contain sm:h-20 sm:w-20" />
  );
  const iconAsso = (
    <Image src="/icons/asso.png" alt="" width={96} height={96} className="h-14 w-14 object-contain sm:h-20 sm:w-20" />
  );
  const iconChefZenith = (
    <Image src="/icons/chef-zenith.png" alt="" width={96} height={96} className="h-14 w-14 object-contain sm:h-20 sm:w-20" />
  );

  // Contenu de la frise : défini côté serveur (texte présent dans le HTML
  // initial pour le SEO), seule l'animation de l'onde est déléguée au
  // composant client SoundwaveTimeline.
  const parcours: TimelineItem[] = [
    {
      year: '2018',
      title: 'Bac Général',
      subtitle: 'Lycée Pierre Bayen',
      description:
        "Les spécialités HLP et Arts plastiques m'ont permis de développer mon esprit critique, ma créativité et mon sens de l'esthétique, des compétences essentielles dans mon parcours en audiovisuel et en communication.",
      icon: iconEtude,
    },
    {
      year: '2021',
      title: 'BTS Montage Audiovisuel',
      subtitle: "Institut Supérieur de l'Audiovisuel — Paris",
      description:
        "Cette formation en alternance a été directement mise en pratique au sein de BH Digital, où j'ai occupé le poste d'alternant chargé de communication. J'y ai développé des compétences en développement web, SEO, montage et post-production, ainsi qu'en création graphique avec Photoshop, me permettant d'allier expertise technique et stratégie de communication.",
      icon: iconEtude,
    },
    {
      year: '2023 – 2025',
      title: 'Chargé de Communication',
      subtitle: 'Mission Locale de Châlons-en-Champagne',
      description:
        "Développement de la communication digitale de la structure à travers le référencement SEO, la création graphique, la production de contenus audiovisuels et la gestion du site web. Conception et mise en place d'un studio dédié aux captations et aux diffusions en direct, afin de professionnaliser les événements et renforcer la communication auprès des différents publics.",
      icon: iconSalarie,
    },
    {
      year: '2025 – auj.',
      title: 'Responsable Communication',
      subtitle: 'Collectif Châlonnais',
      description:
        "Pilotage de la stratégie de communication de l'association en développant son identité de marque et sa visibilité. Encadrement d'une équipe de production vidéo, coordination de la création de contenus audiovisuels et participation à l'organisation des événements. Conception d'un studio audiovisuel de 40 m² en collaboration avec une architecte d'intérieur.",
      icon: iconAsso,
    },
    {
      year: '2025 – auj.',
      title: 'Création de Zenith Production',
      subtitle: 'Micro-entreprise',
      description:
        "Micro-entreprise spécialisée dans la production audiovisuelle et la communication visuelle : montage, post-production, captation vidéo, photographie, retouche photo et création graphique. Développement de l'activité sur ComeUp et couverture de la Foire de Châlons-en-Champagne ainsi que d'autres événements, avec des collaborations en France et à l'international.",
      icon: iconChefZenith,
    },
    {
      year: '2026 – auj.',
      title: 'Chargé de Communication',
      subtitle: 'E.Leclerc — Troyes Saint-Parres-aux-Tertres',
      description:
        "Développement de la communication digitale et interne de l'enseigne. Conception de contenus pour les supports numériques et participation à la mise en œuvre de la stratégie de communication afin de renforcer la visibilité et l'engagement des collaborateurs et des clients.",
      icon: iconSalarie,
    },
  ];

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      <section className="relative pt-40 pb-20 px-6 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-z-blue/10 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">L'Esprit Créatif</span>
          <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter mb-6 leading-none">
            Derrière la <span className="text-glow">Caméra</span>
          </h1>
          <p className="font-body font-light text-z-text/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Mettre son expertise technique, graphique et marketing au service de vos idées pour leur donner la hauteur qu'elles méritent.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative aspect-square rounded-2xl border border-z-blue/10 bg-z-card/50 overflow-hidden flex items-center justify-center group shadow-2xl">
          <Image
            src="/gabin.webp"
            alt="Portrait de Gabin Husson"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 500px"
            className="absolute inset-0 object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-z-bg via-transparent to-z-bg/40 opacity-90 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-radial from-z-blue/5 to-transparent pointer-events-none z-10" />

          <span className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-z-blue/40 z-20" />
          <span className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-z-blue/40 z-20" />
          <span className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-z-blue/40 z-20" />
          <span className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-z-blue/40 z-20" />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-20 w-full px-4">
            <p className="font-sub text-[10px] uppercase tracking-[0.3em] text-z-text/90 drop-shadow-md">
              Gabin Husson — Live Focus
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">
            Qui est Gabin Husson ?
          </h2>
          <div className="w-20 h-1 bg-z-blue" />
          <div className="space-y-4 font-body text-sm sm:text-base text-z-text/80 leading-relaxed">
            <p>
              Passionné par l'image sous toutes ses formes, j'ai fondé <strong className="text-white">Zenith Production</strong> pour concrétiser une vision : celle d'un accompagnement créatif complet, où l'esthétique cinématographique s'allie à la stratégie de communication.
            </p>
            <p>
              Qu'il s'agisse de réaliser des captations dynamiques sur le terrain, de façonner une identité visuelle marquante ou de structurer un montage vidéo percutant, je m'engage à fournir des livrables haut de gamme adaptés aux nouveaux codes des réseaux sociaux et des médias traditionnels.
            </p>
            <p>
              Chaque projet est unique et mérite une attention d'orfèvre. De l'idée originale jusqu'à l'export final, nous travaillons ensemble pour que votre message prenne son envol.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Champs d'action</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">Une Double Compétence</h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {expertises.map((exp, index) => (
            <li key={index} className="p-6 rounded-xl bg-z-card border border-z-border hover:border-z-blue/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-z-blue/10 flex items-center justify-center mb-6 animate-fade-in">
                {exp.icon}
              </div>
              <h3 className="font-display font-bold text-lg uppercase tracking-wide text-white mb-3">
                {exp.title}
              </h3>
              <p className="font-body text-xs text-z-muted leading-relaxed">
                {exp.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Frise chronologique du parcours */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Depuis 2018</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">Mon Parcours</h2>
        </div>
        <SoundwaveTimeline items={parcours} />
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-16 text-center relative py-20 rounded-2xl border border-z-blue/10 bg-z-card overflow-hidden">
        <div className="absolute inset-0 bg-radial from-z-blue/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tighter">
            Prêt à donner vie à <span className="text-glow">votre vision</span> ?
          </h2>
          <p className="font-body text-z-muted text-sm max-w-md mx-auto leading-relaxed">
            Discutons ensemble de vos besoins graphiques, audiovisuels ou de post-production pour concevoir votre futur projet.
          </p>
          <Link href="/contact" className="btn-blue px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 hover:scale-105 transition-transform">
            Lancer la production
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}