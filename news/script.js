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
// Commented out - portfolio image handling not needed for newsletter page
// const darkImg = "LylxnPortfolio.png";
// const lightImg = "LylxnPortfolioLight.png";
// const portfolioImage = document.getElementById("portfolioImage");

// function updatePortfolioImage() {
//   if (!portfolioImage) return;

//   if (document.body.classList.contains("light")) {
//     portfolioImage.src = lightImg;
//   } else {
//     portfolioImage.src = darkImg;
//   }
// }

// window.addEventListener("load", () => {
//   updatePortfolioImage();
//   setTimeout(() => {
//     if (portfolioImage) portfolioImage.classList.add("show");
//   }, 500);
// });

// /* Update whenever theme classes change */
// const observer = new MutationObserver(updatePortfolioImage);
// observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

// /* ensure initial image matches theme */
// updatePortfolioImage();

/* =====================
   SCROLL INDICATOR BEHAVIOR
===================== */
// Commented out - scrollIndicator element not present in newsletter page
// const scrollIndicator = document.getElementById('scrollIndicator');
// const content = document.getElementById('content');

// if (scrollIndicator) {
//   // smooth scroll on click and hide
//   scrollIndicator.addEventListener('click', (e) => {
//     e.preventDefault();
//     if (content) content.scrollIntoView({ behavior: 'smooth' });
//     scrollIndicator.classList.add('hidden');
//   });

//   // hide indicator once user scrolls down
//   const onScroll = () => {
//     if (window.scrollY > 20) {
//       scrollIndicator.classList.add('hidden');
//     } else {
//       scrollIndicator.classList.remove('hidden');
//     }
//   };

//   window.addEventListener('scroll', onScroll, { passive: true });

//   // initial visibility based on scroll position
//   if (window.scrollY > 20) scrollIndicator.classList.add('hidden');
// }

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

// Lenis smooth scrolling library - commented out as it's not included
// const lenis = new Lenis();
// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);

/* =====================
   CONTENT PROCESSOR
===================== */
/**
 * Processes post content to convert markdown-style elements to HTML
 * @param {string} content - Raw content with markdown elements
 * @returns {string} - Processed HTML content
 */
function processPostContent(content) {
  if (!content) return '';

  // Convert code blocks: language```code```
  content = content.replace(/(\w+)\s*```([\s\S]*?)```/g, (match, language, code) => {
    // Trim whitespace and handle line breaks
    code = code.trim();
    return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
  });

  // Convert inline code: `code`
  content = content.replace(/`([^`\n]+)`/g, (match, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // Convert image embeds: ![alt](url) - embedded images
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    return `<img src="${url}" alt="${alt}" loading="lazy">`;
  });

  // Convert linked images: [image](url) - clickable images that open in new tab
  content = content.replace(/\[image\]\(([^)]+)\)/g, (match, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="media-link"><img src="${url}" alt="Linked Image" loading="lazy" style="max-width: 100%; cursor: pointer;"></a>`;
  });

  // Convert video embeds: [video](url) - embedded videos
  content = content.replace(/\[video\]\(([^)]+)\)/g, (match, url) => {
    return `<video controls><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
  });

  // Convert linked videos: [video-link](url) - clickable video links
  content = content.replace(/\[video-link\]\(([^)]+)\)/g, (match, url) => {
    const filename = url.split('/').pop().split('?')[0] || 'Video';
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="media-link video-link"><div class="video-link-container"><div class="video-icon">▶️</div><span>${filename}</span></div></a>`;
  });

  // Auto-detect video files (embedded)
  content = content.replace(/(https?:\/\/[^\s]+\.(mp4|webm|ogg|mov|avi|m4v|flv|wmv|3gp|mpg|mpeg))(\s|$)/gi, (match, url) => {
    const extension = url.split('.').pop().toLowerCase();
    let mimeType = 'video/mp4';
    if (extension === 'webm') mimeType = 'video/webm';
    else if (extension === 'ogg') mimeType = 'video/ogg';
    else if (extension === 'mov') mimeType = 'video/quicktime';
    else if (extension === 'avi') mimeType = 'video/x-msvideo';
    return `<video controls style="max-width: 100%;"><source src="${url}" type="${mimeType}">Your browser does not support the video tag.</video>`;
  });

  // Auto-detect image files (embedded)
  content = content.replace(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico))(\s|$)/gi, (match, url) => {
    return `<img src="${url}" alt="Embedded Image" loading="lazy" style="max-width: 100%;">`;
  });

  // Convert YouTube embeds: [youtube](url) or direct YouTube URLs
  content = content.replace(/\[youtube\]\(([^)]+)\)/g, (match, url) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return match;
  });

  // Auto-detect YouTube URLs (more robust pattern)
  content = content.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi, (match, videoId) => {
    if (videoId && videoId.length === 11) {
      return `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return match;
  });

  // Also handle YouTube URLs with watch?v= format
  content = content.replace(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]{11})[^&\s]*/gi, (match, videoId) => {
    if (videoId && videoId.length === 11) {
      return `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return match;
  });

  // Convert links: [text](url)
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  // Convert line breaks to paragraphs (simple approach)
  content = content.replace(/\n\n+/g, '</p><p>');
  content = '<p>' + content + '</p>';
  content = content.replace(/<p><\/p>/g, '');

  return content;
}

