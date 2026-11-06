import { BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";

const VALUES = [
  {
    icon: BookOpen,
    title: "懂纹样学",
    desc: "每一枚纹样都标注纹样学解读与寓意——蛙纹祈雨、回纹绵长、八角花圆满，让 AI 生成的不是杂乱图案，而是有根脉的文化语言。",
  },
  {
    icon: ShieldCheck,
    title: "有版权路径",
    desc: "数字化采集与生成全程记录来源，纹样附授权信息，从博物馆展柜到产品商标，确权与商用路径清晰可循。",
  },
  {
    icon: Sparkles,
    title: "有变现闭环",
    desc: "选纹样、AI 生成、一键定制下单直连供应链，从灵感到实物一气呵成，让非遗真正走进日常消费。",
  },
];

export default function Intro() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-brocade-rose">
            关于绣未
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-indigo-deep-900 sm:text-4xl">
            让千年纹样，织进未来生活
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-600 sm:text-base">
            绣未是一个 AI 驱动的广西非遗纹样数字文创平台。我们以数字化方式采集壮锦、铜鼓、绣球等纹样，
            用 AI 演绎它们的构成之美，并把它们带到杯子、服饰、壁纸等日常载体上——懂纹样学、有版权路径、有变现闭环。
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.12}>
              <div className="card-hover h-full rounded-xl border border-gray-200 bg-white p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brocade-gold/15 text-brocade-gold">
                  <v.icon size={24} />
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-indigo-deep-900">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {v.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
