import { Star, ExternalLink, Quote, MessageSquareHeart } from 'lucide-react';
import { getGoogleReviews } from '@/lib/googleReviews';

const DEFAULT_GOOGLE_REVIEW_LINK = 'https://g.page/r/CVeLgrtv_yDKEBM/review';

/**
 * Section "Ils parlent de nous" affichant la note globale Google,
 * le nombre total d'avis, 3 avis positifs récupérés via l'API Google Places
 * et un appel à l'action pour laisser un avis.
 */
export default async function GoogleReviewsSection() {
  const { rating, totalReviews, reviews } = await getGoogleReviews();
  const formattedRating = rating.toFixed(1);
  const reviewLink =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
    (process.env.GOOGLE_PLACE_ID
      ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(process.env.GOOGLE_PLACE_ID)}`
      : DEFAULT_GOOGLE_REVIEW_LINK);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="max-w-xl">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
            Ils parlent de nous
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-6xl text-z-text uppercase tracking-tighter leading-none">
            Avis <span className="text-glow">Google</span>
          </h2>
        </div>

        {/* Badge récapitulatif note globale */}
        <div className="inline-flex items-center gap-5 px-6 py-4 rounded-2xl bg-z-card border border-z-border shadow-xl self-start lg:self-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-3xl text-white">{formattedRating}</span>
              <span className="font-sub text-xs text-z-muted">/ 5</span>
            </div>
            <p className="font-sub text-[10px] uppercase tracking-widest text-z-muted mt-0.5">
              {totalReviews} avis Google
            </p>
          </div>
          <div className="h-10 w-px bg-z-border" />
          <div className="flex items-center gap-1" aria-label={`Note de ${formattedRating} sur 5 étoiles`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(rating)
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]'
                    : 'text-z-muted/30'
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grille des 3 avis positifs (affichée dès que les vrais avis Google sont chargés) */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="p-7 rounded-2xl bg-z-card border border-z-border hover:border-z-blue/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote size={18} className="text-z-blue/30" />
                </div>

                <p className="font-body text-sm text-z-text/85 leading-relaxed mb-6 line-clamp-5">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-z-border/70 flex items-center justify-between gap-3">
                <div>
                  <p className="font-display font-semibold text-sm uppercase tracking-wide text-white">
                    {review.author}
                  </p>
                  <p className="font-body text-[11px] text-z-muted">Client vérifié</p>
                </div>
                <span className="font-sub text-[9px] uppercase tracking-widest text-z-blue bg-z-blue/10 px-2.5 py-1 rounded-full shrink-0">
                  {review.relativeTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Bandeau CTA pour inciter les clients satisfaits à noter */}
      <div className="p-6 sm:p-8 rounded-2xl bg-z-card/70 border border-z-blue/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-z-blue/10 border border-z-blue/20 flex items-center justify-center text-z-blue shrink-0">
            <MessageSquareHeart size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wide text-white">
              Satisfait de votre projet ?
            </h3>
            <p className="font-body text-xs sm:text-sm text-z-muted mt-1 leading-relaxed">
              Votre retour est précieux pour Zenith Production. N&apos;hésitez pas à nous laisser une note et quelques mots sur Google.
            </p>
          </div>
        </div>

        <a
          href={reviewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2.5 shrink-0 hover:border-z-blue transition-colors"
        >
          Laisser un avis Google
          <ExternalLink size={14} />
        </a>
      </div>
    </section>
  );
}
