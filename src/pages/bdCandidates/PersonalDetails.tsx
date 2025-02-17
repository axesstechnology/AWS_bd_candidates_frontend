import React, { useState } from "react";
import {
  Form,
  Input,
  Radio,
  Switch,
  DatePicker,
  Select,
  Checkbox,
  Upload,
  message,
  Col,
  Row,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import dropdownOptions from "../../assets/dropdownOptions.json";

const { Option } = Select;
const { Text } = Typography;

interface PersonalDetailsProps {
  form: FormInstance;
  mode: string;
  normFile: (e: any) => any;
  initialData?: any;
}

const capitalize = (text: string) => {
  return text.replace(/\b\w/g, (char) => char?.toUpperCase());
};

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  mode,
  normFile,
}) => {
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [isAgreementYes, setIsAgreementYes] = useState(false);
  const [isAcknowledgementYes, setIsAcknowledgementYes] = useState(false);
  const [checkedForms, setCheckedForms] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [isModelReady, setIsModelReady] = useState(false);
  const [isVideoShot, setIsVideoShot] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");

  const handleCategoryChange = (value: any) => {
    setSelectedCategory(value);
  };

  const handleStageChange = (value: any) => {
    setSelectedStage(value);
  };

  const handleActiveChange = (checked: boolean) => {
    setIsActive(checked);
  };

  const handleAgreementChange = (e: any) => {
    setIsAgreementYes(e.target.value === "yes");
  };

  const handleAcknowledgementChange = (e: any) => {
    setIsAcknowledgementYes(e.target.value === "yes");
  };

  const handleCheckboxChange = (checkedValues: string[]) => {
    setCheckedForms(checkedValues);
  };

  const handleProfileCreatedChange = (e: any) => {
    setIsProfileCreated(e.target.value === "yes");
  };

  const handleModelReadyChange = (e: any) => {
    setIsModelReady(e.target.value === "yes");
    // Reset profile created state when Model Ready changes
    setIsProfileCreated(false);
  };

  const handleVideoShotChange = (e: any) => {
    setIsVideoShot(e.target.value === "yes");
    // Reset profile created state when Video Shot changes
  };

  const handleDomainChange = (e: any) => {
    setSelectedDomain(e.target.value);
  };

  const handleFileUpload = async (info: any) => {
    // Check if file exists
    const file = info.file || (info.fileList && info.fileList[0]);
    if (!file) {
      message.error("No file selected");
      return null;
    }

    // Extract the actual File object
    const originFileObj = file.originFileObj || file;

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(originFileObj);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      // Remove the data URL prefix
      const base64Data = base64.split(",")[1];

      // Create a clean file object without Ant Design metadata
      const cleanFileObject = {
        name: originFileObj.name,
        type: originFileObj.type,
        size: originFileObj.size,
        lastModified: originFileObj.lastModified,
        base64: base64Data,
      };

      console.log("Clean File Object:", cleanFileObject);
      return cleanFileObject;
    } catch (error) {
      console.error("File conversion error:", error);
      message.error("File upload failed");
      return null;
    }
  };

  

  return (
    <div className="space-y-6">
      {/* student Id */}
      <Form.Item
        label={<Text strong>Student ID</Text>}
        name="Back Door ID"
        rules={[
          { required: true, message: "Please input Student ID!" },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: "Student ID can only contain letters and numbers!",
          },
        ]}
      >
        <Input placeholder="Enter Student ID" />
      </Form.Item>

      <Form.Item
        name="BD category"
        label={<Text strong>Category</Text>}
        rules={[{ required: true, message: "Please select a Category!" }]}
      >
        <Select placeholder="Select  Category" onChange={handleCategoryChange}>
          {dropdownOptions.BDcategory.map((category, index) => (
            <Option key={index} value={category}>
              {capitalize(category)}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={<Text strong>Candidate Full Name</Text>}
        name="Candidate Full Name"
        rules={[
          { required: true, message: "Please input Candidate Name!" },
          {
            pattern: /^[a-zA-Z\s]+$/,
            message: "Name can only contain letters and spaces!",
          },
        ]}
      > 
        <Input placeholder="Enter Candidate Name"/>
      </Form.Item>

      <Form.Item
        name="radio-button"
        label={<Text strong>Domain</Text>}
        rules={[{ required: true, message: "Please select a Domain" }]}
      >
        <Radio.Group onChange={handleDomainChange}>
          <Radio.Button value="software_engineering">
            Software Development
          </Radio.Button>
          <Radio.Button value="software_testing">Software Testing</Radio.Button>
          {selectedCategory === "Interview Support" ? (
            <Radio.Button value="Others">Others</Radio.Button>
          ) : null}
        </Radio.Group>
      </Form.Item>

      {selectedCategory === "Interview Support" &&
        selectedDomain === "Others" && (
          <Form.Item
            name="other_domain"
            label={<Text strong>Specify Domain</Text>}
            rules={[{ required: true, message: "Please specify the domain!" }]}
          >
            <Input placeholder="Enter domain" />
          </Form.Item>
        )}

      <Form.Item
        name="switch"
        label={<Text strong>Inactive/Active</Text>}
        initialValue={true}
        valuePropName="checked"
      >
        <Switch onChange={handleActiveChange} />
      </Form.Item>

      {!isActive && (
        <Form.Item
          name="In Active Reason"
          label="Inactive Reason"
          rules={[{ required: true, message: "Please select a Reason!" }]}
        >
          <Select placeholder="Select Reason">
            {dropdownOptions.inActivereasons.map((category, index) => (
              <Option key={`${index}`} value={category}>
                {capitalize(category)}
              </Option> 
            ))}
          </Select>
        </Form.Item>
      )}

<Form.Item name="Agreement" label={<Text strong>Agreement</Text>}>
        <Row align="middle" gutter={16}>
          {/* Agreement Radio Group */}
          <Col>
            <Radio.Group onChange={handleAgreementChange}>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>

          {/* DatePicker aligned to the right */}

          <Col>
            <Form.Item
              name="Agreement Date"
              style={{ marginBottom: 0 }} // Ensures it aligns properly
              rules={
                isAgreementYes
                  ? [{ required: true, message: "Please select Date!" }]
                  : []
              }
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
            rules={[
              { required: true, message: "Please select at least one form!" },
            ]}
          >
            <Checkbox.Group onChange={handleCheckboxChange}>
              <Checkbox value="1">1</Checkbox>
              <Checkbox value="1A">1A</Checkbox>
              <Checkbox value="2">2</Checkbox>
              <Checkbox value="2A">2A</Checkbox>
              <Checkbox value="3">3</Checkbox>
              <Checkbox value="3A">3A</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          {checkedForms.map((form) => (
            <Form.Item
              key={form}
              name={`File Upload ${form}`}
              label={`Upload File for Form ${form}`}
              rules={[
                {
                  required: true,
                  message: `Please upload a file for Form ${form}!`,
                },
              ]}
            >
              <Upload
                // Completely prevent default upload behavior
                customRequest={({ file, onSuccess, onError }) => {
                  handleFileUpload({ file })
                    .then((cleanFile) => {
                      if (cleanFile) {
                        onSuccess?.(cleanFile); // Use optional chaining operator
                      } else {
                        onError?.(new Error("File upload failed"));
                      }
                    })
                    .catch((error) => onError?.(error));
                }}
                // Disable default upload list
                // showUploadList={false}
              >
                <div>
                  <UploadOutlined /> Click to Upload
                </div>
              </Upload>
            </Form.Item>
          ))}
          {/* {checkedForms.map((form) => (
            <Form.Item
              key={form}
              name={`File Upload ${form}`}
              label={`Upload File for Form ${form}`}
              rules={[
                {
                  required: true,
                  message: `Please upload a file for Form ${form}!`,
                },
              ]}
            >
              <Upload
                beforeUpload={(file) => {
                  handleFileUpload(file, form);
                  return false; // Prevent default upload
                }}
                // If you want to transform the file before sending
                transformFile={(file:any) => {
                  // Return the custom payload instead of the original file
                  return file.customPayload || file;
                }}
              >
                <div>
                  <UploadOutlined /> Click to Upload
                </div>
              </Upload>
            </Form.Item>
          ))} */}
        </>
      )}

      {/* Acknowledgement Section */}
      <Form.Item
        name="Acknowledgement"
        label={<Text strong>Acknowledgement</Text>}
      >
        <Row align="middle" gutter={16}>
          {/* Acknowledgement Radio Group */}
          <Col>
            <Radio.Group onChange={handleAcknowledgementChange}>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>

          {/* DatePicker aligned to the right */}
          <Col>
            <Form.Item
              name="Acknowledgement Date"
              style={{ marginBottom: 0 }}
              rules={
                isAcknowledgementYes
                  ? [{ required: true, message: "Please Select Date!" }]
                  : []
              }
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
        <>
          {/* <Form.Item
            name="Acknowledgement Date"
            label="Acknowledgement Date"
            // rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item> */}
          <Form.Item
            name="Acknowledgement File"
            label="Upload Acknowledgement File"
            rules={[
              {
                required: true,
                message: "Please upload the acknowledgement file!",
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => {
                return false;
              }}
            >
              <div>
                <UploadOutlined /> Click to Upload
              </div>
            </Upload>
          </Form.Item>
        </>
      )}  


      {selectedCategory === "Backdoor" && (
        <Form.Item
          name="Need Job Type"
          label={<Text strong>Job Mode</Text>}
          // rules={[{ required: true, message: "Please pick an item!" }]}
        >
          <Radio.Group>
            <Radio.Button value="Hybrid">Hybrid</Radio.Button>
            <Radio.Button value="Remote">Remote</Radio.Button>
            <Radio.Button value="Office">Office</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}

      {/* <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: "Please input your phone number!" }]}
      >
        <Input addonBefore="+91" style={{ width: "100%" }} />
      </Form.Item> */}
      <Form.Item
        name="phone"
        label={<Text strong>Phone Number</Text>}
        rules={[
          { required: true, message: "Please input Phone Number!" },
          {
            pattern: /^[6-9]\d{9}$/,
            message: "Please enter a valid 10-digit mobile number!",
          },
        ]}
      >
        <Input addonBefore="+91" style={{ width: "100%" }} placeholder="Enter Phone Number"/>
      </Form.Item>

      <Form.Item
        label={<Text strong>Candidate Mail ID</Text>}
        name="Candidate Mail ID"
        rules={[
          { required: true, message: "Please input Candidate Mail ID!" },
          { type: "email", message: "Please enter a valid Email Address!" },
        ]}
      >
        <Input placeholder="Enter Mail ID "/>
      </Form.Item>

      {/* stage */}

      {selectedCategory === "Backdoor" && (
        <Form.Item
          name="stage"
          label={<Text strong>Stage</Text>}
          rules={[{ required: true, message: "Please Select a Stage!" }]}
        >
          <Select placeholder="Select  Stage" onChange={handleStageChange}>
            {dropdownOptions.BDStage.map((stage, index) => (
              <Option key={index} value={stage}>
                {capitalize(stage)}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item name="Video Shooted" label={<Text strong>Video Shot</Text>}>
        <Row align="middle" gutter={16}>
          {/* Video Shooted Radio Group */}
          <Col>
            <Radio.Group onChange={handleVideoShotChange}>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>

          {/* DatePicker aligned to the right */}
          <Col>
            <Form.Item
              name="Video shot Date"
              style={{ marginBottom: 0 }}
              rules={
                isVideoShot
                  ? [{ required: true, message: "Please Select Date!" }]
                  : []
              }
            >
              <DatePicker disabled={!isVideoShot} placeholder="Select Date" />
              {/* <span style={{ color: "red" , fontSize:"20px" ,marginRight:"5px" ,marginBottom:"20px"}}>*</span> */}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      {isVideoShot && (
        <Form.Item name="Model Ready" label={<Text strong>Model Ready</Text>}>
          <Row align="middle" gutter={16}>
            {/* Model Ready Radio Group */}
            <Col>
              <Radio.Group onChange={handleModelReadyChange}>
                <Radio.Button value="yes">Yes</Radio.Button>
                <Radio.Button value="no">No</Radio.Button>
              </Radio.Group>
            </Col>

            {/* DatePicker aligned to the right */}
            <Col>
              <Form.Item
                name="Model Created Date"
                style={{ marginBottom: 0 }}
                rules={
                  isModelReady
                    ? [{ required: true, message: "Please Select Date!" }]
                    : []
                }
              >
                {/* <span style={{ color: "red" , fontSize:"20px" ,marginRight:"5px" ,marginBottom:"20px"}}>*</span> */}

                <DatePicker
                  disabled={!isModelReady}
                  placeholder="Select Date"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      )}

      {isModelReady && (
        <Form.Item
          name="Profile Created"
          label={<Text strong>Profile Created</Text>}
        >
          <Row align="middle" gutter={16}>
            {/* Profile Created Radio Group */}
            <Col>
              <Radio.Group onChange={handleProfileCreatedChange}>
                <Radio.Button value="yes">Yes</Radio.Button>
                <Radio.Button value="no">No</Radio.Button>
              </Radio.Group>
            </Col>

            {/* DatePicker aligned to the right */}
            <Col>
              <Form.Item
                name="Profile Created On"
                style={{ marginBottom: 0 }}
                rules={
                  isProfileCreated
                    ? [{ required: true, message: "Please Select Date!" }]
                    : []
                }
              >
                {/* <span style={{ color: "red" , fontSize:"20px" ,marginRight:"5px" ,marginBottom:"20px"}}>*</span> */}

                <DatePicker
                  disabled={!isProfileCreated}
                  placeholder="Select Date"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      )}

      {isProfileCreated && (
        <Form.Item
          name="Profile Created By"
          label={<Text strong>Profile Created By</Text>}
          rules={[{ required: true, message: "Please select!" }]}
        >
          <Select placeholder="Profile Created By">
            {dropdownOptions.ProfileCreators.map((category, index) => (
              <Option key={`${index}`} value={category}>
                {capitalize(category)}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {/* <Form.Item
        name="Video Shooted"
        label="Video Shooted"
        rules={[{ required: true, message: "Please pick an item!" }]}
      >
        <Radio.Group>
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="Model Ready"
        label="Model Ready"
        rules={[{ required: true, message: "Please pick an item!" }]}
      >
        <Radio.Group>
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="Profile Created"
        label="Profile Created"
        rules={[{ required: true, message: "Please pick an item!" }]}
      >
        <Radio.Group onChange={handleProfileCreatedChange}>
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {isProfileCreated && (
        <>
          <Form.Item
            name="Profile Created On"
            label="Profile Created On"
            rules={[{ required: true, message: "Please pick a date!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="Profile Created By"
            label="Profile Created By"
            rules={[{ required: true, message: "Please select!" }]}
          >
            <Select placeholder="Profile Created By">
              {dropdownOptions.ProfileCreators.map((category, index) => (
                <Option key={`${index}`} value={category}>
                  {capitalize(category)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )} */}
    </div>
  );
};

export default PersonalDetails;