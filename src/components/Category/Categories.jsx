import React, { useState, useEffect } from "react";
import Table from "./Table/Table";
import "./Category.scss";
import axios from "axios";

export default function Categories() {
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [isSubmitData, setIsSubmitData] = useState(false);

  const columns = ["S.no", "Category Name", "image"];

  const pageSize = 10;

  const allCategory = async () => {
    try {
      const response = await axios.get(
        `https://shopping-backend-3.onrender.com/category/getAllCategory`
      );

      if (response.status == 200) {
        setAllCategoryData(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allCategory();
  }, [isSubmitData]);

  return (
    <div>
      <Table
        columns={columns}
        data={allCategoryData}
        pageSize={pageSize}
        setIsSubmitData={setIsSubmitData}
      />
    </div>
  );
}
