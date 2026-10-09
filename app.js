/* =====================================================================
   STOCK: the plants and seeds shown in "What we grow".
   Edit this list as stock changes. To add a photo, save it in images/
   with the filename given in `image` (or change the filename here).
   Set available: true to show an "In stock now" tag, false to hide it.
   Keep available accurate; remove the flag when an item runs out.
   ===================================================================== */
var STOCK = [
  {
    ml: "പെറ്റൂണിയ",
    en: "Petunia",
    descMl: "വീട്ടുമുറ്റത്തും ബാൽക്കണിയിലും നിറം നിറയ്ക്കുന്ന പൂച്ചെടി. ചട്ടിയിലും തൂക്കുപാത്രത്തിലും നന്നായി വളരും.",
    descEn: "A flowering annual that brings colour to a yard or balcony. Does well in pots and hanging baskets.",
    image: "images/placeholder-plant-1.jpg",
    alt: "Petunia plants in bloom with purple and pink flowers",
    available: true
  },
  {
    ml: "സീസണിലെ പൂച്ചെടികൾ",
    en: "Seasonal flowering annuals",
    descMl: "ഓരോ സീസണിലും മാറിമാറി വരുന്ന, ഒരു വർഷം പൂക്കുന്ന ചെടികൾ. ഇപ്പോഴുള്ളത് ചോദിച്ചറിയൂ.",
    descEn: "Annuals that change with the season. Ask what is on the benches now.",
    image: "images/placeholder-plant-2.jpg",
    alt: "A bench of mixed flowering annual plants in small nursery pots"
  },
  {
    ml: "ചട്ടിച്ചെടികൾ",
    en: "Potted plants",
    descMl: "ചട്ടിയിൽ വളർന്ന ചെടികൾ. വാങ്ങി നേരെ വീട്ടിൽ വയ്ക്കാം.",
    descEn: "Plants grown in pots, ready to take home and place.",
    image: "images/placeholder-plant-3.jpg",
    alt: "Potted green plants arranged in rows at the nursery"
  },
  {
    ml: "തൈകൾ",
    en: "Seedlings",
    descMl: "പറിച്ചുനടാൻ പാകമായ ചെറു തൈകൾ, തോട്ടത്തിനും ചട്ടിക്കും.",
    descEn: "Young seedlings ready to plant out, for the garden or a pot.",
    image: "images/placeholder-plant-4.jpg",
    alt: "Small seedlings growing in a nursery tray"
  },
  {
    ml: "വിത്തുകൾ",
    en: "Seeds",
    descMl: "തുടക്കം മുതൽ സ്വന്തമായി വളർത്താൻ ആഗ്രഹിക്കുന്നവർക്കുള്ള വിത്തുകൾ.",
    descEn: "Seeds for anyone who likes to grow from the very beginning.",
    image: "images/placeholder-plant-5.jpg",
    alt: "Packets and handfuls of plant seeds"
  }
];

