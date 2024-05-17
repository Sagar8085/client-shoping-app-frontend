// BrandForm component

import React, { useEffect, useRef, useState } from "react";
import "./brand.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FileInput, TextInput } from "../../components/input/Input";
import Button from "../../components/button/Button";
import axios from "axios";

export default function BrandForm({
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
    brand_name: data.brand_name || "",
  };

  const validationSchema = Yup.object({
    category_id: Yup.string(),
    brand_name: Yup.string().required("Brand name is required"),
  });

  const [isEditing, setIsEditing] = useState(false); // State to track edit mode

  useEffect(() => {
    setIsEditing(!!data._id); // Set isEditing based on whether data has an _id
  }, [data._id]);

  const onSubmit = async (values) => {
    const brandData = {
      category_id: values.category_id,
      brand_name: values.brand_name,
      file: selectedImage,
    };
    try {
      if (
        selectedImage.fileName.length > 0 &&
        selectedImage.fileUrl.length > 0
      ) {
        if (data._id) {
          updateBrand(data._id, brandData);
        } else {
          addBrand(brandData);
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
          "http://localhost:5000/service/uploadSingleDoc",
          formData
        );
        if (uploadImage?.status == 200 || uploadImage?.status == 201) {
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

  const addBrand = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/brand/addBrand",
        data
      );
      if (response?.status) {
        handleClose();
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error adding brand:", error);
    }
  };

  const updateBrand = async (brandId, data) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/brand/updateBrand/${brandId}`,
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
                    onChange={formik.handleChange}
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
                  <TextInput
                    label="Brand Name"
                    id="brand_name"
                    name="brand_name"
                    placeholder="Enter Brand Name"
                    value={formik.values.brand_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.brand_name && formik.errors.brand_name && (
                    <div className="text-danger">
                      {formik.errors.brand_name}
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
                    {isEditing ? "Update" : "Submit"} {/* Dynamic button text */}
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
