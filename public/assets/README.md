# 📁 Assets Structure - EfSVP Portfolio

Organisation des assets (images, vidéos, audio, logos) avec une convention centrée sur le **slug** des projets.

## 📂 Structure générale

```
/public/assets/
├── audio/                     # Audio global + extraits projets (git-ignored)
│   └── projects/<slug>/
│       └── excerpt.mp3
├── images/
│   └── projects/<slug>/
│       ├── cover.jpg         # Image principale (obligatoire)
│       ├── cover@2x.jpg      # Optionnel (retina)
│       └── detail-01.jpg     # Optionnel, galerie pour la modale
├── videos/
│   └── projects/<slug>/
│       └── teaser.mp4        # Optionnel
├── clients/                  # Logos (si nécessaire ultérieurement)
│   ├── logos/
│   │   └── .gitkeep
│   └── clients.json
└── projects/
    └── _metadata-template.json  # Template d'override facultatif
```

- `<slug>` = valeur du champ `id` dans `content/projects.json` (ex : `la-force-de-la-douceur`).
- Les fichiers audio lourds restent exclus du dépôt (`public/assets/audio/*` est ignoré par Git).

## 🎨 Médias projet (images / vidéos / audio)

### Nommage recommandé
- **Cover obligatoire** : `/assets/images/projects/<slug>/cover.jpg`
- **Retina (optionnel)** : `/assets/images/projects/<slug>/cover@2x.jpg`
- **Galerie (optionnel)** : `/assets/images/projects/<slug>/detail-01.jpg`, `detail-02.jpg`, ...
- **Vidéo (optionnel)** : `/assets/videos/projects/<slug>/teaser.mp4`
- **Audio (optionnel)** : `/assets/audio/projects/<slug>/excerpt.mp3`

Ajoute uniquement les fichiers disponibles : si tu n'as qu'une image, ne fournis que `cover.jpg`. Si tu as une vidéo ou un audio, nomme-les respectivement `teaser.mp4` et `excerpt.mp3` dans le dossier du projet.

### Lien avec les données
Chaque entrée de `content/projects.json` dispose d'un objet `media` :

```json
"media": {
  "coverImage": "/assets/images/projects/<slug>/cover.jpg",
  "gallery": ["/assets/images/projects/<slug>/detail-01.jpg"],
  "video": "/assets/videos/projects/<slug>/teaser.mp4",
  "audio": "/assets/audio/projects/<slug>/excerpt.mp3"
}
```

Les chemins sont directement utilisés par les cartes du portfolio et les modales. Les champs `video` et `audio` sont optionnels : laisse-les vides ou à `null` si tu n'as rien à fournir.

## 📄 Template metadata (optionnel)
`public/assets/projects/_metadata-template.json` peut servir d'aide pour overrider une fiche projet. Mets simplement à jour le `id` (slug) et les chemins media ci-dessus si tu veux tester des fichiers locaux sans modifier `content/projects.json`.

## 🚀 Workflow d'ajout rapide
1. Créer le dossier du slug si besoin (ex : `public/assets/images/projects/la-force-de-la-douceur/`).
2. Déposer `cover.jpg` (et `cover@2x.jpg` / `detail-01.jpg` si dispo).
3. Si vidéo : `public/assets/videos/projects/<slug>/teaser.mp4`.
4. Si audio : `public/assets/audio/projects/<slug>/excerpt.mp3` (fichiers lourds non commités, voir `.gitignore`).
5. Vérifier/mettre à jour `content/projects.json` pour pointer vers ces chemins.

