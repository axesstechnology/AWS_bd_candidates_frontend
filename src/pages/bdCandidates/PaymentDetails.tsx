import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Radio,
  DatePicker,
  Button,
  Select,
  Checkbox,
  Typography,
} from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import PaymentCalculations from "./PaymentCalculation";
import dropdownOptions from "../../assets/dropdownOptions.json";
import { Option } from "antd/es/mentions";
import { usePaymentCalculations } from "./Paymentcalculations";

interface PaymentDetailsProps {
  form: FormInstance;
  mode: string;
  normFile: (e: any) => any;
  initialData?: any;
}
const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  form,
  mode,
  normFile,
  initialData,
}) => {
  // const [offerSplitCount, setOfferSplitCount] = useState(2);
  // const [pendingPayments, setPendingPayments] = useState<number[]>([]);
  // const [showCheckboxes, setShowCheckboxes] = useState(false);
  // const offerReceived = form.getFieldValue("Offer Received") || "no";
  const [documentsSubmitted, setDocumentsSubmitted] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isInitialAmount, setIsInitialAmount] = useState(false);

  console.log(documentsSubmitted);
  

  const {
    initialAmountSplits,
    updateBalanceAmount,
    handleLoanChange,
    handleLoanAmountChange,
    addInitialAmountSplit,
    updateSplitAmount,
    updateSplitDate,
    removeInitialAmountSplit,
  } = usePaymentCalculations({ form, initialData });
  const loan = form.getFieldValue("Loan");

  const { Text } = Typography;

  const handleInitialAmount = (e: any) => {
    setIsInitialAmount(e.target.value === "yes");
  };


  const handleDocumentsSubmittedChange = (e: any) => {
    const value = e.target.value;

    console.log("value",value);
    
    setDocumentsSubmitted(value);

    // Reset related fields when changing
    form.setFieldsValue({
      requiredDocuments: undefined,
      nonSubmissionReason: undefined,
    });

    // Clear selected documents if switching to "no"
    if (value === "no") {
      setSelectedDocuments([]);
    }
  };

  const handleDocumentChange = (checkedValues: string[]) => {
    // Update the state with only selected documents
    setSelectedDocuments(checkedValues);

    // Set the form field value to only the selected documents
    form.setFieldsValue({
      requiredDocuments: checkedValues,
    });
  };


  console.log( "bala",form.getFieldValue("Balance Amount"));
  
  return (
    <div className="space-y-6">
      <Form.Item
        label={<Text strong>Total Amount</Text>}
        name="Total Amount"
        // rules={[{ required: true, message: "Please input!" }]}
      >
        <InputNumber addonAfter="₹" defaultValue={0} />
      </Form.Item>

      <Form.Item
        label={<Text strong>Initial Amount</Text>}
        name="Initial Amount Received"
        // rules={[{ required: true, message: "Please input!" }]}
      >
              <Radio.Group onChange={handleInitialAmount}>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
      </Form.Item>

     {
      isInitialAmount && (
        <>  
              <Form.Item
        label={<Text strong>Initial Amount</Text>}
        name="Initial Amount"
        // rules={[{ required: true, message: "Please input!" }]}
      >
        <InputNumber onChange={updateBalanceAmount} disabled addonAfter="₹" />
      </Form.Item>

      <Form.Item label={<Text strong>Initial Amount Received by Split Up </Text>} >
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
                onChange={(value: any) => updateSplitAmount(index, value || 0)}
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
      )
     }


      {/* <Form.Item
        name="Mode of Payment"
        label="Mode of Payment"
        // rules={[{ required: true, message: "Please pick an item!" }]}
      >
        <Radio.Group>
          <Radio.Button value="cash">Cash</Radio.Button>
          <Radio.Button value="online">
            Online - Credit, Debit Card, QR Code, UPI ID
          </Radio.Button>
          <Radio.Button value="loan">Loan</Radio.Button>
          <Radio.Button value="Not Applicable">Not Applicable</Radio.Button>
        </Radio.Group>
      </Form.Item> */}

      {/* <Form.Item
        label="At Time of Offer Payment Paid Date"
        name="At Time of Offer Payment Paid Date"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <DatePicker />
      </Form.Item> */}

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
        // rules={[{ required: true, message: "Please input!" }]}
      >
        <InputNumber addonAfter="₹" defaultValue={0} disabled />
      </Form.Item>

      <PaymentCalculations
        form={form}
        totalAmount={form.getFieldValue("Total Amount")}
        initialData={initialData}
      />
      <div style={{ margin: "24px 0" }} />
      <Form.Item
        label={<Text strong>Comments</Text>}
        name="Comments"
        rules={[
          // { required: true, message: "Please input!" },
          // {
          //   pattern: /^[a-zA-Z0-9\s]+$/,
          //   message: "Comments can only contain letters, numbers!",
          // },
        ]}
      >
        <Input.TextArea  placeholder="Enter Comments"/>
      </Form.Item>

      {/* <Form.Item
        label="Referred By"
        name="Referred By"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Input />
      </Form.Item> */}
      <Form.Item
        name="Referred By"
        // label="Referred By"
        label={<Text strong>Referred By</Text>}
        // rules={[{ required: true, message: "Please select an option!" }]}
      >
        <Select placeholder="Select Referrer">
          {dropdownOptions.referredBy.map((referrer, index) => (
            <Option key={`${index}`} value={referrer}>
              {/* {capitalize(referrer)} */}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="Documents Submitted"
        label={<Text strong>Documents Submitted</Text>}
        // rules={[{ required: true, message: "Please select an option!" }]}
      >
        <Radio.Group onChange={handleDocumentsSubmittedChange}>
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>  
        </Radio.Group>
      </Form.Item>

      {documentsSubmitted === "yes" && (
        <Form.Item
          name="requiredDocuments"
          label={<Text strong>Received Documents</Text>}
          rules={[
            { required: true, message: "Please select at least one document!" },
          ]}
        >
          <Checkbox.Group
            style={{ display: "flex", flexDirection: "column" }}
            onChange={handleDocumentChange}
            value={selectedDocuments}
          >
            {dropdownOptions.documentOptions?.map((doc) => (
              <Checkbox
                key={doc.value}
                value={doc.value}
                style={{ marginBottom: "8px" }}
              >
                {doc.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      )}

      {documentsSubmitted === "no" && (
        <Form.Item
          name="nonSubmissionReason"
          label={<Text strong>Reason for Not Submitting Documents</Text>}
          rules={[{ required: true, message: "Please Select a Reason!" }]}
        >
          <Select placeholder="Select reason for not submitting documents">
            {dropdownOptions.nonSubmissionReasons?.map((reason) => (
              <Option key={reason.value} value={reason.value}>
                {reason.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </div>
  );
};

export default PaymentDetails;
