import React, { useEffect, useState } from "react";
import CardDataStats from "../../components/CardDataStats";
import ChartThree from "../../components/Charts/Chartthree";
import { SlPeople } from "react-icons/sl";
import { FaDev, FaUserTie } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { SiMicrosoftacademic } from "react-icons/si";
import { PiTestTubeFill, PiTestTubeLight, PiTestTubeThin } from "react-icons/pi";

import ChartOne from "../../components/Charts/ChartOne";
import ApexChart from "../../components/Charts/BarChart";
import axios from "axios";
import LoanStats from "../../components/Charts/LoanStats";
import CategoryChart from "../../components/Charts/CategoryChart";
import RadialBarChartComponent from "../../components/Charts/CategoryChart";
import CategoryDistributionChart from "../../components/Charts/CategoryChart";

interface ClassCount {
  count: number;
  class: string;
}

interface ClassWiseOffer {
  offersCount: number;
  class: string;
}

interface Statistics {
  totalCandidates: number;
  offerRate: string;
}

interface CandidateStatusResponse {
  classCounts: ClassCount[];
  classWiseOffers: ClassWiseOffer[];
  statistics: Statistics;
}

const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [data, setData] = useState<CandidateStatusResponse>({
    classCounts: [],
    classWiseOffers: [],
    statistics: {
      totalCandidates: 0,
      offerRate: "0%",
    },
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;


  const fetchCandidates = async () => {
    try {
      const result = await axios.get(
       ` ${API_BASE_URL}/api/v1/candidates`
      );
      setCandidates(result.data.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/candidatestatus`
      );
      if (response.data.success) {
        const apiData = response.data.data;
        setData({
          classCounts: apiData.classCounts,
          classWiseOffers: apiData.classWiseOffers,
          statistics: apiData.statistics,
        });
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center mb-6 space-x-4">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center">
  
        Candidates Dashboard
        </h2>
        <div className="flex-grow border-b border-gray-300"></div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartThree />
        <ChartOne />

      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ApexChart />
        <LoanStats/>

      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <LoanStats/> */}
        <CategoryDistributionChart />

      </div>
      {/* <CategoryDistributionChart /> */}

    </>
  );
};

export default Dashboard;
