/* =========================================================
   NIKI SEKAWAN PONDASI
   MAIN JAVASCRIPT
   FIXED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENT NAVBAR
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.querySelector(".navbar");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const sections = document.querySelectorAll("section[id]");


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", function (e) {

            e.stopPropagation();

            navbar.classList.toggle("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {

                if (navbar.classList.contains("active")) {

                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");

                } else {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        });

    }


    /* =====================================================
       TUTUP MENU SAAT LINK DIKLIK
    ===================================================== */

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (navbar) {
                navbar.classList.remove("active");
            }

            const icon = menuToggle?.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    });


    /* =====================================================
       TUTUP MENU KETIKA KLIK DI LUAR
    ===================================================== */

    document.addEventListener("click", function (e) {

        if (!navbar) return;

        if (!navbar.classList.contains("active")) {
            return;
        }

        if (
            navMenu &&
            !navMenu.contains(e.target) &&
            menuToggle &&
            !menuToggle.contains(e.target)
        ) {

            navbar.classList.remove("active");

            const icon = menuToggle?.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    function updateActiveNavigation() {

        let current = "";

        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 150;

            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        /*
           Jika berada paling atas,
           paksa Home menjadi active
        */

        if (window.scrollY <= 100) {

            const homeSection =
                document.getElementById("home");

            if (homeSection) {

                current = "home";

            }

        }


        navLinks.forEach(function (link) {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (href === "#" + current) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );

    updateActiveNavigation();


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    function navbarScroll() {

        if (!navbar) return;

        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        navbarScroll
    );

    navbarScroll();


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (e) {

            const href =
                this.getAttribute("href");


            /*
               Abaikan link biasa / external
            */

            if (
                !href ||
                !href.startsWith("#") ||
                href === "#"
            ) {

                return;

            }


            /*
               HOME
               Selalu kembali ke posisi paling atas
            */

            if (href === "#home") {

                e.preventDefault();

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

                /*
                   Hapus hash dari URL
                   supaya tidak menyimpan posisi section
                */

                if (
                    history.replaceState &&
                    window.location.hash
                ) {

                    history.replaceState(
                        null,
                        "",
                        window.location.pathname +
                        window.location.search
                    );

                }

                return;

            }


            /*
               CARI TARGET SECTION
            */

            const target =
                document.querySelector(href);

            if (!target) {

                return;

            }


            e.preventDefault();


            const navbarHeight =
                navbar ? navbar.offsetHeight : 0;


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });


            /*
               Update URL hash tanpa membuat
               browser melakukan jump otomatis
            */

            if (
                history.replaceState
            ) {

                history.replaceState(
                    null,
                    "",
                    href
                );

            }

        });

    });


    /* =====================================================
       RESET MOBILE MENU SAAT DESKTOP
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 768) {

                navbar?.classList.remove("active");

                const icon =
                    menuToggle?.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        }
    );


    /* =========================================================
       PROJECT DOCUMENTATION
       VIDEO CAROUSEL
    ========================================================= */

    const mainVideo =
        document.getElementById("mainProjectVideo");

    const mainTitle =
        document.getElementById("mainVideoTitle");

    const mainDescription =
        document.getElementById("mainVideoDescription");

    const mainLocation =
        document.getElementById("mainVideoLocation");


    /*
       HTML menggunakan:

       <span class="video-category">
    */

    const mainCategory =
        document.querySelector(".video-category");


    const videoTrack =
        document.getElementById("videoTrack");

    const videoWrapper =
        document.querySelector(".video-track-wrapper");

    const videoThumbs =
        document.querySelectorAll(".video-thumb");

    const prevButton =
        document.querySelector(".video-prev");

    const nextButton =
        document.querySelector(".video-next");


    /* =====================================================
       CEK VIDEO CAROUSEL
    ===================================================== */

    if (
        !mainVideo ||
        !videoTrack ||
        !videoWrapper ||
        videoThumbs.length === 0
    ) {

        console.warn(
            "Elemen dokumentasi video tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       INDEX VIDEO AKTIF
    ===================================================== */

    let currentVideoIndex = 0;


    /* =====================================================
       GANTI VIDEO UTAMA
       
       shouldScroll:
       true  = thumbnail ikut digeser
       false = jangan mengganggu posisi halaman
    ===================================================== */

    function changeVideo(
        index,
        autoplay = true,
        shouldScroll = false
    ) {

        if (
            index < 0 ||
            index >= videoThumbs.length
        ) {

            return;

        }


        const thumb =
            videoThumbs[index];


        /* =================================================
           AMBIL DATA VIDEO
        ================================================= */

        const videoSource =
            thumb.dataset.video;

        const title =
            thumb.dataset.title || "";

        const description =
            thumb.dataset.description || "";

        const category =
            thumb.dataset.category || "";

        const location =
            thumb.dataset.location || "";


        console.log(
            "Mengganti video ke:",
            videoSource
        );


        /* =================================================
           STOP VIDEO LAMA
        ================================================= */

        mainVideo.pause();


        /* =================================================
           RESET VIDEO
        ================================================= */

        mainVideo.removeAttribute("src");

        mainVideo.load();


        /* =================================================
           PASANG VIDEO BARU
        ================================================= */

        mainVideo.src =
            videoSource;


        /*
           Load setelah src diganti
        */

        mainVideo.load();


        /* =================================================
           UPDATE INFORMASI
        ================================================= */

        if (mainTitle) {

            mainTitle.textContent =
                title;

        }


        if (mainDescription) {

            mainDescription.textContent =
                description;

        }


        if (mainCategory) {

            mainCategory.textContent =
                category;

        }


        if (mainLocation) {

            mainLocation.textContent =
                location;

        }


        /* =================================================
           UPDATE ACTIVE THUMBNAIL
        ================================================= */

        videoThumbs.forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


        thumb.classList.add("active");


        /* =================================================
           SIMPAN INDEX
        ================================================= */

        currentVideoIndex =
            index;


        /* =================================================
           SCROLL THUMBNAIL
           
           HANYA dilakukan ketika user
           benar-benar memilih video.
           
           Tidak dilakukan saat website pertama dibuka.
        ================================================= */

        if (shouldScroll) {

            thumb.scrollIntoView({

                behavior: "smooth",

                block: "nearest",

                inline: "center"

            });

        }


        /* =================================================
           PUTAR VIDEO
        ================================================= */

        if (autoplay) {

            setTimeout(
                function () {

                    const playPromise =
                        mainVideo.play();


                    if (
                        playPromise !== undefined
                    ) {

                        playPromise.catch(
                            function (error) {

                                console.warn(
                                    "Video tidak dapat autoplay:",
                                    error
                                );

                            }
                        );

                    }

                },
                100
            );

        }

    }


    /* =====================================================
       KLIK THUMBNAIL
    ===================================================== */

    videoThumbs.forEach(
        function (thumb, index) {

            thumb.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    /*
                       User klik video:
                       boleh scroll thumbnail
                    */

                    changeVideo(
                        index,
                        true,
                        true
                    );

                }
            );

        }
    );


    /* =====================================================
       HITUNG JARAK CAROUSEL
    ===================================================== */

    function getScrollAmount() {

        const thumb =
            videoThumbs[0];

        if (!thumb) {

            return 250;

        }


        const style =
            window.getComputedStyle(
                videoTrack
            );


        const gap =
            parseFloat(style.gap) || 18;


        return (
            thumb.offsetWidth + gap
        );

    }


    /* =====================================================
       UPDATE TOMBOL CAROUSEL
    ===================================================== */

    function updateButtons() {

        const maxScroll =
            videoWrapper.scrollWidth -
            videoWrapper.clientWidth;

        const currentScroll =
            videoWrapper.scrollLeft;


        /*
           Tombol kiri
        */

        if (prevButton) {

            prevButton.disabled =
                currentScroll <= 5;

        }


        /*
           Tombol kanan
        */

        if (nextButton) {

            nextButton.disabled =
                currentScroll >=
                maxScroll - 5;

        }

    }


    /* =====================================================
       TOMBOL KIRI
    ===================================================== */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                videoWrapper.scrollBy({

                    left:
                        -getScrollAmount(),

                    behavior:
                        "smooth"

                });

            }
        );

    }


    /* =====================================================
       TOMBOL KANAN
    ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                videoWrapper.scrollBy({

                    left:
                        getScrollAmount(),

                    behavior:
                        "smooth"

                });

            }
        );

    }


    /* =====================================================
       SCROLL CAROUSEL
    ===================================================== */

    videoWrapper.addEventListener(
        "scroll",
        function () {

            updateButtons();

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            updateButtons();

        }
    );


    /* =====================================================
       DRAG CAROUSEL DESKTOP
    ===================================================== */

    let isDragging = false;

    let startX = 0;

    let startScrollLeft = 0;


    videoWrapper.addEventListener(
        "mousedown",
        function (e) {

            isDragging = true;

            startX =
                e.pageX;

            startScrollLeft =
                videoWrapper.scrollLeft;

            videoWrapper.style.cursor =
                "grabbing";

        }
    );


    videoWrapper.addEventListener(
        "mousemove",
        function (e) {

            if (!isDragging) {

                return;

            }


            e.preventDefault();


            const distance =
                e.pageX - startX;


            videoWrapper.scrollLeft =
                startScrollLeft - distance;

        }
    );


    videoWrapper.addEventListener(
        "mouseup",
        function () {

            isDragging = false;

            videoWrapper.style.cursor =
                "grab";

        }
    );


    videoWrapper.addEventListener(
        "mouseleave",
        function () {

            isDragging = false;

            videoWrapper.style.cursor =
                "grab";

        }
    );


    videoWrapper.style.cursor =
        "grab";


    /* =====================================================
       TOUCH SWIPE MOBILE
    ===================================================== */

    let touchStartX = 0;

    let touchStartScrollLeft = 0;


    videoWrapper.addEventListener(
        "touchstart",
        function (e) {

            touchStartX =
                e.touches[0].pageX;

            touchStartScrollLeft =
                videoWrapper.scrollLeft;

        },
        {
            passive: true
        }
    );


    videoWrapper.addEventListener(
        "touchmove",
        function (e) {

            const currentX =
                e.touches[0].pageX;


            const distance =
                touchStartX - currentX;


            videoWrapper.scrollLeft =
                touchStartScrollLeft +
                distance;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       VIDEO PERTAMA
       
       PENTING:
       shouldScroll = FALSE
       
       Jadi browser TIDAK akan lompat
       ke section Video Proyek.
    ===================================================== */

    changeVideo(
        0,
        false,
        false
    );


    /* =====================================================
       UPDATE BUTTON PERTAMA KALI
    ===================================================== */

    setTimeout(
        function () {

            updateButtons();

        },
        500
    );


    /* =====================================================
       VIDEO ERROR HANDLER
    ===================================================== */

    mainVideo.addEventListener(
        "error",
        function () {

            console.error(
                "VIDEO ERROR:",
                mainVideo.error
            );

            console.error(
                "SOURCE:",
                mainVideo.currentSrc
            );

        }
    );


    /* =====================================================
       VIDEO LOADED
    ===================================================== */

    mainVideo.addEventListener(
        "loadeddata",
        function () {

            console.log(
                "Video berhasil dimuat:",
                mainVideo.currentSrc
            );

        }
    );


});