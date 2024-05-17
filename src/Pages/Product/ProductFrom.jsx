import React, { useEffect, useRef, useState } from "react";
import "./brand.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FileInput, TextInput } from "../../components/input/Input";
import Button from "../../components/button/Button";
import axios from "axios";

export default function ProductFrom({
  data,
  onHide,
  setIsSubmitData,
  allCategoryData,
}) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState({
    fileName: data.file?.fileName || "",
    fileUrl: data.file?.fileUrl || "",
  });

  const initialValues = {
    category_id: data.category_id || "",
    brandId: "", // Added brandId field
    productName: data.productName || "",
  };

  const validationSchema = Yup.object({
    category_id: Yup.string().required("Category is required"),
    brandId: Yup.string().required("Brand is required"),
    productName: Yup.string().required("Product name is required"),
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
    const productData = {
      categoryId: values.category_id,
      brandId: values.brandId,
      productName: values.productName,
      file: selectedImage,
    };
    try {
      if (
        selectedImage.fileName.length > 0 &&
        selectedImage.fileUrl.length > 0
      ) {
        if (data._id) {
          updateBrand(data._id, productData);
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
    if (e && e.target && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("docFile", file);

      try {
        const uploadImage = await axios.post(
          "https://shopping-backend-3.onrender.com/service/uploadSingleDoc",
          formData
        );
        if (uploadImage?.status === 200 || uploadImage?.status === 201) {
          setSelectedImage({
            fileName: uploadImage?.data?.fileName,
            fileUrl: uploadImage?.data?.fileLocation,
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("No file selected");
    }
  };

  const getAllBrand = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://shopping-backend-3.onrender.com/brand/getAllBrand?category_id=${categoryId}`
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

  const addProduct = async (data) => {
    try {
      const response = await axios.post(
        "https://shopping-backend-3.onrender.com/product/addProduct",
        data
      );
      if (response?.status == 200) {
        alert("Product add successfully");
        handleClose();
      } else {
        console.error("Error adding brand:");
      }
    } catch (error) {
      console.error("Error adding brand:", error);
    }
  };

  const updateBrand = async (brandId, data) => {
    try {
      const response = await axios.put(
        `https://shopping-backend-3.onrender.com/brand/updateBrand/${brandId}`,
        data
      );
      if (response?.status) {
        handleClose();
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };

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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.brandId}
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
                  <TextInput
                    label="Product Name"
                    id="productName"
                    name="productName"
                    placeholder="Enter Product Name"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.productName && formik.errors.productName && (
                    <div className="text-danger">
                      {formik.errors.productName}
                    </div>
                  )}
                </div>

                <div className="row align-items-center">
                  <div className="col">
                    <div className="input-group">
                      <FileInput
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
                  {selectedImage.fileUrl && (
                    <div className="col-auto">
                      <img
                        src={selectedImage.fileUrl}
                        className="rounded"
                        alt="Selected"
                        style={{ width: "150px", height: "150px" }}
                      />
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
