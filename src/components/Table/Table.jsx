import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.scss";
import Modal from "react-bootstrap/Modal";
import Category from "../Category/CategoryForm";
import Button from "react-bootstrap/Button";

const Table = ({ columns, data, pageSize }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = data.slice(startIndex, endIndex);
  const [lgShow, setLgShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModel = (row) => {
    if (row) {
      setSelectedRow(row);
      setLgShow(true);
    } else {
      setLgShow(true);
    }
  };
  const modelHide = () => {
    setSelectedRow({});
    setLgShow(false);
  };

  return (
    <div className="table-container p-5 bg-white">
      <div className="addCategoryButton">
        <Button variant="outline-primary" onClick={() => handleOpenModel()}>
          Add Category
        </Button>
      </div>
      <div className="centered-table">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>Actions</th> {/* Add a column for action icons */}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}>
                {/* {columns.map((column) => (
                  <td key={column}>{row[column]}</td>
                ))} */}
                <td>{index}</td>
                <td>{row?.Name}</td>
                <td>
                  <img src={row?.image} />
                </td>
                <td>
                  <button className="btn ">
                    <FontAwesomeIcon
                      className="editIcon"
                      onClick={() => handleOpenModel(row)}
                      icon={faPen}
                    />
                  </button>{" "}
                  {/* Edit icon */}
                  <button className="btn">
                    <FontAwesomeIcon className="deleteIcon" icon={faTrashAlt} />
                  </button>{" "}
                  {/* Delete icon */}
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
        onHide={() => modelHide()}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Large Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Category data={selectedRow} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Table;
