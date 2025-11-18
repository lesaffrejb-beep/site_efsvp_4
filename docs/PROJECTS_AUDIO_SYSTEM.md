# 🎵 Système Audio des Projets - Guide Complet

Ce guide explique le nouveau système audio premium intégré aux projets portfolio EfSVP.

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Configuration d'un projet avec audio](#configuration-dun-projet-avec-audio)
4. [Structure des fichiers](#structure-des-fichiers)
5. [API & Modules](#api--modules)
6. [Styles et personnalisation](#styles-et-personnalisation)
7. [Exemples](#exemples)
8. [Dépannage](#dépannage)

---

## Vue d'ensemble

Le système audio permet d'ajouter des lecteurs audio premium aux projets portfolio. Il utilise :

- **WaveSurfer.js** pour la visualisation waveform
- **Design System EfSVP** pour un look cohérent
- **TypeScript** pour la type safety
- **Audio conditionnel** : le player n'apparaît que si audio disponible

### ✨ Fonctionnalités

- ✅ Lecteur audio premium avec waveform
- ✅ Contrôles play/pause, volume
- ✅ Affichage conditionnel (uniquement si fichier audio présent)
- ✅ Responsive mobile
- ✅ Accessible (ARIA, keyboard shortcuts)
- ✅ Loading states et fallbacks
- ✅ Animations GSAP fluides
- ✅ Support dark mode

---

## Architecture

### Fichiers principaux

```
src/
├── components/
│   └── projects/
│       └── ProjectModal.ts          # Modal avec intégration audio
├── scripts/
│   └── modules/
│       ├── audioPlayer.js           # Audio player existant
│       └── projectAudioPlayer.js    # Extension pour projets
├── data/
│   ├── projects.loader.ts           # Chargement projets
│   └── projectsEnricher.ts          # Enrichissement avec metadata
├── types/
│   └── project.ts                   # Types TypeScript
├── schemas/
│   └── project.schema.ts            # Validation Zod
└── styles/
    └── audio-player.css             # Styles audio player

public/
└── assets/
    └── projects/
        ├── _metadata-template.json  # Template de référence
        └── [project-id]/
            ├── metadata.json        # Config projet (optionnel)
            ├── images/              # Images du projet
            └── audio/               # Fichiers audio
```

---

## Configuration d'un projet avec audio

### Méthode 1 : Via `content/projects.json` (centralisé)

Ajoutez le champ `audio` directement dans le JSON central :

```json
{
  "id": "atelier-lacour",
  "title": "Atelier Lacour",
  "year": 2024,
  "sector": "artisanat",
  "audio": {
    "enabled": true,
    "title": "La Forêt Lacour - Concert 25 ans",
    "artist": "EfSVP Studio",
    "duration": 420,
    "files": {
      "mp3": "/assets/projects/atelier-lacour/audio/concert-25ans.mp3",
      "ogg": "/assets/projects/atelier-lacour/audio/concert-25ans.ogg"
    },
    "waveformColor": "var(--color-primary-500)",
    "description": "Enregistrement complet du concert"
  }
}
```

### Méthode 2 : Via `metadata.json` (par projet)

Créez un fichier `/public/assets/projects/[id]/metadata.json` :

```json
{
  "id": "atelier-lacour",
  "audio": {
    "enabled": true,
    "title": "La Forêt Lacour - Concert 25 ans",
    "artist": "EfSVP Studio",
    "duration": 420,
    "files": {
      "mp3": "concert-25ans.mp3"
    },
    "waveformColor": "var(--color-primary-500)"
  }
}
```

**Note** : Les chemins relatifs dans `metadata.json` seront résolus automatiquement vers `/assets/projects/[id]/audio/`.

---

## Structure des fichiers

### Dossier d'un projet avec audio

```
/public/assets/projects/atelier-lacour/
├── metadata.json                    # Configuration (optionnel)
├── images/
│   ├── cover.jpg                   # Image principale (16:9, 1920x1080+)
│   ├── cover@2x.jpg               # Version retina (optionnel)
│   ├── thumbnail.jpg              # Vignette liste (800x600)
│   └── hero.jpg                   # Hero section (2560px+)
└── audio/
    ├── concert-25ans.mp3          # Fichier audio principal
    └── concert-25ans.ogg          # Format alternatif (optionnel)
```

### Format audio recommandé

- **MP3** : 192 kbps minimum, 320 kbps idéal
- **OGG** : Optionnel, pour compatibilité étendue
- **Durée** : Indiquer en secondes dans la config

---

## API & Modules

### `projectAudioPlayer.js`

#### `createProjectAudioPlayer(container, project)`

Crée un lecteur audio pour un projet.

```javascript
import { createProjectAudioPlayer } from '@/scripts/modules/projectAudioPlayer';

const container = document.getElementById('audio-container');
const wavesurfer = createProjectAudioPlayer(container, project);
```

**Paramètres** :
- `container` : HTMLElement où injecter le player
- `project` : Objet projet avec config audio

**Retourne** : Instance WaveSurfer ou `null`

#### `hasProjectAudio(project)`

Vérifie si un projet a de l'audio.

```javascript
import { hasProjectAudio } from '@/scripts/modules/projectAudioPlayer';

if (hasProjectAudio(project)) {
  // Afficher le player
}
```

#### `destroyProjectAudioPlayer(wavesurfer)`

Détruit un lecteur audio.

```javascript
import { destroyProjectAudioPlayer } from '@/scripts/modules/projectAudioPlayer';

destroyProjectAudioPlayer(wavesurfer);
```

### `projectsEnricher.ts`

#### `enrichProject(project)`

Enrichit un projet avec ses metadata.json optionnels.

```typescript
import { enrichProject } from '@/data/projectsEnricher';

const enriched = await enrichProject(project);
```

#### `checkAudioExists(project)`

Vérifie si le fichier audio existe réellement.

```typescript
import { checkAudioExists } from '@/data/projectsEnricher';

const exists = await checkAudioExists(project);
```

---

## Styles et personnalisation

### Variables CSS disponibles

```css
:root {
  --player-height: 80px;
  --player-bg: var(--bg-elevated, #ffffff);
  --player-radius: var(--radius-lg, 12px);
  --player-shadow: var(--shadow-lg, 0 8px 32px rgba(0, 0, 0, 0.08));
  --player-padding: var(--space-6, 1.5rem);
  --player-transition: var(--transition-smooth, 0.3s ease);
}
```

### Personnaliser la couleur de waveform

Dans `projects.json` ou `metadata.json` :

```json
{
  "audio": {
    "waveformColor": "var(--color-success)"
  }
}
```

Couleurs disponibles :
- `var(--color-primary-500)` (défaut, terracotta)
- `var(--color-success)` (vert)
- `var(--color-warning)` (orange)
- `var(--color-info)` (bleu)
- Ou toute couleur hex : `#B8441E`

---

## Exemples

### Exemple complet de projet avec audio

`/public/assets/projects/atelier-lacour/metadata.json` :

```json
{
  "id": "atelier-lacour",
  "title": "Atelier Lacour",
  "client": "Atelier Lacour",
  "year": 2024,
  "location": "Trélazé",
  "status": "delivered",
  "cover": {
    "initials": "AT",
    "gradient": {
      "from": "var(--color-primary-400)",
      "to": "var(--color-primary-700)"
    }
  },
  "shortDescription": "Le récit de la vie de l'Atelier Lacour pour ses 25 ans.",
  "longDescription": [
    "En juillet 2024, Alain Lacour nous commande une suite de morceaux...",
    "Pour réaliser cette commande, nous faisons un récit en métaphore filée..."
  ],
  "category": "concert live",
  "sector": "artisanat",
  "themes": ["Morceau sur mesure", "Anniversaire & transmission"],
  "details": {
    "format": "concert live",
    "duration": "7 minutes",
    "audience": "salariés de l'Atelier Lacour",
    "deliverables": ["Texte", "musique pour un concert live"]
  },
  "team": ["Azan SOULARD", "Jean-Baptiste LESAFFRE", "Arthur CHARRIER"],
  "audio": {
    "enabled": true,
    "title": "La Forêt Lacour - Concert 25 ans",
    "artist": "EfSVP Studio",
    "duration": 420,
    "files": {
      "mp3": "concert-25ans.mp3"
    },
    "waveformColor": "var(--color-primary-500)",
    "description": "Enregistrement complet du concert joué lors des 25 ans"
  }
}
```

### Intégrer dans une page personnalisée

```html
<div id="custom-audio-player"></div>

<script type="module">
import { createProjectAudioPlayer } from '/src/scripts/modules/projectAudioPlayer.js';

const project = {
  id: 'mon-projet',
  audio: {
    enabled: true,
    title: 'Mon morceau',
    artist: 'EfSVP Studio',
    duration: 180,
    files: {
      mp3: '/assets/projects/mon-projet/audio/track.mp3'
    }
  }
};

const container = document.getElementById('custom-audio-player');
createProjectAudioPlayer(container, project);
</script>
```

---

## Dépannage

### L'audio ne s'affiche pas

**Vérifications** :

1. Le champ `audio.enabled` est bien `true`
2. Le fichier MP3 existe à l'emplacement spécifié
3. Le chemin est correct (absolu ou relatif)
4. WaveSurfer.js est bien chargé
5. Pas d'erreurs dans la console

**Debug** :

```javascript
import { hasProjectAudio, checkAudioExists } from '@/scripts/modules/projectAudioPlayer';

console.log('Has audio config:', hasProjectAudio(project));
console.log('Audio file exists:', await checkAudioExists(project));
```

### Le waveform ne s'affiche pas

- Vérifier que le fichier audio est accessible (pas de CORS)
- Tester avec un fichier audio plus court pour debug
- Regarder la console pour les erreurs WaveSurfer

### Le player ne se détruit pas à la fermeture

Vérifier que `destroyProjectAudioPlayer()` est bien appelé dans `ProjectModal.close()`.

### Erreur TypeScript sur le champ `audio`

Relancer le serveur de développement pour recharger les types :

```bash
npm run dev
```

---

## Workflow recommandé

### Ajouter un nouveau projet avec audio

1. **Créer le dossier projet** :
   ```bash
   mkdir -p public/assets/projects/mon-projet/{images,audio}
   ```

2. **Ajouter les fichiers audio** :
   ```bash
   cp mon-audio.mp3 public/assets/projects/mon-projet/audio/
   ```

3. **Créer ou modifier** `content/projects.json` :
   ```json
   {
     "id": "mon-projet",
     "title": "Mon Projet",
     "audio": {
       "enabled": true,
       "title": "Mon morceau",
       "files": {
         "mp3": "/assets/projects/mon-projet/audio/mon-audio.mp3"
       }
     }
   }
   ```

4. **Tester** : Ouvrir la modal du projet, le player doit apparaître.

---

## Support

Pour toute question ou problème :

- **Documentation technique** : `/docs/`
- **Issues GitHub** : [github.com/lesaffrejb-beep/Site_eFsvp_V3/issues](https://github.com/lesaffrejb-beep/Site_eFsvp_V3/issues)
- **Code source** : `/src/scripts/modules/projectAudioPlayer.js`

---

**Version** : 1.0.0
**Dernière mise à jour** : Novembre 2024
**Auteur** : Claude Code pour EfSVP