/**
 * Escapes HTML entities in code content
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not found
 */
function extractYouTubeId(url) {
  // Clean the URL first
  url = url.trim();

  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*[?&]v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }
  return null;
}

/* =====================
   SYNTAX HIGHLIGHTING
===================== */
window.addEventListener('load', () => {
  // Process all post content
  const postContents = document.querySelectorAll('.post-content');
  postContents.forEach(contentElement => {
    const rawContent = contentElement.textContent || contentElement.innerHTML;
    contentElement.innerHTML = processPostContent(rawContent);
  });

  // Apply Prism.js syntax highlighting
  setTimeout(() => {
    if (typeof Prism !== 'undefined') {
      const codeElements = document.querySelectorAll('code[class*="language-"]');
      codeElements.forEach(code => {
        Prism.highlightElement(code);
      });
    }
  }, 100);
});

/* =====================
   NEWSLETTER SIGNUP
===================== */
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('emailInput');
const signupMessage = document.getElementById('signupMessage');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Store email in localStorage (you can modify this to send to a server/API)
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    
    if (subscribers.includes(email)) {
      showMessage('You are already subscribed!', 'error');
      return;
    }
    
    subscribers.push(email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    
    showMessage('Successfully subscribed! Thank you for signing up.', 'success');
    emailInput.value = '';
    
    // Optional: Log subscriber email (you can replace this with API call)
    console.log('New subscriber:', email);
  });
}

function showMessage(text, type) {
  if (!signupMessage) return;
  
  signupMessage.textContent = text;
  signupMessage.className = `signup-message ${type}`;
  signupMessage.classList.add('show');
  
  // Hide message after 5 seconds
  setTimeout(() => {
    signupMessage.classList.remove('show');
  }, 5000);
}

/* =====================
   EASTER EGG (Bottom of Page)
===================== */
function initEasterEgg() {
  const easterEggModal = document.getElementById('easterEggModal');
  const closeEasterEgg = document.getElementById('closeEasterEgg');
  let easterEggTriggered = false;

  // Close easter egg modal
  if (closeEasterEgg) {
    closeEasterEgg.addEventListener('click', () => {
      if (easterEggModal) {
        easterEggModal.classList.remove('active');
      }
    });
  }

  // Close on outside click
  if (easterEggModal) {
    easterEggModal.addEventListener('click', (e) => {
      if (e.target === easterEggModal) {
        easterEggModal.classList.remove('active');
      }
    });
  }

  // Check if we have 5+ posts by counting .post-card elements
  function checkEasterEggCondition() {
    const postCards = document.querySelectorAll('.post-card');
    return postCards.length >= 5;
  }

  // Scroll detection for easter egg
  function handleScroll() {
    // Only trigger if we have 5+ posts and haven't triggered yet
    if (!checkEasterEggCondition() || easterEggTriggered) return;

    // Check if user has scrolled to bottom (within 100px)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 100) {
      easterEggTriggered = true;
      if (easterEggModal) {
        easterEggModal.classList.add('active');

        // Store in localStorage so it doesn't trigger again in this session
        sessionStorage.setItem('easterEggTriggered', 'true');
      }
    }
  }

  // Check if already triggered in this session
  if (sessionStorage.getItem('easterEggTriggered') === 'true') {
    easterEggTriggered = true;
  }

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Also check on initial load in case page is already at bottom
  setTimeout(handleScroll, 500);
}

// Initialize easter egg when page loads
window.addEventListener('load', initEasterEgg);