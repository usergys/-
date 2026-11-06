import Counter from "@/components/Counter";

const STATS = [
  { to: 20, suffix: "+", label: "非遗纹样数字化入库" },
  { to: 4, suffix: " 大", label: "广西非遗文化体系" },
  { to: 9, suffix: " 种", label: "经典壮锦纹样图鉴" },
  { to: 3, suffix: " 步", label: "AI 定制到实物闭环" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-indigo-deep-950 py-16">
      <div className="brocade-divider absolute inset-x-0 top-0 opacity-80" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-4xl font-black text-brocade-gold sm:text-5xl">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-xs text-white/70 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="brocade-divider absolute inset-x-0 bottom-0 opacity-80" />
    </section>
  );
}
