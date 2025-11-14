/**
 * Contenu de la section Contact
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const contactContent = {
  section: {
    title: '',
    subtitle: '',
    quote: '',
  },

  form: {
    fields: [
      {
        id: 'nom',
        type: 'text',
        label: '',
        required: true,
        autocomplete: 'name',
      },
      {
        id: 'email',
        type: 'email',
        label: '',
        required: true,
        autocomplete: 'email',
      },
      {
        id: 'organisation',
        type: 'text',
        label: '',
        required: true,
        autocomplete: 'organization',
      },
      {
        id: 'type-projet',
        type: 'select',
        label: '',
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
        label: '',
        required: false,
      },
      {
        id: 'budget',
        type: 'range',
        label: '',
        min: 3000,
        max: 30000,
        step: 1000,
        defaultValue: 10000,
        required: false,
      },
      {
        id: 'message',
        type: 'textarea',
        label: '',
        rows: 5,
        maxLength: 500,
        required: true,
      },
      {
        id: 'consent',
        type: 'checkbox',
        label: '',
        required: true,
      },
    ],
    submitLabel: '',
  },

  alternativeContact: {
    title: '',
    email: 'contact@efsvp.fr',
    location: '',
  },

  successModal: {
    title: '',
    message: '', // avec placeholder {name}
    ctaLabel: 'Continuer',
  },
};
