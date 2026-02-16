// import { motion } from "framer-motion";
// import { Mail, Lock } from "lucide-react";

// export default function Login() {
//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1c]">

//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: "url('/login img.png')",
//         }}
//       />

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

//       {/* Content Wrapper */}
//       <div className="relative z-10 w-full max-w-6xl px-6 grid md:grid-cols-2 items-center gap-12">

//         {/* Left Side Image (Desktop Only) */}
//         <motion.div
//           initial={{ x: -80, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="hidden md:flex justify-center"
//         >
//           <img
//             src="/login img.png"
//             alt="Cyber Security"
//             className="rounded-3xl shadow-2xl border border-white/10"
//           />
//         </motion.div>

//         {/* Login Card */}
//         <motion.div
//           initial={{ x: 80, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
//         >
//           <h2 className="text-3xl font-bold text-white mb-2">
//             Secure Login
//           </h2>

//           <p className="text-gray-400 text-sm mb-8">
//             Access your protected banking authentication dashboard.
//           </p>

//           <form className="space-y-6">

//             {/* Email Field */}
//             <div className="relative">
//               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
//               />
//             </div>

//             {/* Password Field */}
//             <div className="relative">
//               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
//               />
//             </div>

//             {/* Remember + Forgot */}
//             <div className="flex justify-between items-center text-sm text-gray-400">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   className="accent-blue-500"
//                 />
//                 Remember me
//               </label>

//               <a
//                 href="#"
//                 className="hover:text-blue-400 transition"
//               >
//                 Forgot password?
//               </a>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 transition text-white font-semibold shadow-lg"
//             >
//               Login Securely
//             </button>

//           </form>

//           {/* Bottom Text */}
//           <p className="text-gray-400 text-sm mt-6 text-center">
//             Don’t have an account?{" "}
//             <span className="text-blue-400 cursor-pointer hover:underline">
//               Request Access
//             </span>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1c]">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/login img.png')" }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Back Button */}
      <a
        href="/dashboard"
        className="absolute top-6 right-6 z-20 flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
      >
        Dashboard
      </a>
      <a
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
      >
        <ArrowLeft size={18} />
        Back
      </a>

      {/* Card Wrapper */}
      <div className="relative z-10 perspective w-full max-w-md px-6">
        <motion.div
          animate={{ rotateY: isRegister ? 180 : 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[520px] transform-style preserve-3d"
        >

          {/* LOGIN SIDE */}
          <div className="absolute w-full h-full backface-hidden bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold text-white mb-2">
              Secure Login
            </h2>

            <p className="text-gray-400 text-sm mb-8">
              Access your protected banking authentication dashboard.
            </p>

            <form className="space-y-6">

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg"
              >
                Login Securely
              </button>
            </form>

            <p className="text-gray-400 text-sm mt-6 text-center">
              Don’t have an account?{" "}
              <span
                onClick={() => setIsRegister(true)}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>
          </div>

          {/* REGISTER SIDE */}
          <div className="absolute w-full h-full backface-hidden bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl rotate-y-180">

            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>

            <p className="text-gray-400 text-sm mb-8">
              Register for secure digital banking access.
            </p>

            <form className="space-y-6">

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="password"
                  placeholder="Create password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg"
              >
                Register Securely
              </button>
            </form>

            <p className="text-gray-400 text-sm mt-6 text-center">
              Already have an account?{" "}
              <span
                onClick={() => setIsRegister(false)}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>

        </motion.div>
      </div>

      {/* Extra CSS for 3D flip */}
      <style>
        {`
        .perspective {
          perspective: 1200px;
        }
        .transform-style {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}
      </style>
    </div>
  );
}
