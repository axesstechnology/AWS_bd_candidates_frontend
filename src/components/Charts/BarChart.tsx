import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface APIResponse {
  success: boolean;
  data: {
    month: string;
    totalCandidates: number;
    onboarded: number;
    profileCreated: number;
  }[];
}

interface CandidateDetail {
  _id: string;
  fullName: string;
  email: string;
  loan: boolean;
  profilecreated: boolean;
  onboarded: boolean;
}

const ApexChart: React.FC = () => {
  const [series, setSeries] = useState([
    { name: "Total Candidates", data: [] as number[] },
    { name: "Onboarded", data: [] as number[] },
    { name: "Profile Created", data: [] as number[] },
  ]);

  const [options, setOptions] = useState({
    chart: { 
      type: "bar" as const, 
      height: 350,
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          handleChartClick(config);
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", colors: ["#000"] },
      formatter: (val: number) => val.toLocaleString(),
      offsetY: -20,
    },
    xaxis: { categories: [] as string[] },
    yaxis: { title: { text: "Count" } },
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
  const [apiData, setApiData] = useState<APIResponse | null>(null);
  
  // New states for detailed candidate modal
  const [candidateModalVisible, setCandidateModalVisible] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetail[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/candidatescount`
        );
        if (response.data.success) {
          setApiData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (apiData) {
      const months = apiData.data.map((item) => item.month);
      const totalCandidatesData = apiData.data.map((item) => item.totalCandidates);
      const onboardedData = apiData.data.map((item) => item.onboarded);
      const profileCreatedData = apiData.data.map((item) => item.profileCreated);

      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { ...prevOptions.xaxis, categories: months },
      }));

      setSeries([
        { name: "Total Candidates", data: totalCandidatesData },
        { name: "Onboarded", data: onboardedData },
        { name: "Profile Created", data: profileCreatedData },
      ]);
    }
  }, [apiData]);

  // New function to handle chart click and fetch candidate details
  // const handleChartClick = async (config: any) => {
  //   if (!config || config.dataPointIndex === undefined) return;

  //   const { dataPointIndex, seriesIndex } = config;
  //   const months = options.xaxis.categories;
  //   const month = months[dataPointIndex];

  //   let filterType = '';
  //   let title = '';

  //   // Determine filter type based on series clicked
  //   switch(seriesIndex) {
  //     case 1: // Onboarded series
  //       filterType = 'onboarded';
  //       title = 'Onboarded Candidates';
  //       break;
  //     case 2: // Profile Created series
  //       filterType = 'profilecreated';
  //       title = 'Profile Created Candidates';
  //       break;
  //     default:
  //       return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `${API_BASE_URL}/api/v1/candidate-filters`,
  //       { 
  //         params: { 
  //           filter: filterType 
  //         } 
  //       }
  //     );

  //     if (response.data.success) {
  //       setCandidateDetails(response.data.data);
  //       setModalTitle(`${title} - ${month}`);
  //       setCandidateModalVisible(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching candidate details", error);
  //   }
  // };

  const handleChartClick = async (config: any) => {
    if (!config || config.dataPointIndex === undefined) return;
  
    const { dataPointIndex, seriesIndex } = config;
    // const months = options.xaxis.categories;

    // const month = months[dataPointIndex];

  
    let filterType = '';
    let title = '';
    let month = options.xaxis.categories;
    console.log(options.xaxis.categories,"options.xaxis.categories");
  
    // Determine filter type based on series clicked
    switch (seriesIndex) {
      case 1: // Onboarded series
        filterType = 'onboarded';
        title = 'Onboarded Candidates';
        break;
      case 2: // Profile Created series
        filterType = 'profilecreated';
        title = 'Profile Created Candidates';
        break;
      default:
        return;
    }
  
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/candidate-filters`,
        {
          params: {
            filter: filterType,
            // month: month, 
          },
          paramsSerializer: (params) => {
            return Object.entries(params)
              .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
              .join('&');
          },
        }
      );
  
      if (response.data.success) {
        setCandidateDetails(response.data.data);
        setModalTitle(`${title} - ${month}`);
        setCandidateModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching candidate details', error);
    }
  };
  
  
  // Columns for candidate details table
  const columns: ColumnsType<CandidateDetail> = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Loan',
      dataIndex: 'loan',
      key: 'loan',
      render: (loan) => loan ? 'Yes' : 'No'
    },
    {
      title: 'Profile Created',
      dataIndex: 'profilecreated',
      key: 'profilecreated',
      render: (profileCreated) => profileCreated ? 'Yes' : 'No'
    },
    {
      title: 'Onboarded',
      dataIndex: 'onboarded',
      key: 'onboarded',
      render: (onboarded) => onboarded ? 'Yes' : 'No'
    },
  ];

  return (
    <>
      <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h5 className="text-xl font-semibold text-black dark:text-white">
              Candidates Analytics
            </h5>
          </div>
        </div>
        <div className="mb-2">
          <div id="chart" className="mx-auto flex justify-center">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
              width={350}
            />
          </div>
        </div>
        
        {/* Candidate Details Modal */}
        <Modal
          title={modalTitle}
          visible={candidateModalVisible}
          onCancel={() => setCandidateModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table 
            columns={columns} 
            dataSource={candidateDetails} 
            rowKey="_id"
            pagination={{ 
              pageSize: 5, 
              showSizeChanger: true 
            }}
          />
        </Modal>
      </div>
    </>
  );
};

export default ApexChart;