// 上线后可用性验证
const BASE = process.env.BASE || "http://localhost:3001";
const TOKEN = process.env.ADMIN_TOKEN || "";
const results = [];
const rec = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  ${detail}`);
};

const get = (u, o) => fetch(BASE + u, o);

let r = await get("/");
let html = await r.text();
rec("首页 /", r.status === 200 && html.includes('id="root"'), `status=${r.status}`);

r = await get("/design");
rec("SPA 路由回退 /design", r.status === 200, `status=${r.status}`);

r = await get("/api/health");
const health = await r.json().catch(() => ({}));
rec("健康检查 /api/health", r.status === 200 && health.ok === true, `driver=${health.driver}`);

r = await get("/admin");
rec("管理后台 /admin", r.status === 200, `status=${r.status}`);

r = await get("/api/patterns");
const pats = await r.json().catch(() => ({}));
rec("纹样接口 /api/patterns", r.status === 200 && pats.total === 9, `total=${pats.total}`);

r = await get("/images/patterns/bajiaohua.png");
rec("纹样图片托管", r.status === 200 && (r.headers.get("content-type") || "").includes("image"), `status=${r.status}`);

const m = html.match(/\/assets\/([^"]+\.js)/);
if (m) {
  r = await get("/assets/" + m[1]);
  rec("前端 JS 资源", r.status === 200, `${m[1]} status=${r.status}`);
} else rec("前端 JS 资源", false, "index.html 中未找到 assets 引用");

for (const product of ["包包", "瓶子"]) {
  r = await get("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pattern: "回纹", product }),
  });
  const j = await r.json().catch(() => ({}));
  rec(`生成接口 ${product}`, r.status === 200 && j.ok === true, `image=${Math.round((j.image || "").length / 1024)}KB mode=${j.mode}`);
}

if (TOKEN) {
  r = await get("/admin/stats", { headers: { Authorization: "Bearer " + TOKEN } });
  const s = await r.json().catch(() => ({}));
  rec("管理统计（带 Token）", r.status === 200 && !!s.stats, JSON.stringify(s.stats));
  r = await get("/admin/stats");
  rec("管理统计（无 Token 应 401）", r.status === 401, `status=${r.status}`);
} else {
  console.log("SKIP  未提供 ADMIN_TOKEN，跳过管理接口验证");
}

const failed = results.filter((x) => !x.pass);
console.log(`\n总计 ${results.length} 项，通过 ${results.length - failed.length}，失败 ${failed.length}`);
process.exit(failed.length ? 1 : 0);
