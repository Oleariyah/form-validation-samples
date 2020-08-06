import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { isEmpty } from "lodash";
import "./styles/App.css";
const payload = require("./data.json");

export default () => {
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState(null);
  const [file, setFileName] = useState({});

  const handleSubmit = event => {
    const { rc_number, mlm, cac } = data;
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      const postData = { kycDocuments: [rc_number, mlm, cac] };
      console.log(JSON.stringify(postData));
    }
  };

  // Convert file to base64 string
  const fileToBase64 = file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.readAsDataURL(file);
    });
  };

  const handleValue = e => {
    if (e.target.type === "text") {
      setData({
        ...data,
        [e.target.name]: {
          fieldName: e.target.name,
          documentType: "TEXT",
          kycRecordUpdate: e.target.value
        }
      });
    }
  };

  const handleFile = e => {
    e.persist();
    const fileDetail = e.target.files[0];
    fileToBase64(fileDetail).then(result => {
      if (fileDetail) {
        const { name } = fileDetail;
        if (e.target.accept === "image/*") {
          setFileName({ ...file, [e.target.name]: name });
          setData({
            ...data,
            [e.target.name]: {
              fieldName: e.target.name,
              documentType: "IMAGE",
              rawFile: result
            }
          });
        } else {
          setFileName({ ...file, cac: name });
          setData({
            ...data,
            [e.target.name]: {
              fieldName: e.target.name,
              documentType: "PDF",
              rawFile: result
            }
          });
        }
      }
    });
  };

  return (
    <div className="container p-5 mt-5">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {payload.map((payloadData, index) => (
          <Form.Group key={index} controlId="validationCustom01">
            <Form.Label>{payloadData.kycDocumentName}</Form.Label>
            {payloadData.documentType === "TEXT" ? (
              <Form.Control
                name={payloadData.fieldName}
                onChange={e => handleValue(e)}
                type="text"
                className="py-4"
                placeholder={payloadData.description}
                style={{ fontSize: 20 }}
                required
              />
            ) : payloadData.documentType !== "TEXT" ? (
              <Form.File
                name={payloadData.fieldName}
                id="custom-file-translate-scss"
                label={
                  payloadData.documentType === "IMAGE"
                    ? isEmpty(file) || file.mlm === undefined
                      ? "Select An Image"
                      : file.mlm
                    : isEmpty(file) || file.cac === undefined
                    ? "Select A PDF"
                    : file.cac
                }
                lang="en"
                accept={
                  payloadData.documentType === "IMAGE"
                    ? "image/*"
                    : "application/pdf"
                }
                onChange={e => handleFile(e)}
                data-browse="Upload"
                style={{ fontSize: 20 }}
                custom
                required
              />
            ) : null}
          </Form.Group>
        ))}
        <Button
          className="my-2 mt-4 mb-3 py-2 btn-lg btn-block"
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};
