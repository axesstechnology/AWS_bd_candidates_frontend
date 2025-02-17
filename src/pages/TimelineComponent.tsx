// import React, { useEffect, useState } from "react";
// import { format, isValid } from "date-fns";
// import { FaChevronLeft, FaClock } from "react-icons/fa";
// import { useNavigate, useParams } from "react-router-dom";

// interface Change {
//   field: string;
//   oldValue: any;
//   newValue?: any;
// }

// interface Log {
//   _id: string;
//   changeType: string;
//   updatedAt: string | Date;
//   updatedBy: { name: string };
//   changes: Change[];
// }

// const TimelineComponent = () => {
//   const [auditLogs, setAuditLogs] = useState<Log[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { id } = useParams<{ id: string }>();
//   const Navigate = useNavigate();
//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;


//   useEffect(() => {
//     const fetchAuditLogs = async () => {
//       try {
//         const response = await fetch(
//          ` ${API_BASE_URL}/api/v1/audit-logs/${id}`,
//           {
//             credentials: "include",
//           }
//         );
//         const data = await response.json();
//         if (data.success) {
//           setAuditLogs(data.data);
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         setError("Failed to fetch audit logs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchAuditLogs();
//     }
//   }, [id]);

//   const formatDate = (dateString: string | Date): string => {
//     try {
//       const date = new Date(dateString);
//       if (isValid(date)) {
//         return format(date, "MMM dd, yyyy");
//       }
//       return "Invalid date";
//     } catch {
//       return "Invalid date";
//     }
//   };

//   const formatTime = (dateString: string | Date): string => {
//     try {
//       const date = new Date(dateString);
//       if (isValid(date)) {
//         return format(date, "hh:mm a");
//       }
//       return "Invalid time";
//     } catch {
//       return "Invalid time";
//     }
//   };

//   // const formatValue = (value: any): string => {
//   //   if (value === null || value === undefined) return 'N/A';
//   //   if (typeof value === 'string') return value;
//   //   if (typeof value === 'number') return value.toString();
//   //   if (value instanceof Date) return formatDate(value);
//   //   if (Array.isArray(value)) {
//   //     return value.map(v => formatValue(v)).join(', ');
//   //   }
//   //   if (typeof value === 'object') {
//   //     // If it's a nested object with specific known fields we want to show,
//   //     // we can handle them specifically here
//   //     return JSON.stringify(value);
//   //   }
//   //   return String(value);
//   // };

//   const formatValue = (value: any, field: string): string => {
//     if (value === null || value === undefined) return "N/A";

//     // Handle specific fields
//     if (field === "offerInstallments" && Array.isArray(value)) {
//       // Format as "amount and split count"
//       return value
//         .map((item) => `Amount: ${item.amount}, Split: ${item.splitNumber}`)
//         .join("; ");
//     }

//     if (field === "initial_splits") {
//       if (Array.isArray(value)) {
//         // Format array of splits
//         return value
//           .map(
//             (split) =>
//               `Amount: ${split.amount}${
//                 split.date ? `, Date: ${formatDate(split.date)}` : ""
//               }`
//           )
//           .join("; ");
//       } else if (typeof value === "object") {
//         // Format single split
//         return `Amount: ${value.amount}${
//           value.date ? `, Date: ${formatDate(value.date)}` : ""
//         }`;
//       }
//     }

//     // General formatting for other fields
//     if (typeof value === "string") return value;
//     if (typeof value === "number") return value.toString();
//     if (value instanceof Date) return formatDate(value);
//     if (Array.isArray(value))
//       return value.map((v) => formatValue(v, field)).join(", ");
//     if (typeof value === "object") return JSON.stringify(value);
//     return String(value);
//   };

//   const isValidChange = (change: Change): boolean => {
//     // Exclude changes to _id field
//     if (change.field === "_id") {
//       return false;
//     }

//     // Ensure we have both values
//     if (change.oldValue === undefined || change.newValue === undefined) {
//       return false;
//     }

//     // Convert both values to strings for comparison
//     const oldValueStr =
//       typeof change.oldValue === "object"
//         ? JSON.stringify(change.oldValue)
//         : String(change.oldValue);
//     const newValueStr =
//       typeof change.newValue === "object"
//         ? JSON.stringify(change.newValue)
//         : String(change.newValue);

//     // Check if the values are actually different
//     return oldValueStr !== newValueStr;
//   };

//   const getValidChanges = (changes: Change[]): Change[] => {
//     return changes.filter(isValidChange);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-4">Loading...</div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 p-4">{error}</div>;
//   }

//   // Filter out logs that don't have any valid changes
//   const validLogs = auditLogs.filter(
//     (log) => getValidChanges(log.changes).length > 0
//   );

//   if (!validLogs.length) {
//     return <div className="text-gray-500 p-4">No changes found</div>;
//   }

//   return (
//     <div className="p-4 space-y-6 flex flex-col justify-center items-center w-full max-w-3xl">
//       {validLogs.map((log, index) => {
//         const isNewDay =
//           index === 0 ||
//           formatDate(log.updatedAt) !==
//             formatDate(validLogs[index - 1].updatedAt);
//         const date = formatDate(log.updatedAt);
//         const time = formatTime(log.updatedAt);
//         const validChanges = getValidChanges(log.changes);

//         return (
//           <div key={log._id} className="relative w-full">
//        <FaChevronLeft onClick={() => Navigate("/bdcandidates")}/>
//             {isNewDay && (
//               <div className="ml-6 mb-4 font-medium text-gray-600">{date}</div>
//             )}
//             <div className="flex gap-4 mb-4">
//               <div className="relative">
//                 <div className="w-12 text-xs text-gray-500">{time}</div>
//                 <div className="absolute left-11 top-0 h-full">
//                   <div className="w-px h-full bg-gray-200"></div>
//                 </div>
//                 <div className="absolute left-10 top-0 w-3 h-3 rounded-full bg-emerald-500"></div>
//               </div>
//               <div className="flex flex-1">
//                 <div className="flex items-start gap-2 p-3 rounded-lg border bg-gray-50 w-full">
//                   <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
//                     <FaClock className="w-5 h-5 text-gray-600" />
//                   </div>
//                   <div className="flex-1">
//                     {/* <div className="font-medium text-gray-900 mb-2">
//                       {log.updatedBy?.name || "System"} made changes:
//                     </div> */}
//                     <div className="space-y-3">
//                       {/* {validChanges.map((change, i) => (
//                         <div key={i} className="bg-white p-2 rounded  border-gray-200">
//                           <div className=" text-sm  mb-1">
//                             {change.field} updated by <span className="font-medium ">{log.updatedBy?.name || "System"}</span>
//                           </div>
//                           <div className="text-black-500 text-sm mb-1">
//                             {formatValue(change.oldValue)} to <span className="text-green-500 text-sm">{formatValue(change.newValue)}</span>
//                           </div>
//                         </div>
//                       ))} */}
//                       {validChanges.map((change, i) => (
//                         <div
//                           key={i}
//                           className="bg-white p-2 rounded border-gray-200"
//                         >
//                           <div className="text-sm mb-1">
//                             {change.field} updated by{" "}
//                             <span className="font-medium">
//                               {log.updatedBy?.name || "System"}
//                             </span>
//                           </div>
//                           <div className="text-black-500 text-sm mb-1">
//                             {formatValue(change.oldValue, change.field)} to{" "}
//                             <span className="text-green-500 text-sm">
//                               {formatValue(change.newValue, change.field)}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default TimelineComponent;


import React, { useEffect, useState } from "react";
import { format, isValid } from "date-fns";
import { FaChevronLeft, FaClock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

interface Change {
  field: string;
  oldValue: any;
  newValue?: any;
}

interface Log {
  _id: string;
  changeType: string;
  updatedAt: string | Date;
  updatedBy: { name: string };
  changes: Change[];
}

const TimelineComponent = () => {
  const [auditLogs, setAuditLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const Navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/audit-logs/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setAuditLogs(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch audit logs");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuditLogs();
    }
  }, [id]);

  const formatDate = (dateString: string | Date): string => {
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, "MMM dd, yyyy");
      }
      return "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string | Date): string => {
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, "hh:mm a");
      }
      return "Invalid time";
    } catch {
      return "Invalid time";
    }
  };

  const formatValue = (value: any, field: string): string => {
    if (value === null || value === undefined) return "N/A";

    if (field === "offerInstallments" && Array.isArray(value)) {
      return value
        .map((item) => `Amount: ${item.amount}, Split: ${item.splitNumber}`)
        .join("; ");
    }

    if (field === "initial_splits") {
      if (Array.isArray(value)) {
        return value
          .map(
            (split) =>
              `Amount: ${split.amount}${
                split.date ? `, Date: ${formatDate(split.date)}` : ""
              }`
          )
          .join("; ");
      } else if (typeof value === "object") {
        return `Amount: ${value.amount}${
          value.date ? `, Date: ${formatDate(value.date)}` : ""
        }`;
      }
    }

    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (value instanceof Date) return formatDate(value);
    if (Array.isArray(value))
      return value.map((v) => formatValue(v, field)).join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const isValidChange = (change: Change): boolean => {
    if (change.field === "_id") {
      return false;
    }

    if (change.oldValue === undefined || change.newValue === undefined) {
      return false;
    }

    const oldValueStr =
      typeof change.oldValue === "object"
        ? JSON.stringify(change.oldValue)
        : String(change.oldValue);
    const newValueStr =
      typeof change.newValue === "object"
        ? JSON.stringify(change.newValue)
        : String(change.newValue);

    return oldValueStr !== newValueStr;
  };

  const getValidChanges = (changes: Change[]): Change[] => {
    return changes.filter(isValidChange);
  };

  const validLogs = auditLogs.filter(
    (log) => getValidChanges(log.changes).length > 0
  );

  return (
    <div className="p-4 space-y-6 flex flex-col w-full  bg-white shadow-md rounded-lg ">
      {/* Back Button */}
      {/* <button
        onClick={() => Navigate("/bdcandidates")}
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg w-fit"
      >
        <FaChevronLeft />
        Back
      </button> */}

    {/* Header Section */}
    <div className="flex items-center mb-8 space-x-4">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center">
          <FaChevronLeft
            onClick={() => Navigate("/bdcandidates")}
            className="text-blue-500 mr-4 text-2xl cursor-pointer hover:text-blue-700 transition-colors"
          />
          Timeline
        </h2>
        <div className="flex-grow border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-4">Loading...</div>
      ) : error ? (
        <div className="text-red-500 p-4 flex items-center justify-center min-h-125">{error}</div>
      ) : validLogs.length === 0 ? (
        <div className="text-gray-500 p-4">No changes found</div>
      ) : (
        validLogs.map((log, index) => {
          const isNewDay =
            index === 0 ||
            formatDate(log.updatedAt) !==
              formatDate(validLogs[index - 1].updatedAt);
          const date = formatDate(log.updatedAt);
          const time = formatTime(log.updatedAt);
          const validChanges = getValidChanges(log.changes);

          return (
            <div key={log._id} className="relative w-full">
              {isNewDay && (
                <div className="ml-6 mb-4 font-medium text-gray-600">{date}</div>
              )}
              <div className="flex gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 text-xs text-gray-500">{time}</div>
                  <div className="absolute left-11 top-0 h-full">
                    <div className="w-px h-full bg-gray-200"></div>
                  </div>
                  <div className="absolute left-10 top-0 w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex flex-1">
                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-gray-50 w-full">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                      <FaClock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      {validChanges.map((change, i) => (
                        <div
                          key={i}
                          className="bg-white p-2 rounded border-gray-200"
                        >
                          <div className="text-sm mb-1">
                            {change.field} updated by{" "}
                            <span className="font-medium">
                              {log.updatedBy?.name || "System"}
                            </span>
                          </div>
                          <div className="text-black-500 text-sm mb-1">
                            {formatValue(change.oldValue, change.field)} to{" "}
                            <span className="text-green-500 text-sm">
                              {formatValue(change.newValue, change.field)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TimelineComponent;
