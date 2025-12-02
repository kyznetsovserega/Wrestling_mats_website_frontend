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
