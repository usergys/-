import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-indigo-deep-900 py-20 sm:py-24">
      {/* 壮锦菱形暗纹底 */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #F2A93B 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, #D91F7A 0 2px, transparent 3px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="brocade-divider absolute inset-x-0 top-0 opacity-80" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-serif text-3xl font-bold text-brocade-goldlight sm:text-4xl"
        >
          把广西纹样，带回家
        </motion.h2>
        <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
          注册绣未，挑选心仪的壮锦纹样，让 AI 为你生成专属文创，一键定制发货。
          让千年非遗，成为你生活里的一抹壮美。
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="#/register"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer rounded-full bg-brocade-gold px-10 py-3.5 text-base font-semibold text-indigo-deep-950 shadow transition-colors duration-200 hover:bg-brocade-goldlight"
          >
            注册并定制我的文创
          </motion.a>
          <Link
            to="/patterns"
            className="cursor-pointer rounded-full border border-white/25 px-10 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-white/10"
          >
            先看看纹样
          </Link>
        </div>
      </div>

      <div className="brocade-divider absolute inset-x-0 bottom-0 opacity-80" />
    </section>
  );
}
