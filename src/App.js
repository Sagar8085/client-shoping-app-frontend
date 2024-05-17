import Categories from "./components/Category/Categories";
import "bootstrap/dist/css/bootstrap.min.css";
import BrandPage from "./Pages/Brand/BrandPage";
import { Route, Routes } from "react-router";
import ProductPage from "./Pages/Product/ProductPage";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<BrandPage />} path="brands" />
        <Route element={<Categories />} path="categories" />
        <Route element={<ProductPage />} path="products" />
      </Routes>
    </div>
  );
}

export default App;
