/**
 * YOUSEF MANSOUR EMAM — PORTFOLIO INTERACTION ENGINE
 * Lightweight, Vanilla ES6+, High-Performance Data & AI Portfolio Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNeuralCanvas();
  initNavigation();
  initModals();
  initProjectData();
  initClipboard();
  initSocialLinksManager();
  initContactForm();
});

/* ==========================================================================
   1. THEME MANAGEMENT (Dark / Light)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  
  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('ym_theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('ym_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* ==========================================================================
   2. NEURAL NETWORK & DATA PARTICLES CANVAS (Subtle & High-Performance)
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse interaction
  const mouse = { x: null, y: null, radius: 140 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle configuration
  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 1;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
      this.isSignal = Math.random() < 0.25; // Certain particles act as active AI signal pulses
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw(theme) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      if (theme === 'light') {
        ctx.fillStyle = this.isSignal
          ? 'rgba(2, 132, 199, 0.7)'
          : `rgba(71, 85, 105, ${this.baseAlpha})`;
      } else {
        ctx.fillStyle = this.isSignal
          ? 'rgba(0, 210, 255, 0.85)'
          : `rgba(148, 163, 184, ${this.baseAlpha})`;
      }
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Draw neural connections
    const maxDistance = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          if (theme === 'light') {
            ctx.strokeStyle = `rgba(3, 105, 161, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
          }
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw(theme);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. NAVIGATION & SCROLL MANAGEMENT
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section scroll spy
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   4. MODALS LOGIC
   ========================================================================== */
function initModals() {
  // Recruiter Scan Modal
  const btnOpenScan = document.getElementById('btn-open-scan');
  const btnCloseScan = document.getElementById('btn-close-scan');
  const recruiterModal = document.getElementById('recruiter-modal');

  if (btnOpenScan && recruiterModal) {
    btnOpenScan.addEventListener('click', () => openModal(recruiterModal));
  }
  if (btnCloseScan && recruiterModal) {
    btnCloseScan.addEventListener('click', () => closeModal(recruiterModal));
  }

  // Project Detail Modal
  const projectModal = document.getElementById('project-detail-modal');
  const btnCloseProject = document.getElementById('btn-close-project-modal');
  const btnCloseProjectAction = document.getElementById('modal-close-action');

  if (btnCloseProject && projectModal) {
    btnCloseProject.addEventListener('click', () => closeModal(projectModal));
  }
  if (btnCloseProjectAction && projectModal) {
    btnCloseProjectAction.addEventListener('click', () => closeModal(projectModal));
  }

  // Close when clicking outside of modal content
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // ESC key to close any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.show').forEach((modal) => {
        closeModal(modal);
      });
    }
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   5. DETAILED PROJECT DATA & BREAKDOWN MODAL INJECTION
   ========================================================================== */
