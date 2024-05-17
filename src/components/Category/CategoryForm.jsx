import React, { useRef, useState } from "react";
import "./Category.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FileInput, TextInput } from "../input/Input";
import Button from "../button/Button";
import axios from "axios";

export default function Category({ data, isEdit, onHide, setIsSubmitData }) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState({
    fileName: data && data.file ? data.file.fileName : "",
    fileUrl: data && data.file ? data.file.fileUrl : "",
  });

  const initialValues = {
    categoryName: data ? data.category_name : "",
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category name is required"),
  });

  const onSubmit = (values) => {
    const categoryData = {
      id: data._id, // Assuming you have an id field in your row data
      category_name: values.categoryName,
      file: selectedImage,
    };
    if (
      categoryData &&
      selectedImage.fileName.length > 0 &&
      selectedImage.fileUrl.length > 0
    ) {
      if (isEdit) {
        updateCategory(categoryData);
      } else {
        addCategory(categoryData);
      }
    } else {
      alert("All fields are required!");
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
          console.log("upload image", uploadImage);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("No file selected");
    }
  };

  const addCategory = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/category/addCategory`,
        data
      );
      if (response.status == 200) {
        onHide();
        setIsSubmitData((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategory = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/category/updateCategory/${data.id}`,
        data
      );

      if (response.status === 200) {
        onHide();
        setIsSubmitData((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid bg-white">
      <div className="row formDiv">
        <div className="col-md-12 ">
          {" "}
          {/* Center the column horizontally */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={formik.handleSubmit} noValidate>
                <TextInput
                  label="Category Name"
                  id="categoryName"
                  name="categoryName"
                  placeholder="Enter Category Name"
                  value={formik.values.categoryName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.categoryName && formik.errors.categoryName && (
                  <div style={{ color: "red" }}>
                    {formik.errors.categoryName}
                  </div>
                )}
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
                  {selectedImage && (
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
                    {isEdit ? "Edit" : "Submit"}
                  </Button>

                  <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={onHide}
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
