import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const PATTERNS = [
  { name: "八角花纹", meaning: "象征八方顺遂，平安圆满", image: "/images/patterns/bajiaohua.png" },
  { name: "水波纹", meaning: "寓意财源绵延，生生不息", image: "/images/patterns/shuibo.png" },
  { name: "蛙纹", meaning: "壮族图腾，风调雨顺、子孙兴旺", image: "/images/patterns/wa.png" },
  { name: "回纹", meaning: "连绵不断，福寿绵长", image: "/images/patterns/huiwen.png" },
  { name: "稻穗纹", meaning: "五谷丰登，岁岁丰收", image: "/images/patterns/daosui.png" },
  { name: "山形纹", meaning: "稳如青山，安居乐业", image: "/images/patterns/shanxing.png" },
  { name: "花叶纹", meaning: "繁花常在，美好新生", image: "/images/patterns/huaye.png" },
  { name: "生命树纹", meaning: "万物繁衍，生生不息", image: "/images/patterns/shengming.png" },
  { name: "梅花纹", meaning: "坚韧清雅，喜运临门", image: "/images/patterns/meihua.png" },
];

export default function FeaturedPatterns() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-widest text-brocade-rose">
            纹样图鉴
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-indigo-deep-900 sm:text-4xl">
            一纹一寓意
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-600 sm:text-base">
            九种经典壮锦纹样，名称背后是壮族人对生活的祈愿。
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {PATTERNS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.1}>
              <div className="card-hover group h-full overflow-hidden rounded-xl border border-gray-200 bg-white text-center">
                <div className="aspect-square overflow-hidden bg-white">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            to="/elements"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-deep-900 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-indigo-deep-700"
          >
            查看完整文化元素库
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
