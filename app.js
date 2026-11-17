// BALABALA 选衣空间 · 交互脚本（无依赖；试穿 SDK 仅在已配置密钥时按需加载）
const STORAGE_KEY = "balabala-rail:v1";
const DECART_SDK = "https://esm.sh/@decartai/sdk@0.2.14";
const VIEWS = ["rail", "about", "shop", "receipt"];
const CATEGORIES = { all: "全部", outerwear: "外套", vest: "马甲", hoodie: "卫衣", polo: "Polo", trousers: "裤装", accessories: "配饰" };
const KID_SIZES = ["110", "120", "130", "140", "150", "160"];

// 换款式只改这里：img 放进 assets/products/，prompt 是给试穿模型的英文描述（20–30 词，写清颜色/材质/版型）。
const PRODUCTS = [
  { id: "bala-01", code: "001", name: "薄荷绿马甲叠穿", en: "Mint Puffer Vest Layered Look", category: "vest", color: "薄荷绿 / 麻灰", img: "assets/products/01.png", ar: 1.528, depth: 0.15, tall: 1.08, tile: "#cfe9e1",
    description: "薄荷绿绗缝马甲叠在麻灰连帽衫外面，胸口一枚 IT'S FUN TO FLY 机尾徽章。",
    prompt: "Substitute the current top with a mint green quilted puffer vest with a stand collar and zip front, layered over a heather grey hoodie with long sleeves" },
  { id: "bala-02", code: "002", name: "撞色拼接牛仔外套", en: "Colour-Block Denim Jacket", category: "outerwear", color: "牛仔蓝 / 橙 / 白", img: "assets/products/02.png", ar: 1.871, depth: 0.12, tall: 1, tile: "#d8dde6",
    description: "水洗牛仔衣身，深灰牛仔过肩，米白尼龙袖上一道橙色臂章。",
    prompt: "Substitute the current top with a light blue washed denim trucker jacket with a dark grey denim yoke, off-white nylon sleeves with a bright orange band, and metal buttons" },
  { id: "bala-03", code: "003", name: "浅蓝拼贴牛仔裤", en: "Light Blue Collage Jeans", category: "trousers", color: "浅蓝 / 多彩", img: "assets/products/03.png", ar: 0.68, depth: 0.075, tall: 1.45, tile: "#e8e2d3",
    description: "浅蓝直筒裤身印满三角拼贴和 WEIRD / NICE 字样，侧缝拼灰色针织。",
    prompt: "Substitute the current bottoms with light blue straight-leg jeans printed with scattered colourful triangle patches and lettering, with grey knit side panels" },
  { id: "bala-04", code: "004", name: "黄红贴布连帽卫衣", en: "Patchwork Hoodie", category: "hoodie", color: "麻灰 / 黄 / 红", img: "assets/products/04.png", ar: 1.469, depth: 0.13, tall: 1, tile: "#f0d48a",
    description: "麻灰卫衣，胸前四块毛边黄色贴布拼出红色图形，帽里是薄荷绿。",
    prompt: "Substitute the current top with a heather grey pullover hoodie with a mint green hood lining and four raw-edged yellow fabric patches with red shapes across the chest" },
  { id: "bala-05", code: "005", name: "彩色拼贴绗缝外套", en: "Collage Print Puffer Jacket", category: "outerwear", color: "米白 / 多彩", img: "assets/products/05.png", ar: 1.324, depth: 0.16, tall: 1.05, tile: "#e6c9cf",
    description: "米白底上铺满彩色三角字母拼贴，连帽、拉链、松紧袖口和下摆。",
    prompt: "Substitute the current top with a cream hooded puffer jacket covered in a dense multicolour triangular collage print of letters, with a zip front and elastic cuffs and hem" },
  { id: "bala-06", code: "006", name: "橙袋迷彩工装裤", en: "Camo Cargo Trousers", category: "trousers", color: "军绿 / 卡其 / 橙", img: "assets/products/06.png", ar: 0.601, depth: 0.08, tall: 1.45, tile: "#c9cdb6",
    description: "军绿卡其迷彩，两只大工装袋配亮橙色袋盖。",
    prompt: "Substitute the current bottoms with olive and khaki camouflage cargo trousers with large side cargo pockets topped by bright orange pocket flaps and a straight relaxed leg" },
  { id: "bala-07", code: "007", name: "深蓝拼贴牛仔裤", en: "Dark Blue Collage Jeans", category: "trousers", color: "深蓝 / 多彩", img: "assets/products/07.png", ar: 0.71, depth: 0.075, tall: 1.45, tile: "#c5cee3",
    description: "和浅蓝款同一套拼贴图案，换成深靛蓝裤身和黑色侧拼。",
    prompt: "Substitute the current bottoms with dark indigo wide-leg jeans printed with scattered colourful triangle patches and lettering, with black side panels" },
  { id: "bala-08", code: "008", name: "撞领 Polo 卫衣", en: "Contrast-Collar Polo Sweatshirt", category: "polo", color: "麻灰 / 深蓝", img: "assets/products/08.png", ar: 2.011, depth: 0.12, tall: .98, tile: "#d9d9d6",
    description: "麻灰卫衣料配深蓝牛仔翻领，按扣门襟，胸前 BALABALA 字母。",
    prompt: "Substitute the current top with a heather grey long-sleeve polo sweatshirt with a navy denim collar, snap button placket, front kangaroo pocket and black BALABALA lettering on the chest" },
  { id: "bala-09", code: "009", name: "撞色翻盖双肩包", en: "Explorer Flap Backpack", category: "accessories", color: "米色 / 橙 / 蓝", img: "assets/products/09.png", ar: 0.84, depth: 0.2, tall: .95, tile: "#f1dcc4", sizes: ["均码"],
    description: "米色翻盖双肩包，橙色滚边、蓝色插扣织带，红色 EXPLORER MODE 拉链条。",
    prompt: "Add a beige flap-top backpack with orange trim, a blue buckle strap, a red zip pocket and mesh side pockets to the person's back, with straps over both shoulders" }
];
// 单文件版（dist/ 里的独立 HTML）会把图片以 base64 放在 window.__ASSETS 里；这里换成短的 blob 地址再用。
// 正常经服务器访问时没有 __ASSETS，路径原样返回。
function asset(path) {
  const data = window.__ASSETS?.[path];
  if (!data) return path;
  const bytes = Uint8Array.from(atob(data.slice(data.indexOf(",") + 1)), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: data.slice(5, data.indexOf(";")) }));
}
PRODUCTS.forEach((product) => { product.img = asset(product.img); });
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
const sizesOf = (p) => p.sizes || KID_SIZES;
const defaultSize = (p) => (p.sizes ? p.sizes[0] : "130");

