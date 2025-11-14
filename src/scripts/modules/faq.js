/**
 * FAQ Module - Accordion interaction
 */
export class FAQ {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    if (this.items.length === 0) return;

    this.items.forEach((item) => {
      const question = item.querySelector('.faq-item__question');
      if (!question) return;

      question.addEventListener('click', () => {
        this.toggleItem(item, question);
      });
    });
  }

  toggleItem(item, question) {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';

    // Close other items (optional - remove if you want multiple open)
    this.items.forEach((otherItem) => {
      if (otherItem !== item) {
        const otherQuestion = otherItem.querySelector('.faq-item__question');
        if (otherQuestion) {
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Toggle current item
    question.setAttribute('aria-expanded', !isExpanded);
  }
}
