import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  Film,
  Palette,
  Target,
  ArrowRight,
  Cpu,
  Clapperboard,
  Sparkles,
  Megaphone,
  Video,
  Layers,
  Check,
} from 'lucide-react';
import SoundwaveTimeline, {
  type TimelineItem,
} from '@/components/SoundwaveTimeline';

export const metadata: Metadata = {
  title: 'À Propos | ZENITH PRODUCTION',
  description:
    "Découvrez Zenith Production : compétences, matériel de production, prestations audiovisuelles & graphiques, et l'histoire du studio.",
};

/**
 * Page de présentation de Zenith Production.
 * Composant serveur (RSC) structuré autour des compétences & matériel,
 * des prestations proposées, de l'identité du studio et de son parcours temporel.
 */
export default function AboutPage() {
  const expertises = [
    {
      icon: <Camera className="w-6 h-6 text-z-blue" />,
      title: 'Cadrage & Captation',
      description:
        "Maîtrise des caméras cinéma, de la lumière et des mouvements pour capturer l'essence de chaque instant sur le terrain.",
    },
    {
      icon: <Film className="w-6 h-6 text-z-blue" />,
      title: 'Montage & Post-Production',
      description:
        "Rythme, colorimétrie et sound design. L'art de couper au bon moment pour raconter une histoire percutante.",
    },
    {
      icon: <Palette className="w-6 h-6 text-z-blue" />,
      title: 'Design Graphique',
      description:
        "Création d'identités visuelles uniques, de chartes graphiques modernes et de visuels à fort impact.",
    },
    {
      icon: <Target className="w-6 h-6 text-z-blue" />,
      title: 'Stratégie Marketing',
      description:
        'Parce qu’une belle image doit servir un objectif. Conception de contenus optimisés pour engager votre audience.',
    },
  ];

  const materiel = [
    {
      category: 'Image & Optique',
      items: ['Caméras hybrides & cinéma 4K/6K', 'Objectifs grand-angle & focales fixes lumineuses', 'Stabilisateur 3 axes & trépieds fluides'],
    },
    {
      category: 'Son & Lumière',
      items: ['Micros HF sans fil & canon directionnel', 'Enregistreur audio multipiste', 'Éclairage LED RGB & diffuseurs studio'],
    },
    {
      category: 'Post-Production & Design',
      items: ['Station de montage & étalonnage calibrée', 'Suite Adobe (Premiere, After Effects, Photoshop, Illustrator)', 'DaVinci Resolve Studio'],
    },
  ];

  const prestations = [
    {
      icon: <Clapperboard className="w-5 h-5 text-z-blue" />,
      tag: 'Production Vidéo',
      title: 'Clips, Aftermovies & Événementiel',
      points: [
        'Captation terrain multi-angles & régie',
        'Montage dynamique, étalonnage & sound design',
        'Formats optimisés YouTube, Reels & TikTok',
      ],
    },
    {
      icon: <Sparkles className="w-5 h-5 text-z-blue" />,
      tag: 'Identité & Print',
      title: 'Design Graphique & Branding',
      points: [
        'Logos, chartes graphiques & direction artistique',
        'Affiches, pochettes, miniatures & supports print',
        'Déclinaisons réseaux sociaux cohérentes',
      ],
    },
    {
      icon: <Video className="w-5 h-5 text-z-blue" />,
      tag: 'Post-Production',
      title: 'Montage & Habillage Sur-Mesure',
      points: [
        'Dérushage et structuration narrative',
        'Motion design, sous-titrage & habillage',
        'Mixage audio et exports multi-plateformes',
      ],
    },
    {
      icon: <Megaphone className="w-5 h-5 text-z-blue" />,
      tag: 'Accompagnement',
      title: 'Contenu Social Media & Stratégie',
      points: [
        'Audit visuel et calendrier éditorial',
        'Séries de contenus récurrents pour marques & créateurs',
        'Coordination créative avec nos collaborateurs',
      ],
    },
  ];

  const iconEtude = (
    <Image
      src="/icons/etude.webp"
      alt=""
      width={96}
      height={96}
      className="h-14 w-14 object-contain sm:h-20 sm:w-20"
    />
  );
  const iconSalarie = (
    <Image
      src="/icons/salarie.webp"
      alt=""
      width={96}
      height={96}
      className="h-14 w-14 object-contain sm:h-20 sm:w-20"
    />
  );
  const iconAsso = (
    <Image
      src="/icons/asso.webp"
      alt=""
      width={96}
      height={96}
      className="h-14 w-14 object-contain sm:h-20 sm:w-20"
    />
  );
  const iconChefZenith = (
    <Image
      src="/icons/chef-zenith.webp"
      alt=""
      width={96}
      height={96}
      className="h-14 w-14 object-contain sm:h-20 sm:w-20"
    />
  );

  const parcours: TimelineItem[] = [
    {
      year: '2018',
      title: 'Premiers pas créatifs',
      subtitle: 'HLP & Arts plastiques',
      description:
        "Développement d'un regard esthétique, critique et narratif autour de l'image, de la composition visuelle et du storytelling.",
      icon: iconEtude,
    },
    {
      year: '2021',
      title: 'Formation Montage Audiovisuel',
      subtitle: "Institut Supérieur de l'Audiovisuel — Paris & BH Digital",
      description:
        'Montée en compétence sur la post-production, le graphisme Photoshop, le développement web et le SEO en environnement agence.',
      icon: iconEtude,
    },
    {
      year: '2023 – 2025',
      title: 'Studio & Captations Live',
      subtitle: 'Mission Locale de Châlons-en-Champagne',
      description:
        "Conception d'un studio dédié aux captations et diffusions en direct, production audiovisuelle complète et déploiement de la communication digitale.",
      icon: iconSalarie,
    },
    {
      year: '2025 – auj.',
      title: 'Direction & Équipe Production',
      subtitle: 'Collectif Châlonnais',
      description:
        "Encadrement d'une équipe de production vidéo, coordination événementielle et conception d'un studio audiovisuel de 40 m².",
      icon: iconAsso,
    },
    {
      year: '2025 – auj.',
      title: 'Création de Zenith Production',
      subtitle: 'Studio Audiovisuel & Graphique',
      description:
        "Lancement de Zenith Production : montage, post-production, captation vidéo, photographie, retouche et design graphique. Collaborations en France et à l'international avec l'appui d'un réseau de partenaires spécialisés.",
      icon: iconChefZenith,
    },
    {
      year: '2026 – auj.',
      title: 'Déploiement & Collaborations',
      subtitle: 'Partenariats & Projets d’envergure',
      description:
        'Développement continu des pôles vidéo, graphisme et stratégie de contenu pour accompagner entreprises, marques et créateurs.',
      icon: iconSalarie,
    },
  ];

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      {/* En-tête de la page */}
      <section className="relative pt-40 pb-16 px-6 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-z-blue/10 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
            Studio Créatif &amp; Audiovisuel
          </span>
          <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter mb-6 leading-none">
            À Propos de <span className="text-glow">Zenith</span>
          </h1>
          <p className="font-body font-light text-z-text/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Mettre une expertise technique, graphique et marketing au service de vos idées pour leur donner la hauteur qu&apos;elles méritent.
          </p>
        </div>
      </section>

      {/* 1. Compétences & Matériel */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center mb-14">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
            Savoir-faire &amp; Équipement
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">
            Compétences &amp; Matériel
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {expertises.map((exp, index) => (
            <li
              key={index}
              className="p-6 rounded-xl bg-z-card border border-z-border hover:border-z-blue/30 transition-all duration-300"
            >
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

        {/* Bloc Matériel */}
        <div className="p-6 sm:p-8 rounded-2xl bg-z-card/60 border border-z-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-z-blue/10 flex items-center justify-center text-z-blue">
              <Cpu size={18} />
            </div>
            <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white">
              Parc Matériel &amp; Outils de Production
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {materiel.map((bloc) => (
              <div
                key={bloc.category}
                className="p-5 rounded-xl bg-z-bg/60 border border-z-border/70"
              >
                <p className="font-sub text-[10px] uppercase tracking-[0.25em] text-z-blue font-bold mb-3">
                  {bloc.category}
                </p>
                <ul className="space-y-2">
                  {bloc.items.map((item) => (
                    <li
                      key={item}
                      className="font-body text-xs text-z-text/80 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-z-blue mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Prestations proposées (cartes visuellement distinctes) */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">
              Offres &amp; Accompagnement
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">
              Prestations Proposées
            </h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-z-muted max-w-md leading-relaxed">
            Des formats modulables adaptés aux entreprises, associations, artistes et créateurs de contenu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prestations.map((presta) => (
            <article
              key={presta.title}
              className="p-7 rounded-2xl bg-linear-to-br from-z-card to-z-bg border border-z-blue/20 hover:border-z-blue/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="inline-flex items-center gap-2 font-sub text-[10px] font-bold uppercase tracking-[0.2em] text-z-blue bg-z-blue/10 border border-z-blue/20 px-3 py-1.5 rounded-full">
                    {presta.icon}
                    {presta.tag}
                  </span>
                  <Layers size={16} className="text-z-muted/40" />
                </div>

                <h3 className="font-display font-bold text-2xl uppercase tracking-wide text-white mb-4">
                  {presta.title}
                </h3>

                <ul className="space-y-2.5 mb-6">
                  {presta.points.map((pt) => (
                    <li
                      key={pt}
                      className="font-body text-xs sm:text-sm text-z-text/80 flex items-start gap-2.5"
                    >
                      <Check size={15} className="text-z-blue shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-z-border/60">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 font-sub text-[10px] font-bold uppercase tracking-[0.2em] text-z-blue hover:text-white transition-colors"
                >
                  Demander un devis <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Derrière la caméra — Zenith Production (logo sans photo personnelle) */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative aspect-square rounded-2xl border border-z-blue/20 bg-z-card/60 overflow-hidden flex items-center justify-center group shadow-2xl">
          <div className="absolute inset-0 bg-radial from-z-blue/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-t from-z-bg/90 via-transparent to-z-bg/40 pointer-events-none" />

          <span className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-z-blue/50 z-20" />
          <span className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-z-blue/50 z-20" />
          <span className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-z-blue/50 z-20" />
          <span className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-z-blue/50 z-20" />

          <div className="relative z-20 flex flex-col items-center text-center px-6 select-none">
            <span className="font-martyric text-6xl sm:text-7xl text-white group-hover:text-z-blue transition-colors duration-500 drop-shadow-2xl leading-none">
              ZENITH
            </span>
            <span className="font-sub text-xs sm:text-sm font-bold tracking-[0.45em] uppercase text-z-blue mt-3">
              PRODUCTION
            </span>
            <div className="w-12 h-0.5 bg-z-blue/50 my-5" />
            <p className="font-sub text-[10px] uppercase tracking-[0.3em] text-z-muted">
              Studio Audiovisuel &amp; Graphique
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] block">
            Le Studio
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">
            Derrière la Caméra : Zenith Production
          </h2>
          <div className="w-20 h-1 bg-z-blue" />
          <div className="space-y-4 font-body text-sm sm:text-base text-z-text/80 leading-relaxed">
            <p>
              <strong className="text-white">Zenith Production</strong> est né d&apos;une ambition claire : proposer un accompagnement créatif complet où l&apos;esthétique cinématographique s&apos;allie à la stratégie de communication.
            </p>
            <p>
              Pour répondre aux projets les plus exigeants, le studio s&apos;appuie également sur un réseau de collaborateurs spécialisés (cadrage, son, graphisme, développement), permettant de mobiliser les bonnes compétences sur chaque production.
            </p>
            <p>
              De la direction artistique jusqu&apos;à l&apos;export final, chaque projet bénéficie d&apos;une exigence de qualité constante, adaptée aux codes actuels des réseaux sociaux comme aux supports traditionnels.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Parcours temporel (format SoundwaveTimeline conservé tel quel) */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
            Depuis 2018
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">
            L&apos;Histoire de Zenith
          </h2>
        </div>
        <SoundwaveTimeline items={parcours} />
      </section>

      {/* CTA Final */}
      <section className="max-w-5xl mx-auto px-6 mt-16 text-center relative py-20 rounded-2xl border border-z-blue/10 bg-z-card overflow-hidden">
        <div className="absolute inset-0 bg-radial from-z-blue/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tighter">
            Prêt à donner vie à <span className="text-glow">votre vision</span> ?
          </h2>
          <p className="font-body text-z-muted text-sm max-w-md mx-auto leading-relaxed">
            Discutons ensemble de vos besoins graphiques, audiovisuels ou de post-production pour concevoir votre futur projet.
          </p>
          <Link
            href="/contact"
            className="btn-blue px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            Lancer la production
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
