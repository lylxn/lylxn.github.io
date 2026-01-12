const body = document.body;
const toggleBtn = document.getElementById("themeToggle");
const modal = document.getElementById("discordModal");
const closeModal = document.getElementById("closeModal");

/* Audio */
const discordSound = new Audio("discordtheme.mp3");

/* State */
let toggleCount = Number(localStorage.getItem("toggleCount")) || 0;
let discordUnlocked = localStorage.getItem("discordUnlocked") === "true";

/* =====================
   LOAD SAVED THEME
===================== */
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  body.classList.add(savedTheme);
} else {
  body.classList.add("dark"); // default
}

/* =====================
   THEME TOGGLE
===================== */
toggleBtn.addEventListener("click", () => {

  /* Exit Discord theme */
  if (body.classList.contains("discord")) {
    body.classList.remove("discord");
    body.classList.add("dark");

    localStorage.setItem("theme", "dark");
    return;
  }

  /* Normal toggle */
  body.classList.toggle("dark");
  body.classList.toggle("light");

  const currentTheme = body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);

  /* Count toggles until unlock */
  if (!discordUnlocked) {
    toggleCount++;
    localStorage.setItem("toggleCount", toggleCount);
  }

  /* Unlock Discord theme */
  if (toggleCount === 5 && !discordUnlocked) {
    discordUnlocked = true;

    localStorage.setItem("discordUnlocked", "true");
    localStorage.setItem("theme", "discord");

    body.classList.remove("dark", "light");
    body.classList.add("discord");

    discordSound.currentTime = 0;
    discordSound.play();

    modal.classList.add("active");
  }
});

/* =====================
   MODAL CLOSE
===================== */
closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

/* =====================
   HERO IMAGE HANDLING
===================== */
const darkImg = "LylxnPortfolio.png";
const lightImg = "LylxnPortfolioLight.png";
const portfolioImage = document.getElementById("portfolioImage");

function updatePortfolioImage() {
  if (!portfolioImage) return;

  if (document.body.classList.contains("light")) {
    portfolioImage.src = lightImg;
  } else {
    portfolioImage.src = darkImg;
  }
}

window.addEventListener("load", () => {
  updatePortfolioImage();
  setTimeout(() => {
    if (portfolioImage) portfolioImage.classList.add("show");
  }, 500);
});

/* Update whenever theme classes change */
const observer = new MutationObserver(updatePortfolioImage);
observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

/* ensure initial image matches theme */
updatePortfolioImage();

/* =====================
   SCROLL INDICATOR BEHAVIOR
===================== */
const scrollIndicator = document.getElementById('scrollIndicator');
const content = document.getElementById('content');

if (scrollIndicator) {
  // smooth scroll on click and hide
  scrollIndicator.addEventListener('click', (e) => {
    e.preventDefault();
    if (content) content.scrollIntoView({ behavior: 'smooth' });
    scrollIndicator.classList.add('hidden');
  });

  // hide indicator once user scrolls down
  const onScroll = () => {
    if (window.scrollY > 20) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // initial visibility based on scroll position
  if (window.scrollY > 20) scrollIndicator.classList.add('hidden');
}

window.addEventListener('wheel', (e) => {
  // We don't prevent default, we just add a slight "glide" 
  // by adjusting the scroll position smoothly.
  if (e.deltaY !== 0) {
    window.scrollBy({
      top: e.deltaY * 0.5, 
      behavior: 'smooth'
    });
  }
}, { passive: true });

window.onscroll = function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("scrollProgress").style.width = scrolled + "%";
};

const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
