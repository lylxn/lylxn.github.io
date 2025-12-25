const body = document.body;
const toggleBtn = document.getElementById("themeToggle");
const modal = document.getElementById("discordModal");
const closeModal = document.getElementById("closeModal");

let toggleCount = 0;
let discordUnlocked = false;

/* Start in dark */
body.classList.add("dark");

/* Sound */
const discordSound = new Audio("discordtheme.mp3");

/* Theme toggle logic */
toggleBtn.addEventListener("click", () => {

  /* Exit Discord theme */
  if (body.classList.contains("discord")) {
    body.classList.remove("discord");
    body.classList.add("dark");
    return;
  }

  /* Toggle normal themes */
  body.classList.toggle("dark");
  body.classList.toggle("light");

  if (!discordUnlocked) toggleCount++;

  /* Unlock Discord */
  if (toggleCount === 5 && !discordUnlocked) {
    discordUnlocked = true;

    body.classList.remove("dark", "light");
    body.classList.add("discord");

    discordSound.currentTime = 0;
    discordSound.play();

    modal.classList.add("active");
  }
});

/* Close modal */
closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});
