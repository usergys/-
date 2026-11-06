import express from "express";
import cors from "cors";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import store from "./db/index.js";
import patternsRouter from "./routes/patterns.js";
import favoritesRouter from "./routes/favorites.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 3001;

const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// 原版成品图目录：优先 server/assets/products/<产品>，回退到项目根目录下的 <产品>/
function resolveProductDir(product) {
  const local = path.join(__dirname, "assets", "products", product);
  if (fs.existsSync(local)) return local;
  const rootLevel = path.resolve(ROOT, "..", product);
  return fs.existsSync(rootLevel) ? rootLevel : null;
}

// 纹样名按顺序映射到成品图（未列出的纹样按名称散列取图，保证同纹样结果稳定）
const PATTERN_ORDER = ["八角花纹", "水波纹", "蛙纹", "回纹", "稻穗纹", "山形纹", "花叶纹", "生命树纹", "梅花纹"];

// 各产品的成品图清单（已排除空白底图与截图；顺序与 PATTERN_ORDER 一一对应，
// 按纹样图案与成品图的视觉对应关系校准）
const PRODUCT_FILES = {
  包包: [
    "去除背景与图案 (7).png",   // 八角花纹（米金几何）
    "去除背景与图案 (5).png",   // 水波纹（蓝紫几何）
    "去除背景与图案 (6).png",   // 蛙纹（蓝金蛙纹）
    "去除背景与图案 (11).png",  // 回纹（浅蓝回纹）
    "去除背景与图案 (12).png",  // 稻穗纹（绿黄稻穗）
    "去除背景与图案 (13).png",  // 山形纹（橙色山形锯齿）
    "去除背景与图案 (10).png",  // 花叶纹（银灰花叶）
    "去除背景与图案 (9).png",   // 生命树纹（暗红生命树）
    "去除背景与图案 (8).png",   // 梅花纹（蓝红梅花）
  ],
  鼠标垫: [
    "去除背景与图案 (5).png", "去除背景与图案 (6).png", "去除背景与图案 (7).png",
  ],
  瓶子: [
    "纹样融入瓶子设计 (3).png",  // 八角花纹（米金几何）
    "纹样融入瓶子设计 (5).png",  // 水波纹（蓝紫几何）
    "纹样融入瓶子设计 (4).png",  // 蛙纹（蓝金蛙纹）
    "纹样融入瓶子设计 (1).png",  // 回纹（浅蓝回纹）
    "纹样融入瓶子设计.png",      // 稻穗纹（绿黄稻穗）
    "纹样融入瓶子设计 (7).png",  // 山形纹（橙色山形锯齿）
    "纹样融入瓶子设计 (2).png",  // 花叶纹（银灰花叶）
    "纹样融入瓶子设计 (6).png",  // 生命树纹（暗红生命树）
    "纹样融入瓶子设计 (8).png",  // 梅花纹（蓝红梅花）
  ],
};

const PHONE_RE = /^1[3-9]\d{9}$/;

const app = express();
app.use(cors());
app.use(express.json());

// ---------- 健康检查 ----------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), driver: store.driver });
});

// ---------- 用户注册（个人信息 + 收货地址） ----------
app.post("/api/register", (req, res) => {
  const { nickname, phone, email = "", receiver, phone2, province, city, district, address } = req.body || {};
  const errors = [];
  if (!nickname || !String(nickname).trim()) errors.push("昵称不能为空");
  if (!PHONE_RE.test(phone || "")) errors.push("手机号格式不正确");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("邮箱格式不正确");
  if (!receiver || !String(receiver).trim()) errors.push("收货人不能为空");
  if (!PHONE_RE.test(phone2 || "")) errors.push("联系电话格式不正确");
  if (!province || !city || !district || !address) errors.push("收货地址不完整");
  if (errors.length > 0) return res.status(400).json({ ok: false, errors });

  const now = new Date().toISOString();
  const exist = store.getUserByPhone(phone);
  let user;
  if (exist) {
    user = store.upsertUser({
      ...exist, nickname: nickname.trim(), email, receiver: receiver.trim(),
      phone2, province: province.trim(), city: city.trim(), district: district.trim(),
      address: address.trim(), updatedAt: now,
    });
  } else {
    user = store.upsertUser({
      id: store.listUsers().length + 1, nickname: nickname.trim(), phone, email,
      receiver: receiver.trim(), phone2, province: province.trim(), city: city.trim(),
      district: district.trim(), address: address.trim(), createdAt: now, updatedAt: now,
    });
  }
  res.json({ ok: true, message: "注册成功", user: { id: user.id, nickname: user.nickname, phone: user.phone } });
});

// 用户列表 / 按手机号查询
app.get("/api/users", (_req, res) => {
  res.json({ ok: true, total: store.listUsers().length, users: store.listUsers() });
});
app.get("/api/users/:phone", (req, res) => {
  const user = store.getUserByPhone(req.params.phone);
  if (!user) return res.status(404).json({ ok: false, message: "用户不存在" });
  res.json({ ok: true, user });
});

