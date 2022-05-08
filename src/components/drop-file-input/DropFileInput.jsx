import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import "./drop-file-input.css";

import { ImageConfig } from "../../config/ImageConfig";
import Fileicon from "../../assets/file.png";
import { Icon } from "@mui/material";

import Upload from "@mui/icons-material/CloudUpload";
import AcUnitIcon from "@mui/icons-material/UploadFile";
import Delete from "@mui/icons-material/Delete";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);
  const [fileList1, setFileList1] = useState([]);
  const [isflag, setFlag] = useState(false);
  const [isflag1, setFlag1] = useState(false);
  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    setFlag(true);
    const newFile = e.target.files[0];
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear();
    newFile["date"] = date;
    newFile["month"] = month;
    newFile["year"] = year;
    if (newFile) {
      const updatedList = [...fileList, newFile];
      console.log(updatedList);
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    setFlag(false);
    props.onFileChange(updatedList);
  };
  const onFileDrop1 = (e) => {
    setFlag1(true);
    const newFile1 = e.target.files[0];
    var date1 = new Date().getDate(); //Current Date
    var month1 = new Date().getMonth() + 1; //Current Month
    var year1 = new Date().getFullYear();
    newFile1["date"] = date1;
    newFile1["month"] = month1;
    newFile1["year"] = year1;
    if (newFile1) {
      const updatedList1 = [...fileList1, newFile1];
      console.log(updatedList1);
      setFileList1(updatedList1);
      props.onFileChange(updatedList1);
    }
  };

  const fileRemove1 = (file) => {
    const updatedList1 = [...fileList1];
    updatedList1.splice(fileList1.indexOf(file), 1);
    setFileList1(updatedList1);
    setFlag1(false);
    props.onFileChange(updatedList1);
  };

  return (
    <div className="content">
      <div className="firstfield">
        <div className="spanfield">
          <p className="logosspan">Logos</p>
          <p className="colorspan">Colors *</p>
        </div>
        <div
          ref={wrapperRef}
          className={
            isflag === false ? "drop-file-input" : "drop-file-input-hide"
          }
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="drop-file-input__label">
            <p className="dragspandrop">
              Choose a file or
              <br /> drag it here
            </p>
            <div className="iconsfiled">
              <Upload className="uploadicon" />
              <input type="file" value="" onChange={onFileDrop} />
            </div>
          </div>
        </div>
        {fileList.length > 0 ? (
          <div className="drop-file-preview">
            {fileList.map((item, index) => (
              <div key={index} className="drop-file-preview__item">
                <div className="namesizes">
                  {/* <img src={Fileicon} alt="" /> */}
                  <AcUnitIcon className="fileicson" />
                  <div className="drop-file-preview__item__info">
                    <p>SomeFileName.png</p>
                    <p className="dateslass">Updated September 20,2020|144ET</p>
                    {/* <p>{item.name}</p>
                    <p className="dateslass">
                      Updated {item.month} {item.date},{item.year}
                    </p> */}
                  </div>
                </div>
                <Delete
                  className="delteicon"
                  onClick={() => fileRemove(item)}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="second">
        <div className="spanfield" style={{ marginLeft: "60px" }}>
          <p className="colorspan">Grayscale</p>
        </div>
        <div
          ref={wrapperRef}
          className={
            isflag1 === false ? "drop-file-input" : "drop-file-input-hide"
          }
          style={{ marginLeft: "8%" }}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="drop-file-input__label">
            <p className="dragspandrop">
              Choose a file or
              <br /> drag it here
            </p>
            <div className="iconsfiled">
              <Upload className="uploadicon" />
              <input type="file" value="" onChange={onFileDrop1} />
            </div>
          </div>
        </div>
        {fileList1.length > 0 ? (
          <div className="drop-file-preview" style={{ marginLeft: "8%" }}>
            {fileList1.map((item, index) => (
              <div key={index} className="drop-file-preview__item">
                <div className="namesizes">
                  {/* <img src={Fileicon} alt="" /> */}
                  <div className="fileiconfield">
                    <AcUnitIcon className="fileicson" />
                  </div>
                  <div className="drop-file-preview__item__info">
                    <p>SomeFileName.png</p>
                    <p className="dateslass">Updated September 20,2020|144ET</p>
                  </div>
                </div>
                <Delete
                  className="delteicon"
                  onClick={() => fileRemove1(item)}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
