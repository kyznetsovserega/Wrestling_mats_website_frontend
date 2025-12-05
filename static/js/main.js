/* ============================================================================
   GLOBAL STATE
============================================================================ */
let currentCard = null; // активная карточка для модалки



/* ============================================================================
   READY
============================================================================ */
document.addEventListener("DOMContentLoaded", () => {



/* ============================================================================
   HEADER SCROLL
============================================================================ */
document.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 160);
});



/* ============================================================================
   BURGER
============================================================================ */
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



/* ============================================================================
   SOCIAL BAR
============================================================================ */
const hero = document.getElementById("hero");
const socialBar = document.querySelector(".social-bar");

function updateSocialBar() {
    if (!hero || !socialBar) return;
    const rect = hero.getBoundingClientRect();
    socialBar.classList.toggle("hidden", rect.bottom < 120);
}

window.addEventListener("scroll", updateSocialBar);
updateSocialBar();



/* ================================================
   HERO PARALLAX + DYNAMIC VIGNETTE
   ================================================ */

document.addEventListener("mousemove", (e) => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    /* Параллакс: движем фон */
    const moveX = (x - 0.5) * 10;  // сила эффекта
    const moveY = (y - 0.5) * 10;

    hero.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;

    /* Движение виньетки */
    hero.style.setProperty("--x", `${x * 100}%`);
    hero.style.setProperty("--y", `${y * 100}%`);
});


/* ============================================================================
   PRODUCT SHEET (MODAL)
============================================================================ */
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

const sliceBtn = sheet?.querySelector(".slice-toggle");
const sliceOverlay = sheet?.querySelector(".slice-overlay");
const sliceImg = sheet?.querySelector(".js-slice-img");

const PRICE_PER_M2 = 300;

const presetPrices = {
    "6x6": 10800,
    "8x8": 16600,
    "10x10": 26000,
    "12x12": 37400
};


// -------------------------------
// OPEN MODAL
// -------------------------------
function openSheet() {
    sheet.classList.add("product-sheet--open");
    sheet.removeAttribute("hidden");
    document.body.style.overflow = "hidden";

    // ставим фокус внутрь модалки (чтобы ARIA не ругалась)
    sheetClose?.focus();
}


// -------------------------------
// CLOSE MODAL (ARIA FIX)
// -------------------------------
function closeSheet() {
    sheet.classList.remove("product-sheet--open");
    sheet.setAttribute("hidden", "");
    document.body.style.overflow = "";

    // FIX: убираем фокус, чтобы не было ARIA warnings
    document.activeElement.blur();
}

sheetClose?.addEventListener("click", closeSheet);
sheetOverlay?.addEventListener("click", closeSheet);




/* ============================================================================
   FILL & OPEN SHEET FROM CARD
============================================================================ */
document.querySelectorAll(".mat-card").forEach(card => {
    const expandBtn = card.querySelector(".mat-card__expand");
    const cardImg = card.querySelector(".mat-card__image");

    const openFromCard = () => {
        currentCard = card;

        // Заголовок
        sheetTitle.textContent = card.dataset.title;

        // Основное изображение
        sheetImage.src = card.dataset.img;

        // Характеристики
        sheetSpecs.innerHTML = `
            <li><strong>Покрытие ПВХ:</strong> плотность 650 г/м²</li>
            <li><strong>Тип мата:</strong> ${card.dataset.type}</li>
            <li><strong>Плотность:</strong> ${card.dataset.density}</li>
            <li><strong>Срок службы:</strong> ${card.dataset.life}</li>
            <li><strong>Рекомендации:</strong> ${card.dataset.recommend}</li>
        `;

        // Цена
        priceValue.textContent = "от 300 руб/м²";

        // Сброс выбора размеров
        sizeButtons.forEach(b => b.classList.remove("active"));
        customBlock.style.display = "none";
        customWidth.value = "";
        customHeight.value = "";

        // Slice image
        sliceOverlay.classList.remove("active");
        sliceImg.src = cardImg.dataset.hover; // slice-картинка из карточки

        openSheet();
    };

    expandBtn?.addEventListener("click", openFromCard);
    cardImg?.addEventListener("click", openFromCard);
});




/* ============================================================================
   SIZE SELECTOR
============================================================================ */
sizeButtons.forEach(btn => btn.addEventListener("click", () => {
    sizeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const size = btn.dataset.size;

    if (size === "custom") {
        customBlock.style.display = "grid";
        priceValue.textContent = "Введите размер формата Ш×Д";
        return;
    }

    customBlock.style.display = "none";

    if (presetPrices[size]) {
        priceValue.textContent = `≈ ${presetPrices[size].toLocaleString("ru-RU")} ₽`;
    }
}));


