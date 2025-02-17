import React, { useState } from 'react';
import { Modal, Button } from 'antd';

interface DocumentViewerProps {
  fileName: string;
  base64: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileName, base64 }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension;
  };

  const renderContent = () => {
    const fileType = getFileType(fileName);

    switch (fileType) {
      case 'pdf':
        return (
          <iframe
            src={`data:application/pdf;base64,${base64}`}
            width="100%"
            height="500px"
            title={fileName}
          />
        );
      case 'docx':
      case 'doc':
        return (
          <div>
            <p>Inline preview for .docx is not supported.</p>
            <a
              href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`}
              download={fileName}
            >
              Click here to download the document.
            </a>
          </div>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={`data:image/${fileType};base64,${base64}`}
            alt={fileName}
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        );
      default:
        return (
          <div>
            <p>Unsupported file type. Unable to preview.</p>
            <a
              href={`data:application/octet-stream;base64,${base64}`}
              download={fileName}
            >
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalVisible(true)}
        className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
      >
        View {fileName.split('.').pop()?.toUpperCase()}
      </button>
      <Modal
        title={fileName}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            onClick={() => {
              const link = document.createElement('a');
              link.href = `data:application/octet-stream;base64,${base64}`;
              link.download = fileName;
              link.click();
            }}
          >
            Download
          </Button>,
        ]}
        width="80%"
      >
        {renderContent()}
      </Modal>
    </>
  );
};

export default DocumentViewer;
