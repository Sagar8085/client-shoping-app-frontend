// BrandPage component
import React, { useState, useEffect } from "react";
import ProductTable from "./Table/ProductTable";
import axios from "axios";

export default function ProductPage() {
  const [allProductData, setAllProductData] = useState([]);
  const [isSubmitData, setIsSubmitData] = useState(false);
  const columns = [
    "S.no",
    "Category Name",
    "Brand Name",
    "Product Name",
    "image",
  ];
  const pageSize = 10;

  const getAllProduct = async () => {
    try {
      const response = await axios.get(
        "https://shopping-backend-3.onrender.com/product/getAllProduct"
      );
      console.log(response.data.data);
      setAllProductData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, [isSubmitData]); // Reload brand data whenever isSubmitData changes

  return (
    <div>
      <ProductTable
        columns={columns}
        data={allProductData}
        pageSize={pageSize}
        setIsSubmitData={setIsSubmitData}
      />
    </div>
  );
}
