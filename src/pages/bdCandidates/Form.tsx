// Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Button, Form, message, FormInstance } from "antd";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import PersonalDetails from "./PersonalDetails";
import PaymentDetails from "./PaymentDetails";
import MetaData from "../../utils/MetaData";
import CommonModal from "../../components/header/CommonModal";
import { FormData } from "./types";
import moment from "moment";
import FormEdit from "./FormEdit";
import { FaChevronLeft } from "react-icons/fa";
import Loader from "../../utils/Loader";
import { Link } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

interface DashboardProps {
  mode?: "create" | "edit";
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const Dashboard: React.FC<DashboardProps> = ({ mode = "create" }) => {
  const { id } = useParams();
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "warning">(
    "success"
  );
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (mode === "edit" && id) {
        try {
          setLoading(true);
          const response = await axios.get(
            `${API_BASE_URL}/api/v1/candidates/${id}`
          );
          const apiData = response?.data?.data;
          console.log('editing data',apiData);

          console.log("apiData?.videoShooted" ,apiData?.videoshooted);
          
          const formattedData = {
            "Back Door ID": apiData.backDoorId,
            "BD category": apiData.BDcategory,
            "Candidate Full Name": apiData.fullName,
            "radio-button": apiData.class,
            switch: apiData.isActive,
            "Need Job Type": apiData.jobType,
            phone: apiData.phoneNumber,
            "Candidate Mail ID": apiData.email,
            "Amount Received": apiData.amountReceived
              ? moment(apiData.amountReceived)
              : null,
            "Total Amount": apiData.totalAmount,
            "Initial Amount": apiData.InitialAmount,
            "Mode of Payment": apiData.modeOfPayment,
            "At Time of Offer Payment Paid Date": apiData.offerPaymentDate
              ? moment(apiData.offerPaymentDate)
              : null,
            Loan: apiData.loan ? "yes" : "no",
            "Balance Amount": apiData.balanceAmount,
            "Did Offer Received": apiData.didOfferReceived ? "yes" : "no",
            "Loan Sanction Amount": apiData?.loanSanctionAmount,
            "Date of Offer": apiData.dateOfOffer
              ? moment(apiData.dateOfOffer)
              : null,
            "Referred By": apiData.referredBy,
            "Documents Submitted": apiData.documentsSubmitted ? "yes" : "no",
            Comments: apiData.comments,
            OnBoarded: apiData.onboarded ? "yes" : "no",
            BDcategory: apiData.BDcategory,
            Agreement: apiData.agreement ? "yes" : "no",
            Acknowledgement: apiData.acknowledgement ? "yes" : "no",
            "Agreement Date": apiData.agreementDate
              ? moment(apiData.agreementDate)
              : null,
            Forms: apiData.forms,
            "Acknowledgement Date": apiData.acknowledgementDate
              ? moment(apiData.acknowledgementDate)
              : null,
            "Profile Created": apiData?.profilecreated? "yes" : "no",
            // "Profile Created": apiData?.profileCreated,
            "Profile Created On": apiData.profileCreatedOn
              ? moment(apiData.profileCreatedOn)
              : null,
            "Profile Created By": apiData.profilecreatedBy,
            "Video Shooted": apiData?.videoshooted ? "yes" : "no",
            "Video shot Date": apiData.videoShootedDate
            ? moment(apiData.videoShootedDate)
            : null,
            "Model Ready": apiData.modelready ? "yes" : "no",
            "Model Created Date": apiData.modelCreatedDate
            ? moment(apiData.modelCreatedDate)
            : null,
            requiredDocuments: apiData.requiredDocuments,
            initial_splits:
              apiData.initial_splits?.map((split: any) => ({
                amount: split.amount,
                date: split.date ? moment(split.date) : null,
                _id: split._id,
              })) || [],

            payment_for_interview: apiData.paymentForInterview,
            payment_for_documents: apiData.paymentForDocuments,
            payment_for_offer: apiData.paymentForOffer,
            emiDetails:
              apiData.emiDetails?.map((emi: any) => ({
                amount: emi.amount,
                date: emi.date ? moment(emi.date) : null,
              })) || [],
          } as FormData;

          // Add dynamic fields
          if (apiData.offerInstallments?.length > 0) {
            apiData.offerInstallments.forEach(
              (installment: any, index: number) => {
                formattedData[`offer_installment_${index + 1}`] =
                  installment.amount;
              }
            );
          }

          if (apiData.formUploads?.length > 0) {
            const fileFields = {};
            apiData.formUploads.forEach((upload: any) => {
              const decodedFile = new File(
                [Uint8Array.from(atob(upload.base64), (c) => c.charCodeAt(0))],
                upload.originalName,
                { type: "application/octet-stream" } // Adjust MIME type as needed
              );
              const fileFields: { [key: string]: any } = {};
              fileFields[`File Upload ${upload.form}`] = [
                {
                  uid: upload._id,
                  name: upload.originalName,
                  status: "done",
                  url: "", // Optional, if there's a preview URL
                  originFileObj: decodedFile,
                },
              ];
            });

            Object.assign(formattedData, fileFields);
          } 

          if (apiData.offerInstallmentsPaid?.length > 0) {
            apiData.offerInstallmentsPaid.forEach(
              (paid: any, index: number) => {
                formattedData[`pending_paid_${index + 1}`] = paid.amount;
                formattedData[`pending_paid_date_${index + 1}`] = moment(
                  paid.date
                );
              }
            );
          }

          if (apiData.processingFees?.length > 0) {
            apiData.processingFees.forEach((fee: any, index: number) => {
              formattedData[`processing_fee_${index + 1}`] = fee.amount;
            });
          }
          console.log("Profile Created:", formattedData?.["Profile Created"]);
          console.log("Profile Created:", apiData?.profileCreated);
          console.log("formattedData:", formattedData);
          setFormData(formattedData);
          form.setFieldsValue(formattedData);
        } catch (error) {
          message.error("Failed to fetch candidate data");
          console.error("Fetch Error:", error);
        } finally {
          setLoading(false);
          setIsDataLoaded(true);
        }
      } else {
        setIsDataLoaded(true);
      }
    };

    
    fetchCandidateData();

    
  }, [id, mode, form]);



  

  const transformFormData = (values: FormData) => {
    console.log(values["Total Amount"], "datraq");
    return {
      backDoorId: values["Back Door ID"],
      fullName: values["Candidate Full Name"],
      class: values["radio-button"],
      isActive: values["switch"],
      jobType: values["Need Job Type"],
      phoneNumber: values["phone"],
      email: values["Candidate Mail ID"],
      amountReceived: values["Amount Received"]?.toISOString(),
      totalAmount:
        values["Total Amount"] == undefined ? 0 : values["Total Amount"],
      InitialAmount: values["Initial Amount"],
      modeOfPayment: values["Mode of Payment"],
      profilecreated: values["Profile Created"] === 'yes',
      profileCreatedOn: values["Profile Created"] === 'yes'?values["Profile Created On"]?.toISOString() : null,
      profilecreatedBy: values["Profile Created"] === 'yes'?values["Profile Created By"] : null,
      videoshooted: values["Video Shooted"] === 'yes',
      videoShootedDate: values["Video Shooted"] === 'yes'?values["Video shot Date"]?.toISOString() : null,
      modelready: values["Model Ready"] === 'yes',
      modelCreatedDate: values["Model Ready"] === 'yes'?values["Model Created Date"]?.toISOString() : null,
      offerPaymentDate: values["At Time of Offer Payment Paid Date"]?.toISOString(),
      loan: values["Loan"] === "yes",
      loanSanctionAmount: values["Loan Sanction Amount"],
      balanceAmount: values["Balance Amount"],
      didOfferReceived: values["Did Offer Received"] === "yes",
      dateOfOffer: values["Date of Offer"]?.toISOString(),
      referredBy: values["Referred By"],
      documentsSubmitted: values["Documents Submitted"] === "yes",
      comments: values["Comments"],
      onBoarded: values["OnBoarded"] === "yes",
      BDcategory: values["BD category"],
      requiredDocuments: values["requiredDocuments"],
      agreement: values["Agreement"],
      agreementDate: values["Agreement"] === "yes" ? values["Agreement Date"]?.toISOString() : null,
      forms: values["Agreement"] === "yes" ? values["Forms"] : [],
      //  formUploads :  values["formUploads"] , 
      initial_splits: values["initial_splits"]?.map((split: any) => ({
        amount: split.amount,
        date: split.date?.toISOString(),
        _id: split._id,
      })),

      processingFeeSplits: Object.keys(values)
        .filter((key) => key.startsWith("processing_fee_"))
        .map((key) => ({
          amount: values[key],
          splitNumber: parseInt(key.replace("processing_fee_", "")),
        })),

      offerInstallments: Object.keys(values)
        .filter((key) => key.startsWith("offer_installment_"))
        .map((key) => ({
          amount: values[key],
          splitNumber: parseInt(key.replace("offer_installment_", "")),
        })),
      pendingPayments: Object.keys(values)
        .filter(
          (key) => key.startsWith("pending_paid_") && !key.includes("date")
        )
        .map((key) => {
          const splitNumber = parseInt(key.replace("pending_paid_", ""));
          return {
            amount: values[key],
            date: values[`pending_paid_date_${splitNumber}`]?.toISOString(),
            splitNumber,
          };
        }),
    };
  };

  const handleSubmit = async (values: FormData) => {
    try {
      setLoading(true);
      console.log(values, "values");
      const payload = mode === "edit" ? transformFormData(values) : values;
      // const payload = transformFormData(values);
      console.log(values, "values");

      const url =
        mode === "edit"
          ? `${API_BASE_URL}/api/v1/candidates/${id}`
          : `${API_BASE_URL}/api/v1/candidates`;
      const method = mode === "edit" ? "put" : "post";
      const response = await axios[method](url, payload, {
        withCredentials: true,
      });
      console.log(response.data);
      if (response.status === 200 || response.status === 201) {
        setLoading(true);

        setModalType("success");
        setModalTitle("Success!");
        setModalMessage(
          `Candidate ${mode === "edit" ? "updated" : "created"} successfully!`
        );
        setIsModalVisible(true);

        // Navigate after successful submission
        setTimeout(() => {
          navigate("/bdcandidates");
        }, 2000);
      }
    } catch (error: any) {
      setModalType("error");
      setModalTitle("Error");
      setModalMessage(error.response?.data?.message || "An error occurred");
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.success("Form has been reset");
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e?.fileList, "e?.fileList");
    return e?.fileList;
  };

  if (!isDataLoaded) {
    return (
      <div>
        {" "}
        <Loader variant="spinner" />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Loader variant="spinner" />
      </div>
    );
  }

  return (
    <>
      <MetaData title="Back Door Candidates - Axess Technologies" />
      <CommonModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      />
      <div className="min-h-screen">
        <div className="flex">
          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-center mb-8 space-x-4">
              <Link to={"/bdcandidates"}>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center">
                  <FaChevronLeft className="text-blue-500 mr-4 text-2xl cursor-pointer hover:text-blue-700 transition-colors" />
                  {mode === "edit" ? "Edit" : "Add"} Candidates
                </h2>
              </Link>
              <div className="flex-grow border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
            </div>

            <Form
              form={form}
              {...formItemLayout}
              onFinish={handleSubmit}
              initialValues={formData || undefined}
            >
              {mode === "create" && (
                <>
                  <div className="mb-6">
                    <PersonalDetails
                      form={form}
                      mode={mode}
                      normFile={normFile}
                      initialData={formData}
                    />
                  </div>
                  <div>
                    <PaymentDetails
                      form={form}
                      mode={mode}
                      normFile={normFile}
                      initialData={formData}
                    />
                  </div>
                </>
              )}
              <div>
                {mode === "edit" && (
                  <>
                    <FormEdit form={form} mode={mode} initialData={formData} />
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                {mode !== "edit" && 
                    <Button type="primary" danger onClick={handleReset}>
                    Reset
                  </Button>}
            
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
