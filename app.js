window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
  
    if (window.scrollY > 25) {
      if (header) {
        header.classList.add('fixed-top');
      }
    } else {
      if (header) {
        header.classList.remove('fixed-top');
      }
    }
  });



//   

document.addEventListener("DOMContentLoaded", function () {
    var mobileBtn = document.querySelector(".menu_icon");
    var sideMenu = document.querySelector(".side-menu");
    var sideMenuCloseBtn = document.querySelector(".side-menu-close-btn img");

    // Check if elements exist before adding event listeners
    if (mobileBtn && sideMenu) {
        mobileBtn.addEventListener("click", () => {
            sideMenu.classList.add("active");
            // document.body.style.position = "fixed";
            // document.body.style.width = "100%";
        });
    }

    if (sideMenuCloseBtn) {
        sideMenuCloseBtn.addEventListener("click", () => {
            sideMenu.classList.remove("active");
        });
    }

    document.addEventListener("click", (event) => {
        if (sideMenu && mobileBtn && !sideMenu.contains(event.target) && !mobileBtn.contains(event.target)) {
            sideMenu.classList.remove("active");
            // document.body.style.position = "relative";
        }
    });

    document.querySelectorAll(".mobile-menu > ul > li > a").forEach((item) => {
        item.addEventListener("click", function (event) {
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains("submenu")) {
                const isOpen = submenu.style.display === "block";

                if (!isOpen) {
                    event.preventDefault();
                    document.querySelectorAll(".mobile-menu .submenu").forEach((sub) => {
                        sub.style.display = "none";
                    });
                    submenu.style.display = "block";
                }
            }
        });
    });
});