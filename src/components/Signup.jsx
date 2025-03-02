import React, { useState } from "react";
import { Logo, Button, Input } from "./index";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createAccount, userLogin } from "../store/Slices/authSlice.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginSkeleton from "../skeleton/loginSkeleton.jsx";

function SignUp() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
    }
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);
  
  // Handle file changes
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };
  
  const submit = async (data) => {

    try {
      // Create FormData object for file uploads
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("fullname", data.fullName);
      formData.append("password", data.password);
      
      if (avatarFile) {
        formData.append("avtar", avatarFile);
      }
      
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      const response = await dispatch(createAccount(formData));
      console.log("Create Account Response:", response);

      if (response?.payload?.success) {
        const username = data?.username;
        const password = data?.password;
        
        const loginResult = await dispatch(userLogin({ username, password }));
        console.log("Login Result:", loginResult);

        if (loginResult?.type === "login/fulfilled") {
          navigate("/terms&conditions");
        } else {
          navigate("/login");
        }
      } else {
        console.error("Account creation failed:", response?.payload?.message);
        setError("root.serverError", { 
          type: "server", 
          message: response?.payload?.message || "Account creation failed" 
        });
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("root.serverError", { 
        type: "server", 
        message: "An error occurred during signup. Please try again." 
      });
    }
  };

  if (loading) {
    return <LoginSkeleton />;
  }

  return (
    <>
      <div className="w-full h-screen text-white p-3 flex justify-center items-start sm:mt-8">
        <div className="flex flex-col space-y-2 justify-center items-center border border-slate-600 p-3">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <form
            onSubmit={handleSubmit(submit)}
            className="space-y-4 p-2 text-sm sm:w-96 w-full"
          >
            <div className="w-full relative h-28 bg-[#222222]">
              {/* Cover Image */}
              <div className="w-full h-full">
                {coverPreview ? (
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-700 flex items-center justify-center">
                    <span>Cover Image (Optional)</span>
                  </div>
                )}
                
                <label className="absolute right-2 bottom-2 bg-gray-800 p-1 rounded-full cursor-pointer hover:bg-purple-700">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleCoverChange} 
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </label>
              </div>
              
              {/* Avatar Image */}
              <div className="absolute left-2 bottom-2 h-20 w-20 rounded-full overflow-hidden border-2 border-white">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs text-center">Avatar*</span>
                  </div>
                )}
                
                <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer hover:bg-opacity-60">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                    required
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </label>
              </div>
            </div>
            
            {!avatarFile && (
              <div className="text-red-500 text-xs">Avatar image is required</div>
            )}
            
            <Input
              label="Username: "
              type="text"
              placeholder="Enter username"
              {...register("username", {
                required: "Username is required",
              })}
              className="h-8"
            />
            {errors.username && (
              <span className="text-red-500">{errors.username.message}</span>
            )}
            
            <Input
              label="Email: "
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email format"
                }
              })}
              className="h-8"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
            
            <Input
              label="Fullname: "
              type="text"
              placeholder="Enter fullname"
              {...register("fullName", {
                required: "Full name is required",
              })}
              className="h-8"
            />
            {errors.fullName && (
              <span className="text-red-500">{errors.fullName.message}</span>
            )}
            
            <Input
              label="Password: "
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className="h-8"
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}

            {errors.root?.serverError && (
              <div className="text-red-500 text-center">{errors.root.serverError.message}</div>
            )}

            <Button
              type="submit"
              bgColor="bg-purple-500"
              className="w-full sm:py-3 py-2 hover:bg-purple-700 text-lg"
              disabled={!avatarFile}
            >
              Signup
            </Button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-purple-600 cursor-pointer hover:opacity-70"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;