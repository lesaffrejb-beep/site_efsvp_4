/**
 * Contenu des services (4 formules)
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const servicesContent = {
  section: {
    title: 'Quatre formules, une signature',
    subtitle: "De l'écriture seule au spectacle complet",
  },

  services: [
    {
      id: 'ecriture',
      title: 'Écriture seule',
      badge: 'À partir de 1 200€',
      features: ['Texte professionnel', '2-3 semaines', 'Validation incluse'],
      ctaLabel: 'Découvrir',
      ctaHref: '#contact',
      featured: false,
    },
    {
      id: 'creation-complete',
      title: 'Création complète',
      badge: 'À partir de 2 500€',
      features: ['Texte + composition', 'Enregistrement pro', '3-4 semaines'],
      ctaLabel: 'Découvrir',
      ctaHref: '#contact',
      featured: false,
    },
    {
      id: 'performance-live',
      title: 'Performance Live',
      badge: 'À partir de 3 600€',
      badgeFeatured: 'Notre signature',
      features: ['Concert sur-mesure', '3-45 minutes', '4-5 semaines'],
      ctaLabel: 'Découvrir',
      ctaHref: '#contact',
      featured: true,
    },
    {
      id: 'droits-exploitation',
      title: "Droits d'exploitation",
      badge: 'Sur devis',
      features: ['Publicité', 'Identité sonore', 'Campagnes'],
      ctaLabel: 'Découvrir',
      ctaHref: '#contact',
      featured: false,
    },
  ],
};
