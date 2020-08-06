import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./styles/App.css";
const payload = require("./data.json");

export default () => {
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({
    rc_number: null,
    mlm: null,
    cac: null
  });

  const [file, setFileName] = useState({
    mlm: null,
    cac: null
  });

  const { rc_number, mlm, cac } = data;
  const handleSubmit = event => {
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

  const handleValue = async e => {
    if (e.target.name === "rc_number") {
      setData({
        ...data,
        [e.target.name]: {
          fieldName: e.target.name,
          documentType: "TEXT",
          kycRecordUpdate: e.target.value
        }
      });
    } else if (e.target.files[0]) {
      const fileDetail = e.target.files[0];
      const { name } = fileDetail;
      if (e.target.name === "mlm") {
        fileToBase64(fileDetail).then(result =>
          setData({ ...data, mlm: result })
        );
        setFileName({ ...file, mlm: name });
        setData({
          ...data,
          [e.target.name]: {
            fieldName: e.target.name,
            documentType: "IMAGE"
          }
        });
      } else {
        fileToBase64(fileDetail).then(result =>
          setData({ ...data, cac: result })
        );
        setFileName({ ...file, cac: name });
        setData({
          ...data,
          [e.target.name]: {
            fieldName: e.target.name,
            documentType: "PDF"
          }
        });
      }
    }
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
            ) : payloadData.documentType === "IMAGE" ? (
              <Form.File
                name={payloadData.fieldName}
                id="custom-file-translate-scss"
                label={!file.mlm ? "Select An Image" : file.mlm}
                lang="en"
                accept="image/*"
                onChange={e => handleValue(e)}
                data-browse="Upload"
                style={{ fontSize: 20 }}
                custom
                required
              />
            ) : (
              <Form.File
                name={payloadData.fieldName}
                id="custom-file-translate-scss"
                label={!file.cac ? "Select A PDF File" : file.cac}
                lang="en"
                accept="application/pdf"
                onChange={e => handleValue(e)}
                data-browse="Upload"
                style={{ fontSize: 20 }}
                custom
                required
              />
            )}
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
