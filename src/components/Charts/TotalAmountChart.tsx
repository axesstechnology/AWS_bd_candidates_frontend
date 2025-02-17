import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { ApexOptions } from 'apexcharts';

interface ChartData {
  data: {
    totalAmount: number;
    totalPaidAmount: number;
    totalBalanceAmount: number;
  }
}

const RadialChart: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>([0, 0, 0]);
  const [total, setTotal] = useState<number>(0);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;


  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get<ChartData>(
         ` ${API_BASE_URL}/api/v1/summary`
        );
        const { totalAmount, totalPaidAmount, totalBalanceAmount } = response.data.data;

        // Convert to percentages relative to total amount
        const totalPercentage = (totalAmount / totalAmount) * 100;
        const paidPercentage = (totalPaidAmount / totalAmount) * 100;
        const balancePercentage = (totalBalanceAmount / totalAmount) * 100;

        setChartData([totalPercentage, paidPercentage, balancePercentage]);
        setTotal(totalAmount);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '16px',
            offsetY: 5,
          },
          value: {
            show: true,
            fontSize: '14px',
            offsetY: -15,
            formatter: function(val: number): string {
              return val.toFixed(1) + '%';
            }
          },
          total: {
            show: true,
            label: 'Total',
            color: '#373d3f',
            fontSize: '16px',
            formatter: function(): string {
              return total.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              });
            }
          }
        },
        track: {
          show: true,
          background: '#f2f2f2',
          strokeWidth: '97%',
          opacity: 1,
          margin: 5,
        },
      }
    },
    colors: ['#008FFB', '#00E396', '#FEB019'],
    labels: ['Total Amount', 'Paid Amount', 'Balance'],
    legend: {
      show: true,
      floating: true,
      fontSize: '13px',
      position: 'left',
      offsetX: 10,
      offsetY: 10,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0
      },
      formatter: function(seriesName: string, opts: any) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex].toFixed(1) + '%';
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    }]
  };

  return (
    <div id="chart" className="w-full h-full">
      <ReactApexChart 
        options={options} 
        series={chartData} 
        type="radialBar" 
        height={350} 
      />
    </div>
  );
};

export default RadialChart;