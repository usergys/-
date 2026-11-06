import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const socials = [
  {
    label: "微信",
    path: "M8.69 4C6.03 4 4 6.06 4 8.62c0 1.5.72 2.83 1.9 3.72l-.47 1.5 1.65-.83c.55.15 1.09.24 1.68.24.17 0 .33-.01.5-.03-.11-.4-.17-.82-.17-1.25 0-2.6 2.2-4.55 4.86-4.55.22 0 .44.01.65.04C14.03 5.44 11.6 4 8.69 4zm-1.6 2.6c.4 0 .73.32.73.72s-.33.73-.73.73-.73-.33-.73-.73.33-.72.73-.72zm3.4 0c.4 0 .72.32.72.72s-.32.73-.72.73-.73-.33-.73-.73.33-.72.73-.72zM15.4 8.3c-2.42 0-4.4 1.77-4.4 3.96 0 2.2 1.98 3.97 4.4 3.97.44 0 .86-.06 1.26-.17l1.4.7-.4-1.26c1-.76 1.63-1.9 1.63-3.24 0-2.19-1.98-3.96-3.89-3.96zm-1.35 2.2c.34 0 .62.28.62.62s-.28.61-.62.61-.61-.27-.61-.61.27-.62.61-.62zm2.7 0c.34 0 .62.28.62.62s-.28.61-.62.61-.61-.27-.61-.61.27-.62.61-.62z",
  },
  {
    label: "小红书",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 7h7c1.38 0 2.5 1.12 2.5 2.5v5c0 1.38-1.12 2.5-2.5 2.5h-7C6.12 17 5 15.88 5 14.5v-5C5 8.12 6.12 7 8.5 7zm1.75 2.5v5l4-2.5-4-2.5z",
  },
  {
    label: "Bilibili",
    path: "M17.8 5.6l1.2-1.9c.1-.2 0-.4-.2-.4h-2c-.1 0-.2 0-.2.1L15.5 5H8.5L7.4 3.4c0-.1-.1-.1-.2-.1h-2c-.2 0-.3.2-.2.4l1.2 1.9C4.3 6.1 3 7.6 3 9.5v5.9C3 17.9 4.9 20 7.2 20h9.6c2.3 0 4.2-2.1 4.2-4.6V9.5c0-1.9-1.3-3.4-3.2-3.9zM8.3 14.5c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3zm7.4 0c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z",
  },
];

export default function Hero() {
  return (
    <section
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      {/* 背景视频：丝滑壮锦动态 */}
      <video
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.10)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.13) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.19) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.07) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.07) 100%)",
        }}
      />

      {/* 左上锚定内容 */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-start",
          paddingTop: "24vh",
          paddingLeft: "64px",
          paddingRight: "24px",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontWeight: 700,
            fontSize: "clamp(2.4rem, 4.6vw, 4.1rem)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: "#fff",
            marginTop: "22px",
            maxWidth: "620px",
            textShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          让千年纹样
          <br />
          织进未来生活
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42, ease: "easeOut" }}
          style={{
            marginTop: "16px",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.65)",
            fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
            maxWidth: "380px",
          }}
        >
          绣未以 AI 演绎壮锦、铜鼓、绣球之美——懂纹样学、有版权路径、有变现闭环。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.58, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "30px" }}
        >
          <motion.a
            href="#/register"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "14px 26px",
              borderRadius: "999px",
              background: "#0a0a0a",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
            }}
          >
            立即定制文创
          </motion.a>
          <motion.a
            href="#/patterns"
            aria-label="观看纹样视频"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* 左下角社交图标 */}
      <div
        style={{
          position: "absolute",
          bottom: "34px",
          left: "64px",
          zIndex: 10,
          display: "flex",
          gap: "10px",
        }}
      >
        {socials.map((s) => (
          <a
            key={s.label}
            href="#"
            aria-label={s.label}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.75)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}
