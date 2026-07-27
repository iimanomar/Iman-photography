if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );

    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.body.classList.add("page-loaded");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener(
        "scroll",
        () => {
            hoverPreview.classList.remove("visible");

            hoverImages.forEach((image) => {
                image.classList.remove("lifted");
            });
        },
        { passive: true }
    );
    /* ==============================
       FULLSCREEN GALLERY LIGHTBOX
    ============================== */

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxYear = document.getElementById("lightboxYear");
    const lightboxCounter = document.getElementById("lightboxCounter");

    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("lightboxPrevious");
    const nextButton = document.getElementById("lightboxNext");

    const lightboxImages = Array.from(
        document.querySelectorAll(".gallery-item img")
    );

    let currentImageIndex = 0;
    let isChangingImage = false;

    function updateLightboxContent(index) {
        if (
            lightboxImages.length === 0 ||
            !lightboxImage ||
            !lightboxTitle ||
            !lightboxYear
        ) {
            return;
        }

        currentImageIndex =
            (index + lightboxImages.length) % lightboxImages.length;

        const selectedImage = lightboxImages[currentImageIndex];

        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;

        lightboxTitle.textContent =
            selectedImage.dataset.title || selectedImage.alt;

        lightboxYear.textContent =
            selectedImage.dataset.year || "";

        if (lightboxCounter) {
            const currentNumber = String(
                currentImageIndex + 1
            ).padStart(2, "0");

            const totalNumber = String(
                lightboxImages.length
            ).padStart(2, "0");

            lightboxCounter.textContent =
                `${currentNumber} / ${totalNumber}`;
        }
    }

    function openLightbox(index) {
        if (!lightbox) return;

        updateLightboxContent(index);

        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("lightbox-open");
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("lightbox-open");
    }

    function changeLightboxImage(index) {
        if (!lightboxImage || isChangingImage) return;

        isChangingImage = true;
        lightboxImage.classList.add("changing");

        window.setTimeout(() => {
            updateLightboxContent(index);

            lightboxImage.classList.remove("changing");
            isChangingImage = false;
        }, 220);
    }

    function showPreviousImage() {
        changeLightboxImage(currentImageIndex - 1);
    }

    function showNextImage() {
        changeLightboxImage(currentImageIndex + 1);
    }

    lightboxImages.forEach((image, index) => {
        image.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    closeButton?.addEventListener("click", closeLightbox);

    previousButton?.addEventListener(
        "click",
        showPreviousImage
    );

    nextButton?.addEventListener(
        "click",
        showNextImage
    );

    lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox?.classList.contains("open")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showPreviousImage();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }
    });

    /* ==============================
       TYPING INTRO
    ============================== */

    const introLines =
        document.querySelectorAll(".intro-line span");

    introLines.forEach((line, index) => {
        const fullText = line.textContent.trim();

        line.textContent = "";
        line.style.opacity = "1";

        setTimeout(() => {
            let characterIndex = 0;

            const typingInterval = setInterval(() => {
                line.textContent +=
                    fullText.charAt(characterIndex);

                characterIndex++;

                if (characterIndex >= fullText.length) {
                    clearInterval(typingInterval);
                }
            }, 55);
        }, index * 900);
    });

    /* ==============================
       CUSTOM CURSOR
    ============================== */

    const cursor = document.querySelector(".cursor");

    document.addEventListener("mousemove", (event) => {
        if (!cursor) return;

        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    });

    document
        .querySelectorAll("a, button, .gallery-item img")
        .forEach((element) => {
            element.addEventListener("mouseenter", () => {
                cursor?.classList.add("grow");
            });

            element.addEventListener("mouseleave", () => {
                cursor?.classList.remove("grow");
            });
        });

    document.documentElement.addEventListener(
        "mouseleave",
        () => {
            cursor?.classList.add("hidden");
        }
    );

    document.documentElement.addEventListener(
        "mouseenter",
        () => {
            cursor?.classList.remove("hidden");
        }
    );

    /* ==============================
       GALLERY IMAGE REVEAL
    ============================== */

    const galleryImages =
        document.querySelectorAll(".photo-wrap img");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle(
                        "in-view",
                        entry.isIntersecting
                    );
                });
            },
            {
                threshold: 0.3
            }
        );

        galleryImages.forEach((image) => {
            observer.observe(image);
        });
    }
else {
    galleryImages.forEach((image) => {
        image.classList.add("in-view");
    });
}
    /* ==============================
       LIFTED STICKER IMAGE HOVER
    ============================== */

    const hoverImages = document.querySelectorAll(
        ".gallery-item img"
    );

    const hoverPreview = document.createElement("img");

    hoverPreview.className = "hover-preview";
    hoverPreview.alt = "";

    document.body.appendChild(hoverPreview);

    hoverImages.forEach((image) => {
        image.addEventListener("mouseenter", () => {
            const rect = image.getBoundingClientRect();

            const imageRatio =
                image.naturalWidth / image.naturalHeight;

            const maxWidth = window.innerWidth * 0.5;
            const maxHeight = window.innerHeight * 0.68;

            let previewWidth = maxWidth;
            let previewHeight = previewWidth / imageRatio;

            if (previewHeight > maxHeight) {
                previewHeight = maxHeight;
                previewWidth = previewHeight * imageRatio;
            }

            const centreX =
                rect.left + rect.width / 2;

            const centreY =
                rect.top + rect.height / 2;

            let left =
                centreX - previewWidth / 2;

            let top =
                centreY - previewHeight / 2;

            left = Math.max(
                20,
                Math.min(
                    left,
                    window.innerWidth -
                    previewWidth -
                    20
                )
            );

            const navbar =
                document.querySelector(".navbar");

            const navbarBottom =
                navbar?.getBoundingClientRect().bottom || 0;

            top = Math.max(
                navbarBottom + 20,
                Math.min(
                    top,
                    window.innerHeight -
                    previewHeight -
                    20
                )
            );

            hoverPreview.src =
                image.currentSrc || image.src;

            hoverPreview.alt =
                image.alt || "";

            hoverPreview.style.width =
                `${previewWidth}px`;

            hoverPreview.style.height =
                `${previewHeight}px`;

            hoverPreview.style.left =
                `${left}px`;

            hoverPreview.style.top =
                `${top}px`;

            image.classList.add("lifted");
            hoverPreview.classList.add("visible");
        });

        image.addEventListener("mouseleave", () => {
            image.classList.remove("lifted");
            hoverPreview.classList.remove("visible");
        });
    });

    /* Hide preview while scrolling */

    window.addEventListener(
        "scroll",
        () => {
            hoverPreview.classList.remove("visible");

            hoverImages.forEach((image) => {
                image.classList.remove("lifted");
            });
        },
        { passive: true }
    );
});