// 文化元素接口（兼容旧前端：仅返回系统纹样）
app.get("/api/elements", (_req, res) => {
  const elements = store.listPatterns().filter((p) => p.source === "system");
  res.json({ ok: true, total: elements.length, elements });
});
app.get("/api/elements/:id", (req, res) => {
  const el = store.listPatterns().find((p) => p.id === Number(req.params.id) && p.source === "system");
  if (!el) return res.status(404).json({ ok: false, message: "元素不存在" });
  res.json({ ok: true, element: el });
});

// ---------- 挂载业务路由 ----------
app.use("/api/patterns", patternsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/orders", ordersRouter);
app.use("/admin", adminRouter); // /admin 页面 + /admin/stats + /admin/favorites（管理员）
app.use("/uploads", express.static(UPLOADS_DIR));
// 九大设计纹样高清原图（server/assets/patterns）
app.use("/images/patterns", express.static(path.join(__dirname, "assets", "patterns")));

// ---------- AI 融合生成接口 ----------
function rgbToHue(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return -1;
  const d = max - min;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return ((h * 60) + 360) % 360;
}
function validateDesign(raw, info) {
  const { width: W, height: H, channels: C } = info;
  const counts = new Map();
  let satPixels = 0, inFamily = 0, diffSum = 0, diffCount = 0;
  for (let y = 0; y < H; y += 4) {
    for (let x = 0; x < W; x += 4) {
      const i = (y * W + x) * C;
      const r = raw[i], g = raw[i + 1], b = raw[i + 2], a = C === 4 ? raw[i + 3] : 255;
      if (a < 40) continue;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      if (lum < 235 || sat > 0.2) {
        const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
        counts.set(key, (counts.get(key) || 0) + 1);
        if (sat > 0.25) {
          satPixels++;
          const hue = rgbToHue(r, g, b);
          const inRange =
            (hue >= 200 && hue <= 255) || (hue >= 25 && hue <= 55) ||
            (hue >= 310 || hue <= 350) || (lum > 200 && sat < 0.25);
          if (inRange) inFamily++;
        }
      }
      const mx = W - 1 - x;
      if (mx > x && mx < W) {
        const j = (y * W + mx) * C;
        diffSum += Math.abs(r - raw[j]) + Math.abs(g - raw[j + 1]) + Math.abs(b - raw[j + 2]);
        diffCount++;
      }
    }
  }
  const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([k]) => {
      const [r, g, b] = k.split("-").map((v) => (Number(v) << 5) + 16);
      return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    });
  const symmetry = diffCount ? Math.max(0, Math.round(100 - diffSum / diffCount / 1.5)) : 0;
  const palettePass = satPixels === 0 || inFamily / satPixels >= 0.6;
  return { dominantColors: dominant, palettePass, symmetry };
}

function sendJSON(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(obj));
}

// ---------- 生成接口：直接返回对应产品的原版成品图（不使用融合引擎） ----------
app.post("/api/generate", async (req, res) => {
  const t0 = Date.now();
  try {
    const { pattern = "八角花纹", product = "包包" } = req.body || {};
    const dir = resolveProductDir(product);
    if (!dir) return sendJSON(res, 400, { ok: false, errors: ["该产品暂不支持生成"] });

    const files = PRODUCT_FILES[product]
      ? PRODUCT_FILES[product].filter((f) => fs.existsSync(path.join(dir, f)))
      : fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".png")).sort();
    if (files.length === 0) return sendJSON(res, 500, { ok: false, errors: ["未找到成品图"] });

    // 同一纹样稳定映射到同一张成品图：先按纹样顺序，未列出的按名称散列
    let idx = PATTERN_ORDER.indexOf(pattern);
    if (idx < 0) {
      idx = 0;
      for (const ch of pattern) idx = (idx * 31 + ch.codePointAt(0)) >>> 0;
    }
    const imgPath = path.join(dir, files[idx % files.length]);
    let buf = fs.readFileSync(imgPath);
    buf = await sharp(buf).resize({ width: 900 }).png().toBuffer();

    const { data: checkRaw, info: checkInfo } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const report = validateDesign(checkRaw, checkInfo);

    sendJSON(res, 200, {
      ok: true,
      mode: "original-render",
      note: "原版成品渲染图",
      image: `data:image/png;base64,${buf.toString("base64")}`,
      report, ms: Date.now() - t0,
    });
  } catch (err) {
    sendJSON(res, 500, { ok: false, errors: ["生成失败: " + err.message] });
  }
});

// ---------- 生产模式：托管前端构建产物 ----------
const DIST = path.join(ROOT, "dist");
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get(/^(?!\/api|\/admin|\/uploads).*/, (_req, res) => {
    res.sendFile(path.join(DIST, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`绣未后端已启动: http://localhost:${PORT}  (存储: ${store.driver})`);
});
