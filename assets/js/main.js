const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const reviewCarousel = document.querySelector("[data-review-carousel]");
if (reviewCarousel) {
  const slides = [...reviewCarousel.querySelectorAll(".review-slide")];
  const dotsWrap = reviewCarousel.querySelector(".review-dots");
  const previous = reviewCarousel.querySelector("[data-review-prev]");
  const next = reviewCarousel.querySelector("[data-review-next]");
  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

  const dots = slides.map((_, index) => {
    const dot = document.createElement("span");
    dot.className = "review-dot";
    dot.dataset.index = String(index);
    dotsWrap?.append(dot);
    return dot;
  });

  const showReview = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === current));
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === current));
  };

  previous?.addEventListener("click", () => showReview(current - 1));
  next?.addEventListener("click", () => showReview(current + 1));
  dots.forEach((dot) => dot.addEventListener("click", () => showReview(Number(dot.dataset.index))));
  showReview(current);
  window.setInterval(() => showReview(current + 1), 5000);
}

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const buttons = [...tabs.querySelectorAll("[data-tab-button]")];
  const panels = [...tabs.querySelectorAll("[data-tab-panel]")];
  if (!buttons.length || !panels.length) return;

  const activateTab = (button, shouldFocus = false) => {
    const panelId = button.getAttribute("aria-controls");
    buttons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });

    if (shouldFocus) button.focus();
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateTab(button));
    button.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = buttons.length - 1;
      if (nextIndex === index && !["Home", "End"].includes(event.key)) return;

      event.preventDefault();
      activateTab(buttons[nextIndex], true);
    });
  });

  activateTab(buttons.find((button) => button.getAttribute("aria-selected") === "true") || buttons[0]);
});

const emailForm = document.querySelector("[data-email-form]");
if (emailForm) {
  const status = emailForm.querySelector("[data-form-status]");
  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(emailForm);
    const email = String(formData.get("email") || "").trim();
    const firstName = String(formData.get("first_name") || "").trim();
    const lastName = String(formData.get("last_name") || "").trim();
    const privacy = formData.get("privacy");

    if (!firstName || !lastName || !email || !privacy) {
      if (status) {
        status.textContent = "Please add your name, email, and privacy agreement before submitting.";
        status.classList.add("error");
      }
      return;
    }

    const lines = [
      "New consultation request from ajt-accounting.com",
      "",
      `Name: ${firstName} ${lastName}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Email: ${email}`,
      `Service: ${formData.get("service") || ""}`,
      `Referral source: ${formData.get("source") || ""}`,
      "",
      "Accounting needs:",
      `${formData.get("message") || ""}`,
    ];
    const subject = encodeURIComponent(`Consultation request from ${firstName} ${lastName}`);
    const body = encodeURIComponent(lines.join("\n"));

    if (status) {
      status.textContent = "Opening an email addressed to AJT Accounting with your form details.";
      status.classList.remove("error");
    }
    window.location.href = `mailto:ataylor@ajt-accounting.com?subject=${subject}&body=${body}`;
  });
}
