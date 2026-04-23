import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
// import { useAuth } from "@/context/useAuth";
import type { LoginData } from "../types/authTypes";
import { getDashboardPathByRole } from "../utils/getDashboardPathByRole";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [form, setForm] = useState<LoginData>({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await login(form);
      
//       const redirectPath = getDashboardPathByRole(response.data.user.role);
//       navigate("/");
//       // navigate(redirectPath, { replace: true });
//     } catch (err: unknown) {
//       console.log(err);
      
//       if (axios.isAxiosError<{ message?: string }>(err)) {
//         setError(err.response?.data?.message || "Login failed.");
//       } else {
//         setError("An unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#10172a] px-4">
//       <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
//         <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/60 shadow-2xl backdrop-blur md:grid-cols-2">
//           <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700/20 via-slate-900 to-slate-950 p-10 md:flex">
//             <div>
//               <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
//                 Match Up
//               </p>
//               <h1 className="max-w-sm text-4xl font-bold leading-tight text-white">
//                 Book your football terrain with a clean and simple experience.
//               </h1>
//             </div>
//           </div>

//           <div className="flex items-center justify-center p-6 sm:p-10">
//             <div className="w-full max-w-md">
//               <div className="mb-8 text-center md:text-left">
//                 <h2 className="text-3xl font-bold text-white">Welcome back</h2>
//                 <p className="mt-2 text-sm text-slate-400">
//                   Sign in to continue to your account.
//                 </p>
//               </div>

//               <form className="space-y-5" onSubmit={handleSubmit}>
//                 <Input
//                   label="Email"
//                   name="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={form.email}
//                   onChange={handleChange}
//                 />

//                 <Input
//                   label="Password"
//                   name="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={form.password}
//                   onChange={handleChange}
//                 />

//                 {error && <p className="text-sm text-red-400">{error}</p>}

//                 <Button type="submit" disabled={loading}>
//                   {loading ? "Loading..." : "Login"}
//                 </Button>
//               </form>

//               <p className="mt-6 text-center text-sm text-slate-400 md:text-left">
//                 Don&apos;t have an account?{" "}
//                 <Link
//                   to="/register"
//                   className="font-semibold text-blue-400 transition hover:text-blue-300"
//                 >
//                   Register
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { loginRequest } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(form);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      const redirectPath = getDashboardPathByRole(data.user.role);
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      console.log("LOGIN ERROR:", err);

      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message || "Login failed.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#10172a] px-4">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/60 shadow-2xl backdrop-blur md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700/20 via-slate-900 to-slate-950 p-10 md:flex">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                Match Up
              </p>
              <h1 className="max-w-sm text-4xl font-bold leading-tight text-white">
                Book your football terrain with a clean and simple experience.
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Sign in to continue to your account.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />

                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Login"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400 md:text-left">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}