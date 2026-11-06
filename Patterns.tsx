import { Link } from "react-router-dom";
import {
  PlayCircle,
  ArrowRight,
  History,
  Shapes,
  Layers,
  Gem,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

const HIGHLIGHTS = [
  {
    icon: History,
    title: "悠久发展历史",
    desc: "壮锦起源于秦汉时期的百越织锦，唐宋工艺逐步成熟，明代达到兴盛被列为贡品。古时壮族妇女自种棉花、纺纱染色，以木织机手工织造；历经千年传承，2006 年列入第一批国家级非物质文化遗产名录。",
  },
  {
    icon: Shapes,
    title: "纹样寓意特色",
    desc: "纹样多取材自然与民族生活，有菱形回纹、水纹、蛙纹、花草鸟兽等。纹样并非单纯装饰——蛙纹象征繁衍、菱形纹代表大地，寄托壮族人对丰收、平安、美好生活的祈愿，几何纹样严谨又富有韵律。",
  },
  {
    icon: Layers,
    title: "材质工艺特点",
    desc: "传统以棉、麻为底，丝线提花，使用天然植物染料染色；采用通经断纬的织造技法，织出的织物厚实耐磨、色彩浓郁，织纹凹凸富有立体感，细密经纬肌理触感质朴。",
  },
  {
    icon: Gem,
    title: "当代文化价值",
    desc: "壮锦不只是布料，更是壮族文化载体。如今它跳出传统服饰、背带的用途，被创新应用在文创、软装、服饰设计中，作为广西文化符号对外展示，持续活化非遗，连接民族传统与现代审美。",
  },
];

const PATTERN_TYPES = [
  ["壮锦囍字被面纹", "喜字 + 几何锦地", "壮锦被面"],
  ["黑底卷草龙凤纹", "卷草龙凤 · 黑白红", "刺绣绣片"],
  ["万字回纹四方连续", "万字纹 / 回纹", "织锦"],
  ["蓝底凤凰几何织锦", "凤凰 + 几何菱格", "壮锦"],
  ["蛙人人物纹绣片", "蚂拐崇拜 · 蛙人纹", "壮绣绣片"],
  ["红底凤穿牡丹壮绣", "凤穿牡丹", "壮绣"],
  ["八卦纹织锦被面", "八卦纹 + 锦地", "壮锦被面"],
  ["斜纹织锦条纹", "斜纹组织条纹", "壮锦"],
];

export default function Patterns() {
  return (
    <>
      <PageHeader
        kicker="非遗纹样"
        title="壮美纹样 · 织在锦缎上的广西记忆"
        desc="纹样是非遗的基因密码——壮锦的菱形几何、铜鼓的太阳星辰、绣球的团圆寓意。观看一段沉浸式视频，读懂纹样的构成之美。"
        image="/images/explain-circle.jpeg"
        imageAlt="壮族铜鼓与人物插画"
      />

      {/* 视频主视觉 */}
      <section className="relative overflow-hidden bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
            <div className="aspect-video w-full bg-indigo-deep-950">
              <iframe
                src="https://player.bilibili.com/player.html?bvid=BV1VY41177x9&page=1&high_quality=1&danmaku=0&autoplay=0"
                title="沉浸式欣赏壮族纹样"
                className="h-full w-full"
                scrolling="no"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <PlayCircle size={16} className="text-brocade-rose" />
            《沉浸式欣赏壮族纹样》· 纹藏团队 · 时长 2 分 18 秒 · 4K
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* 介绍非遗纹样 */}
          <div className="mx-auto mt-16 max-w-3xl text-center">
            <h2 className="font-serif text-2xl font-bold text-indigo-deep-900 sm:text-3xl">
              什么是非遗纹样？
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-600">
              非遗纹样是流传千年的视觉语言：壮族织锦以菱形为骨、回纹作边，铜鼓以太阳纹居中、翔鹭纹环布，绣球十二瓣瓣瓣生花。它们不只是装饰——每一笔都承载着祈福、记事与族群记忆。绣未通过数字化采集与
              AI
              演绎，让这些纹样从博物馆的展柜走向屏幕、走向产品，被更多人看见与使用。
            </p>
          </div>

          {/* 视频看点 */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="card-hover cursor-default rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brocade-gold/15 text-brocade-gold">
                  <h.icon size={20} />
                </div>
                <h3 className="mt-4 font-serif text-base font-bold text-indigo-deep-900">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 纹样图鉴 */}
          <div className="mt-16">
            <h2 className="text-center font-serif text-2xl font-bold text-indigo-deep-900">
              视频中的代表纹样
            </h2>
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
                {PATTERN_TYPES.map(([name, type, carrier]) => (
                  <div key={name} className="bg-white p-5">
                    <h3 className="font-serif text-sm font-bold text-indigo-deep-900">
                      {name}
                    </h3>
                    <p className="mt-1.5 text-xs text-ink-600">{type}</p>
                    <span className="mt-3 inline-block rounded-full bg-indigo-deep-800/5 px-2.5 py-0.5 text-xs text-indigo-deep-800">
                      {carrier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-400">
              * 纹样类型依据画面内容推断归类，完整 20 种纹样详见项目研究档案
            </p>
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/elements"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-deep-900 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-indigo-deep-700"
            >
              查看平台文化元素库
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
