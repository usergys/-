import { Wand2, Layers, Package } from "lucide-react";
import Reveal from "@/components/Reveal";

const STEPS = [
  {
    icon: Wand2,
    title: "选择纹样元素",
    desc: "从文化元素库中挑选壮锦、铜鼓、绣球等纹样作为生成基底。",
  },
  {
    icon: Layers,
    title: "AI 智能生成",
    desc: "基于纹样学规律生成全新图案，可整体铺满也可提取为 logo 图样。",
  },
  {
    icon: Package,
    title: "一键定制下单",
    desc: "将纹样应用于杯子、衣服等产品，确认后直连供应链生产发货。",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-ink-mountain py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-brocade-rose">
            AI 文创定制
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-indigo-deep-900 sm:text-4xl">
            三步，把纹样变成实物
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-600 sm:text-base">
            选元素、AI 生成、一键定制——从创意到成品，平台帮你走完最后一公里。
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="card-hover relative h-full cursor-default rounded-xl border border-gray-200 bg-white p-8">
                <span className="absolute right-6 top-6 font-serif text-4xl font-black text-gray-100">
                  0{i + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brocade-gold/15 text-brocade-gold">
                  <s.icon size={24} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-indigo-deep-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
