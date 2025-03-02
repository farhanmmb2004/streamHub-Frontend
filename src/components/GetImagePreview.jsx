// import React, { useState } from "react";
// import { Controller } from "react-hook-form";
// import { FaCamera } from "react-icons/fa";

// function GetImagePreview({
//     name,
//     control,
//     label,
//     defaultValue = "",
//     className,
//     cameraIcon = false,
//     cameraSize = 20,
//     image
// }) {
//     const [preview, setPreview] = useState(null);

//     const handlePreview = (e) => {
//         const files = e.target.files;
//         setPreview(URL.createObjectURL(files[0]));
//         return files;
//     };
//     return (
//         <>
//             <div className="w-full">
//                 <label
//                     htmlFor={name}
//                     className="cursor-pointer relative flex flex-col justify-center items-start"
//                 >
//                     {label && (
//                         <label className="inline-block mb-2 pl-1">
//                             {label}
//                         </label>
//                     )}
//                     {/* <div className="relative flex justify-center items-center"> */}
//                     <img
//                         src={preview || image}
//                         className={className}
//                     />
//                     {cameraIcon && (
//                         <FaCamera
//                             size={cameraSize}
//                             className="hover:text-purple-500 absolute inline-flex justify-center items-center w-full"
//                         />
//                     )}
//                     {/* </div> */}
//                     <Controller
//                         name={name}
//                         control={control}
//                         defaultValue={defaultValue || ""}
//                         render={({ field: { onChange } }) => (
//                             <input
//                                 id={name}
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={(e) => {
//                                     onChange(handlePreview(e));
//                                 }}
//                             />
//                         )}
//                         rules={{ required: `${name} is required` }}
//                     />
//                 </label>
//             </div>
//         </>
//     );
// }

// export default GetImagePreview;
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { FaCamera } from "react-icons/fa";

function GetImagePreview({
  name,
  control,
  label,
  defaultValue = "",
  className,
  cameraIcon = false,
  cameraSize = 20,
  image,
  required = false
}) {
  const [preview, setPreview] = useState(null);
  
  const handlePreview = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPreview(URL.createObjectURL(files[0]));
      return files[0]; // Return the file object instead of files array
    }
    return null;
  };

  return (
    <>
      <div className="w-full">
        <label
          htmlFor={name}
          className="cursor-pointer relative flex flex-col justify-center items-start"
        >
          {label && (
            <label className="inline-block mb-2 pl-1">
              {label}
            </label>
          )}
          <img
            src={preview || image || "https://via.placeholder.com/150"}
            alt={`${name} preview`}
            className={className}
          />
          {cameraIcon && (
            <FaCamera
              size={cameraSize}
              className="hover:text-purple-500 absolute inline-flex justify-center items-center w-full"
            />
          )}
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ""}
            render={({ field: { onChange } }) => (
              <input
                id={name}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = handlePreview(e);
                  onChange(file); // Pass the actual file object
                }}
              />
            )}
            rules={{ required: required ? `${name} is required` : false }}
          />
        </label>
      </div>
    </>
  );
}

export default GetImagePreview;