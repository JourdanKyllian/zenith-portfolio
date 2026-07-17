import { Metadata } from 'next';
import { Scale, ShieldCheck, EyeOff } from 'lucide-react';

/**
 * Métadonnées sémantiques pour l'indexation de la page de conformité.
 * Déclarées statiquement pour maximiser l'efficience du crawling SEO.
 */
export const metadata: Metadata = {
  title: 'Mentions Légales | ZENITH PRODUCTION',
  description: 'Conformité, mentions légales et politique de confidentialité de Zenith Production.',
};

/**
 * Server Component (RSC) : Page statique des mentions légales.
 * Centralise les obligations légales d'édition de l'identité d'entreprise individuel (EI)
 * et formalise la politique de traitement des données à caractère personnel conformément au RGPD.
 * 
 * @purity Évalué statiquement au build, coût d'hydratation nul pour le client.
 */
export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-z-bg text-z-text pt-32 pb-20 px-6">
      {/* Halo lumineux décoratif arrière-plan */}
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
              <li><strong className="text-z-text">Données collectées :</strong> Nom, adresse e-mail, contenu du message, ainsi que l'adresse IP publique de l'expéditeur lors de la soumission du formulaire de contact.</li>
              <li><strong className="text-z-text">Finalité & Base légale :</strong> Les données d'identité et de message sont traitées à des fins de gestion de la relation commerciale (devis, collaborations). L'adresse IP publique est collectée sur la base légale de l'intérêt légitime de l'éditeur (Article 6, paragraphe 1, point f du RGPD) afin d'assurer la sécurité informatique de l'infrastructure, la traçabilité des transactions cryptographiques et la prévention des abus automatisés (attaques par déni de service, spams répétés). Aucune donnée n'est cédée ou revendue à des tiers.</li>
              <li><strong className="text-z-text">Sous-traitant technique :</strong> Les e-mails de notification et accusés de réception sont propulsés de manière chiffrée via l'infrastructure cloud applicative de la société <strong className="text-white">Resend</strong>.</li>
              <li><strong className="text-z-text">Durée de conservation :</strong> Les données relatives aux demandes de projets sont stockées pendant une durée maximale de 3 ans après le dernier échange commercial. Les métadonnées de sécurité techniques (adresses IP de connexions stockées en base de données applicative) font l'objet d'une purge logicielle automatisée glissante sous un délai strict de 7 jours.</li>
              <li><strong className="text-z-text">Vos droits :</strong> Vous disposez d'un droit d'accès, de rectification, de limitation et de suppression de vos données. Pour exercer ce droit, écrivez directement à la direction de la publication : <span className="text-z-blue">zenithprod.contact@gmail.com</span>.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <EyeOff size={20} className="text-z-blue" />
              4. Politique relative aux Cookies
            </h2>
            <p>
              Ce site n'utilise <strong className="text-white">aucun cookie tiers publicitaire, marketing ou de ciblage comportemental</strong>. Aucun bandeau d'acceptation intrusive n'est requis à l'écran car notre architecture protège nativement la vie privée de l'internaute dès son initialisation.
            </p>
            <p>
              Seul un composant de télémétrie et de mesure de performance d'audience anonymisé (<strong className="text-white">Vercel Analytics & Speed Insights</strong>) est actif pour optimiser l'affichage des médias. Les signatures d'adresses IP associées y sont immédiatement hashées et chiffrées au niveau du réseau périphérique, respectant scrupuleusement les critères d'exemption de consentement formulés par la CNIL.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-z-blue">5.</span> Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus présents sur ce site (créations graphiques, montages vidéo, maquettes photographiques, logos, compositions textuelles, animations d'ondes sonores et arborescences de code source) est protégé au titre du droit d'auteur et de la propriété intellectuelle. Toute reproduction numérique, distribution systémique ou modification sans l'accord écrit préalable de Gabin Husson est strictement interdite et constitue un délit de contrefaçon.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}