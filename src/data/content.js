/**
 * ============================================
 * EfSVP - CONTENT MANAGEMENT
 * Textes éditables centralisés
 * ============================================
 */

export const siteContent = {
  // ===== HERO =====
  hero: {
    eyebrow: "Studio de création narrative & musicale",
    headline: "Vous avez déjà écrit l'histoire.",
    headlineSub: "On ne fera que vous relire.",
    description: `Studio de création narrative et musicale sur-mesure.
Pour vos moments clés : anniversaires, inaugurations, transitions.
**Écriture • Composition • Performance live.**`,
    ctaPrimary: "Partagez votre histoire",
    ctaSecondary: "Découvrir nos projets",
    socialProofLabel: "Ils nous font confiance",
    clients: [
      "Département 49",
      "SIVAL",
      "CAPEB",
      "Destination Angers",
      "+8 autres"
    ]
  },

  // ===== PROMESSE / BENEFITS =====
  benefits: {
    title: "Ce que vous obtenez vraiment",
    items: [
      {
        title: "Prestige",
        description: "La classe d'avoir des auteurs-compositeurs professionnels.",
        icon: "star"
      },
      {
        title: "Émotion",
        description: "J'ai vu des gens pleurer.",
        icon: "heart"
      },
      {
        title: "Compréhension",
        description: "Grâce à vous, tout le monde comprend qui on est.",
        icon: "info"
      }
    ]
  },

  // ===== PROCESS =====
  process: {
    title: "Un process clair. Des délais respectés.",
    steps: [
      {
        number: 1,
        title: "Collectage",
        duration: "2 semaines",
        description: "Entretiens • Immersion • Compréhension fine"
      },
      {
        number: 2,
        title: "Création",
        duration: "2-4 semaines",
        description: "Écriture • Composition • 2 allers-retours inclus"
      },
      {
        number: 3,
        title: "Validation",
        duration: "Vos délais",
        description: "Vous validez texte et musique avant enregistrement"
      },
      {
        number: 4,
        title: "Livraison",
        duration: "Semaine finale",
        description: "Audio pro • Texte • (Option : Performance live)"
      }
    ],
    footer: "Process balisé. SLA 48h. Jamais cringe."
  },

  // ===== OFFRES / PRICING =====
  pricing: {
    title: "Formules & Tarifs",
    plans: [
      {
        name: "Écriture seule",
        price: "À partir de 1 200€",
        features: [
          "Texte professionnel",
          "Validation par étapes",
          "Délai : 2-3 semaines"
        ],
        cta: "Découvrir",
        featured: false
      },
      {
        name: "Création complète",
        price: "À partir de 2 500€",
        features: [
          "Texte + Composition",
          "Enregistrement audio pro",
          "Délai : 3-4 semaines"
        ],
        cta: "Partagez votre histoire",
        featured: true,
        badge: "Recommandé"
      },
      {
        name: "Performance live",
        price: "À partir de 3 600€",
        features: [
          "Création complète",
          "Concert live (3-45min)",
          "Délai : 4-5 semaines"
        ],
        cta: "Demander un devis",
        featured: false
      }
    ],
    note: "**Spectacle 30-60 min** & **droits d'exploitation** sur devis."
  },

  // ===== PROJETS =====
  projects: {
    title: "Quelques histoires que nous avons racontées",
    // Les données détaillées sont dans projects.js
  },

  // ===== TÉMOIGNAGES =====
  testimonials: {
    title: "Ce qu'ils en disent",
    items: [
      {
        quote: "J'ai vu des gens pleurer. Personne ne s'attendait à ça.",
        author: "Directrice communication, Département Maine-et-Loire"
      },
      {
        quote: "Vous avez réussi à mettre des mots sur ce qu'on ressentait sans pouvoir l'exprimer.",
        author: "Fondateur, Atelier Lacour"
      },
      {
        quote: "Enfin un format qui donne envie d'écouter nos innovations.",
        author: "Chef de projet, Destination Angers"
      }
    ]
  },

  // ===== FAQ =====
  faq: {
    title: "Vous vous demandez peut-être…",
    questions: [
      {
        q: "Allez-vous vraiment comprendre notre métier ?",
        a: "Oui. Nous prenons 1 à 2 semaines pour vous écouter, observer, comprendre votre vocabulaire et vos enjeux. Nous ne racontons jamais une histoire qui n'est pas la vôtre. Nos clients nous font confiance parce que nous savons poser les bonnes questions et traduire leur réalité en émotions justes."
      },
      {
        q: "Est-ce que ce ne sera pas gênant pour nos équipes ?",
        a: "Non. Nous intervenons avec discrétion et bienveillance. Nos entretiens se font dans le respect du temps et de la pudeur de chacun. Le résultat final valorise toujours vos équipes et votre culture d'entreprise — jamais l'inverse."
      },
      {
        q: "Et si nous changeons d'avis en cours de route ?",
        a: "C'est normal. Nous incluons 2 allers-retours dans toutes nos formules. Si vous voulez ajuster le ton, ajouter un élément ou changer une direction narrative, nous nous adaptons. L'important, c'est que vous soyez fiers du résultat final."
      },
      {
        q: "Travaillez-vous uniquement en Pays de la Loire ?",
        a: "Non. Nous sommes basés à Angers, mais nous intervenons partout en francophonie. L'essentiel de notre travail (écriture, composition) peut se faire à distance. Pour les performances live, nous nous déplaçons selon vos besoins."
      },
      {
        q: "Peut-on réutiliser le texte ou la musique ensuite ?",
        a: "Oui, sous conditions. Les formules incluent un usage défini (événement, diffusion interne, etc.). Pour une réutilisation commerciale (pub, vidéo, identité sonore), nous établissons un contrat de droits d'usage adapté. Nous restons toujours flexibles et transparents sur les tarifs."
      }
    ]
  },

  // ===== CONTACT =====
  contact: {
    title: "Toutes les bonnes histoires\nméritent d'être racontées.",
    subtitle: "La vôtre aussi.",
    form: {
      nameLabel: "Votre nom",
      namePlaceholder: "Jean Dupont",
      emailLabel: "Votre email",
      emailPlaceholder: "jean@entreprise.fr",
      messageLabel: "Votre histoire",
      messagePlaceholder: "Parlez-nous de votre projet, de vos besoins, de votre moment clé...",
      submitButton: "Partagez votre histoire",
      reassurance: "Réponse sous 48h. Premier échange sans engagement."
    },
    successModal: {
      title: "Message envoyé !",
      message: "Merci {name} ! On vous répond sous 48h.",
      closeButton: "Continuer"
    }
  },

  // ===== FOOTER =====
  footer: {
    brandText: "En français s'il vous plaît – Studio de narration",
    tagline: "Angers, Pays de la Loire",
    navigation: {
      title: "Navigation",
      links: [
        { label: "Projets", href: "#projets" },
        { label: "Offres", href: "#offres" },
        { label: "Process", href: "#process" },
        { label: "FAQ", href: "#faq" },
        { label: "Contact", href: "#contact" }
      ]
    },
    contact: {
      title: "Contact",
      email: "contact@efsvp.fr",
      location: "Angers, Pays de la Loire"
    },
    copyright: "© 2025 En français s'il vous plaît · Tous droits réservés",
    backToTopLabel: "Retour en haut"
  },

  // ===== META / SEO =====
  meta: {
    title: "En français s'il vous plaît | Création narrative & musicale sur-mesure | Angers",
    description: "Studio de création narrative et musicale basé à Angers. Hymnes, spectacles et récits sur-mesure pour institutions et entreprises en Pays de la Loire. À partir de 1200€.",
    keywords: "création narrative angers, composition musicale pays de la loire, spectacle sur-mesure angers, hymne institution maine-et-loire, récit entreprise angers, studio narration pays de la loire",
    ogTitle: "En français s'il vous plaît | Création narrative & musicale",
    ogDescription: "Studio de création narrative et musicale pour vos événements clés. Écriture, composition, performance live. Angers, Pays de la Loire.",
    canonicalUrl: "https://site-e-fsvp.vercel.app"
  },

  // ===== ACCESSIBILITY =====
  a11y: {
    skipToMain: "Aller au contenu principal",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    closeModal: "Fermer",
    readingProgress: "Progression de lecture",
    backToTop: "Retour en haut"
  }
};

/**
 * Helper function to get nested content
 * @param {string} path - Dot notation path (e.g., "hero.headline")
 * @returns {any} The content value
 */
export function getContent(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], siteContent);
}

/**
 * Helper function to replace placeholders in text
 * @param {string} text - Text with placeholders like {name}
 * @param {object} values - Object with replacement values
 * @returns {string} Text with placeholders replaced
 */
export function interpolate(text, values) {
  return text.replace(/\{(\w+)\}/g, (match, key) => values[key] || match);
}
