import { Router } from "express";
import store from "../db/index.js";
import { requireAdmin, isAdminReq } from "../middleware/auth.js";

const router = Router();

// 下单：{ phone, product, pattern?, patternId?, image?, note? }
router.post("/", (req, res) => {
  const { phone, product, pattern, patternId, image, note } = req.body || {};
  if (!phone) return res.status(400).json({ ok: false, errors: ["缺少 phone"] });
  if (!product) return res.status(400).json({ ok: false, errors: ["缺少 product"] });
  const row = store.createOrder({
    phone,
    product,
    pattern: pattern || null,
    patternId: patternId ? Number(patternId) : null,
    image: image || null,
    note: note || "",
  });
  res.json({ ok: true, order: row });
});

// 查询：带管理员 Token 看全部，否则只能看自己的（需 phone）
router.get("/", (req, res) => {
  const { phone } = req.query;
  if (isAdminReq(req)) {
    return res.json({ ok: true, orders: store.listOrders({}) });
  }
  if (!phone) return res.status(400).json({ ok: false, errors: ["缺少 phone 或管理员 Token"] });
  res.json({ ok: true, orders: store.listOrders({ phone }) });
});

// 管理员修改订单状态：{ status }
router.patch("/:id/status", requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ ok: false, errors: ["缺少 status"] });
  const o = store.updateOrderStatus(req.params.id, status);
  if (!o) return res.status(404).json({ ok: false, message: "订单不存在" });
  res.json({ ok: true, order: o });
});

export default router;
