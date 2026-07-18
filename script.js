"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("#loginBtn");
  if (!loginBtn) return;

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const regAnswer = prompt("Желаете пройти регистрацию на сайте?");
    if (regAnswer && regAnswer.toLowerCase() === "да") {
      alert("Круто!");
    } else {
      alert("Попробуй ещё раз!");
    }

    const login = prompt("Введите логин:");
    if (login === "Admin") {
      const pass = prompt("Введите пароль:");
      if (pass === "Я главный") {
        alert("Здравствуйте!");
      } else if (pass === null || pass === "") {
        alert("Отменено!");
      } else {
        alert("Неверный пароль!");
      }
    } else if (login === null || login === "") {
      alert("Отменено!");
    } else {
      alert("Я вас не знаю!");
    }
  });
});

// === ФУНКЦИЯ ОГРАНИЧЕНИЯ ТЕКСТА ===
function truncate(str, maxlength) {
  return str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str;
}

// Применим к описаниям карточек
document.addEventListener("DOMContentLoaded", () => {
  const descs = document.querySelectorAll(".card .desc");
  descs.forEach(p => {
    p.textContent = truncate(p.textContent, 260);
  });
});

// === КАПЧА для формы регистрации ===
document.addEventListener("DOMContentLoaded", () => {
  const captchaText = document.querySelector("#captchaText");
  const captchaInput = document.querySelector("#captchaInput");
  const refreshBtn = document.querySelector("#refreshCaptcha");
  const form = document.querySelector(".signup-form");

  if (!captchaText || !captchaInput || !form) return;

  function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) result += chars[Math.floor(Math.random() * chars.length)];
    captchaText.textContent = result;
  }

  generateCaptcha();

  refreshBtn.addEventListener("click", generateCaptcha);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (captchaInput.value.trim() === "") {
      alert("Введите код!");
      return;
    }
    if (captchaInput.value.trim().toUpperCase() !== captchaText.textContent) {
      alert("Неверный код! Попробуйте снова.");
      generateCaptcha();
      captchaInput.value = "";
      return;
    }
    alert("Форма успешно отправлена!");
    form.reset();
    generateCaptcha();
  });
});

// === ИЗБРАННОЕ (аналог корзины из практической №10) ===
"use strict";

const Favorites = {
  items: [],

  add(title) {
    if (!this.items.includes(title)) {
      this.items.push(title);
      console.log(`Добавлено в избранное: ${title}`);
    } else {
      console.log(`"${title}" уже есть в избранном.`);
    }
    this.show();
  },

  remove(title) {
    const index = this.items.indexOf(title);
    if (index !== -1) {
      this.items.splice(index, 1);
      console.log(`Удалено из избранного: ${title}`);
    } else {
      console.log(`"${title}" не найдено в избранном.`);
    }
    this.show();
  },

  count() {
    return this.items.length;
  },

  show() {
    console.log("Текущий список избранного:", this.items);
    const counter = document.querySelector("#favCount");
    if (counter) counter.textContent = this.count();
  }
};

// === КНОПКИ НА СТРАНИЦЕ ===
document.addEventListener("DOMContentLoaded", () => {
  const favButtons = document.querySelectorAll(".add-fav");

  favButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.dataset.title;

      if (Favorites.items.includes(title)) {
        Favorites.remove(title);
        btn.textContent = "+ В избранное";
        btn.style.background = "var(--red)";
      } else {
        Favorites.add(title);
        btn.textContent = "✓ В избранном";
        btn.style.background = "var(--purple)";
      }
    });
  });
});

// === ПРАКТИЧЕСКАЯ №11: фильтрация и сортировка с выводом на страницу ===
"use strict";

const animeList = [
  { title: "Berserk", year: 1997, rating: 9.1 },
  { title: "Code Geass", year: 2006, rating: 9.0 },
  { title: "Blue Lock", year: 2022, rating: 8.4 },
  { title: "Tokyo Ghoul", year: 2014, rating: 8.2 },
  { title: "Death Note", year: 2006, rating: 9.2 }
];

