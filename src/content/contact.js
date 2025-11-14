/**
 * Contenu de la section Contact
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const contactContent = {
  section: {
    title: 'La vôtre commence maintenant',
    subtitle: 'Réponse sous 48h · Premier échange offert',
    quote: "Toutes les bonnes histoires méritent d'être racontées.",
  },

  form: {
    fields: [
      {
        id: 'nom',
        type: 'text',
        label: 'Prénom Nom',
        required: true,
        autocomplete: 'name',
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email professionnel',
        required: true,
        autocomplete: 'email',
      },
      {
        id: 'organisation',
        type: 'text',
        label: 'Organisation',
        required: true,
        autocomplete: 'organization',
      },
      {
        id: 'type-projet',
        type: 'select',
        label: 'Type de projet',
        required: true,
        options: [
          { value: '', label: 'Sélectionner' },
          { value: 'anniversaire', label: 'Anniversaire' },
          { value: 'inauguration', label: 'Inauguration' },
          { value: 'spectacle', label: 'Spectacle' },
          { value: 'hymne', label: 'Hymne / Identité' },
          { value: 'autre', label: 'Autre' },
        ],
      },
      {
        id: 'date',
        type: 'date',
        label: 'Date envisagée',
        required: false,
      },
      {
        id: 'budget',
        type: 'range',
        label: 'Budget estimé',
        min: 3000,
        max: 30000,
        step: 1000,
        defaultValue: 10000,
        required: false,
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Parlez-nous de votre projet',
        rows: 5,
        maxLength: 500,
        required: true,
      },
      {
        id: 'consent',
        type: 'checkbox',
        label: 'J'accepte d'être recontacté pour échanger sur mon projet',
        required: true,
      },
    ],
    submitLabel: 'Partagez votre histoire',
  },

  alternativeContact: {
    title: 'Ou contactez-nous directement',
    email: 'contact@efsvp.fr',
    location: 'Basé à Angers · Partout en Francophonie',
  },

  successModal: {
    title: 'Message envoyé !',
    message: 'Merci {name} ! On vous répond sous 48h.',
    ctaLabel: 'Continuer',
  },
};
