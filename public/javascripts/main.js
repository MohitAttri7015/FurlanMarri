function swiper() {
  var swiper = new Swiper(".mySwiper", {
    direction: "horizontal",
    slidesPerView: 2,
    spaceBetween: 0,
    centeredSlides: true,
    speed: 800,
    grabCursor: true,
    simulateTouch: true,
    allowTouchMove: true,
    navigation: {
      nextEl: ".next-btn-1",
      prevEl: ".prev-btn-1"
    }
  });

  var swiper2 = new Swiper(".mySwiper2", {
    slidesPerView: 3,
    spaceBetween: 30,
    navigation: {
      nextEl: ".next-btn-2",
      prevEl: ".prev-btn-2"
    }
  });


  function updateSwiper() {
    var windowWidth = window.innerWidth;
    if (windowWidth < 1000) {
      swiper.params.slidesPerView = 1;
    } else {
      swiper.params.slidesPerView = 2;
    }

    if (windowWidth < 700) {
      swiper2.params.slidesPerView = 1;
    } else if (windowWidth < 1000) {
      swiper2.params.slidesPerView = 2;
    } else {
      swiper2.params.slidesPerView = 3;
    }
    swiper.update();
    swiper2.update();
  }

  window.addEventListener("resize", updateSwiper);
  updateSwiper();
}

function pressAnimation() {
  const logos = document.querySelectorAll("#press-corner img");
  const hoverText = document.getElementById("hoverText");

  console.log("Logos found:", logos.length);

  logos.forEach(logo => {
    logo.addEventListener("mouseenter", () => {
      console.log("Mouse entered:", logo.src);

      const oldH1 = hoverText.querySelector(".active");
      if (oldH1) oldH1.classList.remove("active");

      const newH1 = document.createElement("h1");
      newH1.textContent = logo.dataset.text;
      hoverText.appendChild(newH1);

      setTimeout(() => newH1.classList.add("active"), 50);

      if (oldH1) {
        setTimeout(() => oldH1.remove(), 100);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  swiper();
  pressAnimation();
});
