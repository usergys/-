import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import store from "../db/index.js";
import { requireAdmin } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("仅支持上传图片文件"));
  },
});

const router = Router();

// 列表：?source=custom 仅自定义；?mine=<phone> 某用户上传
router.get("/", (req, res) => {
  const { source, mine } = req.query;
  let list = store.listPatterns();
  if (source === "custom") list = list.filter((p) => p.source === "custom");
  if (mine) list = list.filter((p) => p.uploaderPhone === mine);
  res.json({ ok: true, total: list.length, patterns: list });
});

router.get("/:id", (req, res) => {
  const p = store.getPattern(req.params.id);
  if (!p) return res.status(404).json({ ok: false, message: "纹样不存在" });
  res.json({ ok: true, pattern: p });
});

// 自定义纹样上传（multipart: name, meaning, tags 逗号分隔, uploaderPhone, file）
router.post("/", upload.single("file"), (req, res) => {
  const { name, meaning = "", tags = "", uploaderPhone = null } = req.body || {};
  if (!name || !String(name).trim()) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ ok: false, errors: ["纹样名称不能为空"] });
  }
  if (!req.file) return res.status(400).json({ ok: false, errors: ["请上传纹样图片"] });
  const tagArr = String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const row = store.createPattern({
    source: "custom",
    name: String(name).trim(),
    meaning: String(meaning).trim(),
    tags: tagArr,
    image: `/uploads/${req.file.filename}`,
    uploaderPhone,
    region: "",
  });
  res.json({ ok: true, pattern: row });
});

// 删除自定义纹样（仅管理员，系统纹样不可删）
router.delete("/:id", requireAdmin, (req, res) => {
  const ok = store.deletePattern(req.params.id);
  if (!ok) return res.status(400).json({ ok: false, message: "该纹样不可删除（系统纹样或不存在）" });
  res.json({ ok: true, message: "已删除" });
});

export default router;
