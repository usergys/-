import Reveal from "@/components/Reveal";

const SYSTEMS = [
  {
    name: "壮锦纹样",
    desc: "中国四大名锦之一，以菱形几何为骨架，配以回纹、水波纹，色彩浓艳对比强烈，寓意吉祥兴旺。",
    tags: ["菱形几何", "回纹", "配色浓烈"],
    video: "/videos/element-1.mp4",
  },
  {
    name: "铜鼓纹饰",
    desc: "广西壮族的礼乐重器，中心为太阳纹，环布翔鹭纹、青蛙立饰，承载祈雨庆丰的古老信仰。",
    tags: ["太阳纹", "翔鹭纹", "青蛙饰"],
    video: "/videos/element-2.mp4",
  },
  {
    name: "绣球工艺",
    desc: "靖西旧州绣球，十二瓣合成一球，瓣上绣花鸟吉祥图案，是壮家传情达意与祈福的信物。",
    tags: ["十二瓣", "花鸟刺绣", "传情信物"],
    video: "/videos/element-3.mp4",
  },
];

export default function CulturalSystems() {
  return (
    <section className="bg-ink-mountain py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-brocade-rose">
            文化元素库
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-indigo-deep-900 sm:text-4xl">
            三大非遗纹样体系
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-600 sm:text-base">
            平台系统收录广西代表性的非遗纹样元素，每一个都附纹样学解读与授权信息，作为 AI 生成与产品定制的创意源。
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((el, i) => (
            <Reveal key={el.name} delay={i * 0.12}>
              <div className="card-hover h-full overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="aspect-[9/16] max-h-72 overflow-hidden bg-indigo-deep-950">
                  <video
                    src={el.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-indigo-deep-900">
                    {el.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {el.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {el.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-indigo-deep-800/5 px-3 py-1 text-xs text-indigo-deep-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
