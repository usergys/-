import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

type CulturalElement = {
  name: string;
  desc: string;
  tags: string[];
  /** 元素展示视频（自动循环播放） */
  video?: string;
};

/** 纹样图鉴：名称 + 寓意 */
const PATTERNS = [
  {
    name: "八角花纹",
    meaning: "象征八方顺遂，平安圆满",
    image: "/images/patterns/bajiaohua.png",
  },
  {
    name: "水波纹",
    meaning: "寓意财源绵延，生生不息",
    image: "/images/patterns/shuibo.png",
  },
  {
    name: "蛙纹",
    meaning: "壮族图腾，风调雨顺、子孙兴旺",
    image: "/images/patterns/wa.png",
  },
  {
    name: "回纹",
    meaning: "连绵不断，福寿绵长",
    image: "/images/patterns/huiwen.png",
  },
  {
    name: "稻穗纹",
    meaning: "五谷丰登，岁岁丰收",
    image: "/images/patterns/daosui.png",
  },
  {
    name: "山形纹",
    meaning: "稳如青山，安居乐业",
    image: "/images/patterns/shanxing.png",
  },
  {
    name: "花叶纹",
    meaning: "繁花常在，美好新生",
    image: "/images/patterns/huaye.png",
  },
  {
    name: "生命树纹",
    meaning: "万物繁衍，生生不息",
    image: "/images/patterns/shengming.png",
  },
  {
    name: "梅花纹",
    meaning: "坚韧清雅，喜运临门",
    image: "/images/patterns/meihua.png",
  },
];

const ELEMENTS: CulturalElement[] = [
  {
    name: "壮锦纹样",
    desc: "中国四大名锦之一，以菱形几何为骨架，配以回纹、水波纹，色彩浓艳对比强烈，寓意吉祥兴旺。",
    tags: ["菱形几何", "回纹", "配色浓烈"],
    video: "/videos/element-1.mp4",
  },
  {
    name: "铜鼓纹饰",
    desc: "铜鼓是广西壮族的礼乐重器，中心为太阳纹，环布翔鹭纹、青蛙立饰，承载祈雨庆丰的古老信仰。",
    tags: ["太阳纹", "翔鹭纹", "青蛙饰"],
    video: "/videos/element-2.mp4",
  },
  {
    name: "绣球工艺",
    desc: "靖西旧州绣球，十二瓣合成一球，瓣上绣花鸟吉祥图案，是壮家传情达意与祈福的信物。",
    tags: ["十二瓣", "花鸟刺绣", "传情信物"],
    video: "/videos/element-3.mp4",
  },
  {
    name: "民族服饰纹样",
    desc: "壮族、瑶族、苗族服饰上的织锦与挑花纹样，记录族群迁徙记忆与自然崇拜，针线之间皆是史诗。",
    tags: ["织锦", "挑花", "族群记忆"],
    video: "/videos/element-4.mp4",
  },
];

export default function Elements() {
  return (
    <>
      <PageHeader
        kicker="文化元素"
        title="广西非遗纹样元素库"
        desc="平台将系统收录广西代表性的非遗纹样元素，每一个元素都附带纹样学解读与授权信息，作为 AI 生成与产品定制的创意源。"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ELEMENTS.map((el) => (
              <div
                key={el.name}
                className="card-hover cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                {el.video && (
                  <div className="aspect-[9/16] overflow-hidden">
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
                )}
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
            ))}
          </div>

          {/* 纹样图鉴：名称 + 寓意 */}
          <div className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium tracking-widest text-brocade-rose">
                纹样图鉴
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-indigo-deep-900">
                一纹一寓意
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink-600">
                九种经典壮锦纹样，名称背后是壮族人对生活的祈愿。
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {PATTERNS.map((p) => (
                <div
                  key={p.name}
                  className="card-hover cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white text-center"
                >
                  <div className="aspect-square overflow-hidden bg-white">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-base font-bold text-indigo-deep-900">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-brocade-rose/90">
                      {p.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/products"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-deep-900 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-indigo-deep-700"
            >
              用这些元素设计产品
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