const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi));
const pad2 = (n) => String(n).padStart(2, "0");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = { view: "rail", category: "all", basket: [], sound: false, storageOkay: true };
let activeId = null;
let activeSize = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function picture(product, className) {
  const img = el("img", className);
  img.src = product.img;
  img.alt = product.name;
  img.draggable = false;
  img.decoding = "async";
  return img;
}

/* ---------- 提示与声音 ---------- */
let toastTimer;
function announce(message) {
  const toast = $("toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

let audio;
function blip(freq = 880, duration = 0.05, type = "triangle", gain = 0.05) {
  if (!state.sound) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(gain, audio.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    osc.connect(amp).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  } catch { /* 没有音频设备时静默 */ }
}
const sfx = {
  tick: () => blip(1250, 0.03, "square", 0.018),
  turn: () => blip(420, 0.09, "sine", 0.05),
  drop: () => { blip(180, 0.14, "sine", 0.12); setTimeout(() => blip(2400, 0.04, "triangle", 0.03), 60); },
  remove: () => blip(300, 0.08, "sine", 0.05),
  print: () => blip(90 + Math.random() * 50, 0.035, "sawtooth", 0.03)
};
function renderSound() {
  document.querySelectorAll(".sound-toggle").forEach((button) => {
    button.textContent = state.sound ? "SOUND ON" : "SOUND OFF";
    button.setAttribute("aria-pressed", String(state.sound));
  });
}

/* ---------- 本地保存 ---------- */
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return;
    state.sound = Boolean(saved.sound);
    const seen = new Set();
    state.basket = (Array.isArray(saved.basket) ? saved.basket : []).flatMap((item) => {
      const product = item && byId.get(item.id);
      if (!product || seen.has(item.id)) return [];
      seen.add(item.id);
      return [{
        id: item.id,
        size: sizesOf(product).includes(item.size) ? item.size : defaultSize(product),
        x: clamp(Number(item.x) || 0, 0, 0.9), y: clamp(Number(item.y) || 0, 0, 0.9)
      }];
    });
  } catch { state.storageOkay = false; }
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ basket: state.basket, sound: state.sound }));
    state.storageOkay = true;
  } catch { state.storageOkay = false; }
}

/* ---------- 视图切换 ---------- */
function setView(view) {
  if (!VIEWS.includes(view)) view = "rail";
  if (view === "receipt" && !state.basket.length) {
    announce("购物篮还是空的，先挑一件再打小票。");
    location.hash = "shop";
    return;
  }
  state.view = view;
  document.body.dataset.view = view;
  VIEWS.forEach((name) => { $(`view-${name}`).hidden = name !== view; });
  window.scrollTo(0, 0);
  if (view === "receipt") printReceipt();
  if (view === "rail") requestAnimationFrame(layoutRail);
  syncFittingPill();
}
function route() { setView((location.hash || "#rail").slice(1)); }

/* ---------- ① 衣杆 ---------- */
const rail = { offset: 0, min: 0, velocity: 0, dragging: false, moved: 0, startX: 0, startOffset: 0, lastX: 0, lastT: 0, raf: 0, px: 0, tx: 0, py: 0, ty: 0 };
const HOOK = '<svg class="hook" viewBox="0 0 18 30" aria-hidden="true"><path d="M9 30V15c0-5 6-4 6-9a6 6 0 0 0-11-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

// 只有一张正面图，也要挂出体积：把图切成竖条，贴在一条向前鼓起的弧线上（像穿在身上的前片），
// 纹理不拉伸，再按朝向加明暗。
// 单位全用 em（1em = 衣服高度）。ar = 图片宽高比，depth = 最厚处的半厚度。
function garment3D(product, strips = 24) {
  const box = el("div", "hang-garment");
  box.setAttribute("role", "img");
  box.setAttribute("aria-label", product.name);
  box.style.setProperty("--ar", product.ar);
  box.style.setProperty("--bulge", product.depth * 1.5);   // 让领口（最鼓处）正好挂在衣钩下
  const profile = (x) => product.depth * 1.5 * Math.cos(((x / product.ar) * 2 - 1) * Math.PI / 2);

  const stripWidth = product.ar / strips;
  for (let i = 0; i < strips; i += 1) {
    const x0 = i * stripWidth;
    const z0 = profile(x0);
    const dz = profile(x0 + stripWidth) - z0;
    const angle = -Math.atan2(dz, stripWidth);
    const strip = el("span", "strip");
    strip.style.width = `${stripWidth.toFixed(4)}em`;
    strip.style.backgroundImage = `url("${product.img}")`;
    strip.style.backgroundSize = `${product.ar}em 1em`;
    strip.style.backgroundPosition = `${(-x0).toFixed(4)}em 0`;
    strip.style.transform = `translate3d(${x0.toFixed(4)}em, 0, ${z0.toFixed(4)}em) rotateY(${angle.toFixed(4)}rad) scaleX(${(Math.hypot(stripWidth, dz) / stripWidth * 1.03).toFixed(4)})`;
    // 光从左前方来：朝左的面亮一点，朝右的面暗一点
    strip.style.filter = `brightness(${clamp(0.93 + Math.sin(angle) * 0.75, 0.6, 1.12).toFixed(3)})`;
    box.append(strip);
  }
  return box;
}

