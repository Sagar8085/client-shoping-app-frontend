// BrandPage component
import React, { useState, useEffect } from "react";
import BrandTable from "./Table/BrandTable";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BrandPage() {
  const [allBrandData, setAllBrandData] = useState([]);
  const [isSubmitData, setIsSubmitData] = useState(false);
  const columns = ["S.no", "Category Name", "Brand Name", "image"];
  const pageSize = 10;

  const getAllBrand = async () => {
    try {
      const response = await axios.get(
        "https://shopping-backend-3.onrender.com/brand/getAllBrand"
      );

      setAllBrandData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  useEffect(() => {
    getAllBrand();
  }, [isSubmitData]); // Reload brand data whenever isSubmitData changes

  return (
    <div>
      <BrandTable
        columns={columns}
        data={allBrandData}
        pageSize={pageSize}
        setIsSubmitData={setIsSubmitData}
      />
    </div>
  );
}
