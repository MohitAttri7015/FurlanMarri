document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM elements once
    const navbar = document.querySelector("nav");
    const dropdown = document.getElementById("nav-dropdown");
    const menuLink = document.getElementById("menuLink");
    const quoteLink = document.getElementById("quoteLink");
    const menuSection = document.querySelector(".menu-section");
    const quoteSection = document.querySelector(".quote-section");
    const navLinks = document.querySelectorAll(".nav-links");
    const logo = document.querySelector(".logo");
    const menuBtn = document.getElementById("menuBtn");
    const lines  = document.querySelectorAll(".line");

    const menuImg = menuSection.querySelector(".dropdown-img img");
    const quoteImg = quoteSection.querySelector(".dropdown-img img");

    const menuLinks = menuSection.querySelectorAll(".dropdown-link-wrapper a");
    const quoteLinks = quoteSection.querySelectorAll(".dropdown-link-wrapper a");

    const menuImages = [
        "/assests/menu-img-1.jfif",
        "/assests/menu-img-2.jfif",
        "/assests/menu-img-3.jfif",
        "/assests/menu-img-4.jfif"
    ];

    const quoteImages = [
        "/assests/quote-img-1.jfif",
        "/assests/quote-img-2.jfif",
        "/assests/quote-img-3.jfif",
        "/assests/quote-img-4.jfif"
    ];

    let isOpen = false;
    let activeSection = null;

    // Reusable GSAP timeline for dropdown
    const dropdownAnim = gsap.timeline({ paused: true })
        .to(dropdown, { height: "80vh", duration: 0.4, ease: "power2.inOut" });

    function animateHeadings(section) {
        const links = section.querySelectorAll("a");
        gsap.fromTo(links,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
        );
    }

    function openDropdown(section) {
        if (!isOpen) dropdownAnim.play();
        menuSection.style.display = "none";
        quoteSection.style.display = "none";

        section.style.display = "flex";
        navbar.classList.add("change");
        menuLink.classList.add("changebg");
        navLinks.forEach(link => link.classList.add("changClr"));
        logo.classList.add("changeClr");

        animateHeadings(section);
        activeSection = section;
        isOpen = true;

        document.body.style.overflow = "hidden";
    }

    function closeDropdown() {
        dropdownAnim.reverse();
        activeSection = null;
        isOpen = false;
        document.body.style.overflow = "auto";
        if(window.location.pathname !== "/users/SignUp" && window.location.pathname !== "/users/login" && window.location.pathname !== "/users/forgotPassword" && window.location.pathname !== "/cart" && !window.location.pathname.startsWith("/products/productDetail/")){
            if(window.scrollY < 50) {
                navbar.classList.remove("change");
                menuLink.classList.remove("changebg");
                navLinks.forEach(link => link.classList.remove("changClr"));
                logo.classList.remove("changeClr");
            }
        }
    }

    // Toggle logic
    menuLink.addEventListener("click", () =>
        (isOpen && activeSection === menuSection) ? closeDropdown() : openDropdown(menuSection)
    );

    quoteLink.addEventListener("click", () =>
        (isOpen && activeSection === quoteSection) ? closeDropdown() : openDropdown(quoteSection)
    );

    menuBtn.addEventListener("click", () => {
            menuBtn.classList.toggle("active");
            if (menuBtn.classList.contains("active")) {
                openDropdown(menuSection);
            }
            else {
                closeDropdown();
            }
    });


    // Hover image effect (reuse function)
    function setHoverEffect(links, images, imgTag) {
        links.forEach((link, index) => {
            link.addEventListener("mouseenter", () => {
                imgTag.src = images[index];
                imgTag.classList.add("animate-img");
            });
            link.addEventListener("mouseleave", () => {
                imgTag.classList.remove("animate-img");
            });
        });
    }

    setHoverEffect(menuLinks, menuImages, menuImg);
    setHoverEffect(quoteLinks, quoteImages, quoteImg);




    let lastScroll = 0; 
    window.addEventListener("scroll", () => {
        let currentScroll = window.scrollY;

        if (currentScroll > lastScroll) {
            navbar.style.opacity = "0";
            navbar.style.pointerEvents = "none";
            navbar.classList.remove("change");
            menuLink.classList.remove("changebg");
            navLinks.forEach(link => link.classList.remove("changClr"));
            logo.classList.remove("changeClr");
            lines.forEach(line => line.classList.remove("changeLine"));
        }
        else if (currentScroll < 50){ 
            navbar.classList.remove("change");
            menuLink.classList.remove("changebg");
            navLinks.forEach(link => link.classList.remove("changClr"));
            logo.classList.remove("changeClr");
            lines.forEach(line => line.classList.remove("changeLine"));
        }
        else {
            navbar.style.opacity = "1";
            navbar.style.pointerEvents = "auto";
            navbar.classList.add("change");
            menuLink.classList.add("changebg");
            navLinks.forEach(link => link.classList.add("changClr"));
            logo.classList.add("changeClr");
            lines.forEach(line => line.classList.add("changeLine"));
        }


        lastScroll = currentScroll; 
    });

    

    //for location based style
    if(window.location.pathname === "/users/SignUp" || window.location.pathname === "/users/login" || window.location.pathname === "/users/forgotPassword" || window.location.pathname === "/cart" || window.location.pathname.startsWith("/products/productDetail/")){
        navbar.style.opacity = "1";
        navbar.style.pointerEvents = "auto";
        navbar.classList.add("change");
        menuLink.classList.add("changebg");
        navLinks.forEach(link => link.classList.add("changClr"));
        logo.classList.add("changeClr");
        lines.forEach(line => line.classList.add("changeLine"));

        window.addEventListener("scroll", () => {
            let currentScroll = window.scrollY;

            if (currentScroll > lastScroll) {
                navbar.style.opacity = "0";
                navbar.style.pointerEvents = "none";
                navbar.classList.remove("change");
                menuLink.classList.remove("changebg");
                navLinks.forEach(link => link.classList.remove("changClr"));
                logo.classList.remove("changeClr");
                
            }
            else if (currentScroll < 50){ 
                navbar.style.opacity = "1";
                navbar.style.pointerEvents = "auto";
                navbar.classList.add("change");
                menuLink.classList.add("changebg");
                navLinks.forEach(link => link.classList.add("changClr"));
                logo.classList.add("changeClr");
                lines.forEach(line => line.classList.add("changeLine"));
            }
            else{
                navbar.style.opacity = "0";
                navbar.style.pointerEvents = "none";
                navbar.classList.remove("change");
                menuLink.classList.remove("changebg");
                navLinks.forEach(link => link.classList.remove("changClr"));
                logo.classList.remove("changeClr");
                lines.forEach(line => line.classList.remove("changeLine"));   
            }
            lastScroll = currentScroll; 
        });

    }

     if(window.location.pathname.startsWith("/products/productDetail/")){
        navbar.style.backgroundColor = "#F6F6F6";             
    }

});
