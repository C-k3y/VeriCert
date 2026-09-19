import { Route, Routes } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { Verify } from "@/pages/Verify";
import { Issue } from "@/pages/Issue";

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/issue" element={<Issue />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
