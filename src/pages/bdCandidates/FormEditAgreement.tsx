import React, { useEffect, useState } from 'react';
import { Form, Radio, DatePicker, Checkbox, Upload, Row, Col, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { FormInstance } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';

const { Text } = Typography;

interface FormUpload {
  _id: string;
  originalName: string;
  type: string;
  base64: string;
  form?: string;
}

interface InitialDataType {
  Agreement?: string;
  Acknowledgement?: string;
  Forms?: string | string[];
  formUploads?: FormUpload[];
  acknowledgementFile?: FormUpload;
}

interface FormEditAgreementProps {
  form: FormInstance;
  initialData?: InitialDataType;
}

interface CustomFile extends UploadFile {
  base64?: string;
}

const FormEditAgreement: React.FC<FormEditAgreementProps> = ({ form, initialData }) => {
  const [isAgreementYes, setIsAgreementYes] = useState(initialData?.Agreement === "yes");
  const [isAcknowledgementYes, setIsAcknowledgementYes] = useState(initialData?.Acknowledgement === "yes");
  const [checkedForms, setCheckedForms] = useState<string[]>([]);
  const [fileList, setFileList] = useState<{ [key: string]: CustomFile[] }>({});
  const [acknowledgementFile, setAcknowledgementFile] = useState<CustomFile[]>([]);

  useEffect(() => {
    if (initialData) {
      if (initialData.Forms) {
        const forms = Array.isArray(initialData.Forms) ? initialData.Forms : [initialData.Forms];
        setCheckedForms(forms);
      }

      if (initialData.formUploads) {
        const files: { [key: string]: CustomFile[] } = {};
        initialData.formUploads.forEach((upload: FormUpload) => {
          files[`File Upload ${upload.form}`] = [{
            uid: upload._id,
            name: upload.originalName,
            status: 'done',
            type: upload.type,
            url: `data:${upload.type};base64,${upload.base64}`,
          }];
        });
        setFileList(files);
      }

      if (initialData.acknowledgementFile) {
        const file = initialData.acknowledgementFile;
        setAcknowledgementFile([{
          uid: file._id,
          name: file.originalName,
          status: 'done',
          type: file.type,
          url: `data:${file.type};base64,${file.base64}`,
        }]);
      }
    }
  }, [initialData]);

  const handleAgreementChange = (e: RadioChangeEvent) => {
    const isYes = e.target.value === "yes";
    setIsAgreementYes(isYes);
    
    if (!isYes) {
      form.setFieldsValue({
        Forms: undefined,
        "Agreement Date": undefined,
      });
      setCheckedForms([]);
      setFileList({});
    }
  };

  const handleAcknowledgementChange = (e: RadioChangeEvent) => {
    const isYes = e.target.value === "yes";
    setIsAcknowledgementYes(isYes);
    
    if (!isYes) {
      form.setFieldsValue({
        "Acknowledgement Date": undefined,
        "Acknowledgement File": undefined,
      });
      setAcknowledgementFile([]);
    }
  };

  const handleCheckboxChange = (checkedValues: string[]) => {
    setCheckedForms(checkedValues);
    
    const newFileList = { ...fileList };
    Object.keys(newFileList).forEach(key => {
      const formNumber = key.replace("File Upload ", "");
      if (!checkedValues.includes(formNumber)) {
        delete newFileList[key];
      }
    });
    setFileList(newFileList);
  };

  const handleFileUpload = async (info: any, formIdentifier: string): Promise<CustomFile | null> => {
    const file = info.file || (info.fileList && info.fileList[0]);
    if (!file) {
      message.error("No file selected");
      return null;
    }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      const cleanFile: CustomFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        type: file.type,
        url: base64,
        base64: base64.split(',')[1],
      };

      setFileList(prev => ({
        ...prev,
        [formIdentifier]: [cleanFile],
      }));

      return cleanFile;
    } catch (error) {
      console.error("File upload error:", error);
      message.error("File upload failed");
      return null;
    }
  };

  const handleAcknowledgementUpload = async (info: any) => {
    const result = await handleFileUpload(info, "Acknowledgement File");
    if (result) {
      setAcknowledgementFile([result]);
    }
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const formIdentifier = options.data?.formIdentifier;
      const result = await handleFileUpload({ file }, formIdentifier);
      if (result && onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <>
      {/* Agreement Section */}
      <Form.Item name="Agreement" label={<Text strong>Agreement</Text>}>
        <Row align="middle" gutter={16}>
          <Col>
            <Radio.Group onChange={handleAgreementChange} value={isAgreementYes ? "yes" : "no"}>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>
          
          <Col>
            <Form.Item 
              name="Agreement Date"
              style={{ marginBottom: 0 }}
              rules={isAgreementYes ? [{ required: true, message: "Please select Date!" }] : []}
            >
              <DatePicker 
                disabled={!isAgreementYes}
                placeholder="Select Date"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      {isAgreementYes && (
        <>
          <Form.Item
            name="Forms"
            label={<Text strong>Forms</Text>}
            rules={[{ required: true, message: "Please select at least one form" }]}
          >
            <Checkbox.Group onChange={handleCheckboxChange} value={checkedForms}>
              <Checkbox value="1">1</Checkbox>
              <Checkbox value="1A">1A</Checkbox>
              <Checkbox value="2">2</Checkbox>
              <Checkbox value="2A">2A</Checkbox>
              <Checkbox value="3">3</Checkbox>
              <Checkbox value="3A">3A</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          {checkedForms.map((formNumber) => (
            <Form.Item
              key={formNumber}
              name={`File Upload ${formNumber}`}
              label={`Upload File for Form ${formNumber}`}
              rules={[{ required: true, message: `Please upload a file for Form ${formNumber}!` }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload
                customRequest={(options) => 
                  customRequest({ 
                    ...options, 
                    data: { formIdentifier: `File Upload ${formNumber}` }
                  })
                }
                fileList={fileList[`File Upload ${formNumber}`] || []}
                maxCount={1}
              >
                <div className="flex items-center space-x-2">
                  <UploadOutlined />
                  <span>Click to Upload</span>
                </div>
              </Upload>
            </Form.Item>
          ))}
        </>
      )}

      {/* Acknowledgement Section */}
      <Form.Item name="Acknowledgement" label={<Text strong>Acknowledgement</Text>}>
        <Row align="middle" gutter={16}>
          <Col>
            <Radio.Group 
              onChange={handleAcknowledgementChange}
              value={isAcknowledgementYes ? "yes" : "no"}
            >
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>
          
          <Col>
            <Form.Item 
              name="Acknowledgement Date"
              style={{ marginBottom: 0 }}
              rules={isAcknowledgementYes ? [{ required: true, message: "Please Select Date!" }] : []}
            >
              <DatePicker 
                disabled={!isAcknowledgementYes}
                placeholder="Select Date"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      {isAcknowledgementYes && (
        <Form.Item
          name="Acknowledgement File"
          label="Upload Acknowledgement File"
          rules={[{ required: true, message: "Please upload the acknowledgement file!" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            customRequest={(options) => 
              customRequest({ 
                ...options, 
                data: { formIdentifier: "Acknowledgement File" }
              })
            }
            fileList={acknowledgementFile}
            maxCount={1}
          >
            <div className="flex items-center space-x-2">
              <UploadOutlined />
              <span>Click to Upload</span>
            </div>
          </Upload>
        </Form.Item>
      )}
    </>
  );
};

export default FormEditAgreement;