import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Coffee,
  Shirt,
  ShoppingBag,
  Smartphone,
  Wand2,
  Layers,
  Package,
  ArrowRight,
  Check,
  Brain,
  Palette,
  SlidersHorizontal,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

/** 可选纹样（与文化元素页纹样图鉴一致，含对应融合示例图） */
const PATTERN_OPTIONS = [
  {
    name: "八角花纹",
    image: "/images/patterns/bajiaohua.png",
    fusion: "/images/fusion/bajiaohua.png",
  },
  {
    name: "水波纹",
    image: "/images/patterns/shuibo.png",
    fusion: "/images/fusion/shuibo.png",
  },
  {
    name: "蛙纹",
    image: "/images/patterns/wa.png",
    fusion: "/images/fusion/wa.png",
  },
  {
    name: "回纹",
    image: "/images/patterns/huiwen.png",
    fusion: "/images/fusion/huiwen.png",
  },
  {
    name: "稻穗纹",
    image: "/images/patterns/daosui.png",
    fusion: "/images/fusion/daosui.png",
  },
  {
    name: "山形纹",
    image: "/images/patterns/shanxing.png",
    fusion: "/images/fusion/shanxing.png",
  },
  {
    name: "花叶纹",
    image: "/images/patterns/huaye.png",
    fusion: "/images/fusion/huaye.png",
  },
  {
    name: "生命树纹",
    image: "/images/patterns/shengming.png",
    fusion: "/images/fusion/shengming.png",
  },
  {
    name: "梅花纹",
    image: "/images/patterns/meihua.png",
    fusion: "/images/fusion/meihua.png",
  },
];

const PRODUCT_OPTIONS = [
  { name: "包包", available: true },
  { name: "瓶子", available: true },
  { name: "马克杯", available: false },
  { name: "潮服", available: false },
  { name: "鼠标垫", available: false },
];

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

const PRODUCT_LINES = [
  {
    icon: Coffee,
    name: "纹样马克杯系列",
    desc: "壮锦菱形纹环绕杯身，铜鼓太阳纹置于杯底，每日一杯见匠心。",
    status: "待元素图确认",
  },
  {
    icon: Shirt,
    name: "民族潮服系列",
    desc: "AI 解构传统织锦纹样，生成可全局铺满的现代服饰印花。",
    status: "待元素图确认",
  },
  {
    icon: ShoppingBag,
    name: "帆布包 / 文具系列",
    desc: "提取纹样核心符号作为精致 logo 图样，轻盈日常的产品载体。",
    status: "待元素图确认",
  },
  {
    icon: Smartphone,
    name: "数字壁纸 / 表情包",
    desc: "纯数字文创产品，纹样动态化演绎，扫码即得。",
    status: "待元素图确认",
  },
];

type GenResult = {
  image: string;
  report: { dominantColors: string[]; palettePass: boolean; symmetry: number };
  mode: string;
  ms: number;
};

