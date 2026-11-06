import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Shirt, ShoppingBag, Smartphone } from "lucide-react";
import Reveal from "@/components/Reveal";

const PRODUCT_LINES = [
  { icon: Coffee, name: "纹样马克杯系列", desc: "壮锦菱形纹环绕杯身，铜鼓太阳纹置于杯底，每日一杯见匠心。" },
  { icon: Shirt, name: "民族潮服系列", desc: "AI 解构传统织锦纹样，生成可全局铺满的现代服饰印花。" },
  { icon: ShoppingBag, name: "帆布包 / 文具系列", desc: "提取纹样核心符号作为精致 logo 图样，轻盈日常的产品载体。" },
  { icon: Smartphone, name: "数字壁纸 / 表情包", desc: "纯数字文创产品，纹样动态化演绎，扫码即得。" },
];

export default function ProductPreview() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-brocade-rose">
            设计产品
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-indigo-deep-900 sm:text-4xl">
            纹样落地的产品想象
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-600 sm:text-base">
            AI 生成的纹样可延展到多种载体——从日常好物到数字文创，非遗触手可及。
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_LINES.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div className="card-hover h-full cursor-pointer rounded-xl border border-dashed border-gray-300 bg-white/70 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-deep-800 text-brocade-gold">
                  <p.icon size={26} />
                </div>
                <h3 className="mt-4 font-serif text-base font-bold text-indigo-deep-900">
                  {p.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-deep-900 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-indigo-deep-700"
          >
            立即体验 AI 定制
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
