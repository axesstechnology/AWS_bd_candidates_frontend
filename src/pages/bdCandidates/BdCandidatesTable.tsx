import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { TableColumnsType  } from "antd";
import axios from "axios";
import { Tooltip } from 'antd';
import { createStyles } from "antd-style";
import { useNavigate } from "react-router-dom";
import MetaData from "../../utils/MetaData";
import { MdOutlineShowChart, MdOutlineSummarize } from "react-icons/md";
import Loader from "../../utils/Loader";

const useStyle = createStyles(({ css, token }: any) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: unset;
          }
        }
      }
    `,
  };
});

interface DataType {
  key: React.Key;
  backDoorId: string;
  fullName: string;
  jobType: string;
  phoneNumber: string;
  email: string;
  totalAmount: number;
  balanceAmount: number;
  loan: boolean;
  referredBy: string;
  category: string;
  class: string;
  modeOfPayment: string;
  offerReceived: boolean;
  onboarded:boolean;
  BDcategory:string;
}


const BDCandidatesTable: React.FC = () => {
  const { styles } = useStyle();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  // Function to get a cookie value by name
function getCookie(name:any) {
  let decodedCookie = decodeURIComponent(document.cookie);  // Decode the cookie string
  let ca = decodedCookie.split(';');  // Split the string into individual cookies
  for(let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();  // Trim any leading/trailing spaces
      if (c.indexOf(name + "=") === 0) {  // Check if the cookie starts with the desired name
          return c.substring(name.length + 1);  // Return the cookie value
      }
  }
  return "";  // Return empty string if the cookie isn't found
}

// Example usage
let userInfo = getCookie("userInfo");
console.log(userInfo);  // Prints the value of "userInfo" cookie

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/candidates`);
        if (response.data.success) {
          const data = response.data.data.map((item: any) => ({
            key: item._id,
            ...item,
          }));
          setDataSource(data);
          setFilteredData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = dataSource.filter((candidate) =>
      candidate?.fullName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      candidate?.backDoorId?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, dataSource]);

  const jobTypeMapping: Record<string, string> = {
    software_engineering: "Software Development",
    software_testing: "Software Testing",
  };

  const filters = {
    referredBy: ["manju meenakshi", "manju", "srimathi", "bala","N/A"],
    BDcategory: ["Backdoor", "Interview support", "job support", "TSDP", "internship", "Only course"],
    jobType: ["Remote", "Hybrid"],
    class: ["software_testing", "software_engineering"],
    modeOfPayment: ["Not Applicable", "online", "cash"],
    onboarded: ["Yes", "No"],
    loan: ["Yes", "No"],
  };

  const columns: TableColumnsType<DataType> = [
    { title: "Student Id", dataIndex: "backDoorId", key: "backDoorId", width: 120 },
    { title: "Candidate Name", dataIndex: "fullName", key: "fullName", width: 150 },
    // { title: "Job Type", dataIndex: "jobType", key: "jobType", width: 150, filters: filters.jobType.map(value => ({ text: value, value })), onFilter: (value, record) => record.jobType === value },
    { 
      title: "Domain", 
      dataIndex: "class", 
      key: "class", 
      width: 150, 
      filters: Object.entries(jobTypeMapping).map(([value, label]) => ({
        text: label,
        value,
      })),
      onFilter: (value, record) => record.class === value,
      render: (value: string) => jobTypeMapping[value] || value
    },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber", width: 150 },
    {
      title: "Loan",
      dataIndex: "loan",
      key: "loan",
      width: 100,
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.loan === value,  // Compare with record.loan
      render: (loan: boolean) => (loan ? "Yes" : "No"),
    },
    {
      title: "Category",
      dataIndex: "BDcategory",
      key: "BDcategory",
      width: 150, 
      filters: filters.BDcategory.map(value => ({ text: value, value })),
      onFilter: (value, record) => record.BDcategory === value,
    },
    { title: "Stage", dataIndex: "stage", key: "stage", width: 150 ,
      render: (stage: number | null | undefined) =>
        stage ?? 'No Data'
    },

  
    {
      title: "On Boarded",
      dataIndex: "onboarded",
      key: "onboarded",
      width: 130,
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.onboarded === value,
      render: (onboarded: boolean) => (onboarded ? "Yes" : "No"),
    },
      { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", width: 130 },
    { title: "Balance", dataIndex: "balanceAmount", key: "balanceAmount", width: 100, render: (balanceAmount: number | null | undefined) =>
      balanceAmount ?? 0, },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
            <Tooltip placement="top" title="View Summary">
           <Button
            icon={<MdOutlineSummarize   />}
            onClick={() => Navigate(`/bdcandidates/candidates/summary/${record.key}`)}
            className="pt-1 m-1"
          />
          </Tooltip>
            <Tooltip placement="top" title="View Timeline">
           <Button
            icon={<MdOutlineShowChart  />}
            onClick={() => Navigate(`/bdcandidates/candidates/timeline/${record.key}`)}
            className="pt-1 m-1"
          />
          </Tooltip>
          <Tooltip placement="top" title="View Details">
          <Button
            icon={<EyeOutlined />}
            onClick={() => Navigate(`/candidates/view/${record.key}`)}
            className="pt-1 m-1"

          />
          </Tooltip>
          <Tooltip placement="top" title="Edit Details">
          <Button
            icon={<EditOutlined />}
            onClick={() => Navigate(`/backdoor-candidates/edit/${record.key}`)}
            className="pt-1 m-1"

          />
          </Tooltip> 
        </span>
      ),
      fixed: 'right',
      width: 200,
    },
  ];

  if(loading){
   return  <div><Loader variant="spinner"/></div>
  }
  return (
    <>
      <MetaData title="Back Door Candidates - Axess Technologies" />
      <div className="min-h-screen">
        <div className="flex justify-between items-center p-4">
        <div className="flex justify-center items-center gap-2">
        
        {/* <h1 className="text-2xl font-semibold"> Candidates List</h1> */}

        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center">
          Candidates List
        </h2>
        </div>
          <Input
            placeholder="Search by Name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        <Table<DataType>
          className={styles.customTable}
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: "max-content", y: 450 }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default BDCandidatesTable;
