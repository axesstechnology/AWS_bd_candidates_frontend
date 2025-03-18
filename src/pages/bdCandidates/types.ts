// export interface FormData {
//   "Back Door ID": string;
//   "Candidate Full Name": string;
//   "radio-button": "software_engineering" | "software_testing";
//   switch: boolean;
//   "Need Job Type": "Hybrid" | "Remote";
//   phone: string;
//   "Candidate Mail ID": string;
//   "Amount Received": moment.Moment | null;  // Allow null here
//   "Total Amount": number;
//   "Initial Amount": number;
//   "Mode of Payment": "cash" | "online";
//   "At Time of Offer Payment Paid Date": moment.Moment | null;  // Allow null here as well
//   "Loan": "yes" | "no";
//   "Loan Sanction Amount"?: number;
//   "Balance Amount": number;
//   "Did Offer Received": "yes" | "no";
//   "Comments": string;
//   "Date of Offer": moment.Moment | null;  // Allow null here too
//   "Referred By": string;
//   "Documents Submitted": "yes" | "no";
//   "Upload Documents"?: any[];
//   "OnBoarded"?: "yes" | "no";
//   [key: string]: any;
//     // New Fields Added Below
//   "fileName"?: string; // Name of the uploaded file
//   "fileType"?: string; // MIME type of the uploaded file
//   "base64Data"?: string; // Base64-encoded content of the uploaded file
//   "Form"?: string; // Form identifier for dynamic fields
// }

import moment from 'moment';

export interface FileUpload {
  name?: string;
  status?: string;
  url?: string;
  base64?: string;
  type?: string;
}

export interface FormData {
  "Back Door ID": string;
  "Candidate Full Name": string;
  "radio-button": "software_engineering" | "software_testing";
  switch: boolean;
  "Need Job Type": "Hybrid" | "Remote";
  phone: string;
  "Candidate Mail ID": string;
  "Amount Received": moment.Moment | null;
  "Total Amount": number;
  "Initial Amount": number;
  "Mode of Payment": "cash" | "online";
  "At Time of Offer Payment Paid Date": moment.Moment | null;
  "Loan": "yes" | "no";
  "Loan Sanction Amount"?: number;
  "Balance Amount": number;
  "Did Offer Received": "yes" | "no";
  "Comments": string;
  "Date of Offer": moment.Moment | null;
  "Referred By": string;
  "Documents Submitted": "yes" | "no";
  onboarded?: "yes" | "no";
  [key: string]: any;

}