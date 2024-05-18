import React, { useEffect, useRef, useState } from "react";
import "./productDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FileInput, FileMultipleInput } from "../../components/input/Input";
import Button from "../../components/button/Button";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ProductDetailFrom({
  data,
  onHide,
  setIsSubmitData,
  allCategoryData,
  selectedBrand,
}) {
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);

  /** react quil */
  const [description, setDescriptionValue] = useState("");

  const [selectedBrandProducts, setSelectedBrandProducts] = useState([]);

  const initialValues = {
    category_id: data.categoryId || "",
    brandId: selectedBrand?._id || "",
    productId: data.productId || "",
    modelNo: data.modelNo || "",
    color: data.color || "",
    stock: data.stock || "",
    price: data.price || "",
    offerPrice: data.offerPrice || "",
    hsnCode: data.hsnCode || "",
    status: data.status || "continue",
    description: description,
  };
  const validationSchema = Yup.object({
    category_id: Yup.string().required("Category is required"),
    brandId: Yup.string().required("Brand is required"),
    productId: Yup.string().required("Product is required"),
    modelNo: Yup.string().required("Model No. is required"),
    color: Yup.string().required("Color is required"),
    stock: Yup.number().required("Stock is required"),
    price: Yup.number().required("Price is required"),
    offerPrice: Yup.number().required("Offer Price is required"),
    hsnCode: Yup.string().required("HSN Code is required"),
    status: Yup.string().required("Status is required"),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [allBrandData, setAllBrandData] = useState([]);

  useEffect(() => {
    setIsEditing(!!data._id);
  }, [data._id]);

  useEffect(() => {
    if (initialValues.category_id) {
      getAllBrand(initialValues.category_id);
    }
  }, [initialValues.category_id]);

  const onSubmit = async (values) => {
    console.log(values, selectedImages);
    const productData = {
      categoryId: values.category_id,
      brandId: values.brandId,
      productId: values.productId,
      modelNo: values.modelNo,
      color: values.color,
      stock: values.stock,
      price: values.price,
      offerPrice: values.offerPrice,
      hsnCode: values.hsnCode,
      status: values.status,
      file: selectedImages,
      description: description,
    };
    try {
      if (selectedImages.length > 0 && description.length > 0) {
        if (data._id) {
          // updateProduct(data._id, productData);
        } else {
          addProduct(productData);
        }
        setIsSubmitData(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitData(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleCameraIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is not initialized.");
    }
  };

  const handleFileInputChange = async (e) => {
    if (e && e.target && e.target.files) {
      const files = e.target.files;
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("uploadMultiDocs", files[i]);
      }

      try {
        const uploadImages = await axios.post(
          "http://localhost:5000/service/uploadMultiDocs",
          formData
        );
        if (uploadImages?.status === 200 || uploadImages?.status === 201) {
          setSelectedImages(uploadImages?.data?.data || []); // Ensure selectedImages is always an array
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    } else {
      console.log("No files selected");
    }
  };

  /** get all brands */
  const getAllBrand = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://shopping-backend-3.onrender.com/brand/getAllBrand`
      );

      if (response?.data?.status) {
        const filterBrands = response?.data?.data.filter(
          (e) => e.category_id == categoryId
        );

        setAllBrandData(filterBrands || []);
      }
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  /** get all filtered products */
  const getAllProduct = async (brandId) => {
    try {
      const response = await axios.get(
        `https://shopping-backend-3.onrender.com/product/getAllProduct?brandId=${brandId}`
      );
      // console.log(response.data.data);
      if (response?.data?.status) {
        const filterProducts = response?.data?.data.filter(
          (e) =>
            e.brandId == brandId && e.categoryId == formik.values.category_id
        );

        setSelectedBrandProducts(filterProducts ? filterProducts : []);
      } else {
        console.error("Error fetching product data:");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  /** add product details */
  const addProduct = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/productDetails/addProductDetails",
        data
      );
      if (response?.status == 200) {
        console.log(response);
        alert("Product added successfully");
        handleClose();
      } else {
        console.error("Error adding product:");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  /** update product details */
  const updateProduct = async (productId, data) => {
    try {
      const response = await axios.put(
        `https://shopping-backend-3.onrender.com/product/updateProduct/${productId}`,
        data
      );
      if (response?.status) {
        handleClose();
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  /** close model */
  const handleClose = () => {
    onHide();
  };

  return (
    <div className="container-fluid bg-white">
      <div className="row formDiv">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">
                    Choose Category
                  </label>
                  <select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                    onChange={(e) => {
                      formik.handleChange(e);
                      getAllBrand(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.category_id}
                    placeholder="Select Category"
                  >
                    <option value="">Select Category</option>
                    {allCategoryData.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.category_id && formik.errors.category_id && (
                    <div className="text-danger">
                      {formik.errors.category_id}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="brand" className="form-label">
                    Choose Brand
                  </label>
                  <select
                    className="form-select"
                    id="brandId"
                    name="brandId"
                    onChange={(e) => {
                      formik.handleChange(e);
                      getAllProduct(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.brandId}
                    placeholder="Select Brand"
                  >
                    <option value="">Select Brand</option>
                    {allBrandData.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.brand_name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.brandId && formik.errors.brandId && (
                    <div className="text-danger">{formik.errors.brandId}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="product" className="form-label">
                    Choose Product
                  </label>
                  <select
                    className="form-select"
                    id="productId"
                    name="productId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.productId}
                    placeholder="Select Product"
                  >
                    <option value="">Select Product</option>
                    {selectedBrandProducts.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                  {formik.touched.productId && formik.errors.productId && (
                    <div className="text-danger">{formik.errors.productId}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="modelNo" className="form-label">
                    Model No.
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="modelNo"
                    name="modelNo"
                    value={formik.values.modelNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Model No."
                  />
                  {formik.touched.modelNo && formik.errors.modelNo && (
                    <div className="text-danger">{formik.errors.modelNo}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="color" className="form-label">
                    Color
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    name="color"
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Color"
                  />
                  {formik.touched.color && formik.errors.color && (
                    <div className="text-danger">{formik.errors.color}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Stock"
                  />
                  {formik.touched.stock && formik.errors.stock && (
                    <div className="text-danger">{formik.errors.stock}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Price"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-danger">{formik.errors.price}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="offerPrice" className="form-label">
                    Offer Price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="offerPrice"
                    name="offerPrice"
                    value={formik.values.offerPrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Offer Price"
                  />
                  {formik.touched.offerPrice && formik.errors.offerPrice && (
                    <div className="text-danger">
                      {formik.errors.offerPrice}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="hsnCode" className="form-label">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="hsnCode"
                    name="hsnCode"
                    value={formik.values.hsnCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter HSN Code"
                  />
                  {formik.touched.hsnCode && formik.errors.hsnCode && (
                    <div className="text-danger">{formik.errors.hsnCode}</div>
                  )}
                </div>

                <div className="mb-3">
                  <div>Status:</div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusContinue"
                      value="continue"
                      checked={formik.values.status === "continue"}
                      onChange={formik.handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="statusContinue"
                    >
                      Continue
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusDiscontinue"
                      value="discontinue"
                      checked={formik.values.status === "discontinue"}
                      onChange={formik.handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="statusDiscontinue"
                    >
                      Discontinue
                    </label>
                  </div>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-danger">{formik.errors.status}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="hsnCode" className="form-label">
                    Description
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescriptionValue}
                  />
                </div>
                <div className="row align-items-center">
                  <div className="col">
                    <div className="input-group">
                      <FileMultipleInput
                        id="inputGroupFile04"
                        className="form-control d-none"
                        onChange={handleFileInputChange}
                        forwardedRef={fileInputRef}
                      />
                      <Button
                        onClick={handleCameraIconClick}
                        type="button"
                        className="btn btn-outline-secondary"
                      >
                        <FontAwesomeIcon icon={faCamera} />
                      </Button>
                    </div>
                  </div>
                  {selectedImages.length > 0 && (
                    <div className="row">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="col-auto">
                          <img
                            src={image.fileUrl}
                            className="rounded"
                            alt={`Selected Image ${index}`}
                            style={{
                              width: "150px",
                              height: "150px",
                              marginRight: "10px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3 submitButton">
                  <Button type="submit" className="btn btn-primary">
                    {isEditing ? "Update" : "Submit"}
                  </Button>
                  <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
