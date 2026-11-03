document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("main-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const opened = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!opened));
      toggle.setAttribute("aria-label", opened ? "Abrir menu" : "Fechar menu");
      menu.classList.toggle("is-open", !opened);
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
      }
    });
  }
  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
});