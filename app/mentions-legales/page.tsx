import { Metadata } from 'next';
import { Scale, ShieldCheck, EyeOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions Légales | ZENITH PRODUCTION',
  description: 'Conformité, mentions légales et politique de confidentialité de Zenith Production.',
};

/**
 * Server Component : Page statique des mentions légales.
 * Contient les informations juridiques obligatoires et la politique de confidentialité (RGPD).
 */
export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-z-bg text-z-text pt-32 pb-20 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-z-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 bg-z-card border border-z-border p-8 sm:p-12 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4 text-z-blue mb-10 border-b border-z-blue/10 pb-8">
          <Scale size={32} />
          <h1 className="font-display font-bold text-2xl sm:text-4xl uppercase tracking-wide text-z-text">
            Conformité & Mentions Légales
          </h1>
        </div>

        <div className="space-y-10 font-body text-sm sm:text-base text-z-text/80 leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-z-blue">1.</span> Édition du site
            </h2>
            <p>
              En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-z-muted">
              <li><strong className="text-z-text">Propriétaire & Éditeur :</strong> Gabin Husson — Zenith Production</li>
              <li><strong className="text-z-text">Statut juridique :</strong> Entreprise Individuelle (Micro-entreprise) — SIRET : 99056877600019</li>
              <li><strong className="text-z-text">Siège social :</strong> 2A, RUELLE DU PETIT VOUET, 51510 FAGNIERES, France</li>
              <li><strong className="text-z-text">Contact :</strong> zenithprod.contact@gmail.com</li>
              <li><strong className="text-z-text">Directeur de la publication :</strong> Gabin Husson</li>
              <li><strong className="text-z-text">Conception & Développement Web :</strong> Kyllian Jourdan</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-z-blue">2.</span> Hébergement
            </h2>
            <p>
              Le site est hébergé par la société <strong className="text-white">Vercel Inc.</strong>, situé au 950 Tower Lane, Suite 2200, Foster City, CA 94404, États-Unis. Réseau de diffusion de contenu sécurisé et respectueux des infrastructures européennes. Contact technique : https://vercel.com.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" />
              3. Protection des Données Personnelles (RGPD)
            </h2>
            <p>
              Zenith Production s'engage à ce que la collecte et le traitement de vos données, effectués à partir de notre formulaire de contact, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-z-muted">
              <li><strong className="text-z-text">Données collectées :</strong> Nom, adresse e-mail et contenu du message via le formulaire de contact.</li>
              <li><strong className="text-z-text">Finalité :</strong> Ces données sont uniquement utilisées pour traiter, recontacter et répondre à vos demandes de devis ou de collaboration de projet. Aucune donnée n'est cédée ou revendue à des tiers.</li>
              <li><strong className="text-z-text">Sous-traitant technique :</strong> Les emails sont propulsés de manière sécurisée via l'infrastructure applicative de <strong className="text-white">Resend</strong>.</li>
              <li><strong className="text-z-text">Durée de conservation :</strong> Les données sont conservées pendant une durée maximale de 3 ans après le dernier échange commercial.</li>
              <li><strong className="text-z-text">Vos droits :</strong> Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, écrivez directement à : <span className="text-z-blue">zenithprod.contact@gmail.com</span>.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <EyeOff size={20} className="text-z-blue" />
              4. Politique relative aux Cookies
            </h2>
            <p>
              Ce site n'utilise <strong className="text-white">aucun cookie publicitaire, marketing ou de traçage comportemental</strong>. Aucun bandeau de consentement n'est requis car nous protégeons nativement votre navigation. 
            </p>
            <p>
              Seul un outil de mesure d'audience anonymisé et axé sur les performances (<strong className="text-white">Vercel Analytics & Speed Insights</strong>) est activé. Les adresses IP y sont cryptées, respectant scrupuleusement les recommandations d'exemption de la CNIL.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-z-blue">5.</span> Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus présents sur ce site (créations graphiques, vidéos, logos, textes, animations, arborescences) est protégé par le droit d'auteur. Toute reproduction, distribution ou modification sans l'accord écrit préalable de Gabin Husson est strictement interdite.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}