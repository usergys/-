import { Router } from "express";
import store from "../db/index.js";

const router = Router();

router.get("/", (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ ok: false, errors: ["缺少 phone 参数"] });
  res.json({ ok: true, favorites: store.listFavorites({ phone }) });
});

router.post("/", (req, res) => {
  const { phone, patternId } = req.body || {};
  if (!phone) return res.status(400).json({ ok: false, errors: ["缺少 phone"] });
  if (!patternId) return res.status(400).json({ ok: false, errors: ["缺少 patternId"] });
  if (!store.getPattern(patternId)) return res.status(404).json({ ok: false, message: "纹样不存在" });
  const row = store.createFavorite({ phone, patternId: Number(patternId) });
  res.json({ ok: true, favorite: row });
});

router.delete("/:id", (req, res) => {
  const ok = store.deleteFavorite(req.params.id);
  if (!ok) return res.status(404).json({ ok: false, message: "收藏不存在" });
  res.json({ ok: true, message: "已取消收藏" });
});

export default router;
