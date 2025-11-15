/**
 * FAQ Module - Accordion interaction
 * Améliorations accessibilité ARIA
 */
export class FAQ {
  constructor() {
    this.items = document.querySelectorAll('.faq__item, .faq-item');
    this.init();
  }

  init() {
    if (this.items.length === 0) return;

    this.items.forEach((item, index) => {
      const question =
        item.querySelector('.faq__question') || item.querySelector('.faq-item__question');
      const answer =
        item.querySelector('.faq__answer') || item.querySelector('.faq-item__answer');

      if (!question || !answer) return;

      // Générer des IDs uniques pour aria-controls
      const answerId = `faq-answer-${index}`;
      answer.id = answerId;
      question.setAttribute('aria-controls', answerId);

      // Ajouter rôle region pour le contenu
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-labelledby', `faq-question-${index}`);
      question.id = `faq-question-${index}`;

      question.addEventListener('click', () => {
        this.toggleItem(item, question);
      });

      // Support clavier (Enter & Space)
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleItem(item, question);
        }
      });
    });
  }

  toggleItem(item, question) {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';

    // Close other items (optional - remove if you want multiple open)
    this.items.forEach((otherItem) => {
      if (otherItem !== item) {
        const otherQuestion =
          otherItem.querySelector('.faq__question') ||
          otherItem.querySelector('.faq-item__question');
        if (otherQuestion) {
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
        otherItem.classList.remove('is-open');
      }
    });

    // Toggle current item
    question.setAttribute('aria-expanded', !isExpanded);
    if (!isExpanded) {
      item.classList.add('is-open');
    } else {
      item.classList.remove('is-open');
    }
  }
}