function renderResults(list, title = "Результаты") {
  const container = document.querySelector("#resultsList");
  if (!container) return;
  container.innerHTML = `<h3 style="margin:0 0 8px">${title}</h3>`;
  list.forEach(a => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.textContent = `${a.title} — ${a.year} • ⭐ ${a.rating}`;
    container.appendChild(div);
  });
}

function filterByRating(min, max) {
  const result = animeList.filter(a => a.rating >= min && a.rating <= max);
  renderResults(result, `Аниме с рейтингом от ${min} до ${max}`);
}

function sortByRating(order = "asc") {
  const sorted = [...animeList].sort((a, b) =>
    order === "asc" ? a.rating - b.rating : b.rating - a.rating
  );
  renderResults(sorted, `Сортировка по рейтингу (${order === "asc" ? "возрастание" : "убывание"})`);
}

// === Кнопки управления ===
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#filterBtn")?.addEventListener("click", () => filterByRating(8.5, 9.2));
  document.querySelector("#sortAsc")?.addEventListener("click", () => sortByRating("asc"));
  document.querySelector("#sortDesc")?.addEventListener("click", () => sortByRating("desc"));
});

// === ПРАКТИЧЕСКАЯ №12: уведомления, декоратор и таймеры ===
"use strict";

// Находим колокольчик и счётчик
const bell = document.querySelector(".notif-btn");
const badge = document.querySelector(".badge");

// Количество уведомлений
let notifCount = 3;

// === 1. Обновление уведомлений каждые 3 секунды ===
let notifInterval = setInterval(addNotification, 3000);

function addNotification() {
  notifCount++;
  badge.textContent = notifCount;
  // showNotification(`🔔 Новое уведомление (${notifCount})`);
}

// === 2. Декоратор с задержкой (10 секунд паузы при клике) ===
function delayDecorator(fn, delay) {
  let isWaiting = false;
  return function(...args) {
    if (isWaiting) return;
    fn.apply(this, args);
    isWaiting = true;
    showNotification("⏸ Уведомления на паузе (10 секунд)");
    clearInterval(notifInterval);
    setTimeout(() => {
      isWaiting = false;
      notifInterval = setInterval(addNotification, 3000);
      showNotification("▶ Уведомления возобновлены");
    }, delay);
  };
}

// Применяем декоратор к клику по колокольчику
bell?.addEventListener("click", delayDecorator(() => {
  console.log("Колокольчик нажат — пауза уведомлений");
}, 10000));

// === 3. Всплывающее уведомление с автозакрытием ===
function showNotification(text) {
  const note = document.createElement("div");
  note.className = "toast";

  // Добавляем крестик (используем делегирование)
  note.innerHTML = `
    <span class="toast-text">${text}</span>
    <span class="toast-close" aria-label="Закрыть уведомление">✕</span>
  `;

  document.body.appendChild(note);

  // Анимация появления
  requestAnimationFrame(() => note.classList.add("show"));

  // Автоматическое скрытие через 3 секунды
  setTimeout(() => {
    note.classList.remove("show");
    setTimeout(() => note.remove(), 300);
  }, 3000);
}


//  ПРАКТИЧЕСКАЯ №13:
"use strict";

/* 1. Клик по изображению галереи  */
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery .grid");
  if (!gallery) return;

  gallery.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;

    // Получаем координаты клика
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Создаём элемент с координатами
    const coords = document.createElement("div");
    coords.className = "coords";
    coords.textContent = `x: ${Math.round(x)}, y: ${Math.round(y)}`;
    img.parentElement.appendChild(coords);

    // Центрируем изображение (анимация)
    img.classList.add("focused");
    setTimeout(() => {
      img.classList.remove("focused");
      coords.remove();
    }, 1500);
  });
});