const projectDatabase = {
  'amazon-order': {
    title: 'Amazon E-commerce Order Status Prediction',
    category: 'Classification & E-commerce Operations',
    tech: 'Python • Pandas • Scikit-learn • Streamlit',
    githubPlaceholder: 'https://github.com/yousef-mansour/amazon-order-status-prediction',
    demoPlaceholder: 'https://amazon-order-status.streamlit.app',
    sections: [
      {
        title: 'Business Problem & Commercial Context',
        content:
          'In high-volume e-commerce ecosystems like Amazon, order cancellations, transit delays, and return fulfillment incur heavy operational losses and erode customer trust. Anticipating an order’s eventual fulfillment state allows logistics managers to proactively resolve stock discrepancies, reallocate courier capacity, and provide automated transparency to shoppers.'
      },
      {
        title: 'Dataset Characteristics',
        content:
          'Real-world structured e-commerce transaction data featuring multi-dimensional order attributes, shipment status records, category hierarchies, courier identifiers, fulfillment methods, and customer geographic markers.'
      },
      {
        title: 'Data Cleaning & Preprocessing',
        content:
          'Handled sparse records, standardized corrupted postal codes, resolved mixed categorical encodings, and addressed skewed distribution anomalies without introducing look-ahead bias.'
      },
      {
        title: 'Exploratory Data Analysis (EDA)',
        content:
          'Investigated high-impact correlation drivers between shipment methods, geographic zones, order value distributions, and eventual fulfillment success vs. cancellation states.'
      },
      {
        title: 'Feature Engineering & Transformation',
        content:
          'Constructed temporal lead features, engineered customer frequency signals, applied one-hot encoding for categorical variables, and normalized numerical magnitudes via robust scaling within a leak-free scikit-learn ColumnTransformer.'
      },
      {
        title: 'Model Development & Comparison',
        content:
          'Trained and evaluated multiple candidate algorithms including Logistic Regression, K-Nearest Neighbors, Decision Trees, Random Forest, and Gradient Boosted Trees (XGBoost) against baseline metrics.'
      },
      {
        title: 'Hyperparameter Tuning & Evaluation',
        content:
          'Conducted systematic cross-validation and hyperparameter grid searches. Evaluated models using precision, recall, F1-score, and confusion matrices to minimize costly false negatives in delayed/cancelled orders.'
      },
      {
        title: 'Pipeline Assembly & Streamlit Deployment',
        content:
          'Bundled the best-performing estimator into an end-to-end inference pipeline and deployed an interactive Streamlit application allowing stakeholders to input simulated order attributes and receive instant status predictions.'
      }
    ]
  },

  'customer-satisfaction': {
    title: 'E-commerce Customer Satisfaction Prediction',
    category: 'Customer Analytics & Retention',
    tech: 'Python • Pandas • Scikit-learn • Streamlit',
    githubPlaceholder: 'https://github.com/yousef-mansour/ecommerce-customer-satisfaction',
    demoPlaceholder: 'https://customer-satisfaction-prediction.streamlit.app',
    sections: [
      {
        title: 'Business Problem & Retention Strategy',
        content:
          'Customer acquisition in competitive markets is expensive; retaining existing buyers is essential. Early identification of dissatisfied transactions enables automated ticket escalation, personalized customer support, and churn prevention before public negative reviews damage the brand.'
      },
      {
        title: 'Dataset Characteristics',
        content:
          'Customer transaction records, historical review scores, delivery duration logs, freight ratios, product categories, and payment type features from genuine e-commerce orders.'
      },
      {
        title: 'Data Cleaning & Preprocessing',
        content:
          'Filtered inconsistent review timestamps, imputed missing payment and delivery records, mapped target satisfaction classes, and verified data integrity across merged relational tables.'
      },
      {
        title: 'Exploratory Data Analysis (EDA)',
        content:
          'Identified that delivery delays and freight-to-price ratios were the primary drivers of negative customer sentiment, while product category and payment installments had secondary influence.'
      },
      {
        title: 'Feature Engineering',
        content:
          'Engineered delta features (estimated delivery vs. actual delivery date), order complexity ratios, customer lifetime transaction indicators, and standardized numerical inputs.'
      },
      {
        title: 'Model Training & Benchmark Comparison',
        content:
          'Evaluated diverse classifiers including Logistic Regression, Support Vector Machines (SVM), Random Forest, and XGBoost to establish baseline performance and stability across classes.'
      },
      {
        title: 'Hyperparameter Tuning & Evaluation',
        content:
          'Optimized class weighting and tree depth parameters using cross-validation to balance recall on unsatisfied customer signals, ensuring operations teams catch at-risk buyers.'
      },
      {
        title: 'Streamlit Deployment Pipeline',
        content:
          'Serialized preprocessing transformers and final tuned model into an end-to-end prediction pipeline wrapped in an interactive Streamlit UI for customer service agent simulation.'
      }
    ]
  },

  'uber-multistage': {
    title: 'Uber Trip Duration & Fare Prediction (Multi-Stage ML System)',
    category: 'Multi-Stage Chained Regression',
    tech: 'Python • Pandas • Scikit-learn • Streamlit',
    githubPlaceholder: 'https://github.com/yousef-mansour/uber-duration-fare-multistage-ml',
    demoPlaceholder: 'https://uber-fare-prediction.streamlit.app',
    sections: [
      {
        title: 'Business Problem & Sequential ML Formulation',
        content:
          'In ride-hailing services, upfront price transparency is vital for riders, but accurate fare estimation fundamentally depends on how long a trip actually takes. You cannot predict fare reliably without first estimating trip duration under varying traffic and distance constraints.'
      },
      {
        title: 'Multi-Stage Architecture Breakdown',
        content:
          'Designed a 2-stage sequential machine learning architecture:\n• Stage 1 Model: Predicts expected Trip Duration based on geographic coordinates, trip distance, pickup time, and day of week.\n• Cascaded Feature Injection: The predicted duration is dynamically passed as a core feature into Stage 2.\n• Stage 2 Model: Uses raw trip attributes + predicted trip duration to output the final Fare Amount.'
      },
      {
        title: 'Data Preprocessing & Spatial Wrangling',
        content:
          'Filtered coordinate outliers, calculated haversine geographical distance metrics, extracted rush-hour temporal flags, and eliminated trips with corrupted fare records or impossible velocities.'
      },
      {
        title: 'Exploratory Data Analysis (EDA)',
        content:
          'Analyzed non-linear relationships between pickup hours, urban congestion slowdowns, trip duration variance, and base fare step-rates across metropolitan zones.'
      },
      {
        title: 'Feature Engineering & Cascaded Feed',
        content:
          'Engineered cyclical hour/day sine-cosine features, distance tiers, and isolated duration estimates. Implemented validation safeguards to prevent cascaded error amplification between stage 1 and stage 2.'
      },
      {
        title: 'Model Comparison & Regressor Tuning',
        content:
          'Benchmarked Linear Regression, K-Nearest Neighbors regressor, Random Forest Regressor, and XGBoost Regressor across both stages, optimizing RMSE and Mean Absolute Error (MAE).'
      },
      {
        title: 'Hyperparameter Tuning & Cascaded Validation',
        content:
          'Conducted cross-validation on both stages in sequence to confirm that the predicted duration maintained high regression fidelity and did not destabilize fare estimation.'
      },
      {
        title: 'Streamlit Interactive Deployment',
        content:
          'Deployed an end-to-end Streamlit web application where users pick start/end coordinates or distance parameters, visually see Stage 1 duration output, and observe how Stage 2 calculates the predicted fare.'
      }
    ]
  }
};

