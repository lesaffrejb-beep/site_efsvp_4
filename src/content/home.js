/**
 * Contenu de la page d'accueil (Hero + Navigation)
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const homeContent = {
  hero: {
    title: {
      line1: `Votre histoire mérite mieux qu'un PowerPoint.`,
      line2: `Elle mérite un spectacle.`,
    },
    subtitle: `Institutions, territoires, entreprises : nous transformons vos moments clés en expériences narratives sur-mesure, écrites et jouées pour vous.`,
    primaryCta: {
      label: `Partagez votre histoire`,
      targetId: `#contact`,
    },
    secondaryCta: {
      label: `Voir un projet en entier`,
      href: `#portfolio`,
    },
    tagline: `Vous avez déjà écrit l'histoire. On ne fera que vous relire.`,
    metrics: [
      {
        value: `15+`,
        label: `Projets sur-mesure`,
      },
      {
        value: `60+`,
        label: `Dates jouées`,
      },
      {
        value: `1 200 €`,
        label: `À partir de`,
      },
      {
        value: `4`,
        label: `Années de terrain`,
      },
    ],
  },

  navigation: {
    logo: `En français s'il vous plaît`,
    links: [
      { label: `Accueil`, href: `#hero` },
      { label: `Projets`, href: `#projects` },
      { label: `Process`, href: `#process` },
      { label: `Offres`, href: `#offers` },
      { label: `FAQ`, href: `#faq` },
      { label: `Contact`, href: `#contact` },
    ],
    cta: {
      label: `Partagez votre histoire`,
      href: `#contact`,
    },
  },
};
