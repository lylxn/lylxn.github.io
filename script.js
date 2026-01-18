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

