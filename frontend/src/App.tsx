import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./page/home/Home";
import BascketPage from "./page/basket/Basket";
import HistoryPage from "./page/history-page/HistoryPage";
import CatalogPage from "./page/catalog/catalog-page";
import { Layout } from "./components/Layout";

function App() {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/bascket" element={<BascketPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
