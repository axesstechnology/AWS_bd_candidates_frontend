
// // src/pages/Login.tsximport React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../store';
// import ImageSlider from '../slider/LoginImageSlider';
// import { Link, useNavigate } from "react-router-dom";
// import { FaGoogle, FaFacebook, FaTwitter, FaGithub } from "react-icons/fa"; 
// import logo from "../assets/logo/logo.png";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { loginSchema } from '../utils/formValidation';
// import MetaData from "../utils/MetaData";
// import authService from '../services/authServices';
// import Swal from "sweetalert2";
// import { AppDispatch } from '../store';
// import { login } from '../actions/authAction';
// import { useState } from 'react';

// interface LoginFormInputs {
//   email: string;
//   password: string;
// }

// const Login: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const dispatch: AppDispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, error } = useSelector((state: RootState) => state.auth);

//   const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm<LoginFormInputs>({
//     resolver: yupResolver(loginSchema),
//     mode: 'onChange',
//   });

//   const onSubmit = async (data: LoginFormInputs) => {
//     setLoading(true);
//     try {
//       const result = await dispatch(login({ email: data.email, password: data.password })).unwrap();
//       Swal.fire({
//         icon: 'success',
//         title: 'Login successful',
//         text: 'You have been logged in successfully',
//       });
//       navigate('/');
//     } catch (error: any) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Login failed',
//         text: error.message || 'An error occurred',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <>
//       <MetaData title={'Login'}/>
//       <div className="w-full h-screen bg-gray-100">
//         <div className="bg-white rounded-lg flex flex-col md:flex-row w-full h-screen">
//           <div className="hidden md:flex md:w-1/2 justify-center items-center">
//             <ImageSlider />
//           </div>

//           <div className="border-l border-gray-300 hidden md:flex mt-20" style={{ flex: "0 0 1px", height: "80%" }}></div>

//           <div className="w-full md:w-1/2 p-6 sm:p-32 flex justify-center items-center flex-col">
//             <div className="flex mb-10">
//               <img src={logo} alt="Logo" className="w-60" />
//             </div>
//             <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
//               <div className="mb-2 w-full">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-500 text-left">
//                   Email Address
//                 </label>
//                 <input
//                   {...register("email")}
//                   type="email"
//                   id="email"
//                   className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {errors.email && (
//                   <p className="text-red-500">{errors.email.message}</p>
//                 )}
//               </div>

//               <div className="mb-2 w-full">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-500 text-left">
//                   Password
//                 </label>
//                 <input
//                   {...register("password")}
//                   type="password"
//                   id="password"
//                   className="block w-full p-2 sm:p-3 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {errors.password && (
//                   <p className="text-red-500">{errors.password.message}</p>
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <input
//                     id="remember"
//                     name="remember"
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
//                     Remember me
//                   </label>
//                 </div>
//                 <div className="mt-2 sm:mt-0">
//                   <Link to={'/forget'} className="text-sm text-blue-600 hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>
//               </div>

//               <div className="text-center">
//                 <button
//                   type="submit"
//                   disabled={!isDirty || !isValid || loading}
//                   className={`w-36 text-white font-bold py-2 sm:py-3 rounded-full transition-colors shadow-lg ${
//                     !isDirty || !isValid || loading
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-blue-600 hover:bg-blue-700"
//                   }`}
//                 >
//                   {loading ? "Signing in..." : "Sign in"}
//                 </button>
//               </div>

//               <div className="mt-10 text-center">
//                 <p className="text-sm text-gray-600">
//                   Don't have an account?{" "}
//                   <Link to={"/register"} className="text-blue-600 hover:underline font-bold">
//                     Sign up
//                   </Link>
//                 </p>
//               </div>

//               <div className="divider py-[5%]">OR</div>

//               <div className="flex justify-center sm:space-x-10 space-x-4 mt-4">
//                 <Link to="#" className="text-red-600 hover:text-red-700">
//                   <FaGoogle size={30} />
//                 </Link>
//                 <Link to="#" className="text-blue-600 hover:text-blue-700">
//                   <FaFacebook size={30} />
//                 </Link>
//                 <Link to="#" className="text-blue-400 hover:text-blue-500">
//                   <FaTwitter size={30} />
//                 </Link>
//                 <Link to="#" className="text-gray-800 hover:text-gray-700">
//                   <FaGithub size={30} />
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import ImageSlider from '../slider/LoginImageSlider';
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaTwitter, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa"; 
import logo from "../assets/logo/logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from '../utils/formValidation';
import MetaData from "../utils/MetaData";
import authService from '../services/authServices';
import Swal from "sweetalert2";
import { AppDispatch } from '../store';
import { login } from '../actions/authAction';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const result = await dispatch(login({ email: data.email, password: data.password })).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Login successful',
        text: 'You have been logged in successfully',
      });
      navigate('/');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: error.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <MetaData title={'Login'}/>
      <div className="w-full h-screen bg-gray-100">
        <div className="bg-white rounded-lg flex flex-col md:flex-row w-full h-screen">
          <div className="hidden md:flex md:w-1/2 justify-center items-center">
            <ImageSlider />
          </div>

          <div className="border-l border-gray-300 hidden md:flex mt-20" style={{ flex: "0 0 1px", height: "80%" }}></div>

          <div className="w-full md:w-1/2 p-6 sm:p-32 flex justify-center items-center flex-col">
            <div className="flex mb-10">
              <img src={logo} alt="Logo" className="w-60" />
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-2 w-full">
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 text-left">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="block w-full p-2 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-2 w-full relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-500 text-left">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="block w-full p-2 sm:p-3 border-b border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="mt-2 sm:mt-0">
                  <Link to={'/forget'} className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={!isDirty || !isValid || loading}
                  className={`w-36 text-white font-bold py-2 sm:py-3 rounded-full transition-colors shadow-lg ${
                    !isDirty || !isValid || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to={"/register"} className="text-blue-600 hover:underline font-bold">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="divider py-[5%]">OR</div>

              <div className="flex justify-center sm:space-x-10 space-x-4 mt-4">
                <Link to="#" className="text-red-600 hover:text-red-700">
                  <FaGoogle size={30} />
                </Link>
                <Link to="#" className="text-blue-600 hover:text-blue-700">
                  <FaFacebook size={30} />
                </Link>
                <Link to="#" className="text-blue-400 hover:text-blue-500">
                  <FaTwitter size={30} />
                </Link>
                <Link to="#" className="text-gray-800 hover:text-gray-700">
                  <FaGithub size={30} />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;