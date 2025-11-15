# 📘 Guide de Maintenance — Site EfSVP

> Documentation pour éditer et maintenir le site "En français s'il vous plaît"

## 🎯 Vue d'ensemble

Ce site utilise un **design system unifié** avec des **données externalisées** pour faciliter les mises à jour sans toucher au code HTML ou CSS.

---

## 🎨 Design System

### Fichiers principaux

- **`src/styles/design-system-unified.css`** → Design tokens (couleurs, typo, espacements, etc.)
- **`src/styles/project-modal.css`** → Styles de la modale projets
- **`src/styles/dribbble-grade.css`** → Styles spécifiques sections
- **`src/styles/dribbble-sections.css`** → Styles composants

### Tokens disponibles

#### Couleurs
```css
--color-primary-500: #b95a40;  /* Terre cuite */
--color-neutral-800: #1a2332;  /* Encre nuit */
--text-primary: #1a2332;
--text-secondary: #495057;
--bg-primary: #ffffff;
```

#### Espacements
```css
--space-4: 1rem;      /* 16px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--section-spacing: 7.5rem; /* 120px desktop */
```

#### Typographie
```css
--font-display: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
--text-lg: 1.125rem;  /* 18px */
--text-2xl: 1.5rem;   /* 24px */
```

---

## 📝 Modifier le contenu

### 1. Projets (Section "Quelques histoires...")

**Fichier :** `src/data/projects.js`

```javascript
export const projectsData = {
  'mon-projet-id': {
    id: 'mon-projet-id',
    title: 'Titre du projet',
    subtitle: 'Sous-titre optionnel',
    year: 2025,
    type: 'Hymne officiel', // Badge affiché
    client: 'Nom du client',
    tags: ['Tag1', 'Tag2'],
    description: `
      Paragraphe 1 du projet.

      Paragraphe 2 du projet.
    `,
    stats: {
      duration: '3 mois',
      format: '2 clips vidéo',
      audience: '2000 visiteurs'
    }
  }
};
```

**Important :** Pour qu'un projet s'affiche dans la modale, ajoutez l'attribut `data-project-id` à la carte dans `index.html` :

```html
<article class="project-card" data-project-id="mon-projet-id">
  ...
</article>
```

---

### 2. Offres & Tarifs

**Fichier :** `src/data/offers.js`

```javascript
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
  }
];
```

**Pour mettre à jour :**
1. Ouvrez `src/data/offers.js`
2. Modifiez les prix, features, ou ajoutez de nouvelles offres
3. Rechargez la page

---

### 3. Process (Étapes 1-2-3-4)

**Fichier :** `src/data/process.js`

```javascript
export const processData = {
  title: 'Un process clair. Des délais respectés.',
  steps: [
    {
      number: 1,
      title: 'Collectage',
      duration: '2 semaines',
      description: 'Entretiens • Immersion • Compréhension fine'
    }
    // ... autres étapes
  ],
  reassurance: 'Process balisé. SLA 48h. Jamais cringe.'
};
```

---

### 4. FAQ

**Fichier :** `src/content/faq.js`

```javascript
export const faqContent = {
  section: {
    title: 'Vos questions, nos réponses'
  },
  items: [
    {
      id: 'faq-1',
      question: 'Ma question ?',
      answer: 'Ma réponse détaillée.'
    }
  ]
};
```

---

### 5. Texte du Hero

**Fichier :** `index.html` (lignes 224-250)

```html
<h1 class="hero__headline heading-1 text-inverse mb-8">
  Vous avez déjà écrit l'histoire.
  <span class="hero__headline-sub text-secondary mt-4">
    On ne fera que vous relire.
  </span>
</h1>
```

---

## 🔧 Corrections courantes

### Changer les couleurs du site

1. Ouvrez `src/styles/design-system-unified.css`
2. Modifiez les tokens de couleurs :

```css
:root {
  --color-primary-500: #b95a40; /* Votre nouvelle couleur */
}
```

### Modifier les espacements

```css
:root {
  --section-spacing: 7.5rem; /* Espacement desktop */
  --section-spacing-sm: 3rem; /* Espacement mobile */
}
```

### Ajuster les tailles de texte

```css
:root {
  --text-lg: 1.125rem;  /* Corps de texte */
  --text-hero: clamp(2.5rem, 6vw, 4.5rem); /* Titre principal */
}
```

---

## 🚀 Déploiement

Le site est déployé automatiquement sur **Vercel** à chaque push sur la branche `main`.

### Processus

```bash
# 1. Vérifier les modifications
git status

# 2. Ajouter les fichiers modifiés
git add .

# 3. Créer un commit
git commit -m "feat: description de vos modifications"

# 4. Pousser vers GitHub
git push origin claude/efsvp-design-system-refactor-01QcJt11iYLC2fwRK1KUiH3V
```

---

## 📁 Structure du projet

```
Site_eFsvp_V3/
├── index.html                 # Page principale
├── src/
│   ├── data/                  # ← DONNÉES À MODIFIER ICI
│   │   ├── projects.js        # Projets portfolio
│   │   ├── offers.js          # Offres & tarifs
│   │   ├── process.js         # Étapes du process
│   │   └── content.js         # Autres contenus
│   ├── content/
│   │   ├── faq.js             # Questions FAQ
│   │   └── ...
│   ├── styles/                # Styles CSS
│   │   ├── design-system-unified.css  # ← TOKENS DESIGN
│   │   ├── project-modal.css
│   │   └── ...
│   └── scripts/               # JavaScript
│       ├── main.js
│       └── modules/
│           └── projectModal.js
└── MAINTENANCE.md             # Ce fichier
```

---

## 🐛 Résolution de problèmes

### Les modales ne s'ouvrent pas

1. Vérifiez que `data-project-id` est bien sur la carte projet dans `index.html`
2. Vérifiez que l'ID correspond à une clé dans `src/data/projects.js`
3. Ouvrez la console (F12) pour voir les erreurs

### Le style ne se charge pas

1. Vérifiez que `design-system-unified.css` est chargé dans `index.html`
2. Videz le cache du navigateur (Ctrl+Shift+R)
3. Vérifiez qu'il n'y a pas d'erreurs CSS dans la console

### Les données ne s'affichent pas

1. Vérifiez la syntaxe JavaScript dans les fichiers de données
2. Assurez-vous que les exports sont corrects (`export const ...`)
3. Regardez la console pour les erreurs d'import

---

## 💡 Bonnes pratiques

### Avant toute modification

1. ✅ Faites une sauvegarde
2. ✅ Testez localement avant de déployer
3. ✅ Vérifiez sur mobile/tablette/desktop

### Lors de l'édition

1. ✅ Utilisez les tokens CSS plutôt que des valeurs en dur
2. ✅ Respectez la structure des fichiers de données
3. ✅ Ajoutez des commentaires pour les modifications complexes

---

## 📞 Support

Pour toute question ou problème :
- Consultez ce guide
- Vérifiez la console navigateur (F12)
- Contactez le développeur qui a mis en place ce système

---

**Dernière mise à jour :** 15 novembre 2025
**Version du design system :** 3.0 (Unified)
