import { Brain, Palette, SlidersHorizontal } from "lucide-react";
import Reveal from "@/components/Reveal";

const LAYERS = [
  {
    tag: "懂",
    icon: Brain,
    name: "模型层",
    sub: "让 AI 懂纹样",
    desc: "用非遗数据训练模型，让它理解壮锦的经纬结构与纹样章法，生成的不是杂乱图案，而是有根脉的文化语言。",
    techs: ["LoRA 微调", "ControlNet 结构约束", "纹样经纬结构 / 章法学习"],
  },
  {
    tag: "变",
    icon: Palette,
    name: "图像层",
    sub: "让纹样能变化",
    desc: "在理解章法的基础上解构、识别与再生成，让传统纹样变出符合现代审美的全新形态与配色。",
    techs: ["风格迁移", "纹样识别", "图像特征提取与再生成"],
  },
  {
    tag: "用",
    icon: SlidersHorizontal,
    name: "工程层",
    sub: "让用户能上手",
    desc: "把模型能力封装成可调参的引擎与轻量原型，普通用户无需训练模型，即可上手生成与定制文创。",
    techs: ["参数化生成引擎", "程序化 SVG 纹样引擎", "可跑原型（轻量级 Demo 验证）"],
  },
];

export default function TechArchitecture() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-brocade-rose">
            AI 技术架构
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-indigo-deep-900 sm:text-4xl">
            懂 → 变 → 用
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-600 sm:text-base">
            一句话记忆诀窍：模型层让 AI <b className="text-indigo-deep-900">懂</b> 传统章法，
            图像层让纹样 <b className="text-indigo-deep-900">变</b> 出新形态，
            工程层让用户 <b className="text-indigo-deep-900">用</b> 得起来——参数可调、能上手。
            答辩时按这个顺序讲，逻辑天然闭合。
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {LAYERS.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.12}>
              <div className="card-hover relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-8">
                <span className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-brocade-gold/15 font-serif text-2xl font-black text-brocade-gold">
                  {l.tag}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-deep-900 text-brocade-goldlight">
                  <l.icon size={24} />
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-indigo-deep-900">
                  {l.name}
                </h3>
                <p className="mt-1 text-xs font-medium tracking-wide text-brocade-rose">
                  {l.sub}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{l.desc}</p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                  {l.techs.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-indigo-deep-800/5 px-3 py-1.5 text-xs font-medium text-indigo-deep-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 流程箭头：懂 → 变 → 用 */}
        <Reveal className="mt-10 flex items-center justify-center gap-3 text-sm font-medium text-ink-600">
          <span className="rounded-full bg-indigo-deep-900 px-4 py-1.5 text-brocade-goldlight">
            模型层 · 懂
          </span>
          <span className="text-brocade-gold">→</span>
          <span className="rounded-full bg-indigo-deep-900 px-4 py-1.5 text-brocade-goldlight">
            图像层 · 变
          </span>
          <span className="text-brocade-gold">→</span>
          <span className="rounded-full bg-indigo-deep-900 px-4 py-1.5 text-brocade-goldlight">
            工程层 · 用
          </span>
        </Reveal>
      </div>
    </section>
  );
}