export default function Products() {
  const [product, setProduct] = useState("包包");
  const [pattern, setPattern] = useState("八角花纹");
  const [fusedKey, setFusedKey] = useState(0);
  const [genLoading, setGenLoading] = useState(false);
  const [gen, setGen] = useState<GenResult | null>(null);
  const [genFailed, setGenFailed] = useState(false);
  const activePattern = PATTERN_OPTIONS.find((p) => p.name === pattern)!;

  // 更换产品或纹样后，清除旧成品，必须重新点击合成才生成
  useEffect(() => {
    setFusedKey(0);
    setGen(null);
    setGenFailed(false);
  }, [product, pattern]);

  // 点击合成：调用 AI 生成管线，失败时回退预生成示例图
  const onSynthesize = async () => {
    setGenLoading(true);
    setGen(null);
    setGenFailed(false);
    const t0 = performance.now();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern, product }),
      });
      const data = await res.json();
      if (data.ok && data.image) {
        setGen({
          image: data.image,
          report: data.report,
          mode: data.mode,
          ms: data.ms ?? Math.round(performance.now() - t0),
        });
      } else {
        setGenFailed(true);
        setFusedKey((k) => k + 1);
      }
    } catch {
      setGenFailed(true);
      setFusedKey((k) => k + 1);
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        kicker="设计产品"
        title="AI 纹样生成 · 一键定制文创"
        desc="选择文化元素库中的纹样，AI 即可生成精美的 logo 图样或全局铺满的印花图案，应用于杯子、衣服等载体，从创意到实物一气呵成。"
      />

      <section className="bg-ink-mountain py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* 生成流程 */}
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="card-hover relative cursor-default rounded-xl border border-gray-200 bg-white p-8"
              >
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
            ))}
          </div>

          {/* 定制演示框架：原始包 → 纹样参考 → 融合包 */}
          <div className="-mx-6 mt-20 rounded-2xl border border-gray-200 bg-white p-8 sm:-mx-12 sm:p-10 lg:-mx-16">
            <div className="text-center">
              <p className="text-sm font-medium tracking-widest text-brocade-rose">
                定制演示
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-indigo-deep-900">
                原始包 → 纹样参考 → 融合包
              </h2>
              <p className="mt-4 text-sm text-ink-600">
                选择产品与纹样，AI 将纹样融合到产品表面，生成专属印花效果。
              </p>
            </div>

            {/* 第一步：选择产品 */}
            <div className="mt-10">
              <p className="text-sm font-semibold text-indigo-deep-900">
                ① 选择产品
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {PRODUCT_OPTIONS.map((o) => (
                  <button
                    key={o.name}
                    disabled={!o.available}
                    onClick={() => setProduct(o.name)}
                    className={`rounded-full px-5 py-2 text-sm transition-colors duration-200 ${
                      o.available
                        ? product === o.name
                          ? "cursor-pointer bg-indigo-deep-900 text-white"
                          : "cursor-pointer border border-gray-300 bg-white text-ink-600 hover:border-brocade-gold"
                        : "cursor-not-allowed border border-dashed border-gray-200 bg-gray-50 text-gray-300"
                    }`}
                  >
                    {o.name}
                    {!o.available && "（即将开发）"}
                  </button>
                ))}
              </div>
            </div>

            {/* 第二步：选择纹样 */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-indigo-deep-900">
                ② 选择纹样
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
                {PATTERN_OPTIONS.map((p) => {
                  const active = pattern === p.name;
                  return (
                    <button
                      key={p.name}
                      onClick={() => setPattern(p.name)}
                      className={`group cursor-pointer rounded-lg border-2 bg-white p-1.5 transition-all duration-200 ${
                        active
                          ? "border-brocade-gold shadow-md"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      title={p.name}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="aspect-square w-full rounded object-contain"
                      />
                      <span className="mt-1 block truncate text-center text-[10px] leading-tight text-ink-600">
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 第三步：合成 */}
            <div className="mt-8 text-center">
              <button
                onClick={onSynthesize}
                disabled={genLoading}
                className="cursor-pointer rounded-full bg-brocade-gold px-10 py-3 text-sm font-semibold text-indigo-deep-950 shadow transition-colors duration-200 hover:bg-brocade-goldlight disabled:cursor-wait disabled:opacity-60"
              >
                {genLoading ? "AI 生成中…" : "✦ 合成"}
              </button>
              {!fusedKey && !gen && !genLoading && (
                <p className="mt-3 text-xs text-gray-400">
                  选择纹样后点击合成，AI 将实时生成融合成品
                </p>
              )}
            </div>

            {/* 合成结果：AI 生成，点击后从下方滑入 */}
            {(genLoading || gen || (fusedKey > 0 && genFailed)) && (
              <motion.div
                key={genLoading ? "loading" : gen ? `gen-${gen.ms}` : `fb-${fusedKey}`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="mt-10"
              >
                {genLoading ? (
                  <div className="mx-auto flex max-w-2xl flex-col items-center rounded-xl border border-gray-200 bg-white py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brocade-gold/30 border-t-brocade-gold" />
                    <p className="mt-5 text-sm text-ink-600">
                      AI 生成中，请稍候…
                    </p>
                  </div>
                ) : gen ? (
                  <>
                    <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                      <img
                        src={gen.image}
                        alt={`原始包 → ${pattern} → 融合包`}
                        className="w-full"
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                      <span className="flex items-center gap-1.5 rounded-full bg-indigo-deep-800/5 px-3 py-1.5 text-indigo-deep-800">
                        <Check size={14} className="text-brocade-gold" />
                        {product} × {pattern}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 ${
                          gen.report.palettePass
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-brocade-rose/10 text-brocade-rose"
                        }`}
                      >
                        色彩体系{gen.report.palettePass ? "合规 ✓" : "待优化"}
                      </span>
                      <span className="rounded-full bg-indigo-deep-800/5 px-3 py-1.5 text-indigo-deep-800">
                        对称性 {gen.report.symmetry}%
                      </span>
                      <span className="rounded-full bg-indigo-deep-800/5 px-3 py-1.5 text-indigo-deep-800">
                        生成耗时 {gen.ms}ms
                      </span>
                    </div>
                    <p className="mt-3 text-center text-xs text-gray-400">
                      主色 {gen.report.dominantColors.join(" / ")}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                      <img
                        src={activePattern.fusion}
                        alt={`原始包 → ${pattern} → 融合包`}
                        className="w-full"
                      />
                    </div>
                    <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-ink-600">
                      <Check size={16} className="text-brocade-gold" />
                      生成效果：{product} × {pattern}
                      （AI 融合示例图）
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* 产品系列（框架） */}
          <h2 className="mt-20 text-center font-serif text-2xl font-bold text-indigo-deep-900">
            产品系列
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_LINES.map((p) => (
              <div
                key={p.name}
                className="card-hover cursor-pointer rounded-xl border border-dashed border-gray-300 bg-white/70 p-6 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-deep-800 text-brocade-gold">
                  <p.icon size={26} />
                </div>
                <h3 className="mt-4 font-serif text-base font-bold text-indigo-deep-900">
                  {p.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">
                  {p.desc}
                </p>
                <span className="mt-4 inline-block rounded-full bg-brocade-rose/10 px-3 py-1 text-xs text-brocade-rose">
                  {p.status}
                </span>
              </div>
            ))}
          </div>

          {/* AI 生成技术栈：懂 → 变 → 用 三层 */}
          <div className="mt-20 rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
            <div className="text-center">
              <p className="text-sm font-medium tracking-widest text-brocade-rose">
                AI 生成技术栈
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-indigo-deep-900">
                懂 → 变 → 用
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                平台以三层技术支撑文创生成：模型层让 AI 懂传统章法，图像层让纹样变出新形态，工程层让用户用得起来。
              </p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-ink-mountain p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-deep-900 text-brocade-goldlight">
                    <Brain size={18} />
                  </span>
                  <div>
                    <p className="font-serif text-base font-bold text-indigo-deep-900">
                      模型层 · 懂
                    </p>
                    <p className="text-xs text-brocade-rose">让 AI 懂纹样</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["LoRA 微调", "ControlNet 结构约束", "纹样经纬结构 / 章法学习"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-indigo-deep-800/5 px-2.5 py-1 text-xs text-indigo-deep-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-ink-mountain p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-deep-900 text-brocade-goldlight">
                    <Palette size={18} />
                  </span>
                  <div>
                    <p className="font-serif text-base font-bold text-indigo-deep-900">
                      图像层 · 变
                    </p>
                    <p className="text-xs text-brocade-rose">让纹样能变化</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["风格迁移", "纹样识别", "图像特征提取与再生成"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-indigo-deep-800/5 px-2.5 py-1 text-xs text-indigo-deep-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-ink-mountain p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-deep-900 text-brocade-goldlight">
                    <SlidersHorizontal size={18} />
                  </span>
                  <div>
                    <p className="font-serif text-base font-bold text-indigo-deep-900">
                      工程层 · 用
                    </p>
                    <p className="text-xs text-brocade-rose">让用户能上手</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["参数化生成引擎", "程序化 SVG 纹样引擎", "可跑原型（轻量级 Demo 验证）"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-indigo-deep-800/5 px-2.5 py-1 text-xs text-indigo-deep-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            * 产品效果图将根据「文化元素」板块提供的纹样图片进行 AI
            生成与渲染，敬请期待
          </p>

          <div className="mt-14 text-center">
            <Link
              to="/register"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-deep-900 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-indigo-deep-700"
            >
              注册并定制我的文创
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
