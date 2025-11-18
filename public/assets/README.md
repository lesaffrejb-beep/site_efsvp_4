# 📁 Assets Structure - EfSVP Portfolio

Cette documentation explique l'organisation des assets (images, audio, logos) du site.

---

## 📂 Structure générale

```
/public/assets/
├── audio/                  # Audio global du site
├── clients/                # Logos clients pour carousel
│   ├── logos/             # Fichiers SVG des logos
│   │   ├── .gitkeep
│   │   ├── client-nike.svg
│   │   └── client-adidas.svg
│   └── clients.json       # Configuration carousel clients
└── projects/              # Projets portfolio
    ├── _metadata-template.json  # Template de référence
    ├── projet-1/
    │   ├── metadata.json
    │   ├── images/
    │   │   ├── cover.jpg
    │   │   ├── thumbnail.jpg
    │   │   └── hero.jpg
    │   └── audio/
    │       └── track.mp3
    └── projet-2/
        ├── metadata.json
        └── images/
            └── cover.jpg
```

---

## 🎨 Dossier `/projects/`

Chaque projet a son propre dossier organisé ainsi :

### Structure d'un projet

```
/public/assets/projects/[project-id]/
├── metadata.json           # Configuration du projet (optionnel)
├── images/                # Images du projet
│   ├── cover.jpg         # Image principale (16:9, 1920x1080+)
│   ├── cover@2x.jpg     # Version retina (optionnel)
│   ├── thumbnail.jpg    # Vignette liste (800x600)
│   ├── hero.jpg         # Hero section (2560px+)
│   └── gallery-*.jpg    # Images galerie
└── audio/                # Fichiers audio (optionnel)
    ├── track.mp3
    └── track.ogg
```

### Fichier `metadata.json`

Le fichier `metadata.json` permet d'enrichir ou d'override les données du projet définies dans `/content/projects.json`.

**Template** : Voir `_metadata-template.json` à la racine du dossier `projects/`

**Champs principaux** :
- `id` : Identifiant unique (doit correspondre au nom du dossier)
- `audio` : Configuration du lecteur audio (optionnel)
- `media` : Chemins vers images, vidéos, galerie
- Tous les champs du projet central peuvent être overridés

---

## 👥 Dossier `/clients/`

Contient les logos des clients pour les carousels et sections clients.

### Structure

```
/public/assets/clients/
├── logos/                 # Fichiers SVG des logos
│   ├── client-nike.svg
│   └── client-adidas.svg
└── clients.json          # Configuration
```

### Fichier `clients.json`

```json
{
  "clients": [
    {
      "id": "nike",
      "name": "Nike",
      "logo": {
        "svg": "client-nike.svg",
        "alt": "Logo Nike"
      },
      "featured": true,
      "order": 1,
      "projectId": "projet-nike-rebrand"
    }
  ],
  "settings": {
    "displayMode": "marquee",
    "autoplaySpeed": 3000,
    "pauseOnHover": true
  }
}
```

**Champs** :
- `id` : Identifiant unique du client
- `name` : Nom complet
- `logo.svg` : Nom du fichier SVG dans `/logos/`
- `featured` : Affiché dans le carousel principal
- `order` : Ordre d'affichage
- `projectId` : Lien vers un projet (optionnel)

---

## 📐 Formats recommandés

### Images

| Type | Format | Dimensions | Ratio | Poids max |
|------|--------|-----------|-------|-----------|
| Cover | JPG | 1920x1080 | 16:9 | 500KB |
| Cover @2x | JPG | 3840x2160 | 16:9 | 1MB |
| Thumbnail | JPG | 800x600 | 4:3 | 200KB |
| Hero | JPG | 2560x1440+ | Libre | 1MB |
| Gallery | JPG | 1920x1080+ | Libre | 500KB |