function calcCustomPrice() {
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




/* ============================================================================
   SCROLL TO FORM ON MOBILE
============================================================================ */
function scrollToSheetFormOnMobile() {
    if (window.innerWidth >= 1024) return;
    const formCol = sheet.querySelector(".product-sheet__col--form");
    formCol.scrollIntoView({ behavior: "smooth", block: "start" });
}

sizeButtons.forEach(btn => btn.addEventListener("click", scrollToSheetFormOnMobile));
customOk?.addEventListener("click", scrollToSheetFormOnMobile);




/* ============================================================================
   CARD IMAGE HOVER
============================================================================ */
document.querySelectorAll('.mat-card__image').forEach(img => {
    const defaultSrc = img.dataset.default;
    const hoverSrc = img.dataset.hover;

    img.addEventListener('mouseenter', () => img.src = hoverSrc);
    img.addEventListener('mouseleave', () => img.src = defaultSrc);
});



/* ============================================================================
   SLICE TOGGLE (INSIDE MODAL)
============================================================================ */
sliceBtn?.addEventListener("click", () => {
    if (!currentCard) return;
    sliceOverlay.classList.toggle("active");
});



}); // END DOMContentLoaded




/* ============================================================================
   CONTACTS BUTTON (outside ready)
============================================================================ */
document.getElementById("contacts-btn")?.addEventListener("click", () => {
    window.location.href = "https://prospectboxing.ru/contacts";
});



/* ============================================================================

============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const fasteners = document.querySelector(".fasteners");
  if (!fasteners) return;

  const headerBtn    = fasteners.querySelector(".fasteners__header");
  const content      = fasteners.querySelector(".fasteners__content");

  const tabs         = fasteners.querySelectorAll(".fasteners__tab");
  const panels       = fasteners.querySelectorAll(".fasteners__panel");

  const hotspots     = fasteners.querySelectorAll(".fasteners__hotspot"); // старые метки (если нужны)
  const dots         = fasteners.querySelectorAll(".fasteners__dot");       // НОВЫЕ круглые точки

  const circleBlock  = fasteners.querySelector(".fasteners__circle-image");
  const circleImgs   = fasteners.querySelectorAll(".fasteners__circle-image img");
  const circleLabel  = fasteners.querySelector(".fasteners__circle-label");


  /* ============================================================
     1) Открытие / закрытие секции
  ============================================================ */
  headerBtn.addEventListener("click", () => {
    const willOpen = !content.classList.contains("active");

    content.classList.toggle("active", willOpen);
    fasteners.classList.toggle("fasteners--open", willOpen);

    if (willOpen) {
      setMethod("overview");
    }
  });


  /* ============================================================
     2) Главная функция выбора метода
  ============================================================ */
  function setMethod(method) {

    /* --- 2.1 Табы --- */
    tabs.forEach(tab => {
      tab.classList.toggle(
        "fasteners__tab--active",
        tab.dataset.method === method
      );
    });

    /* --- 2.2 Текстовые панели --- */
    panels.forEach(panel => {
      panel.classList.toggle(
        "fasteners__panel--active",
        panel.dataset.methodPanel === method
      );
    });

    /* --- 2.3 НЕОН-схема скрывается / появляется --- */
    fasteners.classList.toggle("fasteners--method-selected", method !== "overview");


    /* --- 2.4 Красные круглые точки (новые) --- */
    dots.forEach(dot => {
      dot.classList.toggle(
        "fasteners__dot--active",
        dot.dataset.method === method
      );
    });


    /* --- 2.5 Круглая фотография --- */
    if (method === "overview") {
      circleBlock.classList.remove("fasteners__circle-image--active");
    } else {
      circleBlock.classList.add("fasteners__circle-image--active");
    }

    circleImgs.forEach(img => {
      img.classList.toggle(
        "circle-active",
        img.dataset.methodPanel === method
      );
    });


    /* --- 2.6 Текст внутри красного круга --- */
    const labels = {
      pockets: "КАРМАНЫ",
      velcro: "ЛИПУЧКИ",
      eyelets: "ЛЮВЕРСЫ"
    };

    circleLabel.textContent = labels[method] || "";
  }


  /* ============================================================
     3) Клик по табам
  ============================================================ */
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      setMethod(tab.dataset.method);
    });
  });


  /* ============================================================
     4) Клик по старым hotspot-кнопкам
  ============================================================ */
  hotspots.forEach(h => {
    h.addEventListener("click", () => {
      setMethod(h.dataset.method);
    });
  });


  /* ============================================================
     5) Клик по НОВЫМ круговым точкам
  ============================================================ */
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      setMethod(dot.dataset.method);
    });
  });

});

