/**
 * ============================================
 * EfSVP - OFFRES & TARIFS
 * Données des formules proposées
 * ============================================
 */

export const offersData = [
  {
    id: 'ecriture-seule',
    name: 'Écriture seule',
    price: '1 200€',
    priceLabel: 'À partir de',
    featured: false,
    features: [
      'Texte professionnel',
      'Validation par étapes',
      'Délai : 2-3 semaines'
    ],
    ctaText: 'Découvrir',
    ctaLink: '#contact'
  },
  {
    id: 'creation-complete',
    name: 'Création complète',
    price: '2 500€',
    priceLabel: 'À partir de',
    featured: true,
    badge: 'Recommandé',
    features: [
      'Texte + Composition',
      'Enregistrement audio pro',
      'Délai : 3-4 semaines'
    ],
    ctaText: 'Partagez votre histoire',
    ctaLink: '#contact'
  },
  {
    id: 'performance-live',
    name: 'Performance live',
    price: '3 600€',
    priceLabel: 'À partir de',
    featured: false,
    features: [
      'Création complète',
      'Concert live (3-45min)',
      'Délai : 4-5 semaines'
    ],
    ctaText: 'Demander un devis',
    ctaLink: '#contact'
  }
];

export const offersNote = {
  text: 'Spectacle 30-60 min & droits d'exploitation sur devis.',
  highlights: ['Spectacle 30-60 min', 'droits d'exploitation']
};
