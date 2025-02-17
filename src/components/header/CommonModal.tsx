import React from 'react';

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onOk: () => void;
  onCancel: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  let iconColor = '';
  let iconPath = '';

  // Set icon color and path based on message type
  switch (type) {
    case 'success':
      iconColor = 'text-green-600';
      iconPath = 'M5 13l4 4L19 7'; // Success checkmark
      break;
    case 'error':
      iconColor = 'text-red-600';
      iconPath = 'M6 18L18 6M6 6l12 12'; // Error cross
      break;
    case 'warning':
      iconColor = 'text-yellow-600';
      iconPath = 'M12 9v2m0 4h.01'; // Warning exclamation mark
      break;
    default:
      iconColor = 'text-green-600';
      iconPath = 'M5 13l4 4L19 7';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <div className="text-center">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconColor} bg-opacity-20 mb-4`}>
            <svg
              className={`h-6 w-6 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={iconPath}
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{message}</p>
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-700 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};


export default CommonModal;