**Optimisation** :
- Compresser avec [TinyPNG](https://tinypng.com/) ou [Squoosh](https://squoosh.app/)
- Progressive JPEG recommandé
- WebP en complément (optionnel)

### Audio

| Format | Bitrate | Poids max |
|--------|---------|-----------|
| MP3 | 192-320 kbps | 10MB |
| OGG | 192 kbps | 10MB (optionnel) |

**Optimisation** :
- Normaliser le volume à -14 LUFS
- Fade in/out de 0.5s recommandé
- Mono acceptable pour voix seule

### Logos (SVG)

- **Format** : SVG uniquement
- **Optimisation** : Utiliser [SVGOMG](https://jakearchibald.github.io/svgomg/)
- **Couleurs** : Préférer noir ou blanc (colorisation via CSS)
- **Taille** : < 50KB idéalement

---

## 🔄 Workflow d'ajout d'assets

### Ajouter un nouveau projet

1. **Créer le dossier** :
   ```bash
   mkdir -p public/assets/projects/mon-projet/{images,audio}
   ```

2. **Ajouter les images** :
   ```bash
   cp cover.jpg public/assets/projects/mon-projet/images/
   cp thumbnail.jpg public/assets/projects/mon-projet/images/
   ```

3. **Ajouter l'audio** (optionnel) :
   ```bash
   cp track.mp3 public/assets/projects/mon-projet/audio/
   ```

4. **Créer `metadata.json`** (optionnel) :
   ```bash
   cp public/assets/projects/_metadata-template.json \
      public/assets/projects/mon-projet/metadata.json
   # Puis éditer le fichier
   ```

5. **Ajouter dans `/content/projects.json`** :
   ```json
   {
     "id": "mon-projet",
     "title": "Mon Projet",
     "audio": {
       "enabled": true,
       "title": "Mon morceau",
       "files": {
         "mp3": "/assets/projects/mon-projet/audio/track.mp3"
       }
     }
   }
   ```

### Ajouter un logo client

1. **Optimiser le SVG** :
   - Passer par [SVGOMG](https://jakearchibald.github.io/svgomg/)
   - Retirer métadonnées inutiles

2. **Ajouter le fichier** :
   ```bash
   cp client-logo.svg public/assets/clients/logos/
   ```

3. **Ajouter dans `clients.json`** :
   ```json
   {
     "id": "client",
     "name": "Nom du client",
     "logo": {
       "svg": "client-logo.svg",
       "alt": "Logo Client"
     },
     "featured": true,
     "order": 10
   }
   ```

---

## 🔍 Résolution des chemins

### Chemins absolus (recommandé)

```json
{
  "audio": {
    "files": {
      "mp3": "/assets/projects/mon-projet/audio/track.mp3"
    }
  }
}
```

### Chemins relatifs (dans metadata.json)

```json
{
  "audio": {
    "files": {
      "mp3": "track.mp3"
    }
  }
}
```

**Note** : Les chemins relatifs dans `metadata.json` sont automatiquement résolus vers `/assets/projects/[id]/audio/`.

---

## 📖 Documentation complète

- **Système audio** : [/docs/PROJECTS_AUDIO_SYSTEM.md](../../docs/PROJECTS_AUDIO_SYSTEM.md)
- **Types TypeScript** : [/src/types/project.ts](../../src/types/project.ts)
- **Template metadata** : [_metadata-template.json](./_metadata-template.json)

---

## 🐛 Dépannage

### Les images ne s'affichent pas

1. Vérifier les chemins (absolus depuis `/public/`)
2. Vérifier les permissions des fichiers
3. Vérifier la console pour erreurs 404

### L'audio ne se charge pas

1. Vérifier que le fichier existe
2. Vérifier le format (MP3 supporté partout)
3. Tester dans un autre navigateur
4. Voir [PROJECTS_AUDIO_SYSTEM.md](../../docs/PROJECTS_AUDIO_SYSTEM.md#dépannage)

---

**Version** : 1.0.0
**Dernière mise à jour** : Novembre 2024
