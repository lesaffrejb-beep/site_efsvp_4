/**
 * Form Validator Premium
 * Validation temps réel avec états visuels
 * Accessibilité WCAG AA
 */

import { gsap } from 'gsap';

export class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.fields = new Map();
    this.isSubmitting = false;
    this.submitBtn = null;
    this.successFeedback = null;
    this.defaultButtonLabel = 'Partagez votre histoire';
    this.defaultIconMarkup = '';
    this.feedbackTimeout = null;

    if (!this.form) {
      console.error('FormValidator: form element not provided');
      return;
    }

    this.init();
  }

  init() {
    // Get all fields
    const inputFields = this.form.querySelectorAll('input, textarea, select');

    inputFields.forEach((field) => {
      this.fields.set(field.id || field.name, {
        element: field,
        rules: this.getValidationRules(field),
        errorElement: this.createErrorElement(field),
      });

      // Setup real-time validation
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));

      // Special handling for different input types
      if (field.type === 'email') {
        field.addEventListener(
          'input',
          this.debounce(() => {
            this.validateField(field);
          }, 500)
        );
      }
    });

    // Budget range slider
    this.setupRangeSlider();

    // Textarea auto-grow and counter
    this.setupTextarea();

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.successFeedback = this.form.closest('.contact__card')?.querySelector('.contact__feedback');
    const defaultLabel = this.submitBtn?.querySelector('.btn__text')?.textContent?.trim();
    if (defaultLabel) {
      this.defaultButtonLabel = defaultLabel;
    }

    const defaultIcon = this.submitBtn?.querySelector('.btn__icon');
    if (defaultIcon) {
      this.defaultIconMarkup = defaultIcon.innerHTML;
    }

    if (this.successFeedback) {
      this.successFeedback.hidden = true;
      this.successFeedback.setAttribute('aria-hidden', 'true');
      this.successFeedback.classList.remove('is-visible');
    }
  }

  getValidationRules(field) {
    const rules = [];

    if (field.hasAttribute('required')) {
      rules.push({ type: 'required', message: 'Ce champ est requis.' });
    }

    if (field.type === 'email') {
      rules.push({
        type: 'email',
        message: "Format d'email invalide (ex. nom@entreprise.fr).",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      });
    }

    if (field.pattern) {
      rules.push({
        type: 'pattern',
        message: 'Format invalide. Veuillez vérifier votre saisie.',
        pattern: new RegExp(field.pattern),
      });
    }

    if (field.minLength > 0) {
      rules.push({
        type: 'minLength',
        message: `Minimum ${field.minLength} caractères requis.`,
        value: field.minLength,
      });
    }

    if (field.maxLength > 0) {
      rules.push({
        type: 'maxLength',
        message: `Maximum ${field.maxLength} caractères autorisés.`,
        value: field.maxLength,
      });
    }

    return rules;
  }

  createErrorElement(field) {
    const errorId = `${field.id || field.name}-error`;
    let errorEl = document.getElementById(errorId);

    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.id = errorId;
      errorEl.className = 'form__error';
      errorEl.setAttribute('role', 'alert');
      errorEl.setAttribute('aria-live', 'polite');

      // Insert after field
      const parent = field.closest('.form__group');
      if (parent) {
        parent.appendChild(errorEl);
      }
    }

    // Connect error to field via aria-describedby
    field.setAttribute('aria-describedby', errorId);

    return errorEl;
  }

  validateField(field) {
    const fieldData = this.fields.get(field.id || field.name);
    if (!fieldData) return true;

    const value = field.value.trim();
    const rules = fieldData.rules;

    // Check each rule
    for (const rule of rules) {
      let isValid = true;
      const errorMessage = rule.message;

      switch (rule.type) {
        case 'required':
          isValid = value.length > 0;
          break;

        case 'email':
          isValid = rule.pattern.test(value);
          break;

        case 'pattern':
          isValid = rule.pattern.test(value);
          break;

        case 'minLength':
          isValid = value.length >= rule.value;
          break;

        case 'maxLength':
          isValid = value.length <= rule.value;
          break;
      }

      if (!isValid) {
        this.showError(field, errorMessage);
        return false;
      }
    }

    // All rules passed
    this.showSuccess(field);
    return true;
  }

  showError(field, message) {
    const fieldData = this.fields.get(field.id || field.name);
    if (!fieldData) return;

    const parent = field.closest('.form__group');
    if (parent) {
      parent.classList.add('form__group--error');
      parent.classList.remove('form__group--success');
    }

    field.setAttribute('aria-invalid', 'true');
    field.classList.add('error');

    // Show error message
    const errorEl = fieldData.errorElement;
    errorEl.textContent = message;
    errorEl.style.display = 'block';

    // Animate error
    gsap.fromTo(
      errorEl,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );

    // Shake field
    gsap.fromTo(
      field,
      { x: -10 },
      {
        x: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.3)',
        clearProps: 'x',
      }
    );
  }

  showSuccess(field) {
    const fieldData = this.fields.get(field.id || field.name);
    if (!fieldData) return;

    const parent = field.closest('.form__group');
    if (parent) {
      parent.classList.remove('form__group--error');
      parent.classList.add('form__group--success');
    }

    field.setAttribute('aria-invalid', 'false');
    field.classList.remove('error');

    this.clearError(field);

    // Add checkmark animation
    const checkmark = parent?.querySelector('.form__checkmark');
    if (checkmark) {
      gsap.fromTo(
        checkmark,
        { scale: 0, rotate: -180 },
        { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }

  clearError(field) {
    const fieldData = this.fields.get(field.id || field.name);
    if (!fieldData) return;

    const errorEl = fieldData.errorElement;
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.isSubmitting) return;

    this.hideSuccessFeedback();

    // Validate all fields
    let isValid = true;
    let firstErrorField = null;

    this.fields.forEach((fieldData) => {
      const field = fieldData.element;

      if (!this.validateField(field)) {
        isValid = false;

        if (!firstErrorField) {
          firstErrorField = field;
        }
      }
    });

    if (!isValid) {
      // Focus first error field
      if (firstErrorField) {
        firstErrorField.focus();

        // Scroll to field smoothly
        firstErrorField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      // Shake submit button
      gsap.fromTo(
        this.submitBtn,
        { x: -5 },
        {
          x: 0,
          duration: 0.4,
          ease: 'elastic.out(1, 0.3)',
          repeat: 2,
          yoyo: true,
        }
      );

      return;
    }

    // All valid - proceed with submission
    this.isSubmitting = true;
    this.hideSuccessFeedback();
    this.setButtonState('loading');

    try {
      // Collect form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);

      console.warn('📮 Form data:', data);

      // Simulate API call (replace with real endpoint)
      await this.submitToAPI(data);

      // Success
      this.setButtonState('success');
      this.showSuccessFeedback(data);

      // Reset form
      setTimeout(() => {
        this.form.reset();
        this.resetAllFields();
        this.setButtonState('default');
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);

      this.setButtonState('error');
      this.showErrorToast(error);

      setTimeout(() => {
        this.setButtonState('default');
      }, 2000);
    } finally {
      this.isSubmitting = false;
    }
  }

  async submitToAPI(_data) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, replace with real API call:
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(_data),
    // });
    //
    // if (!response.ok) {
    //   throw new Error('Submission failed');
    // }
    //
    // return response.json();

    // For now, just simulate success
    return { success: true };
  }

  setButtonState(state) {
    if (!this.submitBtn) return;

    const text = this.submitBtn.querySelector('.btn__text');
    const loader = this.submitBtn.querySelector('.btn__loader');
    const icon = this.submitBtn.querySelector('.btn__icon');

    // Reset all
    this.submitBtn.classList.remove('loading', 'success', 'error');
    if (text) text.style.display = '';
    if (loader) loader.style.display = 'none';
    if (icon) icon.style.display = '';

    switch (state) {
      case 'loading':
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
        if (text) text.style.display = 'none';
        if (icon) icon.style.display = 'none';
        if (loader) loader.style.display = 'block';
        break;

      case 'success':
        this.submitBtn.classList.add('success');
        this.submitBtn.disabled = true;
        if (text) text.textContent = 'Envoyé !';
        if (icon) {
          icon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          `;
          icon.style.display = '';
        }
        break;

      case 'error':
        this.submitBtn.classList.add('error');
        this.submitBtn.disabled = false;
        if (text) text.textContent = 'Erreur - Réessayer';
        break;

      case 'default':
      default:
        this.submitBtn.disabled = false;
        if (text) text.textContent = this.defaultButtonLabel;
        if (icon) {
          if (this.defaultIconMarkup) {
            icon.innerHTML = this.defaultIconMarkup;
          } else {
            icon.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            `;
          }
          icon.style.display = '';
        }
        break;
    }
  }

  showSuccessFeedback(data = {}) {
    if (!this.successFeedback) return;

    clearTimeout(this.feedbackTimeout);

    const nameSpan = this.successFeedback.querySelector('[data-feedback-name]');
    if (nameSpan) {
      const firstName = data.nom ? data.nom.trim().split(' ')[0] : '';
      if (firstName) {
        nameSpan.textContent = ` ${firstName}`;
        nameSpan.removeAttribute('hidden');
      } else {
        nameSpan.textContent = '';
        nameSpan.setAttribute('hidden', '');
      }
    }

    this.successFeedback.hidden = false;
    this.successFeedback.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
      this.successFeedback.classList.add('is-visible');
    });

    this.feedbackTimeout = setTimeout(() => {
      this.hideSuccessFeedback();
    }, 8000);
  }

  hideSuccessFeedback() {
    if (!this.successFeedback) return;

    clearTimeout(this.feedbackTimeout);
    this.feedbackTimeout = null;

    this.successFeedback.classList.remove('is-visible');
    this.successFeedback.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      if (this.successFeedback && !this.successFeedback.classList.contains('is-visible')) {
        this.successFeedback.hidden = true;
      }
    }, 250);
  }

  showErrorToast(error) {
    // Show error toast instead of modal with specific message
    const toast = document.createElement('div');
    toast.className = 'error-toast error-toast--visible';
    toast.setAttribute('role', 'alert');

    // Determine specific error message
    let errorMessage = 'Veuillez réessayer dans quelques instants.';
    if (error && error.message) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Envoi impossible (problème réseau). Vérifiez votre connexion et réessayez.';
      } else if (error.message.includes('timeout')) {
        errorMessage = "Délai d'attente dépassé. Réessayez dans quelques minutes.";
      }
    }

    toast.innerHTML = `
      <div class="error-toast__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <div class="error-toast__content">
        <p class="error-toast__title">Erreur d'envoi</p>
        <p class="error-toast__message">${errorMessage}</p>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('error-toast--visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  setupRangeSlider() {
    const slider = this.form.querySelector('.form__range');
    if (!slider) return;

    const output = this.form.querySelector('.form__range-value');
    if (!output) return;

    const updateValue = () => {
      const value = parseInt(slider.value);
      output.textContent = `~${value.toLocaleString('fr-FR')}€`;

      // Update slider gradient
      const percent =
        ((value - parseInt(slider.min)) / (parseInt(slider.max) - parseInt(slider.min))) * 100;
      slider.style.setProperty('--value', `${percent}%`);
    };

    slider.addEventListener('input', updateValue);
    updateValue(); // Initial value
  }

  setupTextarea() {
    const textarea = this.form.querySelector('.form__textarea');
    if (!textarea) return;

    const counter = this.form.querySelector('.form__counter');

    // Auto-grow
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';

      // Update counter
      if (counter) {
        const current = textarea.value.length;
        const max = textarea.maxLength;
        counter.textContent = `${current}/${max}`;

        // Warning when close to max
        if (max && current > max * 0.9) {
          counter.style.color = '#B8441E';
        } else {
          counter.style.color = '';
        }
      }
    });
  }

  resetAllFields() {
    this.fields.forEach((fieldData) => {
      const field = fieldData.element;
      const parent = field.closest('.form__group');

      if (parent) {
        parent.classList.remove('form__group--error', 'form__group--success');
      }

      field.classList.remove('error');
      field.removeAttribute('aria-invalid');

      this.clearError(field);
    });

    // Reset counter
    const counter = this.form.querySelector('.form__counter');
    if (counter) {
      counter.textContent = '0/500';
    }

    // Reset range slider
    const slider = this.form.querySelector('.form__range');
    const output = this.form.querySelector('.form__range-value');
    if (slider && output) {
      slider.value = slider.defaultValue || slider.getAttribute('value');
      output.textContent = `~${parseInt(slider.value).toLocaleString('fr-FR')}€`;
    }
  }

  // Utility: debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public method to validate form programmatically
  validate() {
    let isValid = true;

    this.fields.forEach((fieldData) => {
      if (!this.validateField(fieldData.element)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Cleanup
  destroy() {
    this.fields.clear();
    this.form = null;
  }
}