function initProjectData() {
  const modalButtons = document.querySelectorAll('.btn-open-modal');
  const projectModal = document.getElementById('project-detail-modal');

  modalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-modal');
      const project = projectDatabase[projectId];

      if (project && projectModal) {
        document.getElementById('modal-project-title').textContent = project.title;
        document.getElementById('modal-project-cat').textContent = project.category;
        document.getElementById('modal-project-tech').textContent = project.tech;

        // Populate links
        const ghLink = document.getElementById('modal-github-link');
        const demoLink = document.getElementById('modal-demo-link');

        // Check if user has saved custom URLs
        const customGh = localStorage.getItem('ym_github_url') || project.githubPlaceholder;
        const customDemo = localStorage.getItem(`ym_demo_${projectId}`) || project.demoPlaceholder;

        ghLink.href = customGh;
        demoLink.href = customDemo;

        // Build deep-dive content
        const contentContainer = document.getElementById('modal-project-content');
        contentContainer.innerHTML = '';

        project.sections.forEach((sec, idx) => {
          const secEl = document.createElement('div');
          secEl.className = 'deepdive-section';

          const formattedIndex = String(idx + 1).padStart(2, '0');
          secEl.innerHTML = `
            <h4><span class="step-index">Step ${formattedIndex}</span> ${sec.title}</h4>
            <p>${sec.content.replace(/\n/g, '<br>')}</p>
          `;
          contentContainer.appendChild(secEl);
        });

        openModal(projectModal);
      }
    });
  });
}

/* ==========================================================================
   6. CLIPBOARD COPY UTILITIES & TOAST NOTIFICATIONS
   ========================================================================== */
