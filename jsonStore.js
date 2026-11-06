import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// 早期入库的 4 个文化体系条目，已由九大设计纹样取代（加载时自动移除）
const LEGACY_PATTERNS = ["壮锦纹样", "铜鼓纹饰", "绣球工艺", "民族服饰纹样"];

// 九大经典设计纹样（高清原图存于 server/assets/patterns，由后端 /images/patterns 托管）
const DESIGN_PATTERNS = [
  { name: "八角花纹", tile: "bajiaohua", meaning: "八角花是壮锦核心纹样，以八角放射状几何为骨架，象征太阳光辉，寓意八方来福。", tags: ["放射几何", "太阳崇拜", "骨架纹样"] },
  { name: "水波纹", tile: "shuibo", meaning: "水波纹以连续波折线描绘流水层层漾开，寓意富足绵长、生生不息。", tags: ["波折线", "流水意象", "连续纹样"] },
  { name: "蛙纹", tile: "wa", meaning: "蛙纹源于铜鼓青蛙立饰，蛙鸣报雨，是祈雨庆丰、多子多福的图腾符号。", tags: ["铜鼓立饰", "祈雨丰收", "图腾"] },
  { name: "回纹", tile: "huiwen", meaning: "回纹以回环往复的几何线条构成，回环连绵寓意“富贵不断头”。", tags: ["回环几何", "连绵不断", "边饰"] },
  { name: "稻穗纹", tile: "daosui", meaning: "稻穗纹描绘稻谷垂穗之态，是稻作民族对五谷丰登、仓廪殷实的祈愿。", tags: ["稻作文化", "五谷丰登", "垂穗"] },
  { name: "山形纹", tile: "shanxing", meaning: "山形纹以锯齿状折线表现山峦叠嶂，记录族群迁徙路线与山河记忆。", tags: ["锯齿折线", "山峦意象", "迁徙记忆"] },
  { name: "花叶纹", tile: "huaye", meaning: "花叶纹提取花卉枝叶的自然形态，寓意生机勃发、花开富贵。", tags: ["花卉枝叶", "生机", "自然崇拜"] },
  { name: "生命树纹", tile: "shengming", meaning: "生命树纹以树形为骨架，枝头栖息花鸟，象征生命繁衍、天地连通。", tags: ["树形骨架", "生命繁衍", "宇宙树"] },
  { name: "梅花纹", tile: "meihua", meaning: "梅花纹以五瓣梅花装点锦面，凌寒留香，寓意坚韧不拔与吉祥如意。", tags: ["五瓣梅花", "坚韧", "吉祥"] },
];

function ensureDesignPatterns(db) {
  const now = new Date().toISOString();
  for (const p of DESIGN_PATTERNS) {
    if (db.patterns.some((x) => x.name === p.name)) continue;
    db.patterns.push({
      id: nextId(db.patterns),
      source: "system",
      name: p.name,
      meaning: p.meaning,
      tags: p.tags,
      region: "",
      video: null,
      image: `/images/patterns/${p.tile}.png`,
      uploaderPhone: null,
      createdAt: now,
    });
  }
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function load() {
  ensureDir();
  let db;
  if (fs.existsSync(DB_FILE)) {
    let raw = fs.readFileSync(DB_FILE, "utf-8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    db = JSON.parse(raw || "{}");
  } else {
    db = {};
  }
  // 兼容旧结构：elements -> patterns
  if (db.elements && !db.patterns) {
    db.patterns = db.elements.map((e) => ({
      id: Number(e.id),
      source: "system",
      name: e.name,
      meaning: e.desc || e.meaning || "",
      tags: e.tags || [],
      region: e.region || "",
      video: e.video || null,
      image: null,
      uploaderPhone: null,
      createdAt: new Date().toISOString(),
    }));
    delete db.elements;
  }
  db.users = db.users || [];
  db.patterns = db.patterns || [];
  db.favorites = db.favorites || [];
  db.orders = db.orders || [];
  // 迁移：移除早期的 4 个文化体系条目
  db.patterns = db.patterns.filter((p) => !LEGACY_PATTERNS.includes(p.name));
  // 确保九大设计纹样存在（升级旧数据时自动补种）
  ensureDesignPatterns(db);
  return db;
}

let db = load();

function persist() {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function nextId(arr) {
  return arr.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
}

const store = {
  driver: "json",
  listUsers: () => db.users,
  getUserByPhone: (phone) => db.users.find((u) => u.phone === phone) || null,
  upsertUser(user) {
    const i = db.users.findIndex((u) => u.phone === user.phone);
    if (i >= 0) db.users[i] = { ...db.users[i], ...user };
    else db.users.push(user);
    persist();
    return user;
  },
  listPatterns: () => db.patterns,
  getPattern: (id) => db.patterns.find((p) => p.id === Number(id)) || null,
  getPatternByName: (name) => db.patterns.find((p) => p.name === name) || null,
  createPattern(p) {
    const row = { id: nextId(db.patterns), createdAt: new Date().toISOString(), ...p };
    db.patterns.push(row);
    persist();
    return row;
  },
  deletePattern(id) {
    const p = db.patterns.find((x) => x.id === Number(id));
    if (!p || p.source === "system") return false;
    db.patterns = db.patterns.filter((x) => x.id !== Number(id));
    persist();
    return true;
  },
  listFavorites({ phone } = {}) {
    return db.favorites
      .filter((f) => !phone || f.phone === phone)
      .map((f) => {
        const p = db.patterns.find((x) => x.id === Number(f.patternId));
        return { ...f, patternName: p ? p.name : null, patternImage: p ? p.image : null };
      });
  },
  createFavorite(f) {
    const row = { id: nextId(db.favorites), createdAt: new Date().toISOString(), ...f };
    db.favorites.push(row);
    persist();
    return row;
  },
  deleteFavorite(id) {
    const before = db.favorites.length;
    db.favorites = db.favorites.filter((x) => x.id !== Number(id));
    persist();
    return db.favorites.length < before;
  },
  listOrders({ phone } = {}) {
    return db.orders
      .filter((o) => !phone || o.phone === phone)
      .map((o) => {
        const p = db.patterns.find((x) => x.id === Number(o.patternId));
        return { ...o, patternName: p ? p.name : o.pattern || null };
      });
  },
  createOrder(o) {
    const row = { id: nextId(db.orders), status: "pending", createdAt: new Date().toISOString(), ...o };
    db.orders.push(row);
    persist();
    return row;
  },
  updateOrderStatus(id, status) {
    const o = db.orders.find((x) => x.id === Number(id));
    if (!o) return null;
    o.status = status;
    persist();
    return o;
  },
};

export default store;
