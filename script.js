document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("#navbar a");
  const header = document.querySelector("header");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // ──────────────────────────────────────────────────
      // 1) Manage “active” class
      // ──────────────────────────────────────────────────
      // Clear “active” from all links
      navLinks.forEach((l) => l.classList.remove("active"));
      // If this isn’t the Home link, add “active”
      if (this.getAttribute("href") !== "#home") {
        this.classList.add("active");
      }
      // (If it is "#home", we leave all links un‐highlighted.)

      // ──────────────────────────────────────────────────
      // 2) Smooth‐scroll to the target section
      // ──────────────────────────────────────────────────
      const targetID = this.getAttribute("href"); // e.g. "#courses"
      const targetElement = document.querySelector(targetID);
      if (!targetElement) return;

      // Calculate distance from top of document to the section’s top
      const elementTop =
        targetElement.getBoundingClientRect().top + window.scrollY;
      // Subtract header height so the section isn’t hidden beneath it
      const headerHeight = header.offsetHeight;
      // Calculate 2rem in pixels (assuming default font size, or getComputedStyle)
      const remInPx = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const scrollToPosition = elementTop - headerHeight - 6 * remInPx;
      console.log(`Scrolling to ${targetID} at position ${scrollToPosition}`);

      window.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    });
  });
});

// ① Select the body‐container
const heroContainer = document.querySelector(".hero");

