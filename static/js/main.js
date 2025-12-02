document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------------
       HEADER SCROLL
    ----------------------------------------------------------- */
    document.addEventListener("scroll", () => {
        document.body.classList.toggle("scrolled", window.scrollY > 160);
    });

    /* -----------------------------------------------------------
       BURGER MENU
    ----------------------------------------------------------- */
    const burger = document.getElementById("burger");
    const mobileNav = document.getElementById("mobileNav");

    if (burger && mobileNav) {
        burger.addEventListener("click", () => {
            burger.classList.toggle("active");
            mobileNav.classList.toggle("show");
        });

        mobileNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                burger.classList.remove("active");
                mobileNav.classList.remove("show");
            });
        });
    }

    /* -----------------------------------------------------------
       SOCIAL BAR AUTO-HIDE
    ----------------------------------------------------------- */
    const hero = document.getElementById("hero");
    const socialBar = document.querySelector(".social-bar");

    function updateSocialBar() {
        if (!hero || !socialBar) return;
        const rect = hero.getBoundingClientRect();
        socialBar.classList.toggle("hidden", rect.bottom < 120);
    }

    window.addEventListener("scroll", updateSocialBar);
    updateSocialBar();

    /* -----------------------------------------------------------
       PRODUCT SHEET (MODAL)
    ----------------------------------------------------------- */
    const sheet = document.getElementById("productSheet");
    const sheetOverlay = sheet?.querySelector(".product-sheet__overlay");
    const sheetClose = sheet?.querySelector(".product-sheet__close");

    const sheetTitle = sheet?.querySelector(".js-sheet-title");
    const sheetImage = sheet?.querySelector(".js-sheet-image");
    const sheetSpecs = sheet?.querySelector(".js-sheet-specs");
    const priceValue = sheet?.querySelector(".js-price-value");

    const sizeButtons = sheet?.querySelectorAll(".js-size-option");
    const customBlock = sheet?.querySelector(".js-size-custom");
    const customWidth = sheet?.querySelector(".js-size-width");
    const customHeight = sheet?.querySelector(".js-size-height");
    const customOk = sheet?.querySelector(".js-size-ok");

    const PRICE_PER_M2 = 300;
    const presetPrices = {
        "6x6": 10800,
        "8x8": 16600,
        "10x10": 26000,
        "12x12": 37400
    };

    function openSheet() {
        if (!sheet) return;
        sheet.classList.add("product-sheet--open");
        sheet.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeSheet() {
        if (!sheet) return;
        sheet.classList.remove("product-sheet--open");
        sheet.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    sheetClose?.addEventListener("click", closeSheet);
    sheetOverlay?.addEventListener("click", closeSheet);

    /* -----------------------------------------------------------
       FILL MODAL FROM CARD
    ----------------------------------------------------------- */
    document.querySelectorAll(".mat-card").forEach(card => {
        const expandBtn = card.querySelector(".mat-card__expand");
        const img = card.querySelector(".mat-card__image");

        function fillAndOpen() {
            if (!sheetTitle || !sheetImage || !sheetSpecs) return;

            sheetTitle.textContent = card.getAttribute("data-title") || "";
            sheetImage.src = card.getAttribute("data-img") || "";
            sheetImage.alt = `Ковер ${sheetTitle.textContent}`;

            sheetSpecs.innerHTML = `
                <li><strong>Покрытие ПВХ:</strong> плотность 650 г/м²</li>
                <li><strong>Тип мата:</strong> ${card.getAttribute("data-type")}</li>
                <li><strong>Плотность:</strong> ${card.getAttribute("data-density")}</li>
                <li><strong>Срок службы:</strong> ${card.getAttribute("data-life")}</li>
                <li><strong>Рекомендации:</strong> ${card.getAttribute("data-recommend")}</li>
            `;

            if (priceValue) priceValue.textContent = "от 300 руб/м²";

            // Reset size state
            sizeButtons?.forEach(btn => btn.classList.remove("active"));
            if (customBlock) customBlock.style.display = "none";
            if (customWidth) customWidth.value = "";
            if (customHeight) customHeight.value = "";

            openSheet();
        }

        expandBtn?.addEventListener("click", fillAndOpen);
        img?.addEventListener("click", fillAndOpen);
    });

    /* -----------------------------------------------------------
       SIZE SELECTOR
    ----------------------------------------------------------- */
    sizeButtons?.forEach(btn => {
        btn.addEventListener("click", () => {
            if (!priceValue) return;

            sizeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const size = btn.getAttribute("data-size");
            if (!size) return;

            if (size === "custom") {
                if (customBlock) customBlock.style.display = "grid";
                priceValue.textContent = "Введите размер формата Ш×Д";
                return;
            }

            if (customBlock) customBlock.style.display = "none";

            if (presetPrices[size]) {
                priceValue.textContent = `≈ ${presetPrices[size].toLocaleString("ru-RU")} ₽`;
            }
        });
    });

    function calcCustomPrice() {
        if (!priceValue || !customWidth || !customHeight) return;

        const w = parseFloat(customWidth.value.replace(",", "."));
        const h = parseFloat(customHeight.value.replace(",", "."));

        if (!w || !h) {
            priceValue.textContent = "Введите оба значения";
            return;
        }

        const area = w * h;
        const result = Math.round(area * PRICE_PER_M2);
        priceValue.textContent = `≈ ${result.toLocaleString("ru-RU")} ₽`;
    }

    customOk?.addEventListener("click", calcCustomPrice);

    [customWidth, customHeight].forEach(input => {
        input?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                calcCustomPrice();
            }
        });
    });

    /* -----------------------------------------------------------
       MOBILE AUTO SCROLL
    ----------------------------------------------------------- */
    function scrollToSheetFormOnMobile() {
        if (window.innerWidth >= 1024) return;
        const formCol = sheet?.querySelector(".product-sheet__col--form");
        formCol?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    sizeButtons?.forEach(btn => btn.addEventListener("click", scrollToSheetFormOnMobile));
    customOk?.addEventListener("click", scrollToSheetFormOnMobile);

    /* -----------------------------------------------------------
       HOVER IMAGE SWAP + ZOOM (исправленный)
    ----------------------------------------------------------- */
    document.querySelectorAll('.mat-card__image').forEach(img => {
        const defaultSrc = img.dataset.default;
        const hoverSrc = img.dataset.hover;

        // если нет параметров — пропускаем
        if (!defaultSrc || !hoverSrc) return;

        img.addEventListener('mouseenter', () => {
            img.src = hoverSrc;
            img.classList.add('hovered');
        });

        img.addEventListener('mouseleave', () => {
            img.src = defaultSrc;
            img.classList.remove('hovered');
        });
    });
});

/* -----------------------------------------------------------
   CONTACTS BUTTON OUTSIDE DOMContentLoaded
----------------------------------------------------------- */
document.getElementById("contacts-btn")?.addEventListener("click", () => {
    window.location.href = "https://prospectboxing.ru/contacts";
});
