import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Modal, Button } from 'antd';
import { ApexOptions } from 'apexcharts';

interface LoanStatData {
  month: string;
  year: number;
  totalPeople: number;
  loan: {
    count: number;
    candidateIds: string[];
  };
  noLoan: {
    count: number;
    candidateIds: string[];
  };
}

interface ApiResponse {
  success: boolean;
  data: LoanStatData[];
}

const ChartOne: React.FC = () => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

  const [state, setState] = useState<{
    series: { name: string; data: number[] }[];
    rawData: LoanStatData[];
    isModalVisible: boolean;
    selectedCandidates: string[];
  }>({
    series: [
      { name: 'Loan', data: Array(12).fill(0) },
      { name: 'No Loan', data: Array(12).fill(0) },
    ],
    rawData: [],
    isModalVisible: false,
    selectedCandidates: [],
  });

  const options: ApexOptions = {
    // ... (previous options remain the same)
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 100,
    },
    xaxis: {
      type: 'category',
      categories: monthNames,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
         ` ${API_BASE_URL}/api/v1/candidate/loanstat`
        );
        
        if (response.data.success) {
          const loanData = Array(12).fill(0);
          const noLoanData = Array(12).fill(0);

          response.data.data.forEach((item) => {
            const monthIndex = monthNames.indexOf(item.month);
            
            if (monthIndex !== -1) {
              loanData[monthIndex] = item.loan.count;
              noLoanData[monthIndex] = item.noLoan.count;
            }
          });

          setState({
            series: [
              { name: 'Loan', data: loanData },
              { name: 'No Loan', data: noLoanData },
            ],
            rawData: response.data.data,
            isModalVisible: false,
            selectedCandidates: [],
          });
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDataPointClick = (event: any, chartContext: any, config: any) => {
    const monthIndex = config.dataPointIndex;
    const seriesIndex = config.seriesIndex;

    const selectedData = state.rawData.find(
      (item) => monthNames.indexOf(item.month) === monthIndex
    );

    if (selectedData) {
      const candidateIds = seriesIndex === 0
        ? selectedData.loan.candidateIds
        : selectedData.noLoan.candidateIds;

      setState(prevState => ({
        ...prevState,
        isModalVisible: true,
        selectedCandidates: candidateIds,
      }));
    }
  };

  const chartOptions: ApexOptions = {
    ...options,
    chart: {
      ...options.chart,
      events: {
        dataPointSelection: handleDataPointClick,
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-7">
      {/* ... (previous render logic remains the same) */}
      <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Loan Analytics
          </h5>
        </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={chartOptions}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>

      <Modal
        title="Candidate Details"
        visible={state.isModalVisible}
        onCancel={() => setState(prevState => ({ ...prevState, isModalVisible: false, selectedCandidates: [] }))}
        footer={[
          <Button key="close" onClick={() => setState(prevState => ({ ...prevState, isModalVisible: false, selectedCandidates: [] }))}>
            Close
          </Button>,
        ]}
      >
        <h4>Selected Candidates:</h4>
        <ul>
          {state.selectedCandidates.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default ChartOne;
