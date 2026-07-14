import { Metadata } from 'next';
import Link from 'next/link';
import { Camera, Film, Palette, Target, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À Propos | ZENITH PRODUCTION',
  description: 'Découvrez le parcours de Gabin Husson, l\'esprit créatif derrière Zenith Production. Graphisme, cadrage, montage vidéo & marketing.',
};

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

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      
      {/* Hero Section */}
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

      {/* Profile Presentation */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Colonne visuelle (Représentation de la caméra/focus) */}
        <div className="lg:col-span-5 relative aspect-square rounded-2xl border border-z-blue/10 bg-z-card/50 overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 bg-radial from-z-blue/5 to-transparent" />
          
          {/* Repères de viseur cinématique */}
          <span className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-z-blue/30" />
          <span className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-z-blue/30" />
          <span className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-z-blue/30" />
          <span className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-z-blue/30" />
          
          <div className="text-center z-10 p-8">
            <span className="font-martyric text-8xl text-white/10 group-hover:text-z-blue/10 transition-colors duration-500 select-none">
              ZH
            </span>
            <p className="font-sub text-[10px] uppercase tracking-[0.3em] text-z-muted mt-4">
              Gabin Husson — Zenith Production
            </p>
          </div>
        </div>

        {/* Colonne Texte */}
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

      {/* Expertises Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Champs d'action</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide">Une Double Compétence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {expertises.map((exp, index) => (
            <div key={index} className="p-6 rounded-xl bg-z-card border border-z-border hover:border-z-blue/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-z-blue/10 flex items-center justify-center mb-6">
                {exp.icon}
              </div>
              <h3 className="font-display font-bold text-lg uppercase tracking-wide text-white mb-3">
                {exp.title}
              </h3>
              <p className="font-body text-xs text-z-muted leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
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