function buildRail() {
  const track = $("rail-track");
  PRODUCTS.forEach((product, index) => {
    const hang = el("div", "hang");
    hang.dataset.id = product.id;
    hang.tabIndex = 0;
    hang.setAttribute("role", "button");
    hang.setAttribute("aria-label", `${product.code} ${product.name}，查看详情`);
    const swing = el("div", "hang-swing");
    swing.style.setProperty("--delay", `${-index * 0.83}s`);
    swing.innerHTML = HOOK;
    const garment = garment3D(product);
    garment.style.setProperty("--tall", product.tall);
    garment.style.setProperty("--side", `${[70, 66, 72, 68, 71][index % 5]}deg`);
    const label = el("span", "hang-label");
    label.append(el("span", "num", product.code), el("span", "name", product.en.toUpperCase()));
    swing.append(garment, label);
    hang.append(swing, el("span", "hang-shadow"));
    hang.addEventListener("pointerenter", () => { $("rail-current").textContent = pad2(index + 1); sfx.turn(); });
    hang.addEventListener("focus", () => { $("rail-current").textContent = pad2(index + 1); });
    track.append(hang);
  });
  $("rail-total").textContent = pad2(PRODUCTS.length);
}

function layoutRail() {
  const stage = $("rail-stage");
  const track = $("rail-track");
  rail.min = Math.min(0, stage.clientWidth - track.scrollWidth);
  // 衣服比屏幕窄时居中
  if (track.scrollWidth <= stage.clientWidth) rail.offset = (stage.clientWidth - track.scrollWidth) / 2;
  else rail.offset = clamp(rail.offset, rail.min, 0);
  paintRail();
}
function paintRail() {
  $("rail-track").style.transform = `translate3d(${rail.offset - rail.px * 20}px, ${rail.py * -6}px, 0)`;
}
function railLoop() {
  rail.px += (rail.tx - rail.px) * 0.07;
  rail.py += (rail.ty - rail.py) * 0.07;
  if (!rail.dragging && Math.abs(rail.velocity) > 0.02 && rail.min < 0) {
    rail.offset = clamp(rail.offset + rail.velocity * 16, rail.min, 0);
    rail.velocity *= 0.94;
  }
  if (state.view === "rail" || state.view === "about") {
    const view = $(`view-${state.view}`);
    view.style.setProperty("--px", rail.px.toFixed(3));
    view.style.setProperty("--py", rail.py.toFixed(3));
    if (state.view === "rail") paintRail();
    else paintRing();
  }
  requestAnimationFrame(railLoop);
}

function bindRail() {
  const stage = $("rail-stage");
  stage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    Object.assign(rail, { dragging: true, moved: 0, startX: event.clientX, startOffset: rail.offset, lastX: event.clientX, lastT: performance.now(), velocity: 0 });
  });
  window.addEventListener("pointermove", (event) => {
    if (!reduceMotion) {
      rail.tx = (event.clientX / innerWidth) * 2 - 1;
      rail.ty = (event.clientY / innerHeight) * 2 - 1;
    }
    if (!rail.dragging) return;
    const dx = event.clientX - rail.startX;
    rail.moved = Math.max(rail.moved, Math.abs(dx));
    if (rail.moved > 5) stage.classList.add("is-dragging");
    if (rail.min < 0) {
      rail.offset = clamp(rail.startOffset + dx, rail.min, 0);
      const now = performance.now();
      rail.velocity = (event.clientX - rail.lastX) / Math.max(1, now - rail.lastT);
      rail.lastX = event.clientX;
      rail.lastT = now;
    }
  });
  const end = () => { rail.dragging = false; stage.classList.remove("is-dragging"); };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  stage.addEventListener("wheel", (event) => {
    if (rail.min >= 0) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const next = clamp(rail.offset - delta, rail.min, 0);
    if (next !== rail.offset) { event.preventDefault(); rail.offset = next; }
  }, { passive: false });
  $("rail-track").addEventListener("click", (event) => {
    const hang = event.target.closest(".hang");
    if (hang && rail.moved <= 5) openProduct(hang.dataset.id);
  });
  $("rail-track").addEventListener("keydown", (event) => {
    const hang = event.target.closest(".hang");
    if (hang && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openProduct(hang.dataset.id); }
  });
  document.querySelector(".face-toggle").addEventListener("click", (event) => {
    const button = event.target.closest("[data-face]");
    if (!button) return;
    $("rail-track").dataset.face = button.dataset.face;
    document.querySelectorAll(".face-toggle button").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    sfx.turn();
    setTimeout(layoutRail, 750);
  });
  window.addEventListener("resize", layoutRail);
}

/* ---------- ② 环形画廊 ---------- */
const ring = { spin: 0, velocity: 0.06, dragging: false, lastX: 0 };
const RING_RADIUS = 760;
function buildRing() {
  const step = 360 / PRODUCTS.length;
  PRODUCTS.forEach((product, index) => {
    const card = el("div", "ring-card");
    card.dataset.angle = index * step;
    card.style.setProperty("--tile", product.tile);
    card.style.transform = `rotateY(${index * step}deg) translateZ(${-RING_RADIUS}px)`;
    const figure = el("figure");
    const tile = el("div", "tile");
    tile.append(picture(product));
    const caption = el("figcaption", "", product.name);
    caption.append(el("span", "", `${product.code} / ${product.en}`));
    figure.append(tile, caption);
    card.append(figure);
    $("ring").append(card);
  });
  const scene = $("ring-scene");
  scene.addEventListener("pointerdown", (event) => { ring.dragging = true; ring.lastX = event.clientX; ring.velocity = 0; scene.classList.add("is-dragging"); });
  window.addEventListener("pointermove", (event) => {
    if (!ring.dragging) return;
    ring.velocity = (event.clientX - ring.lastX) * 0.09;
    ring.spin += ring.velocity;
    ring.lastX = event.clientX;
  });
  const end = () => { ring.dragging = false; scene.classList.remove("is-dragging"); };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  scene.addEventListener("wheel", (event) => { event.preventDefault(); ring.velocity = clamp(-(event.deltaX || event.deltaY) * 0.01, -2, 2); }, { passive: false });
}
function paintRing() {
  if (!ring.dragging) {
    ring.spin += ring.velocity;
    const cruise = reduceMotion ? 0 : 0.06 * (ring.velocity < 0 ? -1 : 1);
    ring.velocity += (cruise - ring.velocity) * 0.03;
  }
  $("ring").style.transform = `translateZ(420px) rotateY(${-ring.spin}deg)`;
  // 只画镜头前方的卡片，身后的隐藏
  document.querySelectorAll(".ring-card").forEach((card) => {
    const relative = (((Number(card.dataset.angle) - ring.spin) % 360) + 540) % 360 - 180;
    card.style.visibility = Math.abs(relative) < 96 ? "visible" : "hidden";
  });
}

