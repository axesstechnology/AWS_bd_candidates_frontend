import React, { useState, useEffect } from "react";
import { Form, InputNumber, DatePicker, Button, Radio, Row, Col, Typography } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import moment from "moment";
import { usePaymentContext } from "../../context/PaymentContext";

interface PaymentCalculationsProps {
  form: any;
  totalAmount: number;
  initialData?: any;
}
const PaymentCalculations: React.FC<PaymentCalculationsProps> = ({
  form,
  totalAmount,
  initialData,
}) => {
  const formInstance = Form.useFormInstance();
  const [offerReceived, setOfferReceived] = useState<
    "yes" | "no" | undefined
  >();
  const [offerSplitCount, setOfferSplitCount] = useState(2);
  const [noOfferSplitCount, setNoOfferSplitCount] = useState(2);
  // const [balanceAmontValue, setBalanceAmontValue] = useState(0);
  const {balanceAmontValue, setBalanceAmontValue } = usePaymentContext();


  const { Text } = Typography;

  const calculateTotalPaidAmount = () => {
    const initialAmount = form.getFieldValue("Initial Amount") || 0;
    const loanAmount =
      form.getFieldValue("Loan") === "yes"
        ? form.getFieldValue("Loan Sanction Amount") || 0
        : 0;
    const offerTimeAmount = form.getFieldValue("At Time of Offer") || 0;

    const paidSplitsAmount =
      offerReceived === "yes"
        ? (form.getFieldValue("pending paid in splits") || []).reduce(
            (sum: number, current: number) => sum + (current || 0),
            0
          )
        : 0;

    const additionalPayments =
      offerReceived === "no"
        ? (form.getFieldValue("payment_for_interview") || 0) +
          (form.getFieldValue("payment_for_documents") || 0) +
          (form.getFieldValue("payment_for_offer") || 0)
        : 0;

    return (
      initialAmount +
      loanAmount +
      offerTimeAmount +
      additionalPayments +
      paidSplitsAmount
    );
  };


  console.log('calculateTotalPaidAmount -',calculateTotalPaidAmount());
  

  const calculateBalanceAmount = () => {
    if (initialData?.balanceAmount !== undefined) {
      return initialData.balanceAmount;
    }
    const totalPaid = calculateTotalPaidAmount() || 0;
    console.log("totalAmount in calculate Balance Amount -",totalPaid);
    return Math.max(0, totalAmount - totalPaid) || 0;
  };

  const updateBalanceAmount = () => {
    if (initialData) {
      // In edit mode, use API data
      console.log(initialData, "initialData");
      form.setFieldsValue({ "Balance Amount": initialData?.balanceAmount });

      if (initialData.didOfferReceived) {
        // Set offer installments from API
        if (Array.isArray(initialData.offerInstallments)) {
          initialData.offerInstallments.forEach(
            (installment: any, index: number) => {
              form.setFieldsValue({
                [`Split ${index + 1}`]: installment.amount,
                [`offer_installment_${index + 1}`]: installment.amount,
              });
            }
          );
        }

        // Set paid installments from API
        const paidAmounts = new Array(offerSplitCount).fill(0);
        const paidDates = new Array(offerSplitCount).fill(null);

        if (Array.isArray(initialData.offerInstallmentsPaid)) {
          initialData.offerInstallmentsPaid.forEach((paid: any) => {
            const index = paid.splitNumber - 1;
            if (index >= 0 && index < offerSplitCount) {
              paidAmounts[index] = paid.amount;
              paidDates[index] = paid.date ? moment(paid.date) : null;

              form.setFieldsValue({
                [`pending_paid_${index + 1}`]: paid.amount,
              });
            }
          });
        }

        form.setFieldsValue({
          "pending paid in splits": paidAmounts,
          "pending payment dates": paidDates,
        });
      } else if (Array.isArray(initialData.processingFees)) {
        // Set processing fees from API
        initialData.processingFees.forEach((fee: any, index: number) => {
          form.setFieldsValue({
            [`processing_fee_${index + 1}`]: fee.amount,
          });
        });
      }
    } else {
      // In create mode, use calculation logic
      const balanceAmount = calculateBalanceAmount();
      form.setFieldsValue({ "Balance Amount": balanceAmount });
      console.log(balanceAmount, "balanceAmount");
      setBalanceAmontValue(balanceAmount);
      if (offerReceived === "yes") {
        const splitAmount = Math.floor(balanceAmount / offerSplitCount);
        const remainder = balanceAmount % offerSplitCount;

        [...Array(offerSplitCount)].forEach((_, index) => {
          const amount = index === 0 ? splitAmount + remainder : splitAmount;
          form.setFieldsValue({
            [`Split ${index + 1}`]: amount,
            [`offer_installment_${index + 1}`]: amount,
          });
        });

        const pendingPayments = [...Array(offerSplitCount)].map((_, index) =>
          index === 0 ? splitAmount + remainder : splitAmount
        );

        form.setFieldsValue({
          "pending payment in splits": pendingPayments,
        });

        if (!form.getFieldValue("pending paid in splits")) {
          form.setFieldsValue({
            "pending paid in splits": new Array(offerSplitCount).fill(0),
          });
        }
      }
    }
  };
  const handleOfferReceivedChange = (e: any) => {
    setOfferReceived(e.target.value);

    // Reset fields based on offer status
    if (e.target.value === "yes") {
      form.setFieldsValue({
        payment_for_interview: undefined,
        payment_for_documents: undefined,
        payment_for_offer: undefined,
      });
    } else {
      form.setFieldsValue({
        "pending payment in splits": undefined,
        "pending paid in splits": undefined,
      });
    }

    updateBalanceAmount();
  };

  useEffect(() => {
    if (initialData) {
      // Initialize from API data
      setOfferReceived(initialData?.didOfferReceived ? "yes" : "no");
      setOfferSplitCount(initialData?.offerInstallments?.length || 2);
      setNoOfferSplitCount(initialData?.processingFees?.length || 2);
    }
    updateBalanceAmount();
  }, [initialData, totalAmount]);
  const handlePendingPaidChange = (index: number, value: number) => {
    // Get current pending paid amounts
    const pendingPaid = [
      ...(form.getFieldValue("pending paid in splits") || []),
    ];
    pendingPaid[index] = value || 0;

    // Update pending paid amounts in form
    form.setFieldsValue({
      "pending paid in splits": pendingPaid,
      [`pending_paid_${index + 1}`]: value,
    });

    // Get the original split amount
    const splitAmount = form.getFieldValue(`Split ${index + 1}`) || 0;
    const remainingAmount = Math.max(0, splitAmount - (value || 0));

    // Update pending payments
    const pendingPayments = [
      ...(form.getFieldValue("pending payment in splits") || []),
    ];
    pendingPayments[index] = remainingAmount;

    form.setFieldsValue({
      [`offer_installment_${index + 1}`]: remainingAmount,
      "pending payment in splits": pendingPayments,
    });

    // Update balance amount after paid amount changes
    const newBalanceAmount = calculateBalanceAmount();
    form.setFieldsValue({ "Balance Amount": newBalanceAmount });
    console.log("Update balance amount ",newBalanceAmount);
    
  };

  const handleNoOfferPaymentChange = () => {
    const currentBalance = calculateBalanceAmount();

    // Update balance amount
    form.setFieldsValue({ "Balance Amount": currentBalance });

    // Only recalculate splits if there's a balance and splits are needed
    if (currentBalance > 0 && noOfferSplitCount > 0) {
      const splitAmount = Math.floor(currentBalance / noOfferSplitCount);
      const remainder = currentBalance % noOfferSplitCount;

      // Update each split amount
      [...Array(noOfferSplitCount)].forEach((_, index) => {
        const amount = index === 0 ? splitAmount + remainder : splitAmount;
        form.setFieldsValue({
          [`processing_fee_${index + 1}`]: amount,
        });
      });
    }
  };

  const handlePendingPaidDateChange = (index: number, date: any) => {
    const pendingDates = [
      ...(form.getFieldValue("pending payment dates") || []),
    ];
    pendingDates[index] = date ? date.format("YYYY-MM-DD") : null;
    form.setFieldsValue({
      "pending payment dates": pendingDates,
    });
  };

  const addNoOfferSplit = () => {
    setNoOfferSplitCount((prev) => prev + 1);
  };
  const addOfferSplit = () => {
    setOfferSplitCount((prev) => prev + 1);
  };

  useEffect(() => {
    updateBalanceAmount();
  }, [
    totalAmount,
    form.getFieldValue("Initial Amount"),
    form.getFieldValue("Loan Sanction Amount"),
    form.getFieldValue("At Time of Offer"),
    offerReceived,
    offerSplitCount,
    noOfferSplitCount,
  ]);

  useEffect(() => {
    const didOfferReceived = formInstance.getFieldValue("Did Offer Received");
    if (didOfferReceived) {
      setOfferReceived(didOfferReceived);
    }

    // Count existing splits and update state
    let maxOfferSplitIndex = 0;
    let maxProcessingFeeIndex = 0;

    // Find the highest index of offer installments
    for (let i = 1; i <= 10; i++) {
      // Assuming max 10 splits
      if (formInstance.getFieldValue(`offer_installment_${i}`) !== undefined) {
        maxOfferSplitIndex = i;
      }
      if (formInstance.getFieldValue(`processing_fee_${i}`) !== undefined) {
        maxProcessingFeeIndex = i;
      }
    }

    // Update split counts if we found existing splits
    if (maxOfferSplitIndex > 0) {
      setOfferSplitCount(maxOfferSplitIndex);
    }
    if (maxProcessingFeeIndex > 0) {
      setNoOfferSplitCount(maxProcessingFeeIndex);
    }
  }, [formInstance]);

  console.log(form.getFieldValue("Balance Amount"));
  
  return (
    <div className="space-y-4">
      {/* {offerReceived === "no" && ( */}
      {balanceAmontValue > 0 && (
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
    </div>
  );
};

export default PaymentCalculations;
