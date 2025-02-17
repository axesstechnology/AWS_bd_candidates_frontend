// PersonalDetails.tsx
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Radio,
  Switch,
  DatePicker,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import {
  InboxOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import { FormData } from "./types";
import { Option } from "antd/es/mentions";
import dropdownOptions from "../../assets/dropdownOptions.json";
import { useParams } from "react-router-dom";
import { Checkbox, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import PaymentCalculations from "./PaymentCalculation";
import { FaPlusCircle } from "react-icons/fa";
import { usePaymentCalculations } from "./Paymentcalculations";
import FormEditAgreement from "./FormEditAgreement";
import { usePaymentContext } from "../../context/PaymentContext";

const { Text } = Typography;

interface FormEditProps {
  form: FormInstance;
  mode: string;
  initialData?: any;
  formData?: any;
}
const FormEdit: React.FC<FormEditProps> = ({ form, initialData, formData }) => {
  const { id } = useParams();
  const [noOfferSplitCount, setNoOfferSplitCount] = useState(2);
  const [offerSplitCount, setOfferSplitCount] = useState(2);
  const [pendingPayments, setPendingPayments] = useState<number[]>([]);
  const {balanceAmontValue, setBalanceAmontValue } = usePaymentContext();
  const [isProfileCreated, setIsProfileCreated] = useState(
    initialData?.["Profile Created"] === "yes"
  );
  const [isVideoShot, setIsVideoShot] = useState(
    initialData?.["Video Shooted"] === "yes"
  );
  const [isModelReady, setIsModelReady] = useState(
    initialData?.["Model Ready"] === "yes"
  );
  // console.log("isProfileCreated in form edit" , isProfileCreated );
  const [isActive, setIsActive] = useState(true);
  const [isAgreementYes, setIsAgreementYes] = useState(
    initialData?.Agreement === "yes"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.["BD category"] || ""
  );
  const [isInitialAmount, setIsInitialAmount] = useState(false);

  const [isAcknowledgementYes, setIsAcknowledgementYes] = useState(false);
  const [checkedForms, setCheckedForms] = useState<string[]>([]);
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
      </Select>
    </Form.Item>
  );
  console.log("isAgreementYes", isAgreementYes);

  console.log("initialData in form Edit", initialData);
  console.log(initialData?.Agreement === "yes");

  const loan = form.getFieldValue("Loan");
  const offerReceived = form.getFieldValue("Did Offer Received");
  // const isAgreementYes = form.getFieldValue("Agreement");

  console.log("initial Data form edit", initialData);
  console.log("formData form edit", formData);

  const capitalize = (text: string) => {
    return text.replace(/\b\w/g, (char) => char?.toUpperCase());
  };

  const handleProfileCreatedChange = (e: any) => {
    setIsProfileCreated(e.target.value === "yes");
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

  const handleInitialAmount = (e: any) => {
    setIsInitialAmount(e.target.value === "yes");
  };

  const handleVideoShotChange = (e: any) => {
    const isYes = e.target.value === "yes";
    setIsVideoShot(isYes);

    // If Video Shot is set to "no", reset dependent fields
    if (!isYes) {
      setIsModelReady(false);
      setIsProfileCreated(false);

      // Clear form values for dependent fields
      form.setFieldsValue({
        "Model Ready": undefined,
        "Model Created Date": undefined,
        "Profile Created": undefined,
        "Profile Created On": undefined,
        "Profile Created By": undefined,
      });
    }
  };

  const handleModelChange = (e: any) => {
    const isYes = e.target.value === "yes";
    setIsModelReady(isYes);

    // If Model Ready is set to "no", reset profile created
    if (!isYes) {
      setIsProfileCreated(false);

      // Clear form values for profile created
      form.setFieldsValue({
        "Profile Created": undefined,
        "Profile Created On": undefined,
        "Profile Created By": undefined,
      });
    }
  };

  const {
    initialAmountSplits,
    updateBalanceAmount,
    handleLoanChange,
    handleLoanAmountChange,
    addInitialAmountSplit,
    updateSplitAmount,
    updateSplitDate,
    removeInitialAmountSplit,
    handleNoOfferPaymentChange,
    calculateBalanceAmount,
    addOfferSplit,
    addNoOfferSplit,
    handlePendingPaidChange,
    handleOfferReceivedChange,
    handlePendingPaidDateChange,
    updateOfferSplitAmounts,
    calculateSplits,
  } = usePaymentCalculations({ form, initialData });

  useEffect(() => {
    const balanceAmount = calculateBalanceAmount();
    form.setFieldsValue({ "Balance Amount": balanceAmount });

    if (offerReceived === "no" && noOfferSplitCount > 0) {
      const splitAmount = Math.floor(balanceAmount / noOfferSplitCount);
      const remainder = balanceAmount % noOfferSplitCount;

      [...Array(noOfferSplitCount)].forEach((_, index) => {
        const amount = index === 0 ? splitAmount + remainder : splitAmount;
        form.setFieldsValue({
          [`processing_fee_${index + 1}`]: amount,
        });
      });
    }
  }, [
    form.getFieldValue("Total Amount"),
    form.getFieldValue("Initial Amount"),
    form.getFieldValue("Loan Sanction Amount"),
    form.getFieldValue("At Time of Offer"),
    form.getFieldValue("payment_for_interview"),
    form.getFieldValue("payment_for_documents"),
    form.getFieldValue("payment_for_offer"),
    initialAmountSplits,
    noOfferSplitCount,
  ]);

  useEffect(() => {
    updateBalanceAmount();

    const balanceAmount = form.getFieldValue("Balance Amount") || 0;

    if (offerReceived === "yes" && offerSplitCount > 0) {
      const offerSplits = calculateSplits(balanceAmount, offerSplitCount);
      offerSplits.forEach((amount, index) => {
        form.setFieldsValue({ [`offer_installment_${index + 1}`]: amount });
      });
    } else if (offerReceived === "no" && noOfferSplitCount > 0) {
      const noOfferSplits = calculateSplits(balanceAmount, noOfferSplitCount);
      noOfferSplits.forEach((amount, index) => {
        form.setFieldsValue({ [`processing_fee_${index + 1}`]: amount });
      });
    }
  }, [
    form.getFieldValue("Total Amount"),
    form.getFieldValue("Loan Sanction Amount"),
    form.getFieldValue("At Time of Offer"),
    form.getFieldValue("payment_for_interview"),
    form.getFieldValue("payment_for_documents"),
    form.getFieldValue("payment_for_offer"),
    initialAmountSplits,
    loan,
    offerReceived,
    offerSplitCount,
    noOfferSplitCount,
  ]);

  useEffect(() => {
    if (offerReceived === "yes") {
      const initialPendingPayments = [...Array(offerSplitCount)].map(
        (_, index) => {
          return form.getFieldValue(`offer_installment_${index + 1}`) || 0;
        }
      );
      form.setFieldsValue({
        "pending payment in splits": initialPendingPayments,
      });
      setPendingPayments(initialPendingPayments);
    }
  }, [offerSplitCount]);

  useEffect(() => {
    if (offerReceived === "yes") {
      const pendingPaid = form.getFieldValue("pending paid in splits") || [];
      updateOfferSplitAmounts(pendingPaid);
      updateBalanceAmount();
    }
  }, [
    form.getFieldValue("pending paid in splits"),
    form.getFieldValue("pending payment in splits"),
  ]);

  useEffect(() => {
    if (initialData) {
      // If agreement is yes, ensure forms are properly set
      if (initialData.Agreement === "yes") {
        setIsAgreementYes(true);

        // Handle Agreement Date
        if (initialData["Agreement Date"]) {
          form.setFieldsValue({
            "Agreement Date": initialData["Agreement Date"],
          });
        }

        // Handle Forms
        if (initialData.Forms) {
          setCheckedForms(
            Array.isArray(initialData.Forms)
              ? initialData.Forms
              : [initialData.Forms]
          );
          form.setFieldsValue({
            Forms: Array.isArray(initialData.Forms)
              ? initialData.Forms
              : [initialData.Forms],
          });
        }
      }
    }

    if (initialData) {
      // Set initial values for Video Shot
      setIsVideoShot(initialData["Video Shooted"] === "yes");
      form.setFieldsValue({
        "Video Shooted": initialData["Video Shooted"],
        "Video shot Date": initialData["Video shot Date"],
      });

      // If Video Shot is yes, set Model Ready values
      if (initialData["Video Shooted"] === "yes") {
        setIsModelReady(initialData["Model Ready"] === "yes");
        form.setFieldsValue({
          "Model Ready": initialData["Model Ready"],
          "Model Created Date": initialData["Model Created Date"],
        });

        // If Model Ready is yes, set Profile Created values
        if (initialData["Model Ready"] === "yes") {
          setIsProfileCreated(initialData["Profile Created"] === "yes");
          form.setFieldsValue({
            "Profile Created": initialData["Profile Created"],
            "Profile Created On": initialData["Profile Created On"],
            "Profile Created By": initialData["Profile Created By"],
          });
        }
      }
    }
  }, [initialData, form]);

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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <div className="space-y-6">
      {/* <FormEditAgreement 
  form={form}
  initialData={initialData}
/> */}

      {/* student id */}
      <Form.Item
        label={<Text strong>Student ID</Text>}
        name="Back Door ID"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Input />
      </Form.Item>
      {/* BD category */}
      <Form.Item
        name="BD category"
        label={<Text strong>Category</Text>}
        rules={[{ required: true, message: "Please select an option!" }]}
      >
        <Select
          placeholder="Select BD category"
          onChange={handleCategoryChange}
          defaultValue={initialData?.["BD category"]}
        >
          {dropdownOptions.BDcategory.map((category, index) => (
            <Option key={`${index}`} value={category}>
              {capitalize(category)}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* candidate name */}
      <Form.Item
        label={<Text strong>Candidate Full Name</Text>}
        name="Candidate Full Name"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Input />
      </Form.Item>
      {/* select domain */}
      <Form.Item
        name="radio-button"
        label={<Text strong>Domain</Text>}
        rules={[{ required: true, message: "Please pick an item!" }]}
      >
        <Radio.Group>
          <Radio.Button value="software_engineering">
            Software Developement
          </Radio.Button>
          <Radio.Button value="software_testing">Software Testing</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* Inactive/Active */}

      <Form.Item
        name="switch"
        label={<Text strong>Inactive/Active</Text>}
        valuePropName="checked"
        initialValue={initialData?.switch}
        rules={[{ required: true }]}
      >
        <Switch onChange={handleActiveChange} />
      </Form.Item>

      {!isActive && (
        <Form.Item
          name="In Active Reason"
          label="Inactive Reason"
          rules={[{ required: true, message: "Please select an option!" }]}
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

      {/* Agreement */}
      <Form.Item name="Agreement" label={<Text strong>Agreement</Text>}>
        <Row align="middle" gutter={16}>
          <Col>
            <Radio.Group
              onChange={handleAgreementChange}
              defaultValue={initialData?.Agreement}
            >
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>

          <Col>
            <Form.Item
              name="Agreement Date"
              style={{ marginBottom: 0 }}
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
              { required: true, message: "Please select at least one form" },
            ]}
          >
            <Checkbox.Group
              onChange={handleCheckboxChange}
              defaultValue={initialData?.Forms}
            >
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
                customRequest={({ file, onSuccess, onError }) => {
                  handleFileUpload({ file })
                    .then((cleanFile) => {
                      if (cleanFile) {
                        onSuccess?.(cleanFile);
                      } else {
                        onError?.(new Error("File upload failed"));
                      }
                    })
                    .catch((error) => onError?.(error));
                }}
              >
                <div>
                  <UploadOutlined /> Click to Upload
                </div>
              </Upload>
            </Form.Item>
          ))}
        </>
      )}

      {/* Acknowledgement Section */}
      <Form.Item
        name="Acknowledgement"
        label={<Text strong>Acknowledgement</Text>}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <Radio.Group onChange={handleAcknowledgementChange}>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>

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
      )}

      {/* job type */}
      {selectedCategory === "Backdoor" && (
        <Form.Item
          name="Need Job Type"
          label={<Text strong>Need Job Type</Text>}
          rules={[{ message: "Please pick an item!" }]}
        >
          <Radio.Group>
            <Radio.Button value="Hybrid">Hybrid</Radio.Button>
            <Radio.Button value="Remote">Remote</Radio.Button>
            <Radio.Button value="Office">Office</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}
      {/* phone number */}
      <Form.Item
        name="phone"
        label={<Text strong>Phone Number</Text>}
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
        ]}
      >
        <Input addonBefore="+91" style={{ width: "100%" }} />
      </Form.Item>

      {/* mail id */}
      <Form.Item
        label={<Text strong>Candidate Mail ID</Text>}
        name="Candidate Mail ID"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="Video Shooted" label={<Text strong>Video Shot</Text>}>
        <Row align="middle" gutter={16}>
          {/* Video Shooted Radio Group */}
          <Col>
            <Radio.Group
              onChange={handleVideoShotChange}
              defaultValue={initialData?.["Video Shooted"]}
            >
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
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      {isVideoShot && (
        <Form.Item name="Model Ready" label={<Text strong>Model Ready</Text>}>
          <Row align="middle" gutter={16}>
            {/* Model Ready Radio Group */}
            <Col>
              <Radio.Group
                onChange={handleModelChange}
                defaultValue={initialData?.["Model Ready"]}
              >
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
              <Radio.Group
                onChange={handleProfileCreatedChange}
                defaultValue={initialData?.["Profile Created"]}
              >
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

      <Form.Item
        label={<Text strong>Total Amount</Text>}
        name="Total Amount"
        // rules={[{ message: "Please input!" }]}
      >
        <InputNumber addonAfter="₹" defaultValue={0} />
      </Form.Item>

      <Form.Item
        label={<Text strong>Initial Amount</Text>}
        // name="Total Amount"
        // rules={[{ required: true, message: "Please input!" }]}
      >
        <Radio.Group onChange={handleInitialAmount}>
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {isInitialAmount && (
        <>
          <Form.Item
            label={<Text strong>Initial Amount</Text>}
            name="Initial Amount"
            // rules={[{ required: true, message: "Please input!" }]}
          >
            <InputNumber
              onChange={updateBalanceAmount}
              disabled
              addonAfter="₹"
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Initial Amount Received by Split Up </Text>}
          >
            {initialAmountSplits.map((split, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Form.Item
                  name={["initial_splits", index, "amount"]}
                  rules={[]}
                  className="mb-0"
                >
                  <InputNumber
                    addonAfter="₹"
                    style={{ width: "200px" }}
                    onChange={(value: any) =>
                      updateSplitAmount(index, value || 0)
                    }
                    placeholder="Enter Initial Amount"
                  />
                </Form.Item>

                <Form.Item
                  name={["initial_splits", index, "date"]}
                  // rules={[{ required: true, message: "Please select date!" }]}
                  className="mb-0"
                >
                  <DatePicker
                    disabled={split.amount === 0}
                    onChange={(date) => {
                      if (date) {
                        updateSplitDate(index, date.toDate());
                      }
                    }}
                  />
                </Form.Item>
                {index > 0 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeInitialAmountSplit(index)}
                  />
                )}
              </div>
            ))}
            <Button
              type="dashed"
              onClick={addInitialAmountSplit}
              icon={<PlusCircleOutlined />}
              className="mt-2"
            >
              Add Split
            </Button>
          </Form.Item>
        </>
      )}

      <Form.Item
        name="Loan"
        label={<Text strong>Loan</Text>}
        // rules={[{ required: true, message: "Please select!" }]}
      >
        <Radio.Group onChange={handleLoanChange}>
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {loan === "yes" && (
        <>
          <Form.Item
            label={<Text strong>Loan Disbursed Amount</Text>}
            name="Loan Sanction Amount"
            rules={[
              {
                required: true,
                message: "Please Input Loan Disbursed Amount!",
              },
            ]}
          >
            <InputNumber
              addonAfter="₹"
              style={{ width: "100%" }}
              onChange={handleLoanAmountChange}
              min={0}
              max={form.getFieldValue("Total Amount")}
              placeholder="Enter Loan Disbursed Amount"
            />
          </Form.Item>
        </>
      )}

      <Form.Item
         label={<Text strong>Balance Amount</Text>}
        name="Balance Amount"
        initialValue={form.getFieldValue("Balance Amount") || 0}
        // rules={[{ required: true, message: "Please input!" }]}
      >
        <InputNumber addonAfter="₹" defaultValue={0} disabled />
      </Form.Item>

      {balanceAmontValue > 0 && (
      // {form.getFieldValue("Balance Amount")  > 0 && (
        <>
          <Form.Item label={<Text strong>Payment for Interview</Text>}>
            <Row align="middle" gutter={16}>
              {/* Payment Input */}
              <Col>
                <Form.Item
                  name="payment_for_interview"
                  style={{ marginBottom: 0 }}
                  // rules={[
                  //   { required: true, message: "Please input interview payment!" },
                  // ]}
                >
                  <InputNumber
                    addonAfter="₹"
                    style={{ width: "100%" }}
                    onChange={handleNoOfferPaymentChange}
                  />
                </Form.Item>
              </Col>

              {/* Date Picker */}
              <Col>
                <Form.Item
                  name="Payment_for_Interview_Date"
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true, message: "Please Select Date!" }]}
                >
                  <DatePicker placeholder="Select Date" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label={<Text strong>Payment for Documents</Text>}>
            <Row align="middle" gutter={16}>
              {/* Payment Input */}
              <Col>
                <Form.Item
                  name="payment_for_documents"
                  style={{ marginBottom: 0 }}
                  // rules={[
                  //   { required: true, message: "Please input document payment!" },
                  // ]}
                >
                  <InputNumber
                    addonAfter="₹"
                    style={{ width: "100%" }}
                    onChange={handleNoOfferPaymentChange}
                  />
                </Form.Item>
              </Col>

              {/* Date Picker */}
              <Col>
                <Form.Item
                  name="Payment_for_Documents_Date"
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true, message: "Please Select Date!" }]}
                >
                  <DatePicker placeholder="Select Date" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label={<Text strong>Payment for Offer</Text>}>
            <Row align="middle" gutter={16}>
              {/* Payment Input */}
              <Col>
                <Form.Item
                  name="payment_for_offer"
                  style={{ marginBottom: 0 }}
                  // rules={[{ required: true, message: "Please input offer payment!" }]}
                >
                  <InputNumber
                    addonAfter="₹"
                    style={{ width: "100%" }}
                    onChange={handleNoOfferPaymentChange}
                  />
                </Form.Item>
              </Col>

              {/* Date Picker */}
              <Col>
                <Form.Item
                  name="payment_for_offer_date"
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true, message: "Please Select Date!" }]}
                >
                  <DatePicker placeholder="Select Date" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </>
      )}