/* ---------- ③ 选衣空间 ---------- */
const inBasket = (id) => state.basket.find((item) => item.id === id);
function visibleProducts() {
  return PRODUCTS.filter((p) => state.category === "all" || p.category === state.category);
}

function renderPills() {
  const nav = $("category-nav");
  nav.replaceChildren();
  Object.entries(CATEGORIES).forEach(([key, label]) => {
    const button = el("button", "", label);
    button.type = "button";
    button.dataset.category = key;
    button.setAttribute("aria-pressed", String(state.category === key));
    if (key === "all") button.append(el("span", "n", pad2(PRODUCTS.length)));
    nav.append(button);
  });
}

function renderCatalog() {
  const grid = $("catalog-grid");
  const products = visibleProducts();
  grid.replaceChildren();
  for (const product of products) {
    const selected = Boolean(inBasket(product.id));
    const card = el("article", "product-card");
    card.dataset.id = product.id;
    card.classList.toggle("is-selected", selected);
    const badge = el("button", "tryon-badge", "Try-On");
    badge.type = "button";
    badge.dataset.action = "tryon";
    badge.setAttribute("aria-label", `实时试穿${product.name}`);
    const photo = el("button", "photo-button");
    photo.type = "button";
    photo.dataset.action = "detail";
    photo.draggable = true;
    photo.setAttribute("aria-label", `查看${product.name}`);
    photo.append(picture(product));
    const info = el("div", "product-info");
    info.append(el("h3", "product-name", product.name), el("p", "product-meta", `${CATEGORIES[product.category]} · ${product.color}`));
    const add = el("button", "add-button", selected ? "✓" : "+");
    add.type = "button";
    add.dataset.action = "toggle";
    add.classList.toggle("is-selected", selected);
    add.setAttribute("aria-pressed", String(selected));
    add.setAttribute("aria-label", selected ? `从购物篮移除${product.name}` : `将${product.name}放入购物篮`);
    card.append(badge, photo, info, add);
    grid.append(card);
  }
  $("catalog-count").textContent = `${pad2(products.length)} 件单品 · 自由挑选`;
  $("catalog-empty").hidden = products.length > 0;
}

const ROTATIONS = [-7, 5, -3, 8, -5, 3, 6, -8, 4];
const SLOTS = [
  { x: 0.04, y: 0.04 }, { x: 0.52, y: 0.10 }, { x: 0.06, y: 0.52 }, { x: 0.50, y: 0.56 }, { x: 0.28, y: 0.30 },
  { x: 0.30, y: 0.00 }, { x: 0.02, y: 0.28 }, { x: 0.54, y: 0.33 }, { x: 0.27, y: 0.60 }
];
function renderBasket() {
  const layer = $("basket-cards");
  layer.replaceChildren();
  state.basket.forEach((item, index) => {
    const product = byId.get(item.id);
    const card = el("div", "basket-card");
    card.dataset.id = item.id;
    card.tabIndex = 0;
    card.setAttribute("role", "group");
    card.setAttribute("aria-label", `${product.name}，${item.size}。可拖动，或用方向键移动。`);
    card.style.left = `${item.x * 100}%`;
    card.style.top = `${item.y * 100}%`;
    card.style.setProperty("--rotation", `${ROTATIONS[index % ROTATIONS.length]}deg`);
    const remove = el("button", "remove-button", "×");
    remove.type = "button";
    remove.dataset.action = "remove";
    remove.setAttribute("aria-label", `从购物篮移除${product.name}`);
    card.append(picture(product), el("span", "basket-card-name", product.name), remove);
    layer.append(card);
  });
  const count = state.basket.length;
  $("cart-count").textContent = pad2(count);
  $("cart-chip").classList.toggle("has-items", count > 0);
  $("basket-empty").hidden = count > 0;
  $("basket-summary").textContent = state.storageOkay ? `已选 ${count} 件 · 自动保存` : `已选 ${count} 件 · 浏览器未允许保存`;
  $("clear-basket").disabled = count === 0;
  $("receipt-open").disabled = count === 0;
}
function renderShop() { renderCatalog(); renderBasket(); }

function addProduct(id, size, position) {
  const product = byId.get(id);
  if (!product) return;
  const existing = inBasket(id);
  if (existing) {
    if (size) existing.size = size;
    if (position) Object.assign(existing, position);
    announce(`${product.name}已在篮中${size ? `，尺码改为 ${size}` : ""}。`);
  } else {
    state.basket.push({ id, size: size || defaultSize(product), ...SLOTS[state.basket.length % SLOTS.length], ...position });
    announce(`${product.name}已放入购物篮。`);
    sfx.drop();
    const chip = $("cart-chip");
    chip.classList.remove("bump");
    void chip.offsetWidth;
    chip.classList.add("bump");
  }
  save();
  renderShop();
  if (activeId) renderDetailButtons();
}
function removeProduct(id) {
  state.basket = state.basket.filter((item) => item.id !== id);
  save();
  renderShop();
  if (activeId) renderDetailButtons();
  sfx.remove();
}

