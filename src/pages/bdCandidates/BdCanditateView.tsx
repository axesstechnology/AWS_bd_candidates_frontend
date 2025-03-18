import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "antd";
import {
  FiUser,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiUserCheck,
  FiClock,
  FiMessageSquare,
  FiAlertCircle,
  FiCheckCircle,
  FiDatabase,
} from "react-icons/fi";
import { MdOutlinePaid, MdPendingActions } from "react-icons/md";
import { FaBuilding, FaChevronLeft } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import DocumentViewer from "../../components/DocumentViewer";
import Loader from "../../utils/Loader";
import GoogleDrivePDFViewer from "../../components/GoogleDrivePDFViewer";

const BdCandidateView: React.FC = () => {
  const [candidate, setCandidate] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const Navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/candidates/${id}`);
        const data = await response.json();
        if (data.success) {
          setCandidate(data.data);
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };
    fetchCandidate();
  }, [id]);

  if (!candidate) {
    return (
      // <div className="flex items-center justify-center min-h-screen">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      // </div>

      <div>
        <Loader variant="spinner" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex items-center mb-8 space-x-4">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center">
          <FaChevronLeft
            onClick={() => Navigate("/bdcandidates")}
            className="text-blue-500 mr-4 text-2xl cursor-pointer hover:text-blue-700 transition-colors"
          />
          Candidates Details
        </h2>
        <div className="flex-grow border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <Card
              title={
                <div className="text-center">
                  <div className="inline-flex mt-4 h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold mb-4">
                    {getInitials(candidate.fullName)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {candidate.fullName}
                  </h2>
                  <div className="flex justify-center gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {candidate.class.replace(/_/g, " ")?.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        candidate.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {candidate.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <FiUser className="w-5 h-5 text-blue-500" />
                  <span>ID: {candidate.backDoorId}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FiBriefcase className="w-5 h-5 text-blue-500" />
                  <span>{candidate.jobType}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FiPhone className="w-5 h-5 text-blue-500" />
                  <span>{candidate.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FiMail className="w-5 h-5 text-blue-500" />
                  <span className="truncate">{candidate.email}</span>
                </div>
              </div>
            </Card>

            {/* Payment Summary Card */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-5 h-5 text-green-500" />
                  Payment Summary
                </div>
              }
              className="mt-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(candidate.totalAmount)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(candidate.balanceAmount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600 mt-4">
                <FiCreditCard className="w-5 h-5 text-purple-500" />
                <span>{candidate.modeOfPayment?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 mt-2">
                <FiCalendar className="w-5 h-5 text-purple-500" />
                <span>{candidate?.amountReceived?.slice(0, 10)}</span>
              </div>
            </Card>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FaRegMessage className="w-5 h-5 text-blue-500" />
                  Comments
                </div>
              }
              className="mt-6"
            >
              <div className="flex items-center gap-3 text-gray-600 mt-2">
                {/* <FiCalendar className="w-5 h-5 text-purple-500" /> */}
                <span>{candidate.comments}</span>
              </div>
            </Card>
          </div>

          {/* Main Content Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Loan Information */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-5 h-5 text-indigo-500" />
                  Loan Information
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Loan Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        candidate.loan
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {candidate.loan ? "Active" : "Not Applied"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Sanction Amount</span>
                    <span className="font-semibold">
                      {formatCurrency(candidate.loanSanctionAmount)}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Documents</span>
                    <span
                      className={`flex items-center gap-2 ${
                        candidate.documentsSubmitted
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {candidate.documentsSubmitted ? (
                        <FiCheckCircle className="w-5 h-5" />
                      ) : (
                        <FiAlertCircle className="w-5 h-5" />
                      )}
                      {candidate.documentsSubmitted ? "Submitted" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Referred By</span>
                    <span className="font-semibold">
                      {candidate.referredBy}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FiDatabase className="w-5 h-5 text-orange-500" />
                  Initial Payment
                </div>
              }
            >
              <div className="space-y-4">
                {candidate.initial_splits.map(
                  (initial_splits: any, index: number) => (
                    <div
                      key={initial_splits._id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <span className="text-gray-600">
                        Installment {index + 1}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {formatCurrency(initial_splits.amount)}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {initial_splits?.date?.slice(0, 10)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* Payment Splits */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <MdPendingActions className="w-5 h-5 text-orange-500" />
                  Pending Payment Splits
                </div>
              }
            >
              <div className="space-y-4">
                {candidate.offerInstallments.map(
                  (installment: any, index: number) => (
                    <div
                      key={installment._id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <span className="text-gray-600">
                        Installment {index + 1}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {formatCurrency(installment.amount)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center gap-2">
                  <MdOutlinePaid className="w-5 h-5 text-orange-500" />
                  Pending Paid Splits
                </div>
              }
              className="md:col-span-2 mt-6"
            >
              <div className="space-y-4">
                {candidate.offerInstallmentsPaid.map(
                  (installment: any, index: number) => (
                    <div
                      key={installment._id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <span className="text-gray-600">
                        Installment {index + 1}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {formatCurrency(installment.amount)}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {installment?.date?.slice(0, 10)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center gap-2">
                  <FiFileText className="w-5 h-5 text-teal-500" />
                  Uploaded Forms
                </div>
              }
              className="mt-6"
            >
              <div className="space-y-4 flex justify-between flex-col ">
                {
                  candidate.agreementDocument && (
                    <div className=" flex  justify-between items-center">
                    <h1>Agreement</h1>
                    <GoogleDrivePDFViewer file={candidate.agreementDocument} />
                  </div>
                  )
                }

                {
                  candidate.acknowledgementDocument && (
                    <div className=" flex  justify-between items-center">
                    <h1>Acknowledgement</h1>
                    <GoogleDrivePDFViewer file={candidate.acknowledgementDocument} />
                  </div>
                  )
                }
             
                {/* {candidate.formUploads.map((form: any) => (
                  <div
                    key={form._id}
                    className="flex items-center justify-between border-b pb-2 mb-2"
                  >
                    <span className="text-gray-600 font">Form {form.form}</span>
                    <DocumentViewer
                      fileName={form.fileName}
                      base64={form.base64}
                    />
                  </div>
                ))} */}
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center gap-2">
                  <FiDatabase className="w-5 h-5 text-orange-500" />
                  Received Documents
                </div>
              }
              className="mt-6"
            >
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {candidate.requiredDocuments.map(
                  (doc: string, index: number) => (
                    <li key={index}>{doc.replace(/_/g, " ")?.toUpperCase()}</li>
                  )
                )}
              </ul>
            </Card>

            <Card
              title={
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-blue-500" />
                  Last Updated
                </div>
              }
              className="mt-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiMail className="w-5 h-5 text-blue-500" />
                  <span>Updated By: {candidate.updatedBy?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-blue-500" />
                  <span>Date: {formatDate(candidate.updatedDate)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BdCandidateView;
