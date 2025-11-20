/**
 * Utilitaire de logging conditionnel pour le développement
 * Les logs ne s'affichent qu'en mode DEV, évitant ainsi la pollution de la console en production
 */

/**
 * Log conditionnel qui n'affiche que pendant le développement
 * @param {...any} args - Arguments à logger
 */
export const devLog = (...args) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};
