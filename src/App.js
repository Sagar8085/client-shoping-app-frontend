import Categories from "./components/Category/Categories";
import "bootstrap/dist/css/bootstrap.min.css";
import BrandPage from "./Pages/Brand/BrandPage";
import { Route, Routes } from "react-router";
import ProductPage from "./Pages/Product/ProductPage";
import ProductDetailPage from './Pages/Product Detail/ProductDetailPage'

function App() {
  return (
    <div>
      <Routes>
        <Route element={<BrandPage />} path="brands" />
        <Route element={<Categories />} path="categories" />
        <Route element={<ProductPage />} path="products" />
        <Route element={<ProductDetailPage />} path="product-detail" />
      </Routes>
    </div>
  );
}

export default App;
