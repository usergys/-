// 管理员鉴权：请求头 Authorization: Bearer <ADMIN_TOKEN>
// Token 由环境变量 ADMIN_TOKEN 指定，缺省为 xiuwei-admin
export function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_TOKEN || "xiuwei-admin";
  const h = req.headers["authorization"] || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m || m[1] !== token) {
    return res.status(401).json({ ok: false, message: "未授权：请提供正确的管理员 Token" });
  }
  next();
}

// 仅判断请求是否带有效管理员 Token（不拦截）
export function isAdminReq(req) {
  const token = process.env.ADMIN_TOKEN || "xiuwei-admin";
  const h = req.headers["authorization"] || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return !!(m && m[1] === token);
}