function initClipboard() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast(`Copied to clipboard: ${textToCopy}`);
        });
      }
    });
  });
}

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast-notify');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. SOCIAL & PROFILE LINKS CUSTOMIZER
   Allows Yousef to easily paste his real GitHub & LinkedIn links right on the site
   ========================================================================== */
function initSocialLinksManager() {
  const btnEdit = document.getElementById('btn-edit-socials');
  const editModal = document.getElementById('social-edit-modal');
  const btnClose = document.getElementById('btn-close-social-edit');
  const btnCancel = document.getElementById('btn-cancel-socials');
  const btnSave = document.getElementById('btn-save-socials');

  const inputGh = document.getElementById('input-github-url');
  const inputLi = document.getElementById('input-linkedin-url');
  const inputAmazon = document.getElementById('input-amazon-demo');
  const inputSat = document.getElementById('input-satisfaction-demo');
  const inputUber = document.getElementById('input-uber-demo');

  // Load existing saved links
  applySavedLinks();

  if (btnEdit && editModal) {
    btnEdit.addEventListener('click', () => {
      if (inputGh) inputGh.value = localStorage.getItem('ym_github_url') || '';
      if (inputLi) inputLi.value = localStorage.getItem('ym_linkedin_url') || '';
      if (inputAmazon) inputAmazon.value = localStorage.getItem('ym_demo_amazon-order') || '';
      if (inputSat) inputSat.value = localStorage.getItem('ym_demo_customer-satisfaction') || '';
      if (inputUber) inputUber.value = localStorage.getItem('ym_demo_uber-multistage') || '';
      openModal(editModal);
    });
  }

  if (btnClose) btnClose.addEventListener('click', () => closeModal(editModal));
  if (btnCancel) btnCancel.addEventListener('click', () => closeModal(editModal));

  if (btnSave && editModal) {
    btnSave.addEventListener('click', () => {
      if (inputGh && inputGh.value.trim()) {
        localStorage.setItem('ym_github_url', inputGh.value.trim());
      }
      if (inputLi && inputLi.value.trim()) {
        localStorage.setItem('ym_linkedin_url', inputLi.value.trim());
      }
      if (inputAmazon && inputAmazon.value.trim()) {
        localStorage.setItem('ym_demo_amazon-order', inputAmazon.value.trim());
      }
      if (inputSat && inputSat.value.trim()) {
        localStorage.setItem('ym_demo_customer-satisfaction', inputSat.value.trim());
      }
      if (inputUber && inputUber.value.trim()) {
        localStorage.setItem('ym_demo_uber-multistage', inputUber.value.trim());
      }

      applySavedLinks();
      closeModal(editModal);
      showToast('Profile and demo links updated successfully!');
    });
  }
}

function applySavedLinks() {
  const savedGh = localStorage.getItem('ym_github_url') || 'https://github.com/ym320917-blip';
  const savedLi = localStorage.getItem('ym_linkedin_url');

  // Update Hero Links
  const heroGh = document.getElementById('hero-cta-github');
  const heroLi = document.getElementById('hero-cta-linkedin');
  const socialGh = document.getElementById('social-github-btn');
  const socialLi = document.getElementById('social-linkedin-btn');

  if (savedGh) {
    if (heroGh) heroGh.href = savedGh;
    if (socialGh) socialGh.href = savedGh;
    document.querySelectorAll('.gh-link-anchor').forEach((el) => (el.href = savedGh));
  }
  if (savedLi) {
    if (heroLi) heroLi.href = savedLi;
    if (socialLi) socialLi.href = savedLi;
  }
}

/* ==========================================================================
   8. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    // Prepare mailto link
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - From ${name}`);
    const mailtoBody = encodeURIComponent(
      `Hi Yousef,\n\nName: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${message}\n`
    );
    const mailtoUrl = `mailto:yousef.mansourrr2001@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Open mail client
    window.location.href = mailtoUrl;
    showToast('Opening your email client...');
  });
}
