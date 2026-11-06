import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-indigo-deep-950 py-12 text-center">
      <div className="brocade-divider mb-10" />
      <p className="font-serif text-2xl font-bold tracking-widest text-brocade-gold">
        绣未
      </p>
      <p className="mt-3 text-sm text-white/60">
        AI 驱动的广西非遗纹样数字文创平台
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
        <Link
          to="/patterns"
          className="cursor-pointer text-white/70 transition-colors duration-200 hover:text-brocade-goldlight"
        >
          非遗纹样
        </Link>
        <Link
          to="/elements"
          className="cursor-pointer text-white/70 transition-colors duration-200 hover:text-brocade-goldlight"
        >
          文化元素
        </Link>
        <Link
          to="/products"
          className="cursor-pointer text-white/70 transition-colors duration-200 hover:text-brocade-goldlight"
        >
          设计产品
        </Link>
        <Link
          to="/register"
          className="cursor-pointer text-white/70 transition-colors duration-200 hover:text-brocade-goldlight"
        >
          注册 / 收货地址
        </Link>
      </div>
      <p className="mt-8 text-xs text-white/40">
        © 2026 绣未 XiuWei · 壮锦纹样致敬广西非遗传承人
      </p>
    </footer>
  );
}
