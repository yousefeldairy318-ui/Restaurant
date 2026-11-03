const WA = "201000000000"; // غيّر الرقم لرقم المطعم (بدون + أو صفر)
const NAME = "دار الجمر";
const PAGES = [
  ["index.html", "الرئيسية"],
  ["menu.html", "المنيو"],
  ["about.html", "قصتنا"],
  ["reserve.html", "احجز"],
  ["contact.html", "تواصل"],
];
const $ = (s) => document.querySelector(s);
const here = location.pathname.split("/").pop() || "index.html";
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

// header + footer shared by all pages
$("#hd").innerHTML = `<nav class="wrap" aria-label="القائمة الرئيسية">
  <a class="logo" href="index.html">${NAME}</a>
  <ul id="links">${PAGES.map((p) => `<li><a href="${p[0]}" class="${p[0] === here ? "on" : ""}">${p[1]}</a></li>`).join("")}</ul>
  <button class="burger" id="burger" aria-label="فتح القائمة" aria-expanded="false">☰</button></nav>`;
$("#ft").innerHTML = `<div class="wrap">
  <div><h3>${NAME}</h3><p>مشويات على الفحم الحقيقي وأطباق مصرية أصيلة.</p></div>
  <div><h3>الصفحات</h3>${PAGES.map((p) => `<a href="${p[0]}">${p[1]}</a>`).join("")}</div>
  <div><h3>زورنا</h3><p>12 شارع النيل، الجيزة<br>يوميًا من 1 ظهرًا</p></div></div>
  <p class="copy">© ${new Date().getFullYear()} ${NAME}. كل الحقوق محفوظة.</p>`;
$("#burger").addEventListener("click", (e) =>
  e.currentTarget.setAttribute(
    "aria-expanded",
    $("#links").classList.toggle("open"),
  ),
);

// sparks in the hero
const hero = $(".hero");
if (hero)
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("i");
    s.className = "sp";
    s.style.cssText = `left:${Math.random() * 100}%;animation-duration:${5 + Math.random() * 6}s;animation-delay:${Math.random() * 6}s`;
    hero.appendChild(s);
  }

// menu page
const MENU = {
  مشويات: [
    ["كباب ضاني", "نصف كيلو على الفحم مع أرز وسلطة", 260],
    ["كفتة", "نصف كيلو متبلة بخلطتنا", 210],
    ["ريش ضاني", "مشوية مع بصل وطماطم", 420],
    ["فراخ مشوية", "فرخة كاملة متبلة ليلة", 190],
    ["مشكل مشاوي", "كباب وكفتة وريش لشخصين", 380],
  ],
  مقبلات: [
    ["حمص بالطحينة", "بزيت الزيتون", 45],
    ["بابا غنوج", "باذنجان مشوي على الفحم", 50],
    ["سلطة بلدي", "خيار وطماطم وجرجير", 35],
    ["ورق عنب", "محشي بالزيت والليمون", 70],
  ],
  "أطباق رئيسية": [
    ["طاجن بامية باللحم", "بالصلصة والثوم", 230],
    ["ممبار محشي", "مشوي مع أرز بالخلطة", 120],
    ["أرز بالخلطة", "كبدة وقوانص ومكسرات", 65],
  ],
  حلويات: [
    ["أم علي", "بالمكسرات والقشطة", 60],
    ["كنافة بالقشطة", "سخنة من الفرن", 75],
    ["بسبوسة", "بجوز الهند", 45],
  ],
  مشروبات: [
    ["شاي بالنعناع", "ورق طازة", 25],
    ["عصير ليمون بالنعناع", "مثلج", 45],
    ["مياه غازية", "علبة", 25],
  ],
};
if ($("#items")) {
  let cat = Object.keys(MENU)[0],
    cart = {};
  const tabs = () =>
    ($("#tabs").innerHTML = Object.keys(MENU)
      .map(
        (c) =>
          `<button class="tab" role="tab" aria-selected="${c === cat}" data-c="${c}">${c}</button>`,
      )
      .join(""));
  const items = () =>
    ($("#items").innerHTML = MENU[cat]
      .map(
        (m, i) =>
          `<div class="item"><h3>${m[0]}</h3><p>${m[1]}</p><span class="price">${m[2]} ج</span>
     <button class="add" data-i="${i}" aria-label="أضف ${m[0]}">+</button></div>`,
      )
      .join(""));
  const draw = () => {
    const keys = Object.keys(cart);
    let total = 0,
      txt = `أهلاً ${NAME}، عايز أطلب:\n`;
    $("#order").classList.toggle("on", keys.length > 0);
    $("#list").innerHTML = keys
      .map((k) => {
        const [q, p] = cart[k];
        total += q * p;
        txt += `- ${k} × ${q}\n`;
        return `<li><span>${k} × ${q}</span><button data-r="${k}" aria-label="شيل ${k}">−</button></li>`;
      })
      .join("");
    $("#total").textContent = total + " ج";
    $("#send").href = wa(txt + `الإجمالي: ${total} ج`);
  };
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (b) {
      cat = b.dataset.c;
      tabs();
      items();
    }
  });
  $("#items").addEventListener("click", (e) => {
    const b = e.target.closest(".add");
    if (!b) return;
    const m = MENU[cat][b.dataset.i];
    cart[m[0]] = [(cart[m[0]]?.[0] || 0) + 1, m[2]];
    draw();
  });
  $("#list").addEventListener("click", (e) => {
    const k = e.target.dataset.r;
    if (k && --cart[k][0] <= 0) delete cart[k];
    draw();
  });
  $("#clear").addEventListener("click", () => {
    cart = {};
    draw();
  });
  tabs();
  items();
}

// reservation form
const book = $("#book");
if (book) {
  $("#d").min = new Date().toISOString().split("T")[0];
  book.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (id) => $(id).value.trim();
    if (!v("#n") || !/^01[0-9]{9}$/.test(v("#p")) || !v("#d") || !v("#t")) {
      $("#msg").textContent =
        "كمّل الاسم والتاريخ والساعة، ورقم الموبايل لازم 11 رقم يبدأ بـ 01.";
      return;
    }
    $("#msg").textContent = "";
    window.open(
      wa(
        `حجز جديد\nالاسم: ${v("#n")}\nالموبايل: ${v("#p")}\nاليوم: ${v("#d")}\nالساعة: ${v("#t")}\nالعدد: ${v("#g")}\nملاحظات: ${v("#nt") || "-"}`,
      ),
      "_blank",
      "noopener",
    );
  });
}

// contact form
const contact = $("#contact");
if (contact)
  contact.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#cn").value.trim(),
      m = $("#cm").value.trim();
    if (!n || !m) {
      $("#msg").textContent = "اكتب اسمك ورسالتك الأول.";
      return;
    }
    $("#msg").textContent = "";
    window.open(wa(`رسالة من ${n}:\n${m}`), "_blank", "noopener");
  });
