const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const animatedText = document.getElementById("animatedText");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const animatedWords = [
  "accessible web experiences",
  "full stack development",
  "customer-focused solutions",
  "collaborative teamwork",
];

let animatedIndex = 0;
let typingIndex = 0;
let isDeleting = false;

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeToggle.querySelector(".theme-toggle__icon").textContent = isDark ? "☀" : "☾";
  themeToggle.querySelector(".theme-toggle__text").textContent = isDark ? "Light" : "Dark";
  localStorage.setItem("theme", theme);
};

const initTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    setTheme(storedTheme);
    return;
  }
  setTheme("dark");
};

const toggleMenu = () => {
  const isOpen = navMenu.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

const closeMenu = () => {
  navMenu.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
};

const typeLoop = () => {
  const currentWord = animatedWords[animatedIndex];
  const visibleText = currentWord.substring(0, typingIndex);
  animatedText.textContent = visibleText;

  if (!isDeleting && typingIndex < currentWord.length) {
    typingIndex += 1;
  } else if (isDeleting && typingIndex > 0) {
    typingIndex -= 1;
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      animatedIndex = (animatedIndex + 1) % animatedWords.length;
    }
  }

  const speed = isDeleting ? 60 : 100;
  const pause = typingIndex === currentWord.length ? 1400 : typingIndex === 0 ? 500 : 0;
  setTimeout(typeLoop, pause || speed);
};

const showError = (field, message) => {
  const errorEl = document.querySelector(`[data-error-for="${field}"]`);
  if (errorEl) {
    errorEl.textContent = message;
  }
};

const clearErrors = () => {
  document.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name) {
    showError("name", "Please enter your name.");
    isValid = false;
  }

  if (!email) {
    showError("email", "Please enter your email.");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (!message) {
    showError("message", "Please enter your message.");
    isValid = false;
  }

  return isValid;
};

menuToggle.addEventListener("click", toggleMenu);
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", closeMenu);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  if (!validateForm()) {
    formStatus.textContent = "Please fix the highlighted fields.";
    return;
  }

  formStatus.textContent = "Thanks! Your message has been sent.";
  contactForm.reset();
});

initTheme();
typeLoop();
