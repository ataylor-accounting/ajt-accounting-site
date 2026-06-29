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
