import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import moment from 'moment';
import { ApexOptions } from 'apexcharts';

interface LoanData {
  monthYear: string;
  loanCount: number;
  totalLoanAmount: number;
  totalBalanceAmount: number;
}

const Loanstats: React.FC = () => {
  // Function to format Indian currency
  const formatIndianRupees = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const [series, setSeries] = useState([
    {
      name: 'Loan Count',
      data: [] as number[]
    },
    {
      name: 'Total Loan Amount',
      data: [] as number[]
    },
    {
      name: 'Total Balance Amount',
      data: [] as number[]
    }
  ]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        // endingShape: 'rounded',
        borderRadius: 4
      },
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#008FFB', '#00E396', '#CED4DC'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Number of Loans',
        },
        labels: {
          formatter: function(val: number) {
            return val.toFixed(0);
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Amount (₹)'
        },
        labels: {
          formatter: function(val: number) {
            return formatIndianRupees(val);
          }
        }
      }
    ],
    tooltip: {
      y: {
        formatter: function(value: number, { seriesIndex }: { seriesIndex: number }) {
          if (seriesIndex === 0) {
            return `${value} loans`;
          }
          return formatIndianRupees(value);
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    },
    fill: {
      opacity: 1
    }
  });

  // Generate all 12 months of the current year
  const generateAllMonths = () => {
    const months = [];
    const currentYear = moment().year();
    
    for (let i = 0; i < 12; i++) {
      months.push(moment(`${currentYear}-${i + 1}`, 'YYYY-M').format('YYYY-MM'));
    }
    return months;
  };

  // Find data for a specific month, return 0 if no data exists
  const getDataForMonth = (monthYear: string, data: LoanData[]) => {
    const monthData = data.find(item => item.monthYear === monthYear);
    return {
      loanCount: monthData?.loanCount || 0,
      totalLoanAmount: monthData?.totalLoanAmount || 0,
      totalBalanceAmount: monthData?.totalBalanceAmount || 0,
    };
  };

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/candidate/loans`
        );
        if (response.data.success) {
          const apiData = response.data.data;

          // Generate all months
          const allMonths = generateAllMonths();
          
          // Prepare data for all months
          const monthlyData = allMonths.map(month => ({
            monthYear: month,
            ...getDataForMonth(month, apiData)
          }));

          // Format month labels for display
          const categories = monthlyData.map(item => 
            moment(item.monthYear).format('MMM YYYY')
          );

          // Update chart options with new categories
          setOptions(prevOptions => ({
            ...prevOptions,
            xaxis: {
              ...prevOptions.xaxis,
              categories: categories
            }
          }));

          // Update series with new data
          setSeries([
            {
              name: 'Loan Count',
              data: monthlyData.map(item => item.loanCount)
            },
            {
              name: 'Total Loan Amount',
              data: monthlyData.map(item => item.totalLoanAmount)
            },
            {
              name: 'Total Balance Amount',
              data: monthlyData.map(item => item.totalBalanceAmount)
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching loan data:', error);
      }
    };

    fetchLoanData();
  }, []);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      
      <div id="chart" className="w-full">
        <ReactApexChart 
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default Loanstats;