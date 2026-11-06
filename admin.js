import { Router } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import store from "../db/index.js";
import { requireAdmin } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// 统计（管理员）
router.get("/stats", requireAdmin, (req, res) => {
  const users = store.listUsers().length;
  const patterns = store.listPatterns();
  const customPatterns = patterns.filter((p) => p.source === "custom").length;
  const orders = store.listOrders({}).length;
  const favorites = store.listFavorites({}).length;
  res.json({
    ok: true,
    stats: {
      users,
      patterns: patterns.length,
      customPatterns,
      orders,
      favorites,
      driver: store.driver,
    },
  });
});

// 全部收藏（管理员聚合）
router.get("/favorites", requireAdmin, (req, res) => {
  res.json({ ok: true, favorites: store.listFavorites({}) });
});

// 管理后台页面（独立 HTML，无需登录即可打开，数据接口需 Token）
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

export default router;
