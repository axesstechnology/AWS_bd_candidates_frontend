import React, { useState } from "react";
import ImageSlider from "../slider/LoginImageSlider";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaTwitter, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo/logo.png';
import { useForm, SubmitHandler } from "react-hook-form";
import { schema } from '../utils/formValidation';
import { yupResolver } from "@hookform/resolvers/yup";
import MetaData from "../utils/MetaData";
import axios from "axios";
import Swal from "sweetalert2";

// API URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
const REGISTER_ENDPOINT = `${API_BASE_URL}/api/v1/register`;

// Define TypeScript interface for form data
interface RegisterFormData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange' // Enable validation as you type
  });
  const navigate = useNavigate(); // Add useNavigate hook

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await axios.post(REGISTER_ENDPOINT, data);
      console.log(response.data); // Handle success response
      // Show SweetAlert on successful registration
      Swal.fire({
        title: 'Success!',
        text: response.data.message, // Display the message from the response
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 text-white rounded-full py-2 px-4'
        },
      }).then(() => {
        navigate('/login'); // Navigate to login page after acknowledging the alert
      });
    } catch (error) {
      console.error("Failed to register:", error);
      // Show error alert if registration fails
      Swal.fire({
        title: 'Error!',
        text: 'Failed to register. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-red-600 text-white rounded-full py-2 px-4'
        },
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <MetaData title={'Register'} />
      <div className="min-h-screen w-full flex-wrap bg-gray-100">
        <div className="bg-white flex flex-col md:flex-row w-full h-screen">
          <div className="hidden md:flex md:w-1/2 justify-center items-center">
            <ImageSlider />
          </div>
          <div className="border-l border-gray-300 hidden md:flex sm:mt-20" style={{ flex: '0 0 1px', height: '80%' }}></div>
          <div className="w-full md:w-1/2 p-6 sm:p-32 flex justify-center items-center flex-col ">
            <div className="flex mb-7">
              <img src={logo} alt="Logo" className="w-60" />
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex mb-2 w-full space-x-2">
                <div className="w-full">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-500 text-left">First Name</label>
                  <input {...register("name")} type="text" id="name" className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500" />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div className="w-full">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-500 text-left">Last Name</label>
                  <input {...register("lastName")} type="text" id="lastName" className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500" />
                  {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="mb-2 w-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 text-left">Email Address</label>
                <input {...register("email")} type="email" id="email" className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              <div className="flex mb-2 w-full space-x-2">
                <div className="w-full relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-500 text-left">Password</label>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-2">
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                  {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <div className="w-full relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-500 text-left">Confirm Password</label>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-2">
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                  {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="mb-2 w-full">
                <label htmlFor="role" className="block text-sm font-medium text-gray-500 text-left">Role</label>
                <select {...register("role")} id="role" className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="admin">Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
                {errors.role && <p className="text-red-500">{errors.role.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="flex items-center">
                  <input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div className="mt-2 sm:mt-0">
                  <Link className="text-sm text-blue-600 hover:underline" to={""}>Forgot password?</Link>
                </div>
              </div>

              {/* Conditional button disable/enable based on form state */}
              <div className="text-center">
                <button type="submit" disabled={!isDirty || !isValid} className={`w-36 text-white font-bold py-2 sm:py-3 rounded-full transition-colors shadow-xl 
                ${!isDirty || !isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Register
                </button>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mt-5">
                <p>Already have an account? <Link className="text-blue-600 hover:underline" to="/login">Login</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
