/**
 * LabelX Studio — main.js
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ─── SERVICES LOGIC FOR INDEX PAGE ─── */
  const serviceRows = document.querySelectorAll('.service-row');
  
  if (serviceRows.length > 0) {
    serviceRows.forEach((row) => {
      const header = row.querySelector('.service-header');
      if (header) {
        header.addEventListener('click', () => {
          const isActive = row.classList.contains('active');
          
          // Optionally close others
          serviceRows.forEach(r => {
            r.classList.remove('active');
            const icon = r.querySelector('.service-icon');
            if (icon) icon.textContent = '+';
          });
          
          if (!isActive) {
            row.classList.add('active');
            const icon = row.querySelector('.service-icon');
            if (icon) icon.textContent = '-';
          }
        });
      }
    });
  }

  /* ─── FORM HANDLING ─── */
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.textContent : 'Submit';
      const action = form.getAttribute('action');

      if (btn) {
        btn.textContent = 'Submitting...';
        btn.disabled = true;
      }

      // If form is hooked to an external service (web3forms, formspree, formsubmit)
      if (action && (action.includes('web3forms.com') || action.includes('formspree.io') || action.includes('formsubmit.co'))) {
        try {
          let endpoint = action;
          if (action.includes('formsubmit.co') && !action.includes('/ajax/')) {
            endpoint = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            body: new FormData(form),
            headers: {
              'Accept': 'application/json'
            }
          });

          const data = await response.json().catch(() => ({}));

          const isSuccess = response.ok && (
            data.success === true ||
            data.success === "true" ||
            data.ok === true ||
            (!('success' in data) && !('error' in data))
          );

          if (isSuccess) {
            if (btn) btn.textContent = 'Success! Message Sent';
            form.reset();
          } else {
            const msg = data.message || data.error || 'Server rejected submission';
            console.error('Submission error response:', msg, data);
            alert(`Submission issue: ${msg}`);
            throw new Error(msg);
          }
        } catch (error) {
          console.error('Submission network error:', error);
          if (btn) btn.textContent = 'Failed - Try Again';
        } finally {
          setTimeout(() => {
            if (btn) {
              btn.textContent = originalText;
              btn.disabled = false;
            }
          }, 4000);
        }
        return;
      }

      // Fallback animation for other mock forms
      setTimeout(() => {
        if (btn) btn.textContent = 'Success!';
        setTimeout(() => {
          if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
          }
          form.reset();
        }, 2000);
      }, 1000);
    });
  });
  /* ─── HERO SLIDESHOW LOGIC ─── */
  const heroImg = document.getElementById('hero-slideshow-img');
  if (heroImg) {
    let images = [];
    const dataImages = heroImg.getAttribute('data-images');
    if (dataImages) {
      images = dataImages.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      images = [
        'assets/images/landing_page_img6.jpeg',
        'assets/images/landing_page_img1.jpeg',
        'assets/images/landing_page_img2.jpeg',
        'assets/images/landing_page_img3.jpeg',
        'assets/images/landing_page_img5.jpeg',
        'assets/images/landing_page_img7.jpeg'
      ];
    }
    let currentIndex = 0;
    let timerId = null;
    let isPaused = false;
    let isFirstRun = true;

    // Preload images for smooth instant swapping (flipbook effect)
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const runSlideshow = () => {
      if (isPaused) return;
      
      // 1st image stays longer only on the very first run
      const duration = isFirstRun ? 1500 : 150; 
      isFirstRun = false;

      timerId = setTimeout(() => {
        if (isPaused) return;
        
        currentIndex = (currentIndex + 1) % images.length;
        heroImg.src = images[currentIndex];
        
        // Schedule next image
        runSlideshow();
      }, duration);
    };

    const startSlideshow = () => {
      isPaused = false;
      runSlideshow();
    };

    const stopSlideshow = () => {
      isPaused = true;
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    };

    // Remove CSS transition to ensure a crisp, instant frame swap
    heroImg.style.transition = 'none';
    
    // Start slideshow initially
    startSlideshow();

    // Pause on hover
    heroImg.addEventListener('mouseenter', stopSlideshow);
    heroImg.addEventListener('mouseleave', startSlideshow);
  }

  /* ─── SCROLL ANIMATIONS ─── */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.why-labelx').forEach(el => {
    observer.observe(el);
  });
  /* ─── WORK CARDS INTERACTIVITY ─── */
  const workCards = document.querySelectorAll('.work-card');
  if (workCards.length > 0) {
    let currentMaxZIndex = 10;
    
    workCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      
      card.addEventListener('click', () => {
        currentMaxZIndex++;
        card.style.zIndex = currentMaxZIndex;
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '-15px 15px 30px rgba(0,0,0,0.15)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '-10px 0 20px rgba(0,0,0,0.1)';
      });
    });
  }
});

// Mobile Menu Toggle and Nav Scroll Behavior
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  /* ─── MOBILE NAV SCROLL BEHAVIOR ─── */
  const nav = document.querySelector('.main-nav');
  let lastScrollY = window.scrollY;

  if (nav) {
    window.addEventListener('scroll', () => {
      // Only apply this behavior on mobile view (max-width: 768px)
      if (window.innerWidth <= 768) {
        const currentScrollY = window.scrollY;
        
        // Hide if scrolling down and past the header height, show if scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
      } else {
        // Ensure nav is visible on desktop if window is resized
        nav.style.transform = 'translateY(0)';
      }
    }, { passive: true });
  }
});
