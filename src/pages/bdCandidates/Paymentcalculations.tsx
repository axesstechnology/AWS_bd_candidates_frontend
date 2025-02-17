import { Form, message } from "antd";
import { RadioChangeEvent } from "antd/lib";
import moment from "moment";
import { useEffect, useState } from "react";
import { usePaymentContext } from "../../context/PaymentContext";

// Define types for better type safety
interface AmountSplit {
  amount: number;
  date: Date | null;
}

interface UsePaymentCalculationsProps {
  form: any; // Replace with proper Form type from antd if available
  initialData?: any;
}

export const usePaymentCalculations = ({
  form,
  initialData,
}: UsePaymentCalculationsProps) => {
  const [initialAmountSplits, setInitialAmountSplits] = useState<AmountSplit[]>([{ amount: 0, date: new Date() }]);
  const [offerReceived, setOfferReceived] = useState<
    "yes" | "no" | undefined
  >();
  const [loan, setLoan] = useState<string>("no");
  const [noOfferSplitCount, setNoOfferSplitCount] = useState(2);
  const [offerSplitCount, setOfferSplitCount] = useState(2);
  const {balanceAmontValue, setBalanceAmontValue } = usePaymentContext();



  // Initialize the splits with initialData if available
  useEffect(() => {
    if (initialData?.initial_splits) {
      const mappedSplits = initialData.initial_splits.map((split: any) => ({
        amount: split.amount || 0,
        date: split.date ? new Date(split.date) : null,
      }));
      setInitialAmountSplits(mappedSplits);

      const totalInitialAmount = mappedSplits.reduce(
        (sum: number, split: AmountSplit) => sum + (split.amount || 0),
        0
      );
      form.setFieldsValue({ "Initial Amount": totalInitialAmount });
    }
  }, [initialData, form]);

  const calculateTotalPaidAmount = () => {
    // Calculate initial amount total
    const initialAmountTotal = initialAmountSplits.reduce(
      (sum, split) => sum + (split.amount || 0),
      0
    );
    
    // Calculate loan amount
    const loanAmount =
      form.getFieldValue("Loan") === "yes"
        ? form.getFieldValue("Loan Sanction Amount") || 0
        : 0;
        
    const offerTimeAmount = form.getFieldValue("At Time of Offer") || 0;
    
    // Calculate no offer payments

    const noOfferPayments =
    Number(form.getFieldValue("payment_for_interview") || 0) +
    Number(form.getFieldValue("payment_for_documents") || 0) +
    Number(form.getFieldValue("payment_for_offer") || 0);
  
    // Fix: Get all pending paid amounts by iterating through the form fields
    const pendingPaidAmounts = [];
    let index = 1;
    while (true) {
      const value = form.getFieldValue(`pending_paid_${index}`);
      if (value === undefined) break;
      pendingPaidAmounts.push(Number(value) || 0);
      index++;
    }
    
    // Calculate total pending paid
    const totalPendingPaid = pendingPaidAmounts.reduce(
      (sum, value) => sum + value,
      0
    );
  
    console.log(
      'Debug values:',
      {
        initialAmountTotal,
        loanAmount,
        offerTimeAmount,
        noOfferPayments,
        pendingPaidAmounts,
        totalPendingPaid
      }
    );
  
    return (
      initialAmountTotal +
      loanAmount +
      Number(offerTimeAmount) +
      noOfferPayments +
      totalPendingPaid
    );
  };

  console.log("calculateTotalPaidAmount () -" ,calculateTotalPaidAmount());
  

  const calculateBalanceAmount = () => {
    const totalAmount = parseFloat(form.getFieldValue("Total Amount")?.toString() || "0");
    const totalPaid = calculateTotalPaidAmount();
    form.setFieldsValue({ "Total Paid Amount": totalPaid });
    console.log(totalAmount,"totalAmount");
    console.log(totalPaid,"totalPaid");
    console.log("Math.max(0, totalAmount - totalPaid)",Math.max(0, totalAmount - totalPaid)); 
    return Math.max(0, totalAmount - totalPaid);
  };
  console.log("calculateBalanceAmount () -" ,calculateBalanceAmount());
  

  const updateBalanceAmount = () => {
    const totalAmount = parseFloat(form.getFieldValue("Total Amount")?.toString() || "0");

    console.log("updateBalanceAmount totalAmount",totalAmount);
  
    
    const offerReceived = form.getFieldValue("Offer Received") || "no";

    if (offerReceived === "no") {
      const balance = calculateBalanceAmount();
      form.setFieldsValue({ "Balance Amount": balance });
      return balance;
    }

    const pendingPaid = form.getFieldValue("pending paid in splits") || [];
    const pendingPayments: number[] = [];

    // Calculate remaining amounts for each split
    const offerSplitCount = form.getFieldValue("offerSplitCount") || 0;
    for (let index = 0; index < offerSplitCount; index++) {
      const originalSplitAmount = parseFloat(form.getFieldValue(`Split ${index + 1}`)?.toString() || "0");
      const paidAmount = parseFloat(pendingPaid[index]?.toString() || "0");
      const remainingAmount = Math.max(0, originalSplitAmount - paidAmount);
      pendingPayments.push(remainingAmount);

      form.setFieldsValue({
        [`offer_installment_${index + 1}`]: remainingAmount,
      });
    }

    form.setFieldsValue({ "pending payment in splits": pendingPayments });

    const totalBalance = pendingPayments.reduce(
      (sum, amount) => sum + amount,
      0
    );
    form.setFieldsValue({ "Balance Amount": totalBalance });

    console.log("balance amont in loan" ,totalBalance);
    

    return totalBalance;
  };


  console.log("updateBalanceAmount () -" , updateBalanceAmount());
  
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

  // Split management functions
  const updateSplitDate = (index: number, date: Date) => {
    const newSplits = [...initialAmountSplits];
    newSplits[index].date = date;
    setInitialAmountSplits(newSplits);
  };

  // const updateSplitAmount = (index: number, amount: number) => {
  //   const newSplits = [...initialAmountSplits];
  //   newSplits[index].amount = amount;
  //   setInitialAmountSplits(newSplits);
  //   updateInitialAmount(newSplits);
  // };

  const updateSplitAmount = (index: number, amount: number) => {
    const newSplits = [...initialAmountSplits];
    newSplits[index] = {
      ...newSplits[index],
      amount: parseFloat(amount?.toString() || "0")
    };
    setInitialAmountSplits(newSplits);
    
    // Calculate new total initial amount
    const totalInitialAmount = newSplits.reduce(
      (sum, split) => sum + (parseFloat(split.amount?.toString() || "0") || 0),
      0
    );
    
    // Update initial amount in form
    form.setFieldsValue({ "Initial Amount": totalInitialAmount });
    
    // Update balance amount
    const newBalance = calculateBalanceAmount();
    // console.log("newBalance",newBalance);
    form.setFieldsValue({ "Balance Amount": newBalance });
  };

  

  const removeInitialAmountSplit = (index: number) => {
    const newSplits = initialAmountSplits.filter((_, i) => i !== index);
    setInitialAmountSplits(newSplits);
    updateInitialAmount(newSplits);
  };

  const addInitialAmountSplit = () => {
    setInitialAmountSplits([...initialAmountSplits, { amount: 0, date: null }]);
  };

  const updateInitialAmount = (splits: AmountSplit[]) => {
    const total = splits.reduce((sum, split) => sum + (split.amount || 0), 0);
    form.setFieldsValue({ "Initial Amount": total });
    updateBalanceAmount();
  };

  const handleLoanChange = (e: RadioChangeEvent) => {
    setLoan(e.target.value);
    if (e.target.value === "no") {
      form.setFieldsValue({
        "Loan Sanction Amount": undefined,  
        "Did Offer Received": undefined,
      });
    }
    const balanceAmount = calculateBalanceAmount();
    console.log("balanceAmount",balanceAmount);
    form.setFieldsValue({ "Balance Amount": balanceAmount });
  };

  const handleLoanAmountChange = (value: number | null) => {
    const totalAmount = form.getFieldValue("Total Amount") || 0;
    const loanAmount = value || 0;

    if (loanAmount > totalAmount) {
      message.warning("Loan amount cannot exceed total amount");
      form.setFieldsValue({ "Loan Sanction Amount": totalAmount });
    }

    const balanceAmount = calculateBalanceAmount();
    console.log("balanceAmount",balanceAmount);
    setBalanceAmontValue(balanceAmount)
    form.setFieldsValue({ "Balance Amount": balanceAmount });
  };

  // console.log("handleLoanAmountChange ()" , handleLoanAmountChange);
  

  const handleNoOfferPaymentChange = () => {
    const currentBalance = calculateBalanceAmount();
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
  const addNoOfferSplit = () => {
    setNoOfferSplitCount((prev) => prev + 1);
  };
  const addOfferSplit = () => {
    setOfferSplitCount((prev) => prev + 1);
  };


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
    form.setFieldValue(`pending_paid_${index + 1}`, value);

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
    form.setFieldValue(`pending_paid_${index + 1}`, value);
    form.setFieldsValue({ "Balance Amount": newBalanceAmount });
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
  const updateOfferSplitAmounts = (pendingPaid: number[]) => {
    const splits = [...Array(offerSplitCount)].map((_, idx) => {
      // Get the original split value from the form field
      return form.getFieldValue(`offer_installment_${idx + 1}`) || 0;
    });

    // Calculate the updated splits by subtracting the paid amounts
    const updatedSplits = splits.map((splitValue: number, index: number) => {
      const paidAmount = pendingPaid[index] || 0;
      // Update the form field for each split
      const remainingSplit = Math.max(0, splitValue - paidAmount);
      form.setFieldsValue({ [`Split ${index + 1}`]: remainingSplit });
      return remainingSplit;
    });
  };
  const calculateSplits = (balanceAmount: any, splitCount: any) => {
    const amountPerSplit = Math.floor(balanceAmount / splitCount);
    const remainder = balanceAmount % splitCount;
    return Array(splitCount)
      .fill(amountPerSplit)
      .map((amt, idx) => (idx === 0 ? amt + remainder : amt));
  };



  return {
    // State
    initialAmountSplits,
    loan,

    // Calculations
    calculateBalanceAmount,
    calculateTotalPaidAmount,
    updateBalanceAmount,

    // Split management
    updateSplitDate,
    updateSplitAmount,
    removeInitialAmountSplit,
    addInitialAmountSplit,

    // Loan management
    handleLoanChange,
    handleLoanAmountChange,

    handleOfferReceivedChange,
    handleNoOfferPaymentChange,
    addOfferSplit,
    addNoOfferSplit,
    handlePendingPaidChange,
    handlePendingPaidDateChange,
    updateOfferSplitAmounts,
    calculateSplits
  };
};
