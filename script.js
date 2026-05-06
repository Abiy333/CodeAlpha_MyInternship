const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// Mobile menu toggle
function toggleMenu() {
  const links = document.getElementById("navLinks");
  const burger = document.getElementById("burger");
  links.classList.toggle("open");
  burger.classList.toggle("open");
}

// Close mobile menu on link click
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
    document.getElementById("burger").classList.remove("open");
  });
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
reveals.forEach((el) => observer.observe(el));

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  btn.textContent = "Sending...";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "Message sent ✓";
    btn.style.background = "#3a6b3a";
    e.target.reset();
    setTimeout(() => {
      btn.textContent = "Send message →";
      btn.style.background = "";
      btn.disabled = false;
    }, 3000);
  }, 1200);
}

// Active nav link on scroll
const sections = document.querySelectorAll("[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.style.color =
      a.getAttribute("href") === "#" + current ? "var(--amber)" : "";
  });
});
