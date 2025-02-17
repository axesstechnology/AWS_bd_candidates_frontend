import { Steps } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaCreditCard,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../utils/Loader";

const Summary = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
  const { id } = useParams<{ id: string }>();
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log("summaryData",summaryData);
  


  const stepsConfig = [
    {
      key: "BDcategory",
      title: "Category",
      description: "Candidate's category",
    },
    { key: "agreement", title: "Agreement", description: "Agreement status" },
    {
      key: "acknowledgement",
      title: "Acknowledgement",
      description: "Acknowledgement",
    },
    {
      key: "profilecreated",
      title: "Profile Created",
      description: "Profile creation",
    },
    {
      key: "videoshooted",
      title: "Video Shot",
      description: "Video shooting",
    },
    { key: "modelready", title: "Model Ready", description: "Model readiness" },
    { key: "loan", title: "Loan", description: "Loan details" },
    { key: "documentsSubmitted", title: "Documents Submitted", description: "Documents Submitted" },
    {
      key: "didOfferReceived",
      title: "Offer Received",
      description: "Offer Received",
    },

  ];

  const Navigate = useNavigate();

  const fetchSummaryData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/candidate-summary/${id}`
      );
      setSummaryData(res.data.data);
    } catch (err) {
      console.error("Error fetching summary data:", err);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  console.log("summaryData",summaryData);


  // Function to get initials based on full name
  const getInitials = (fullName: string) => {
    const nameParts = fullName?.split(" ");
    if (nameParts && nameParts.length > 1) {
      return nameParts[0][0]?.toUpperCase() + nameParts[1][0]?.toUpperCase();
    }
    return fullName?.slice(0, 2)?.toUpperCase() || "NA"; // Default fallback if no full name
  };

  // Function to professionally format class names
  const formatClassName = (className: string) => {
    return className
      ? className
          .split("_")
          .map((word) => word.charAt(0)?.toUpperCase() + word.slice(1))
          .join(" ")
      : "Not available";
  };

  

  const TotalPaid =summaryData?.totalAmount - summaryData?.balanceAmount
    // summaryData?.totalAmount && summaryData?.balanceAmount
    //   ? 
    //   : null;

      console.log(" summmary , TotalPaid" , TotalPaid); 

  if(loading){
    return <div><Loader variant="spinner"/></div>
  }    
      

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
      {/* Header Section */}
      <div className="flex items-center mb-8 space-x-4">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center">
          <FaChevronLeft
            onClick={() => Navigate("/bdcandidates")}
            className="text-blue-500 mr-4 text-2xl cursor-pointer hover:text-blue-700 transition-colors"
          />
          Candidates Summary
        </h2>
        <div className="flex-grow border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Steps / Progress Section */}
        <div className="space-y-6">
          <Steps direction="vertical" className="candidate-steps">
            {stepsConfig.map((step, index) => (
              <Steps.Step
                key={index}
                title={
                  <span className="font-semibold text-lg text-gray-800 dark:text-white">
                    {step.title}
                  </span>
                }
                description={
                  summaryData ? (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {step.key === "didOfferReceived" &&
                      summaryData[step.key] ? (
                        <>
                          <div>{step.description}: Yes</div>
                          {summaryData.dateOfOffer ? (
                            <div>{`Date of Offer: ${summaryData.dateOfOffer.slice(
                              0,
                              10
                            )}`}</div>
                          ) : (
                            <div>Offer Date not available</div>
                          )}
                        </>
                      ) : step.key === "agreement" ? (
                        <>
                          <div>{step.description}: Yes</div>
                          {summaryData.agreementDate && (
                            <div>{`Agreement Date: ${summaryData.agreementDate.slice(
                              0,
                              10
                            )}`}</div>
                          )}
                        </>
                      ) : (
                        `${step.description}: ${
                          typeof summaryData[step.key] === "boolean"
                            ? summaryData[step.key]
                              ? "Yes"
                              : "No"
                            : summaryData[step.key] || "Not available"
                        }`
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Loading...
                    </span>
                  )
                }
                status={
                  summaryData &&
                  (summaryData[step.key] === true ||
                    (step.key === "BDcategory" && summaryData[step.key]))
                    ? "finish"
                    : "wait"
                }
                className="transition-all duration-300 ease-in-out"
              />
            ))}
          </Steps>
        </div>

        {/* Profile Card Section */}
        <div className="flex justify-center">
          <div className="flex justify-center items-center max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="px-6">
              <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mx-auto shadow-lg">
                {getInitials(summaryData?.fullName)}
              </div>

              <div className="text-center mt-4">
                <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-2">
                  {summaryData?.fullName || "Loading..."}
                </h3>

                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Backdoor ID:
                  </span>{" "}
                  {summaryData?.backDoorId || "Not available"}
                </p>

                <div className="mt-2 inline-block">
                  {summaryData?.isActive ? (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                      Active
                    </span>
                  ) : (
                    <div>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100">
                        Inactive
                      </span>
                      {summaryData?.inactivereason && (
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                          Reason: {summaryData.inactivereason}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  {formatClassName(summaryData?.class) || "Class not specified"}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="text-green-600 text-xl" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Total Amount :
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {summaryData?.totalAmount || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaWallet className="text-blue-600 text-xl" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Balance Amount :
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {summaryData?.balanceAmount || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaCreditCard className="text-purple-600 text-xl" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Total Paid Amount :
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {TotalPaid || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
