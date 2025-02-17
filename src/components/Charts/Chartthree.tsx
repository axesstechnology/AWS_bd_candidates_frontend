import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';

interface ChartData {
  data: {
    totalAmount: number;
    totalBalanceAmount: number;
  }
}
interface ChartThreeState {
  series: number[];
}

const ChartThree: React.FC = () => {
  const [state, setState] = useState<ChartThreeState>({
    series: [0, 0],
  });

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ChartData>(`${API_BASE_URL}/api/v1/summary`);
        const { totalAmount, totalBalanceAmount } = response.data.data;
        const paidAmount = totalAmount - totalBalanceAmount;
        
        setState({
          series: [totalAmount,paidAmount, totalBalanceAmount]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: [],
    labels: ['Total Amount','Paid Amount', 'Balance Amount'],
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  // Calculate percentages
  const total = state.series.reduce((acc, curr) => acc + curr, 0);
  const paidPercentage = total ? ((state.series[0] / total) * 100).toFixed(1) : "0";
  const balancePercentage = total ? ((state.series[1] / total) * 100).toFixed(1) : "0";
  // const 

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Payment Analytics
          </h5>
        </div>
        <div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

     

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Paid Amount </span>
              <span> {paidPercentage}% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Balance Amount </span>
              <span> {balancePercentage}% </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;