/*  2. Делегирование событий */
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".toast-close");
  if (closeBtn) {
    const toast = closeBtn.closest(".toast");
    toast?.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }
});

/* Эффект параллакса для секции “ТОП-подборка” */
window.addEventListener("scroll", () => {
  const topSection = document.querySelector("#top-list")?.closest("section");
  if (!topSection) return;
  const offset = window.scrollY * 0.3; // скорость параллакса
  topSection.style.backgroundPositionY = `${offset}px`;
});

/* Плавное появление карточек при скролле */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".card, .gallery figure").forEach((el) => {
  observer.observe(el);
});

// ПРАКТИЧЕСКАЯ №14: финал
"use strict";

/* 1. Подтверждение перехода по внешним ссылкам */
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;
  if (link.href.startsWith(location.origin)) return; // внутренние ссылки пропускаем
  const confirmExit = confirm("Покинуть сайт AnimeGuide и перейти на внешний ресурс?");
  if (!confirmExit) e.preventDefault();
});

/* 2. Галерея: клик по миниатюре - крупное изображение */
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery .grid");
  if (!gallery) return;

  // создаём контейнер для крупного изображения
  const viewer = document.createElement("div");
  viewer.className = "main-viewer";
  viewer.innerHTML = `<img src="" alt="Превью" class="main-preview">`;
  gallery.parentElement.insertBefore(viewer, gallery);

  const mainImg = viewer.querySelector(".main-preview");
  mainImg.src = gallery.querySelector("img").src;

  gallery.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    mainImg.src = img.src;
    mainImg.classList.add("fade");
    setTimeout(() => mainImg.classList.remove("fade"), 400);
  });
});

/* 3. Глоссарий: выделение терминов (множественный выбор) */
document.addEventListener("DOMContentLoaded", () => {
  const terms = document.querySelectorAll("#glossary .term");
  let selected = new Set();

  terms.forEach(term => {
    term.addEventListener("click", (e) => {
      const isMulti = e.metaKey || e.ctrlKey;
      if (!isMulti) selected.clear();

      if (selected.has(term)) selected.delete(term);
      else selected.add(term);

      terms.forEach(t => t.classList.toggle("active", selected.has(t)));
    });
  });
});

/* 4. Слайдер */
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".gallery .grid");
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.classList.add("grabbing");
  });
  slider.addEventListener("mouseleave", () => { isDown = false; slider.classList.remove("grabbing"); });
  slider.addEventListener("mouseup", () => { isDown = false; slider.classList.remove("grabbing"); });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2; // скорость
    slider.scrollLeft = scrollLeft - walk;
  });
});

/* 5. Drag’n’Drop в избранное  */
document.addEventListener("DOMContentLoaded", () => {
  const favZone = document.querySelector(".fav-icon");
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.setAttribute("draggable", true);
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.querySelector(".title").textContent);
    });
  });

  favZone.addEventListener("dragover", (e) => e.preventDefault());
  favZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const title = e.dataTransfer.getData("text/plain");
    Favorites.add(title);
    showNotification(`💾 ${title} добавлен в избранное`);
  });
});

/* 6. Анимации: кнопка "Наверх" + движение логотипа */

// логотип при загрузке страницы
window.addEventListener("load", () => {
  const logo = document.querySelector(".logo");
  if (!logo) return;
  logo.style.transition = "transform 1.2s ease";
  logo.style.transform = "translateY(-20px)";
  setTimeout(() => logo.style.transform = "translateY(0)", 100);
});

// мигание кнопки "Наверх" при бездействии
let idleTimer;
const toTopBtn = document.querySelector(".to-top");
function pulseToTop() {
  if (!toTopBtn) return;
  toTopBtn.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }],
    { duration: 800, iterations: 3, easing: "ease-in-out" }
  );
}
function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(pulseToTop, 10000); // через 10 сек бездействия
}
["mousemove", "keydown", "scroll"].forEach(ev => window.addEventListener(ev, resetIdleTimer));
resetIdleTimer();
