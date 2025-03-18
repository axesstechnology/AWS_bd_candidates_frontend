import React from "react";
import { Button } from "antd";

const GoogleDrivePDFViewer = ({file}) => {
  const fileUrl = `${file}/preview`;

  return (
    <Button type="primary" onClick={() => window.open(fileUrl, "_blank")}>
      View PDF
    </Button>
  );
};

export default GoogleDrivePDFViewer;