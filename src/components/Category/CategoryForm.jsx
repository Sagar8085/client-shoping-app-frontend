import React, { useRef, useState } from "react";
import "./Category.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FileInput, TextInput } from "../input/Input";
import Button from "../button/Button";

export default function Category({ data }) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState({
    bytes: "",
    filename: "",
  });

  const initialValues = {
    categoryName: data ? data.Name : "",
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category name is required"),
  });

  const onSubmit = (values) => {
    console.log("Form values:", values, "-------------", selectedImage);
    // Add your form submission logic here
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

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage({
        bytes: file,
        filename: URL.createObjectURL(file),
      });
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
                  {selectedImage.filename && (
                    <div className="col-auto">
                      <img
                        src={selectedImage.filename}
                        className="rounded"
                        alt="Selected"
                        style={{ width: "150px", height: "150px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-3 submitButton">
                  <Button type="submit" className="btn btn-primary">
                    Submit
                  </Button>
                  <Button type="button" className="btn btn-primary">
                    Reset
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
