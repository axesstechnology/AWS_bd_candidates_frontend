import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z]+$/, 'First name should only contain letters')
    .required('First name is required'),
  lastName: yup
    .string()
    .matches(/^[A-Za-z]+$/, 'Last name should only contain letters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Enter your email'),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters')
    .max(15, 'Password can be up to 15 characters only'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    // .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
    role: yup.string().required('Please select a role'),
  // captcha: yup.string().required('Enter the captcha'),
});


export  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  export const mobileNoSchema = yup.object().shape({
    mobileno: yup
      .string()
      .matches(/(0|91)?[6-9][0-9]{9}/, "Please enter a valid mobile number")
      .required("Mobile no is required"),
  });



const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[^\d]*$/, "Name cannot contain numbers")
    .required("Name is required"),
  designation: yup
    .string()
    .matches(/^[^\d]*$/, "Designation cannot contain numbers")
    .required("Designation is required"),
  contact: yup
    .string()
    .matches(/^[0-9]{10}$/, "Contact must be a 10-digit number")
    .required("Contact is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  blood: yup.string().required("Blood group is required"),
  joiningDate: yup.date().required("Joining date is required"),
  fatherName: yup
    .string()
    .matches(/^[^\d]*$/, "Father's name cannot contain numbers")
    .required("Father's name is required"),
    motherName: yup
    .string()
    .matches(/^[^\d]*$/, "Mother's name cannot contain numbers")
    .required("Mother's name is required"),
  address: yup.string().required("Address is required"),
  state: yup
    .string()
    .matches(/^[^\d]*$/, "State cannot contain numbers")
    .required("State is required"),
  profileImage: yup
    .mixed()
    .test("fileType", "Unsupported File Format", (value: any): value is { type: string } => {
      if (!value) return true; // Allow empty (for cases where the user might not upload a new image)
      return validImageTypes.includes(value.type);
    })
    .test("fileSize", "File Size is too large (max 2MB)", (value: any): value is { type: string } => {
      if (!value) return true; // Allow empty
      return value.size <= 2000000; // 2MB
    }),
  coverImage: yup
    .mixed()
    .test("fileType", "Unsupported File Format", (value: any): value is { type: string } => {
      if (!value) return true; // Allow empty
      return validImageTypes.includes(value.type);
    })
    .test("fileSize", "File Size is too large (max 2MB)", (value: any): value is { type: string } => {
      if (!value) return true; // Allow empty
      return value.size <= 2000000; // 2MB
    }),
});