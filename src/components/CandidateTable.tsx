import React from 'react';
import { Modal, Table, Button, Tooltip, TableColumnsType } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MdOutlineSummarize } from 'react-icons/md';

// Define interfaces for type safety
export interface Candidate {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  BDcategory?: string;
  onboarded?: boolean;
}

interface CandidateTableModalProps {
  visible: boolean;
  candidates: Candidate[];
  onCancel: () => void;
  title?: string;
  width?: number;
}

const CandidateTableModal: React.FC<CandidateTableModalProps> = ({
  visible,
  candidates,
  onCancel,
  title = 'Selected Candidates',
  width = 800,
}) => {
  const navigate = useNavigate();

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/candidates/view/${candidateId}`);
    onCancel(); // Close the modal after navigation
  };

  // Explicitly type the columns
  const columns: TableColumnsType<Candidate> = [
    { title: "Back Door Id", dataIndex: "backDoorId", key: "backDoorId", width: 120 },
    { title: "Candidate Name", dataIndex: "fullName", key: "fullName", width: 150 },
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
    { title: "Balance", dataIndex: "balanceAmount", key: "balanceAmount", width: 100 },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Tooltip placement="top" title="View Canditate">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/candidates/view/${record._id}`)}
            className="pt-1 m-1"

          />
          </Tooltip>
        </span>
      ),
      width: 200,
    },
  ];

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={width}
    >
      {candidates.length > 0 ? (
        <Table
          dataSource={candidates}
          columns={columns}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`,
          }}
        />
      ) : (
        <div className="text-center text-gray-500">No candidates found.</div>
      )}
    </Modal>
  );
};

export default CandidateTableModal;