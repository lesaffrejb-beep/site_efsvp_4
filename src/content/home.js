/**
 * Contenu de la page d'accueil (Hero + Navigation)
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const homeContent = {
  hero: {
    title: {
      line1: "Vous avez déjà écrit l'histoire.",
      line2: 'Nous la mettons en scène avec mesure.',
    },
    subtitle: 'Une direction narrative et musicale ciselée qui laisse respirer vos moments clés et magnifie votre signature.',
    primaryCta: {
      label: 'Partagez votre histoire',
      targetId: '#contact',
    },
    metrics: [
      {
        value: '60+',
        label: 'Représentations',
      },
      {
        value: '15+',
        label: 'Projets institutionnels',
      },
      {
        value: '1200€',
        label: 'À partir de',
      },
    ],
  },

  navigation: {
    logo: 'EfSVP',
    links: [
      { label: 'Créations', href: '#creations' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Process', href: '#process' },
      { label: 'FAQ', href: '#faq' },
    ],
    cta: {
      label: 'Démarrer votre projet',
      href: '#contact',
    },
  },
};
