/**
 * Contenu de la section Contact
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const contactContent = {
  section: {
    title: `Parlons de votre histoire`,
    subtitle: `En quelques questions, dites-nous ce qui compte pour vous. Nous revenons vers vous sous 72 h avec une première idée de récit.`,
    responseTime: `Réponse sous 72h garantie.`,
  },

  form: {
    fields: [
      {
        id: `nom`,
        type: `text`,
        label: `Votre nom`,
        required: true,
        autocomplete: `name`,
      },
      {
        id: `email`,
        type: `email`,
        label: `Email`,
        required: true,
        autocomplete: `email`,
      },
      {
        id: `organisation`,
        type: `text`,
        label: `Structure / institution`,
        required: true,
        autocomplete: `organization`,
      },
      {
        id: `type-projet`,
        type: `select`,
        label: `Contexte`,
        required: true,
        options: [
          { value: ``, label: `Sélectionner` },
          { value: `anniversaire`, label: `Anniversaire` },
          { value: `inauguration`, label: `Inauguration` },
          { value: `transformation`, label: `Transformation` },
          { value: `territoire`, label: `Territoire` },
          { value: `autre`, label: `Autre` },
        ],
      },
      {
        id: `date`,
        type: `date`,
        label: `Date ou période de l'événement`,
        required: false,
      },
      {
        id: `budget`,
        type: `range`,
        label: `Budget approximatif`,
        min: 1000,
        max: 20000,
        step: 500,
        defaultValue: 5000,
        required: false,
      },
      {
        id: `message`,
        type: `textarea`,
        label: `Ce que vous aimeriez voir apparaître dans le récit`,
        rows: 5,
        maxLength: 500,
        required: true,
      },
      {
        id: `consent`,
        type: `checkbox`,
        label: `J'accepte d'être recontacté pour échanger sur mon projet`,
        required: true,
      },
    ],
    submitLabel: `Partagez votre histoire`,
  },

  alternativeContact: {
    email: `contact@efsvp.fr`,
  },

  successState: {
    title: `Message envoyé !`,
    message: `Merci ! Votre histoire nous est bien parvenue. Nous revenons vers vous très vite.`,
  },
};
