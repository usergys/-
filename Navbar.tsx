import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "首页", to: "/" },
  { label: "非遗纹样", to: "/patterns" },
  { label: "文化元素", to: "/elements" },
  { label: "设计产品", to: "/products" },
  { label: "注册 / 收货地址", to: "/register" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 44px",
      }}
    >
      <div className="flex items-center gap-11">
        {/* Xiumo 品牌 logo：原色透明底 */}
        <Link to="/" className="flex items-center" aria-label="绣未首页">
          <img
            src="/images/xiumo-logo-color.png"
            alt="Xiumo 绣未"
            className="h-12 w-auto transition-transform duration-200 hover:scale-[1.04] sm:h-14"
            style={{ filter: "drop-shadow(0 2px 6px rgba(255,255,255,0.55))" }}
          />
        </Link>

        <div className="hidden items-center gap-[30px] md:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{ fontSize: "14px", fontWeight: 500 }}
                className={`cursor-pointer text-decoration-none transition-colors duration-200 ${
                  active
                    ? "text-brocade-rose"
                    : "text-indigo-deep-900/80 hover:text-indigo-deep-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <motion.a
        href="#/register"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "11px 24px",
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
          color: "#fff",
          textDecoration: "none",
          background: "linear-gradient(135deg, #1e2a5e, #10173a)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
          cursor: "pointer",
        }}
        className="hidden md:inline-block"
      >
        立即体验
      </motion.a>

      <button
        className="cursor-pointer rounded-md p-2 text-indigo-deep-900 md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="切换菜单"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute inset-x-4 top-[72px] rounded-xl border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-3 text-sm text-indigo-deep-900 transition-colors hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-full bg-indigo-deep-900 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            立即体验
          </Link>
        </div>
      )}
    </motion.nav>
  );
}
