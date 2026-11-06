import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "xiuwei.sqlite");

// 早期入库的 4 个文化体系条目，已由九大设计纹样取代（初始化时自动删除）
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
  // 迁移：删除早期的 4 个文化体系条目
  const del = db.prepare("DELETE FROM patterns WHERE name=?");
  const ins = db.prepare(
    "INSERT INTO patterns (source,name,meaning,tags,region,image,createdAt) VALUES ('system',@name,@meaning,@tags,'',@image,@createdAt)"
  );
  const exists = db.prepare("SELECT id FROM patterns WHERE name=?");
  const tx = db.transaction(() => {
    for (const name of LEGACY_PATTERNS) del.run(name);
    const now = new Date().toISOString();
    for (const p of DESIGN_PATTERNS) {
      if (exists.get(p.name)) continue;
      ins.run({ name: p.name, meaning: p.meaning, tags: JSON.stringify(p.tags), image: `/images/patterns/${p.tile}.png`, createdAt: now });
    }
  });
  tx();
}

export default function createSqliteStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_FILE);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT, phone TEXT UNIQUE, email TEXT,
      receiver TEXT, phone2 TEXT, province TEXT, city TEXT, district TEXT, address TEXT,
      createdAt TEXT, updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS patterns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT DEFAULT 'system',
      name TEXT UNIQUE,
      meaning TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      region TEXT DEFAULT '',
      video TEXT,
      image TEXT,
      uploaderPhone TEXT,
      createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT, patternId INTEGER,
      createdAt TEXT,
      FOREIGN KEY(patternId) REFERENCES patterns(id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT, product TEXT, patternId INTEGER, pattern TEXT,
      image TEXT, note TEXT, status TEXT DEFAULT 'pending',
      createdAt TEXT
    );
  `);

  // 确保九大设计纹样存在（含旧条目清理与自动补种）
  ensureDesignPatterns(db);

  const store = {
    driver: "sqlite",
    listUsers: () => db.prepare("SELECT * FROM users").all(),
    getUserByPhone: (phone) => db.prepare("SELECT * FROM users WHERE phone=?").get(phone) || null,
    upsertUser(user) {
      const exist = db.prepare("SELECT * FROM users WHERE phone=?").get(user.phone);
      if (exist) {
        db.prepare(
          "UPDATE users SET nickname=@nickname,email=@email,receiver=@receiver,phone2=@phone2,province=@province,city=@city,district=@district,address=@address,updatedAt=@updatedAt WHERE phone=@phone"
        ).run({ ...user, updatedAt: new Date().toISOString() });
        return db.prepare("SELECT * FROM users WHERE phone=?").get(user.phone);
      }
      db.prepare(
        "INSERT INTO users (nickname,phone,email,receiver,phone2,province,city,district,address,createdAt,updatedAt) VALUES (@nickname,@phone,@email,@receiver,@phone2,@province,@city,@district,@address,@createdAt,@updatedAt)"
      ).run({ ...user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      return db.prepare("SELECT * FROM users WHERE phone=?").get(user.phone);
    },
    listPatterns: () => db.prepare("SELECT * FROM patterns").all(),
    getPattern: (id) => db.prepare("SELECT * FROM patterns WHERE id=?").get(Number(id)) || null,
    getPatternByName: (name) => db.prepare("SELECT * FROM patterns WHERE name=?").get(name) || null,
    createPattern(p) {
      const info = db.prepare(
        "INSERT INTO patterns (source,name,meaning,tags,region,image,uploaderPhone,createdAt) VALUES ('custom',@name,@meaning,@tags,@region,@image,@uploaderPhone,@createdAt)"
      ).run({
        name: p.name,
        meaning: p.meaning || "",
        tags: JSON.stringify(p.tags || []),
        region: p.region || "",
        image: p.image || null,
        uploaderPhone: p.uploaderPhone || null,
        createdAt: new Date().toISOString(),
      });
      return db.prepare("SELECT * FROM patterns WHERE id=?").get(info.lastInsertRowid);
    },
    deletePattern(id) {
      const p = db.prepare("SELECT * FROM patterns WHERE id=?").get(Number(id));
      if (!p || p.source === "system") return false;
      db.prepare("DELETE FROM patterns WHERE id=?").run(Number(id));
      return true;
    },
    listFavorites({ phone } = {}) {
      return db.prepare(
        `SELECT f.*, p.name AS patternName, p.image AS patternImage
         FROM favorites f LEFT JOIN patterns p ON p.id=f.patternId
         WHERE (? IS NULL OR f.phone=?) ORDER BY f.id DESC`
      ).all(phone || null, phone || null);
    },
    createFavorite(f) {
      const info = db.prepare("INSERT INTO favorites (phone,patternId,createdAt) VALUES (?,?,?)").run(f.phone, f.patternId, new Date().toISOString());
      return db.prepare("SELECT * FROM favorites WHERE id=?").get(info.lastInsertRowid);
    },
    deleteFavorite(id) {
      return db.prepare("DELETE FROM favorites WHERE id=?").run(Number(id)).changes > 0;
    },
    listOrders({ phone } = {}) {
      return db.prepare(
        `SELECT o.*, p.name AS patternName
         FROM orders o LEFT JOIN patterns p ON p.id=o.patternId
         WHERE (? IS NULL OR o.phone=?) ORDER BY o.id DESC`
      ).all(phone || null, phone || null);
    },
    createOrder(o) {
      const info = db.prepare(
        "INSERT INTO orders (phone,product,patternId,pattern,image,note,status,createdAt) VALUES (?,?,?,?,?,?,'pending',?)"
      ).run(o.phone, o.product, o.patternId || null, o.pattern || null, o.image || null, o.note || null, new Date().toISOString());
      return db.prepare("SELECT * FROM orders WHERE id=?").get(info.lastInsertRowid);
    },
    updateOrderStatus(id, status) {
      const r = db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, Number(id));
      if (r.changes === 0) return null;
      return db.prepare("SELECT * FROM orders WHERE id=?").get(Number(id));
    },
  };

  return store;
}
