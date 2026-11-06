// 生产图片优化（调色板量化，装饰纹样画质损失极小）
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const jobs = [
  { dir: "public/images/patterns", max: 420, palette: 192, note: "前端纹样缩略图" },
  { dir: "server/assets/patterns", max: 1000, palette: 256, note: "管理后台纹样预览" },
  { dir: "server/assets/products", max: 1600, palette: 256, note: "产品成品图" },
];

let before = 0, after = 0, count = 0;
for (const job of jobs) {
  if (!fs.existsSync(job.dir)) continue;
  const files = [];
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.png$/i.test(f.name)) files.push(p);
    }
  };
  walk(job.dir);

  let dirBefore = 0, dirAfter = 0;
  for (const file of files) {
    const inSize = fs.statSync(file).size;
    const tmp = file + ".tmp.png";
    await sharp(file)
      .resize({ width: job.max, height: job.max, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, quality: 82, colours: job.palette })
      .toFile(tmp);
    const outSize = fs.statSync(tmp).size;
    if (outSize < inSize * 0.9) {
      fs.renameSync(tmp, file);
      before += inSize; after += outSize; dirBefore += inSize; dirAfter += outSize; count++;
    } else {
      fs.unlinkSync(tmp);
      dirBefore += inSize; dirAfter += inSize;
    }
  }
  console.log(`[${job.note}] ${Math.round(dirBefore / 1024 / 1024)}MB -> ${Math.round(dirAfter / 1024 / 1024)}MB`);
}

console.log(`\n共优化 ${count} 张，合计 ${Math.round(before / 1024 / 1024)}MB -> ${Math.round(after / 1024 / 1024)}MB`);
