import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { Button, Modal, Table, Tooltip } from "antd";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { MdOutlineSummarize } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CandidateTableModal from "../CandidateTable";

interface CategoryDetails {
  count: number;
  candidates: string[];
}

interface Categories {
  [key: string]: CategoryDetails;
}

interface ApiResponse {
  success: boolean;
  data: {
    totalCandidates: number;
    categories: Categories;
  };
}

const CategoryDistributionChart: React.FC = () => {
  const [chartData, setChartData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${API_BASE_URL}/api/v1/candidate/category`
        );
        setChartData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBarClick = async (index: number) => {
    const category = categories[index];
    if (category) {
      try {
        const response = await axios.post(
        `  ${API_BASE_URL}/api/v1/candidates/bdcategory/${category.name}`
        );
        setSelectedCandidates(response.data.data);
        setModalVisible(true);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[350px] text-gray-500">
      <FiAlertCircle className="w-12 h-12 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">No Data Available</h3>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        There are currently no categories to display. New data will appear here
        once available.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
        <div className="flex items-center justify-center h-[350px]">
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
        <div className="flex items-center justify-center h-[350px] text-red-500">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // Extract and calculate data
  const totalCandidates = chartData.data.totalCandidates;
  const categories = Object.entries(chartData.data.categories)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([key, value]) => ({
      name: key,
      count: value.count,
      candidates: value.candidates,
    }));

  const series = categories.map(
    (category) => (category.count / totalCandidates) * 100
  );

  const labels = categories.map((category) => category.name);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "radialBar",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          handleBarClick(config.dataPointIndex);
        },
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          size: "30%",
          background: "transparent",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "14px",
            color: "#333",
          },
          value: {
            show: true,
            fontSize: "16px",
            color: "#333",
            formatter: (val: number) => `${Math.round(val)}%`,
          },
        },
        track: {
          background: "#f2f2f2",
          strokeWidth: "100%",
        },
      },
    },
    colors: ["#2E93fA", "#FF6B6B", "#4CAF50", "#FFA500", "#800080"],
    labels: labels,
    legend: {
      show: true,
      position: "right" as const,
      offsetX: 0,
      formatter: (seriesName: string, opts: any) => {
        const index = opts.seriesIndex;
        const category = categories[index];
        if (category) {
          return `${seriesName}: ${category.count} (${category.candidates.length} candidates)`;
        }
        return seriesName;
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/candidates/view/${candidateId}`);
    setModalVisible(false);
  };
  const columns = [
    { title: "Candidate Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Category", dataIndex: "BDcategory", key: "BDcategory" },
    {
      title: "On Boarded",
      dataIndex: "onboarded",
      key: "onboarded",
      width: 130,
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value: any, record: any) => record.onboarded === value,
      render: (onboarded: boolean) => (onboarded ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        console.log(record, "record"),
        (
          <span>
            <Tooltip placement="top" title="View Canditate">
              <Button
                icon={<EyeOutlined />}
                onClick={() => handleViewCandidate(record._id)}
                className="pt-1 m-1"
              />
            </Tooltip>
          </span>
        )
      ),
      width: 200,
    },
  ];

  const modalContent = (
    <Table
      dataSource={selectedCandidates}
      columns={columns}
      rowKey="name"
      pagination={false}
    />
  );

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div>
        <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
        <div className="text-center mb-4 text-gray-600">
          <p>
            Total Candidates: <strong>{totalCandidates}</strong>
          </p>
        </div>

        <div className="mx-auto flex justify-center">
          {series.length > 0 ? (
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={400}
              width={450}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

        {/* {modalContent} */}
        <CandidateTableModal
          visible={modalVisible}
          candidates={selectedCandidates}
          onCancel={() => setModalVisible(false)}
          title="My Custom Title"
        />
    </div>
  );
};

export default CategoryDistributionChart;