// 篮内卡片：拖动 / 方向键移动
let cardDrag = null;
function basketBounds(card) {
  const layer = $("basket-cards");
  return { w: layer.clientWidth, h: layer.clientHeight, maxX: 1 - card.offsetWidth / layer.clientWidth, maxY: 1 - card.offsetHeight / layer.clientHeight };
}
function bindBasket() {
  const layer = $("basket-cards");
  layer.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    const card = event.target.closest(".basket-card");
    const item = card && inBasket(card.dataset.id);
    if (!item) return;
    event.preventDefault();
    cardDrag = { id: event.pointerId, card, item, x0: event.clientX, y0: event.clientY, ix: item.x, iy: item.y, bounds: basketBounds(card), moved: false };
    card.classList.add("is-dragging");
    card.style.zIndex = "20";
    card.focus({ preventScroll: true });
    try { card.setPointerCapture(event.pointerId); } catch { /* 旧浏览器 */ }
  });
  window.addEventListener("pointermove", (event) => {
    if (!cardDrag || event.pointerId !== cardDrag.id) return;
    const { item, card, bounds } = cardDrag;
    cardDrag.moved = true;
    item.x = clamp(cardDrag.ix + (event.clientX - cardDrag.x0) / bounds.w, -0.08, bounds.maxX + 0.08);
    item.y = clamp(cardDrag.iy + (event.clientY - cardDrag.y0) / bounds.h, -0.08, bounds.maxY + 0.08);
    card.style.left = `${item.x * 100}%`;
    card.style.top = `${item.y * 100}%`;
  });
  const end = (event) => {
    if (!cardDrag || event.pointerId !== cardDrag.id) return;
    cardDrag.card.classList.remove("is-dragging");
    cardDrag.card.style.zIndex = "";
    if (cardDrag.moved) save();
    cardDrag = null;
  };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  layer.addEventListener("click", (event) => {
    const card = event.target.closest(".basket-card");
    if (card && event.target.closest("[data-action='remove']")) removeProduct(card.dataset.id);
  });
  layer.addEventListener("keydown", (event) => {
    const card = event.target.closest(".basket-card");
    const item = card && inBasket(card.dataset.id);
    if (!item || event.target.closest("button")) return;
    if (event.key === "Delete" || event.key === "Backspace") return removeProduct(item.id);
    const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!moves) return;
    event.preventDefault();
    const step = event.shiftKey ? 0.08 : 0.03;
    const bounds = basketBounds(card);
    item.x = clamp(item.x + moves[0] * step, 0, bounds.maxX);
    item.y = clamp(item.y + moves[1] * step, 0, bounds.maxY);
    card.style.left = `${item.x * 100}%`;
    card.style.top = `${item.y * 100}%`;
    save();
  });
}

// 从货架拖到购物篮：用浏览器原生拖放。这样同一个拖动也能把衣服图直接丢进 Anywear 插件的试穿窗
// （插件监听的就是原生 dragstart，并从被拖元素里找 <img> 的地址）。触屏设备用 + 按钮。
let suppressClickUntil = 0;
function bindShelfDrag() {
  const grid = $("catalog-grid");
  const zone = $("basket-zone");
  let draggingId = null;
  grid.addEventListener("dragstart", (event) => {
    const photo = event.target.closest?.(".photo-button");
    if (!photo || !event.dataTransfer) return;
    const card = photo.closest(".product-card");
    const product = byId.get(card.dataset.id);
    draggingId = product.id;
    setGarmentCrumb(product.id);
    const absolute = new URL(product.img, location.href).href;
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", absolute);
    event.dataTransfer.setData("text/uri-list", absolute);
    event.dataTransfer.setData("application/x-balabala-id", product.id);
    const img = photo.querySelector("img");
    if (img) event.dataTransfer.setDragImage(img, img.offsetWidth / 2, img.offsetHeight / 2);
    card.classList.add("is-lifted");
    sfx.tick();
  });
  grid.addEventListener("dragend", () => {
    draggingId = null;
    suppressClickUntil = Date.now() + 250;
    zone.classList.remove("is-dragover");
    grid.querySelectorAll(".is-lifted").forEach((card) => card.classList.remove("is-lifted"));
  });
  zone.addEventListener("dragover", (event) => {
    if (!draggingId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    zone.classList.add("is-dragover");
  });
  zone.addEventListener("dragleave", (event) => { if (!zone.contains(event.relatedTarget)) zone.classList.remove("is-dragover"); });
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("is-dragover");
    const id = event.dataTransfer.getData("application/x-balabala-id") || draggingId;
    if (!byId.has(id)) return;
    const rect = $("basket-cards").getBoundingClientRect();
    addProduct(id, null, {
      x: clamp((event.clientX - rect.left) / rect.width - 0.22, 0, 0.56),
      y: clamp((event.clientY - rect.top) / rect.height - 0.2, 0, 0.6)
    });
  });
}

function bindShop() {
  $("category-nav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderPills();
    renderCatalog();
    sfx.tick();
  });
  $("reset-filter").addEventListener("click", () => { state.category = "all"; renderPills(); renderCatalog(); });
  $("catalog-grid").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    const card = event.target.closest(".product-card");
    if (!button || !card || Date.now() < suppressClickUntil) return;
    const id = card.dataset.id;
    if (button.dataset.action === "detail") openProduct(id);
    if (button.dataset.action === "tryon") openTryOn(id);
    if (button.dataset.action === "toggle") inBasket(id) ? removeProduct(id) : addProduct(id);
  });
  $("clear-basket").addEventListener("click", () => {
    state.basket = [];
    save();
    renderShop();
    announce("购物篮已清空。");
  });
  $("receipt-open").addEventListener("click", () => { location.hash = "receipt"; });
  $("cart-chip").addEventListener("click", () => $("basket-panel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }));
}

/* ---------- 详情 ---------- */
function renderDetailButtons() {
  const item = inBasket(activeId);
  $("detail-add").textContent = item ? (item.size === activeSize ? "已在购物篮 ✓" : `改为 ${activeSize} 码`) : "放进购物篮";
  document.querySelectorAll("#detail-size button").forEach((button) => button.setAttribute("aria-checked", String(button.dataset.size === activeSize)));
}
function openProduct(id) {
  const product = byId.get(id);
  if (!product) return;
  activeId = id;
  activeSize = inBasket(id)?.size || defaultSize(product);
  // 用背景图而不是 <img>：弹窗在浏览器顶层，Anywear 的试穿窗会被它挡住，所以不让插件在这里挂按钮
  $("detail-image").style.backgroundImage = `url("${product.img}")`;
  $("detail-image").setAttribute("aria-label", product.name);
  document.querySelector(".detail-turner").classList.remove("is-turned");
  $("detail-code").textContent = `${product.code} / ${product.en}`;
  $("detail-name").textContent = product.name;
  $("detail-meta").textContent = `${CATEGORIES[product.category]} / ${product.color}`;
  $("detail-description").textContent = product.description;
  const sizes = $("detail-size");
  sizes.replaceChildren(...sizesOf(product).map((size) => {
    const button = el("button", "", size);
    button.type = "button";
    button.dataset.size = size;
    button.setAttribute("role", "radio");
    return button;
  }));
  renderDetailButtons();
  const dialog = $("product-dialog");
  if (!dialog.open) dialog.showModal();
}
function bindDetail() {
  const dialog = $("product-dialog");
  $("detail-size").addEventListener("click", (event) => {
    const button = event.target.closest("[data-size]");
    if (!button) return;
    activeSize = button.dataset.size;
    renderDetailButtons();
    sfx.tick();
  });
  $("detail-add").addEventListener("click", () => addProduct(activeId, activeSize));
  $("detail-turn").addEventListener("click", () => { document.querySelector(".detail-turner").classList.toggle("is-turned"); sfx.turn(); });
  $("detail-tryon").addEventListener("click", () => { const id = activeId; dialog.close(); openTryOn(id); });
  dialog.addEventListener("close", () => { activeId = null; });
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) return dialog.close();
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}

