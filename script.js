document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const navbar = document.getElementById("navbar");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelectorAll("#navbar a");

  // 1. Scroll Effect on Header
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 0);
    });
  }

  // 2. Hamburger Menu Toggle (Mobile)
  if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      navbar.classList.toggle("open", isOpen);
    });

    // Optional: Close nav when clicking outside
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("open");
        navbar.classList.remove("open");
      }
    });
  }

  // 3. Smooth Scrolling + Close Mobile Nav
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetID = link.getAttribute("href");
      const target = document.querySelector(targetID);
      if (!target) return;

      const headerHeight = header ? header.offsetHeight : 0;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: targetY, behavior: "smooth" });

      setTimeout(() => {
        hamburger?.classList.remove("open");
        navbar?.classList.remove("open");
      }, 300);

      navLinks.forEach((l) => l.classList.remove("active"));
      if (targetID !== "#home") link.classList.add("active");
    });
  });

  // 4. Section Scroll Tracking
  const sections = document.querySelectorAll("section[id]");
  const trackSectionInView = () => {
    const markerY = window.innerHeight * 0.25;
    let matched = false;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const link = document.querySelector(`#navbar a[href="#${section.id}"]`);

      if (rect.top <= markerY && rect.bottom >= markerY) {
        navLinks.forEach((l) => l.classList.remove("active"));
        if (link) link.classList.add("active");
        matched = true;
      }
    });

    if (!matched) {
      navLinks.forEach((l) => l.classList.remove("active"));
    }
  };

  window.addEventListener("scroll", trackSectionInView, { passive: true });
  trackSectionInView();

  // 5. Hero Image Reveal Animation
  const heroImage = document.querySelector(".hero-image");
  if (heroImage) {
    const heroObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    heroObserver.observe(heroImage);
  }

  // 6. Animate Course Cards
  const courseCards = document.querySelectorAll(".course-card");
  const directions = ["from-left", "from-right", "from-top", "from-bottom"];

  courseCards.forEach((card) => {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    card.classList.add(dir);
    card.dataset.direction = dir;
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      const dir = card.dataset.direction;
      if (entry.isIntersecting) {
        card.classList.remove(dir);
        card.classList.add("in-view");
      } else {
        card.classList.remove("in-view");
        card.classList.add(dir);
      }
    });
  }, { threshold: 0.1 });

  courseCards.forEach((card) => cardObserver.observe(card));

  // 7. Replace "Tomorrow" with Actual Date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatted = tomorrow.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.querySelectorAll(".live-date").forEach((el) => {
    const parts = el.textContent.split("•");
    if (parts.length === 2) {
      el.textContent = `${formatted} • ${parts[1].trim()}`;
    }
  });
});