if (heroContainer) {
  // ② On scroll, check how far we've scrolled:
  window.addEventListener("scroll", () => {
    // 1 rem is roughly 16px (assuming default font‐size).
    // You can tweak this threshold if your rem is different.
    const hideThreshold = 16;

    if (window.scrollY >= hideThreshold) {
      heroContainer.classList.add("hidden");
    } else {
      heroContainer.classList.remove("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".course-card");
  if (!cards.length) return;

  // 1) Assign a random “from-*” class to each card and save it in data-direction
  const directions = ["from-left", "from-right", "from-top", "from-bottom"];
  cards.forEach((card) => {
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    card.classList.add(randomDir);
    card.dataset.direction = randomDir; // store it for later
  });

  // 2) Intersection Observer: toggle .in-view on entry/exit
  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% visible
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      const dirClass = card.dataset.direction;

      if (entry.isIntersecting) {
        // 2a) When the card enters view: remove its from-* class, add in-view
        card.classList.remove(dirClass);
        card.classList.add("in-view");
      } else {
        // 2b) When the card exits view: remove in-view, reapply from-* class
        card.classList.remove("in-view");
        card.classList.add(dirClass);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  cards.forEach((card) => observer.observe(card));
});

document.addEventListener("DOMContentLoaded", () => {
  // 1) Hero Image Radial Reveal
  const heroImageContainer = document.querySelector(".hero-image");
  if (heroImageContainer) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    observer.observe(heroImageContainer);
  }

  // 2) Course Card Scroll Animations (unchanged from before)
  const courseCards = document.querySelectorAll(".course-card");
  if (courseCards.length) {
    const directions = ["from-left", "from-right", "from-top", "from-bottom"];
    courseCards.forEach((card) => {
      const randomDir =
        directions[Math.floor(Math.random() * directions.length)];
      card.classList.add(randomDir);
      card.dataset.direction = randomDir;
    });

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target;
          const dirClass = card.dataset.direction;
          if (entry.isIntersecting) {
            card.classList.remove(dirClass);
            card.classList.add("in-view");
          } else {
            card.classList.remove("in-view");
            card.classList.add(dirClass);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    courseCards.forEach((card) => cardObserver.observe(card));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // 1) Compute tomorrow’s date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 2) Format as "Month Day, Year" (e.g. "June 16, 2025")
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = tomorrow.toLocaleDateString("en-US", options);

  // 3) Replace "Tomorrow" in each .live-date
  document.querySelectorAll(".live-date").forEach((el) => {
    // The original text is "Tomorrow • [time]"
    // We split on the bullet (•) and then rejoin with our formatted date.
    const parts = el.textContent.split("•").map((p) => p.trim());
    if (parts.length >= 2) {
      const timePart = parts[1]; // e.g. "6:00 PM IST"
      el.textContent = `${formatted} • ${timePart}`;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────────────────
  // 1) Hide‐on‐scroll & Nav‐active at 75% visibility (excluding "home")
  // ────────────────────────────────────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#navbar a");

  function onScrollHandler() {
    const viewportHeight = window.innerHeight;
    let anyActive = false;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const sectionHeight = rect.height;

      // 1a) Hide section if fully scrolled past (bottom < 0)
      if (rect.bottom < 0) {
        sec.classList.add("hidden-section");
      } else {
        sec.classList.remove("hidden-section");
      }

      // 1b) Compute visible ratio
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = visibleBottom - visibleTop;
      const visibleRatio = visibleHeight / sectionHeight;

      // 1c) If ≥75% visible and not the "home" section, mark matching nav link active
      if (sec.id !== "home" && visibleRatio >= 0.75) {
        anyActive = true;
        navLinks.forEach((lnk) => lnk.classList.remove("active"));
        const targetLink = document.querySelector(
          `#navbar a[href="#${sec.id}"]`
        );
        if (targetLink) targetLink.classList.add("active");
      }
    });

    // 1d) If no non-home section ≥75% visible, clear all active states
    if (!anyActive) {
      navLinks.forEach((lnk) => lnk.classList.remove("active"));
    }
  }

  window.addEventListener("scroll", onScrollHandler, { passive: true });
  onScrollHandler();

  // ────────────────────────────────────────────────────────────────────────────
  // 2) Nav‐link click: set active except for "home"
  // ────────────────────────────────────────────────────────────────────────────
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((lnk) => lnk.classList.remove("active"));
      if (link.getAttribute("href") !== "#home") {
        link.classList.add("active");
      }
      // default anchor scroll behavior runs afterward
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // 3) Hamburger toggle & close‐on‐link‐click (mobile menu)
  // ────────────────────────────────────────────────────────────────────────────
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.getElementById("navbar");

  if (!hamburger || !navbar) {
    console.warn("Hamburger or navbar element not found.");
    return;
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navbar.classList.toggle("open");
  });

  document.querySelectorAll("#navbar a").forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger.classList.contains("open")) {
        hamburger.classList.remove("open");
        navbar.classList.remove("open");
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────────────────
  // 1) Hide‐on‐scroll & Nav‐active by “marker-line” at 25% down the viewport
  // ────────────────────────────────────────────────────────────────────────────
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll("#navbar a"));

  function onScrollHandler() {
    const viewportHeight = window.innerHeight;
    const markerY = viewportHeight * 0.25; // 25% from top
    let activeFound = false;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();

      // 1a) Hide section if fully scrolled past (bottom < 0)
      if (rect.bottom < 0) {
        sec.classList.add("hidden-section");
      } else {
        sec.classList.remove("hidden-section");
      }

      // 1b) If this is not “home” and it straddles the marker line,
      //     mark its link active.
      if (sec.id !== "home" && rect.top <= markerY && rect.bottom >= markerY) {
        activeFound = true;
        const targetLink = document.querySelector(
          `#navbar a[href="#${sec.id}"]`
        );
        navLinks.forEach((lnk) => lnk.classList.remove("active"));
        if (targetLink) targetLink.classList.add("active");
      }
    });

    // 1c) If no non-home section crosses the marker line, clear active states
    if (!activeFound) {
      navLinks.forEach((lnk) => lnk.classList.remove("active"));
    }
  }

  // Attach scroll listener
  window.addEventListener("scroll", onScrollHandler, { passive: true });
  // Run once on load in case page is already scrolled
  onScrollHandler();

  // ────────────────────────────────────────────────────────────────────────────
  // 2) Nav-link click: immediately set “active” (unless it’s “#home”)
  // ────────────────────────────────────────────────────────────────────────────
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((lnk) => lnk.classList.remove("active"));
      if (link.getAttribute("href") !== "#home") {
        link.classList.add("active");
      }
      // Default anchor scroll behavior still runs afterward
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // 3) Hamburger toggle & close-on-link-click (mobile menu)
  // ────────────────────────────────────────────────────────────────────────────
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.getElementById("navbar");
  if (!hamburger || !navbar) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navbar.classList.toggle("open");
  });

  document.querySelectorAll("#navbar a").forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger.classList.contains("open")) {
        hamburger.classList.remove("open");
        navbar.classList.remove("open");
      }
    });
  });
});