/* ---------- ④ 小票 ---------- */
let printAnimation;
let printTicker;
function stamp() {
  const parts = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type).value;
  return { text: `${get("year")}.${get("month")}.${get("day")} ${get("hour")}:${get("minute")}`, digits: `${get("year")}${get("month")}${get("day")}${get("hour")}${get("minute")}` };
}
function buildReceipt() {
  const time = stamp();
  $("receipt-items").replaceChildren(...state.basket.map((item, index) => {
    const product = byId.get(item.id);
    const row = el("div", "receipt-item");
    const text = el("div");
    text.append(
      el("p", "receipt-item-name", product.name),
      el("p", "receipt-item-meta", `${product.color} · ${item.size}`),
      el("p", "receipt-item-meta", `${pad2(index + 1)} / ${product.en}`)
    );
    row.append(picture(product), text, el("span", "receipt-item-qty", "01"));
    return row;
  }));
  $("receipt-date").textContent = time.text;
  $("receipt-id").textContent = `NO. BLA-${time.digits}`;
  $("receipt-total").textContent = pad2(state.basket.length);
}
function printReceipt() {
  buildReceipt();
  const paper = $("receipt-paper");
  const view = $("view-receipt");
  const status = $("print-status");
  const setStatus = (text) => { status.lastChild.textContent = text; };
  printAnimation?.cancel();
  clearInterval(printTicker);
  paper.classList.remove("is-out");
  if (reduceMotion || !paper.animate) {
    paper.classList.add("is-out");
    setStatus("打印完成 · 好眼光。");
    return;
  }
  view.classList.add("is-printing");
  setStatus("正在打印，这里慢慢成形…");
  const duration = 1800 + state.basket.length * 650;
  printAnimation = paper.animate(
    [{ transform: "translateY(-101%)" }, { transform: "translateY(0)" }],
    { duration, easing: `steps(${Math.round(duration / 55)}, end)`, fill: "forwards" }
  );
  printTicker = setInterval(sfx.print, 70);
  const done = () => {
    clearInterval(printTicker);
    view.classList.remove("is-printing");
    paper.classList.add("is-out");
    setStatus("打印完成 · 好眼光。");
    blip(1560, 0.12, "sine", 0.05);
  };
  printAnimation.finished.then(done, () => { clearInterval(printTicker); view.classList.remove("is-printing"); });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
async function saveReceiptImage() {
  const items = state.basket.map((item) => ({ item, product: byId.get(item.id) }));
  const images = await Promise.all(items.map(({ product }) => loadImage(product.img)));
  const W = 380, rowH = 78, top = 132, bottom = 210, scale = 3;
  const H = top + items.length * rowH + bottom;
  const canvas = el("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const g = canvas.getContext("2d");
  g.scale(scale, scale);
  g.fillStyle = "#fbfaf4";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#151515";
  const mono = (size) => `${size}px ui-monospace, Menlo, Consolas, monospace`;
  const sans = (size, weight = 700) => `${weight} ${size}px "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif`;
  const dashed = (y) => { g.save(); g.setLineDash([3, 3]); g.strokeStyle = "#0008"; g.beginPath(); g.moveTo(24, y); g.lineTo(W - 24, y); g.stroke(); g.restore(); };
  g.textAlign = "center";
  g.font = sans(28, 800);
  g.fillText("BALABALA", W / 2, 52);
  g.font = mono(8.5);
  g.fillStyle = "#555";
  g.fillText("YOUR FITTING RECORD / 选衣记录", W / 2, 72);
  g.textAlign = "left";
  g.fillText($("receipt-date").textContent, 24, 98);
  g.textAlign = "right";
  g.fillText($("receipt-id").textContent, W - 24, 98);
  dashed(108);
  g.textAlign = "left";
  g.fillText("ITEM / 单品", 24, 122);
  g.textAlign = "right";
  g.fillText("QTY", W - 24, 122);
  dashed(130);
  items.forEach(({ item, product }, index) => {
    const y = top + index * rowH;
    const img = images[index];
    const fit = Math.min(56 / img.width, 56 / img.height);
    g.save();
    if ("filter" in g) g.filter = "grayscale(1) contrast(1.15)";
    g.drawImage(img, 24 + (56 - img.width * fit) / 2, y + 11 + (56 - img.height * fit) / 2, img.width * fit, img.height * fit);
    g.restore();
    g.textAlign = "left";
    g.fillStyle = "#151515";
    g.font = sans(13);
    g.fillText(product.name, 96, y + 30);
    g.font = mono(8.5);
    g.fillStyle = "#555";
    g.fillText(`${product.color} · ${item.size}`, 96, y + 46);
    g.fillText(`${pad2(index + 1)} / ${product.en}`, 96, y + 60);
    g.textAlign = "right";
    g.fillStyle = "#151515";
    g.fillText("01", W - 24, y + 28);
    g.fillStyle = "#00000018";
    g.fillRect(24, y + rowH - 1, W - 48, 1);
  });
  const y = top + items.length * rowH;
  dashed(y + 14);
  g.fillStyle = "#151515";
  g.textAlign = "left";
  g.font = mono(9);
  g.fillText("TOTAL ITEMS / 共", 24, y + 44);
  g.textAlign = "right";
  g.fillText("件", W - 24, y + 44);
  g.font = mono(26);
  g.fillText(pad2(items.length), W - 44, y + 46);
  g.textAlign = "center";
  g.font = mono(9);
  g.fillText("G O O D   C H O I C E S .", W / 2, y + 86);
  g.fillText("T A K E   T H E M   W I T H   Y O U .", W / 2, y + 102);
  g.fillStyle = "#666";
  g.font = mono(8);
  g.fillText("选衣记录 · 非付款凭证", W / 2, y + 124);
  g.fillStyle = "#111";
  for (let x = 44, i = 0; x < W - 44; i += 1) { const w = [2, 1, 3, 1, 2, 4][i % 6]; if (i % 2 === 0) g.fillRect(x, y + 138, w, 32); x += w; }
  g.fillStyle = "#666";
  g.fillText("WEIRD BUT NICE", W / 2, y + 188);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const link = el("a");
  link.href = URL.createObjectURL(blob);
  link.download = `balabala-receipt-${stamp().digits}.png`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  announce("小票图片已开始下载。");
}
function bindReceipt() {
  $("reprint").addEventListener("click", printReceipt);
  $("print-pdf").addEventListener("click", () => { printAnimation?.finish(); window.print(); });
  $("save-receipt").addEventListener("click", () => saveReceiptImage().catch(() => announce("小票图片生成失败，可改用「打印 / PDF」。")));
}

/* ---------- Anywear 实时试穿 ---------- */
// 已配置 DECART_API_KEY：摄像头画面经 WebRTC 送到 Decart lucy-vton-latest，回传换好衣服的实时画面。
// 未配置：只显示本地摄像头预览，并明确告知尚未换装——不模拟任何试穿结果。
const tryon = { index: 0, stream: null, rt: null, configured: false, live: false, starting: false, timer: 0, startedAt: 0, sentId: null };

function syncFittingPill() {
  const pill = $("fitting-pill");
  pill.hidden = !(state.view === "shop" && $("tryon-panel").hidden);
  pill.classList.toggle("is-live", Boolean(tryon.stream));
}
function setTryOnStatus(text) { $("tryon-status").textContent = text; }
function renderTryOnGarment() {
  const product = PRODUCTS[tryon.index];
  $("tryon-thumb").src = product.img;
  $("tryon-thumb").alt = product.name;
  $("tryon-name").textContent = product.name;
  if (!tryon.stream) setTryOnStatus("已选好 · 打开摄像头开始");
}
function renderTryOnMode() {
  const mode = $("tryon-mode");
  mode.hidden = !tryon.stream;
  mode.textContent = tryon.live ? "LIVE · Anywear" : "摄像头预览 · 未换装";
  mode.classList.toggle("is-live", tryon.live);
  $("tryon-help").hidden = !(tryon.stream && !tryon.live);
  $("tryon-video").style.transform = tryon.live ? "none" : "scaleX(-1)";
}

async function garmentBlob(product) {
  // 试穿模型更适合白底服装图：把透明底 PNG 铺到白底上再发送
  const img = await loadImage(product.img);
  const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
  const canvas = el("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const g = canvas.getContext("2d");
  g.fillStyle = "#fff";
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
}
async function sendGarment() {
  const product = PRODUCTS[tryon.index];
  if (!tryon.rt || tryon.sentId === product.id) return;
  tryon.sentId = product.id;
  setTryOnStatus("正在换上这件…");
  try {
    await tryon.rt.set({ prompt: product.prompt, image: await garmentBlob(product), enhance: false });
    if (PRODUCTS[tryon.index].id === product.id) setTryOnStatus("实时试穿中 · 转个身看看");
  } catch (error) {
    tryon.sentId = null;
    setTryOnStatus(`换装失败：${error.message || error}`);
  }
}

async function startTryOn() {
  if (tryon.starting || tryon.stream) return;
  if (!navigator.mediaDevices?.getUserMedia) return setTryOnStatus("当前浏览器或地址不支持摄像头（需要 https 或 localhost）。");
  tryon.starting = true;
  $("tryon-start").disabled = true;
  let sdk = null;
  let model = null;
  try {
    if (tryon.configured) {
      setTryOnStatus("正在加载 Anywear 试穿服务…");
      try {
        sdk = await import(DECART_SDK);
        model = sdk.models.realtime("lucy-vton-latest");
      } catch { sdk = null; }
    }
    setTryOnStatus("等待摄像头授权…");
    const video = { facingMode: "user", width: { ideal: model?.width || 1280 }, height: { ideal: model?.height || 720 } };
    if (model?.fps) video.frameRate = { ideal: model.fps };
    tryon.stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
  } catch (error) {
    tryon.starting = false;
    $("tryon-start").disabled = false;
    const denied = error?.name === "NotAllowedError" || error?.name === "SecurityError";
    return setTryOnStatus(denied ? "没有摄像头权限 · 请在地址栏允许后重试" : "没有找到可用的摄像头");
  }
  const videoEl = $("tryon-video");
  videoEl.srcObject = tryon.stream;
  $("tryon-idle").hidden = true;
  tryon.startedAt = Date.now();
  $("tryon-timer").hidden = false;
  tryon.timer = setInterval(() => {
    const seconds = Math.floor((Date.now() - tryon.startedAt) / 1000);
    $("tryon-timer").textContent = `${Math.floor(seconds / 60)}:${pad2(seconds % 60)}`;
  }, 500);
  renderTryOnMode();
  syncFittingPill();

  if (sdk && model) {
    setTryOnStatus("正在连接 Anywear…");
    try {
      const client = sdk.createDecartClient({
        apiKeyProvider: async () => {
          const response = await fetch("api/tokens", { method: "POST" });
          const body = await response.json();
          if (!response.ok || !body.apiKey) throw new Error(body.error || "令牌获取失败");
          return body.apiKey;
        }
      });
      const stream = tryon.stream;
      const rt = await client.realtime.connect(stream, {
        model,
        onRemoteStream: (remote) => {
          if (tryon.stream !== stream) return;
          videoEl.srcObject = remote;
          tryon.live = true;
          renderTryOnMode();
        }
      });
      if (tryon.stream !== stream) { rt.disconnect?.(); return; }
      tryon.rt = rt;
      await sendGarment();
    } catch (error) {
      tryon.live = false;
      tryon.rt = null;
      if (tryon.stream) videoEl.srcObject = tryon.stream;
      renderTryOnMode();
      setTryOnStatus(`试穿服务连接失败：${error.message || error}`);
    }
  } else {
    setTryOnStatus(tryon.configured ? "试穿组件加载失败 · 当前仅摄像头预览" : "摄像头预览中 · 实时换装尚未开通");
  }
  tryon.starting = false;
}
function stopTryOn() {
  clearInterval(tryon.timer);
  try { tryon.rt?.disconnect?.(); } catch { /* 已断开 */ }
  tryon.stream?.getTracks().forEach((track) => track.stop());
  Object.assign(tryon, { stream: null, rt: null, live: false, starting: false, sentId: null });
  $("tryon-video").srcObject = null;
  $("tryon-idle").hidden = false;
  $("tryon-timer").hidden = true;
  $("tryon-timer").textContent = "0:00";
  $("tryon-start").disabled = false;
  renderTryOnMode();
}
function openTryOn(id) {
  if (anywearInstalled()) return pointToAnywear(id);
  const index = PRODUCTS.findIndex((product) => product.id === id);
  if (index >= 0) tryon.index = index;
  $("tryon-panel").hidden = false;
  renderTryOnGarment();
  syncFittingPill();
  if (tryon.rt) sendGarment();
  else if (tryon.stream) setTryOnStatus(tryon.live ? "" : "摄像头预览中 · 实时换装尚未开通");
}
// Anywear Chrome 插件会在每张衣服图左上角挂自己的 Try-On 按钮，并在页面左下角放试穿窗。
// 检测到它就把本站的同名入口收起来，避免两个按钮叠在一起、点到没有换装能力的那个。
const anywearInstalled = () => document.documentElement.classList.contains("has-anywear");
function watchAnywear() {
  const found = () => document.getElementById("__decart-imgbtn-style") || document.getElementById("__decart-tryon-widget") || document.querySelector(".vton-btn");
  const apply = () => {
    if (!found()) return false;
    document.documentElement.classList.add("has-anywear");
    document.querySelector(".shop-foot").textContent = "Anywear 试穿：点衣服左上角的 Try-On，或把衣服拖进左下角的试穿窗 · 首次连接要排队约 10 秒 · 点 + 放入购物篮";
    stopTryOn();
    $("tryon-panel").hidden = true;
    return true;
  };
  if (apply()) return;
  const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
function setGarmentCrumb(id) {
  const product = byId.get(id);
  if (product) $("garment-crumb").textContent = product.en;
}
function pointToAnywear(id) {
  if (location.hash !== "#shop") location.hash = "shop";
  requestAnimationFrame(() => {
    const card = id && document.querySelector(`.product-card[data-id="${id}"]`);
    if (card) {
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      card.classList.add("is-pointed");
      setTimeout(() => card.classList.remove("is-pointed"), 2600);
    }
    announce("点这件衣服左上角的 Try-On，由 Anywear 插件打开摄像头试穿。");
  });
}

function bindTryOn() {
  watchAnywear();
  if (window.__ASSETS) {
    // 单文件版：Anywear 插件读不到内嵌图片，在面板里直说，并指向能用插件的在线版
    const note = el("p", "tryon-file-note");
    note.append("你打开的是单文件版，Anywear 插件在这里无法换装。要试穿请打开在线版：");
    const link = el("a", "", "localhost:4174");
    link.href = "http://localhost:4174/#shop";
    note.append(link, "（先双击 start.command 启动）。");
    $("tryon-help").before(note);
  }
  const crumb = (event) => { const card = event.target.closest?.(".product-card"); if (card) setGarmentCrumb(card.dataset.id); };
  $("catalog-grid").addEventListener("pointerover", crumb);
  $("catalog-grid").addEventListener("pointerdown", crumb, true);
  const panel = $("tryon-panel");
  $("fitting-pill").addEventListener("click", () => openTryOn());
  $("tryon-start").addEventListener("click", startTryOn);
  $("tryon-min").addEventListener("click", () => { panel.hidden = true; syncFittingPill(); });
  $("tryon-close").addEventListener("click", () => { stopTryOn(); panel.hidden = true; syncFittingPill(); });
  const stepGarment = (delta) => {
    tryon.index = (tryon.index + delta + PRODUCTS.length) % PRODUCTS.length;
    renderTryOnGarment();
    sfx.tick();
    if (tryon.rt) sendGarment();
    else if (tryon.stream) setTryOnStatus("摄像头预览中 · 实时换装尚未开通");
  };
  $("tryon-prev").addEventListener("click", () => stepGarment(-1));
  $("tryon-next").addEventListener("click", () => stepGarment(1));
  // 拖动面板
  let drag = null;
  $("tryon-handle").addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const rect = panel.getBoundingClientRect();
    drag = { id: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  });
  $("tryon-handle").addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    panel.style.left = `${clamp(event.clientX - drag.dx, 4, innerWidth - panel.offsetWidth - 4)}px`;
    panel.style.top = `${clamp(event.clientY - drag.dy, 4, innerHeight - 60)}px`;
    panel.style.bottom = "auto";
  });
  const end = () => { drag = null; };
  $("tryon-handle").addEventListener("pointerup", end);
  $("tryon-handle").addEventListener("pointercancel", end);
  window.addEventListener("pagehide", stopTryOn);
  fetch("api/status").then((response) => response.json()).then((body) => { tryon.configured = Boolean(body.tryOnConfigured); }).catch(() => { tryon.configured = false; });
}

/* ---------- 通用 ---------- */
function bindGlobal() {
  document.querySelectorAll(".sound-toggle").forEach((button) => button.addEventListener("click", () => {
    state.sound = !state.sound;
    save();
    renderSound();
    sfx.turn();
  }));
  document.querySelectorAll(".fullscreen-toggle").forEach((button) => button.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { announce("没能进入全屏，可以用浏览器菜单切换。"); }
  }));
  window.addEventListener("hashchange", route);
}

function init() {
  load();
  if (window.__ASSETS) document.querySelector(".basket-image").src = asset("assets/basket.png");
  buildRail();
  buildRing();
  renderPills();
  renderShop();
  renderSound();
  renderTryOnGarment();
  bindGlobal();
  bindRail();
  bindShop();
  bindBasket();
  bindShelfDrag();
  bindDetail();
  bindReceipt();
  bindTryOn();
  route();
  requestAnimationFrame(railLoop);
  window.addEventListener("load", layoutRail);
}
init();
