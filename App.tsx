import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Patterns from "@/pages/Patterns";
import Elements from "@/pages/Elements";
import Products from "@/pages/Products";
import Register from "@/pages/Register";

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col bg-brocade-ivory">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/about" element={<Navigate to="/patterns" replace />} />
            <Route path="/elements" element={<Elements />} />
            <Route path="/products" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
