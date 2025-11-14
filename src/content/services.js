/**
 * Contenu des services (4 formules)
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const servicesContent = {
  section: {
    title: `Nos formats`,
    subtitle: `Du texte à la performance complète`,
  },

  services: [
    {
      id: `ecriture-seule`,
      title: `Écriture seule`,
      shortLabel: `Texte sur-mesure`,
      badge: `À partir de 1 200 €`,
      description: `Un texte narratif écrit pour vous, prêt à être lu, partagé ou intégré à vos supports (discours, vidéo, livret…).`,
      features: [`Texte professionnel`, `2 allers-retours inclus`, `2-3 semaines`],
      ctaLabel: `Découvrir`,
      ctaHref: `#contact`,
      featured: false,
    },
    {
      id: `creation-complete`,
      title: `Création complète`,
      shortLabel: `Texte + musique`,
      badge: `À partir de 2 500 €`,
      description: `Texte, composition musicale originale et enregistrement de qualité : un hymne, une pièce sonore ou une bande-son pour vos images.`,
      features: [`Texte + composition`, `Enregistrement professionnel`, `3-4 semaines`],
      ctaLabel: `Découvrir`,
      ctaHref: `#contact`,
      featured: false,
    },
    {
      id: `performance-live`,
      title: `Performance live`,
      shortLabel: `Spectacle sur-mesure`,
      badge: `À partir de 3 600 €`,
      badgeFeatured: `Notre signature`,
      description: `Nous venons jouer chez vous : texte, musique et interprétation live au cœur de votre événement (10 à 45 minutes selon vos besoins).`,
      features: [`Spectacle complet`, `10-45 minutes`, `4-5 semaines`],
      ctaLabel: `Découvrir`,
      ctaHref: `#contact`,
      featured: true,
    },
  ],
};
