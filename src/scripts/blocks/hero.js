import { HeroManager } from '../modules/hero.js';
import { CopyEmail } from '../modules/copyEmail.js';
import { KnowledgeVoicePlayer } from '../modules/knowledgeVoice.js';

const HERO_SELECTORS = ['.signature-hero', '.hero', '.efsvp-hero'];

const hasHeroSection = (root = document) => HERO_SELECTORS.some((selector) => root.querySelector(selector));

/**
 * Initialize hero-related behaviours (hero animations, copy email, knowledge voice)
 * @param {Object} context
 * @param {Record<string, any>} context.modules - Registry of instantiated modules
 * @param {Document|HTMLElement} [context.root=document]
 * @returns {Object} Updated context including instantiated modules
 */
export const initHeroBlock = (context = {}) => {
  const { modules = {}, root = document } = context;

  if (!hasHeroSection(root)) {
    return { ...context, modules };
  }

  if (!modules.hero) {
    modules.hero = new HeroManager();
  }

  if (!modules.copyEmail) {
    modules.copyEmail = new CopyEmail();
  }

  if (!modules.knowledgeVoice) {
    const knowledgeVoice = new KnowledgeVoicePlayer();
    knowledgeVoice.init();
    modules.knowledgeVoice = knowledgeVoice;
  }

  return { ...context, modules };
};

export default initHeroBlock;
