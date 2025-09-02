function swiper2() {
  var swiper3 = new Swiper(".mySwiper3", {
    direction: "horizontal",
    speed: 800,
    slidesPerView: 3,
    spaceBetween: 30,
    grabCursor: true,
    simulateTouch: true,
    allowTouchMove: true,
    navigation: {
      nextEl: ".next-btn-3",
      prevEl: ".prev-btn-3"
    }
  });


  var swiper4 = new Swiper(".mySwiper4", {
    direction: "horizontal",
    speed: 800,
    slidesPerView: 3,
    spaceBetween: 30,
    grabCursor: true,
    simulateTouch: true,
    allowTouchMove: true,
    navigation: {
      nextEl: ".next-btn-4",
      prevEl: ".prev-btn-4"
    }
  });

  function updateSwiper() {
    var windowWidth = window.innerWidth;
    if (windowWidth < 700) {
      swiper3.params.slidesPerView = 1;
      swiper4.params.slidesPerView = 1;
    } else if (windowWidth < 1000) {
      swiper3.params.slidesPerView = 2;
      swiper4.params.slidesPerView = 2;
    } else {
      swiper3.params.slidesPerView = 3;
      swiper4.params.slidesPerView = 3;
    }
    swiper3.update();
    swiper4.update();
  }

  window.addEventListener("resize", updateSwiper);
  updateSwiper();
}

document.addEventListener("DOMContentLoaded", () => {
  // Only run swiper when DOM is ready
  swiper2();

  const seePictureIcons = document.querySelectorAll(".see-picture");
  const popup = document.getElementById("imagePopup");
  const popupImg = document.getElementById("popupImg");
  const closePopup = document.querySelector(".close-popup");

  seePictureIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
      const img = e.target.closest(".swiper-slide").querySelector("img");
      popupImg.src = img.src; 
      popup.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
    popupImg.src = "";
    document.body.style.overflow = "auto";
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
      popupImg.src = "";
      document.body.style.overflow = "auto";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      popup.style.display = "none";
      popupImg.src = "";
      document.body.style.overflow = "auto";
    }
  });
});








document.querySelectorAll(".see-detail").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    // Get related data from the swiper-slide
    const slide = btn.closest(".swiper-slide");
    const img = slide.querySelector("img").src;
    const name = slide.querySelector(".designName").innerText;
    const value = slide.querySelector(".designValue").innerText;
    const desc = slide.querySelector(".design-desc").innerText; 
    const productDesign = document.getElementById("productDesign");

    // Populate sidebar
    document.getElementById("sidebarImage").src = img;
    document.getElementById("sidebarName").innerText = name;
    document.getElementById("sidebarValue").innerText = value;
    document.getElementById("sidebarDesc").innerText = desc;

    // Show sidebar
    document.getElementById("designSidebar").classList.add("active");
    document.body.style.overflow = "hidden";
    productDesign.classList.add("blur");
  });
});

// Close button
document.querySelector("#designSidebar .design-side-bar-close-btn").addEventListener("click", () => {
  const video = document.getElementById("video-container");
  const productDesign = document.getElementById("productDesign");
  document.getElementById("designSidebar").classList.remove("active");
  document.body.style.overflowY = "auto";
  productDesign.classList.remove("blur");
});
