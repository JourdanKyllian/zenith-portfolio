export interface GoogleReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  relativeTime: string;
}

export interface GoogleReviewsData {
  rating: number;
  totalReviews: number;
  reviews: GoogleReviewItem[];
  source: 'google_api' | 'fallback';
}

interface PlacesApiReview {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: {
    text?: string;
  };
  authorAttribution?: {
    displayName?: string;
  };
}

interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesApiReview[];
}

const FALLBACK_DATA: GoogleReviewsData = {
  rating: 5.0,
  totalReviews: 11,
  source: 'fallback',
  reviews: [],
};

/**
 * Récupère la note globale, le nombre total d'avis et jusqu'à 3 avis positifs
 * depuis l'API Google Places (v1) avec mise en cache serveur (24h).
 * Retombe proprement sur les données par défaut si les clés ne sont pas configurées.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return FALLBACK_DATA;
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
        },
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      console.error('Erreur API Google Places :', response.status, response.statusText);
      return FALLBACK_DATA;
    }

    const data = (await response.json()) as PlacesApiResponse;
    const rawReviews = data.reviews ?? [];

    const filteredReviews: GoogleReviewItem[] = rawReviews
      .filter((r) => (r.rating ?? 0) >= 4 && Boolean(r.text?.text?.trim()))
      .slice(0, 3)
      .map((r, index) => ({
        id: r.name || `google-review-${index}`,
        author: r.authorAttribution?.displayName?.trim() || 'Client Google',
        rating: r.rating ?? 5,
        comment: r.text?.text?.trim() || '',
        relativeTime: r.relativePublishTimeDescription || 'Avis Google',
      }));

    if (filteredReviews.length === 0) {
      return {
        rating: data.rating ?? FALLBACK_DATA.rating,
        totalReviews: data.userRatingCount ?? FALLBACK_DATA.totalReviews,
        reviews: FALLBACK_DATA.reviews,
        source: 'fallback',
      };
    }

    return {
      rating: data.rating ?? 5.0,
      totalReviews: data.userRatingCount ?? filteredReviews.length,
      reviews: filteredReviews,
      source: 'google_api',
    };
  } catch (error) {
    console.error('Échec de récupération des avis Google :', error);
    return FALLBACK_DATA;
  }
}