(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var lang = "en"; // "en" (default) or "ml"

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  
  function messageFor() {
    var m = C.WHATSAPP_MESSAGE;
    if (!m) return "Hello";
    return lang === "ml" ? m.ml + " / " + m.en : m.en;
  }

  function waLink(message) {
    var msg = message || messageFor();
    return "https://wa.me/" + encodeURIComponent(C.WHATSAPP_NUMBER || "") + "?text=" + encodeURIComponent(msg);
  }

  /* ---- Stock grid ---- */
  function renderStock() {
    var grid = document.getElementById("stock-grid");
    if (!grid) return;
    STOCK.forEach(function (item) {
      var li = el("li", "card");

      var media = el("div", "card-media");
      var img = el("img");
      img.src = item.image;
      img.alt = item.alt;
      img.loading = "lazy";
      img.width = 640;
      img.height = 480;
      // Until a real photo exists, hide the broken image and show the green block behind it.
      img.onerror = function () { img.hidden = true; };
      media.appendChild(img);
      if (item.available) {
        var badge = el("span", "badge");
        var bml = el("span", "ml", "ഇപ്പോൾ ലഭ്യം"); bml.lang = "ml";
        badge.appendChild(bml);
        badge.appendChild(el("span", "en", "In stock now"));
        media.appendChild(badge);
      }
      li.appendChild(media);

      var body = el("div", "card-body");
      var h3 = el("h3");
      var open = el("button", "card-open");
      open.type = "button";
      open.setAttribute("aria-haspopup", "dialog");
      open.setAttribute("data-open", String(STOCK.indexOf(item)));
      var ml = el("span", "ml", item.ml); ml.lang = "ml";
      open.appendChild(ml);
      open.appendChild(el("span", "en", item.en));
      h3.appendChild(open);
      body.appendChild(h3);
      var p1 = el("p", "ml", item.descMl); p1.lang = "ml";
      body.appendChild(p1);
      body.appendChild(el("p", "en", item.descEn));

      var a = el("a", "card-link");
      a.setAttribute("data-ask", String(STOCK.indexOf(item)));
      a.target = "_blank";
      a.rel = "noopener";
      var aml = el("span", "ml", "ചോദിക്കൂ /"); aml.lang = "ml";
      a.appendChild(aml);
      a.appendChild(el("span", "en", "Ask about this"));
      a.setAttribute("aria-label", "Ask about " + item.en + " on WhatsApp");
      body.appendChild(a);

      li.appendChild(body);
      grid.appendChild(li);
    });
  }

  /* ---- Plant pop-up ---- */
  function askMessage(item) {
    return lang === "ml"
      ? "ഹലോ, " + item.ml + " (" + item.en + ") ലഭ്യമാണോ? / Hello, is " + item.en + " available?"
      : "Hello, is " + item.en + " available?";
  }

  function setupDialog() {
    var dlg = document.getElementById("plant-dialog");
    var grid = document.getElementById("stock-grid");
    if (!dlg || !grid) return;
    var lastTrigger = null;
    function $(id) { return document.getElementById(id); }

    function openItem(i, trigger) {
      var item = STOCK[i];
      lastTrigger = trigger;
      $("pd-title").textContent = item.en;
      $("pd-ml-name").textContent = item.ml;
      $("pd-desc").textContent = item.descEn;
      $("pd-desc-ml").textContent = item.descMl;
      $("pd-badge").hidden = !item.available;
      var img = $("pd-img");
      img.hidden = false;
      img.alt = item.alt;
      img.onerror = function () { img.hidden = true; };
      img.src = item.image;
      $("pd-ask").href = waLink(askMessage(item));
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
      document.body.classList.add("dialog-open");
    }
    function close() {
      if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
    }

    grid.addEventListener("click", function (e) {
      if (e.target.closest(".card-link")) return;
      var card = e.target.closest(".card");
      var btn = card && card.querySelector(".card-open");
      if (btn) openItem(Number(btn.getAttribute("data-open")), btn);
    });
    $("pd-close").addEventListener("click", close);
    $("pd-close-2").addEventListener("click", close);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener("close", function () {
      document.body.classList.remove("dialog-open");
      if (lastTrigger) lastTrigger.focus();
    });
  }

  /* ---- Config wiring ---- */
  function refreshLinks() {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.href = waLink();
      a.target = "_blank";
      a.rel = "noopener";
    });
    document.querySelectorAll("[data-ask]").forEach(function (a) {
      var item = STOCK[Number(a.getAttribute("data-ask"))];
      a.href = waLink(askMessage(item));
    });
  }

  function renderHours() {
    var hours = document.getElementById("hours");
    if (!hours) return;
    hours.textContent = "";
    (C.OPENING_HOURS || []).forEach(function (row) {
      var d = el("div");
      d.appendChild(el("dt", null, lang === "ml" && row.daysMl ? row.daysMl + " / " + row.days : row.days));
      d.appendChild(el("dd", null, row.time));
      hours.appendChild(d);
    });
  }

  function applyConfig() {
    refreshLinks();
    renderHours();
    document.querySelectorAll("[data-address]").forEach(function (n) { n.textContent = C.ADDRESS || ""; });
    document.querySelectorAll("[data-address-ml]").forEach(function (n) { n.textContent = C.ADDRESS_ML || ""; });

    var fb = document.getElementById("facebook");
    if (fb) fb.href = C.FACEBOOK_URL || "#";

    var query = encodeURIComponent("Plant Palace Gardens, " + (C.ADDRESS || ""));
    var dir = document.getElementById("directions");
    if (dir) dir.href = "https://www.google.com/maps/dir/?api=1&destination=" + query;

    var map = document.getElementById("map");
    if (map) map.src = C.GOOGLE_MAPS_EMBED_URL || ("https://maps.google.com/maps?q=" + query + "&output=embed");

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---- Mobile nav ---- */
  function setupNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    function set(open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  /* ---- Language switch (English default, Malayalam optional) ---- */
  function setLang(next, save) {
    lang = next;
    document.documentElement.setAttribute("data-lang", lang);
    var t = document.getElementById("lang-toggle");
    if (t) {
      if (lang === "en") {
        t.textContent = "മലയാളം";
        t.lang = "ml";
        t.setAttribute("aria-label", "View this site in Malayalam");
      } else {
        t.textContent = "English";
        t.lang = "en";
        t.setAttribute("aria-label", "View this site in English");
      }
    }
    refreshLinks();
    renderHours();
    if (save) { try { localStorage.setItem("ppg-lang", lang); } catch (e) {} }
  }

  function setupLang() {
    var t = document.getElementById("lang-toggle");
    if (!C.ENABLE_MALAYALAM) return; // Malayalam view is switched off: stay in English
    if (t) {
      t.hidden = false;
      t.addEventListener("click", function () { setLang(lang === "en" ? "ml" : "en", true); });
    }
    var saved = null;
    try { saved = localStorage.getItem("ppg-lang"); } catch (e) {}
    if (saved === "ml") setLang("ml", false);
  }

  renderStock();
  applyConfig();
  setupNav();
  setupLang();
  setupDialog();
})();
