import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.scss";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import ProductFrom from "../ProductFrom";

const ProductTable = ({ columns, data, pageSize, setIsSubmitData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = data.slice(startIndex, endIndex);
  const [lgShow, setLgShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://shopping-backend-3.onrender.com/category/getAllCategory"
      );
      setCategories(response?.data?.data); // Assuming response.data is an array of categories
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        "https://shopping-backend-3.onrender.com/brand/getAllBrand"
      );
      console.log(response.data.data);
      setBrand(response?.data?.data); // Assuming response.data is an array of categories
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModel = (row) => {
    if (row) {
      setIsEdit(true);
      setSelectedRow(row);
      setLgShow(true);
    } else {
      setLgShow(true);
    }
  };

  const handleCloseModel = () => {
    setSelectedRow({});
    setIsEdit(false);
    setLgShow(false);
    setIsSubmitData((prev) => !prev);
  };

  // delete product from Id

  const deleteProduct = async (brandId) => {
    try {
      const response = await axios.delete(
        `https://shopping-backend-3.onrender.com/product/deleteProduct/${brandId}`
      );
      if (response.status == 200) {
        console.log("Brand deleted successfully");
        setIsSubmitData((prev) => !prev); // Reload brand data
      }
    } catch (error) {
      console.error("Error deleting brand", error);
    }
  };

  return (
    <div className="table-container p-5 bg-white">
      <div className="addCategoryButton">
        <Button variant="outline-primary" onClick={() => handleOpenModel()}>
          Add Product
        </Button>
      </div>
      <div className="centered-table">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {categories.find(
                    (category) => category._id === row.categoryId
                  )
                    ? categories.find(
                        (category) => category._id === row.categoryId
                      ).category_name
                    : row.categoryId}
                </td>
                <td>
                  {brand.find((brand) => brand._id === row.brandId)
                    ? brand.find((brand) => brand._id === row.brandId)
                        .brand_name
                    : row.brandId}
                </td>
                <td>{row.productName}</td>
                <td>
                  <img src={row?.file?.fileUrl} alt="brand image" />
                </td>
                <td>
                  <button
                    className="btn editButton "
                    onClick={() => handleOpenModel(row)}
                  >
                    <FontAwesomeIcon className="editIcon" icon={faPen} />
                  </button>{" "}
                  <button
                    className="btn deleteButton"
                    onClick={() => deleteProduct(row._id)}
                  >
                    <FontAwesomeIcon className="deleteIcon" icon={faTrashAlt} />
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Previous
        </Button>
        <span className="page-numbers">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>

      <Modal
        size="lg"
        show={lgShow}
        onHide={handleCloseModel}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductFrom
            data={selectedRow}
            onHide={handleCloseModel}
            setIsSubmitData={setIsSubmitData}
            allCategoryData={categories}
            selectedBrand={brand.find((b) => b._id === selectedRow.brandId)} // Pass selected brand
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductTable;