<Form.Item
        name="Did Offer Received"
        label={<Text strong>Offer Received</Text>}
        rules={
          [
            // { required: true, message: "Please select if offer was received!" },
          ]
        }
      >
        <Row align="middle" gutter={16}>
          <Col>
            <Radio.Group onChange={handleOfferReceivedChange}>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Col>

          <Col>
            <Form.Item
              // label="Date of Offer"
              name="Date of Offer"
              style={{ marginBottom: 0 }}
              rules={offerReceived === "yes" ?[{ required: true, message: "Please Select Date!" }] :[]}
            >
              <DatePicker disabled={offerReceived !== "yes"} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      {/* {offerReceived === "no" && (
        <>
          <Form.Item label="Payment for Interview" name="payment_for_interview">
            <InputNumber
              addonAfter="₹"
              style={{ width: "100%" }}
              onChange={handleNoOfferPaymentChange}
            />
          </Form.Item>

          <Form.Item label="Payment for Documents" name="payment_for_documents">
            <InputNumber
              addonAfter="₹"
              style={{ width: "100%" }}
              onChange={handleNoOfferPaymentChange}
            />
          </Form.Item>

          <Form.Item label="Payment for offer" name="payment_for_offer">
            <InputNumber
              addonAfter="₹"
              style={{ width: "100%" }}
              onChange={handleNoOfferPaymentChange}
            />
          </Form.Item> */}

          {/* {[...Array(noOfferSplitCount)].map((_, index) => (
            <Form.Item
              key={index}
              label={`Split ${index + 1}`}
              name={`processing_fee_${index + 1}`}
              // rules={[
              //   {
              //     required: true,
              //     message: `Please input split ${index + 1} amount!`,
              //   },
              // ]}
            >
              <InputNumber addonAfter="₹" style={{ width: "100%" }} disabled />
            </Form.Item>
          ))}

          <Form.Item>
            <Button
              type="dashed"
              onClick={addNoOfferSplit}
              icon={<FaPlusCircle />}
            >
              Add Split
            </Button>
          </Form.Item> */}
        {/* </>
      )} */}
         {balanceAmontValue > 0 && offerReceived === "yes" && (
        <>
          <Form.Item
            label="pending payment in splits"
            name="pending payment in splits"
            hidden
          />
          {[...Array(offerSplitCount)].map((_, index) => (
            <Form.Item
              key={index}
              label={`Split ${index + 1}`}
              name={`offer_installment_${index + 1}`}
              // rules={[
              //   {
              //     // required: true,
              //     message: `Please input installment ${index + 1} amount!`,
              //   },
              // ]}
            >
              <InputNumber addonAfter="₹" style={{ width: "100%" }} disabled />
            </Form.Item>
          ))}
          <div className="flex justify-end">
            <Form.Item>
              <Button
                type="dashed"
                onClick={addOfferSplit}
                icon={<FaPlusCircle />}
              >
                Add Split
              </Button>
            </Form.Item>
          </div>

          <Form.Item
            label="pending paid in splits"
            name="pending paid in splits"
            hidden
          />

          {[...Array(offerSplitCount)].map((_, index) => (
            <div key={index}>
              <Form.Item
                label={`Paid Split ${index + 1}`}
                name={`pending_paid_${index + 1}`}
              >
                <Row gutter={8}>
                  <Col span={16}>
                    <InputNumber
                      addonAfter="₹"
                      style={{ width: "100%" }}
                      onChange={(value: any) =>
                        handlePendingPaidChange(index, value)
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={(date) =>
                        handlePendingPaidDateChange(index, date)
                      }
                    />
                  </Col>
                </Row>
              </Form.Item>
            </div>
          ))}
        </>
      )}

{offerReceived === "yes" && (
        <>
          <Form.Item
            name="OnBoarded"
            label={<Text strong>Onboarded</Text>}
            rules={[{ required: true, message: "Please Select Yes or No!" }]}
          >
            <Radio.Group>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* {[...Array(noOfferSplitCount)].map((_, index) => (
            <Form.Item
              key={index}
              label={`Split ${index + 1}`}
              name={`processing_fee_${index + 1}`}
              // rules={[
              //   {
              //     required: true,
              //     message: `Please input split ${index + 1} amount!`,
              //   },
              // ]}
            >
              <InputNumber addonAfter="₹" style={{ width: "100%" }} disabled />
            </Form.Item>
          ))}

          <div className=" flex justify-end">
            <Form.Item>
              <Button
                type="dashed"
                onClick={addNoOfferSplit}
                icon={<FaPlusCircle />}
              >
                Add Split
              </Button>
            </Form.Item>
          </div> */}
        </>
      )}


      <div style={{ margin: "24px 0" }} />
      <Form.Item
        label={<Text strong>Comments</Text>}
        name="Comments"
        rules={[{ message: "Please input!" }]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* <Form.Item
        label="Date of Offer"
        name="Date of Offer"
        // rules={[{ required: true, message: "Please input!" }]}
      >
        <DatePicker />
      </Form.Item> */}
      <Form.Item
        name="Referred By"
        label={<Text strong>Referred By</Text>}
        rules={[{ message: "Please select an option!" }]}
      >
        <Select placeholder="Select referrer">
          {dropdownOptions.referredBy.map((referrer, index) => (
            <Option key={`${index}`} value={referrer}>
              {capitalize(referrer)}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="Documents Submitted"
        label={<Text strong>Documents Submitted</Text>}
        rules={[{ required: true, message: "Please pick an item!" }]}
      >
        <Radio.Group
        // onChange={handleDocumentChange}
        >
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </div>
  );
};

export default FormEdit;
