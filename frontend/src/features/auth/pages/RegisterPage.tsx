import { Link } from "react-router-dom";
import { useState } from "react";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import Select from "@/shared/components/ui/Select";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-[#10172a] px-4">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/60 shadow-2xl backdrop-blur md:grid-cols-2">
          <div className="hidden flex-col justify-between
        
        from-blue-700/20 via-slate-900 to-slate-950 p-10 md:flex">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                Match Up
              </p>
              <h1 className="max-w-sm text-4xl font-bold leading-tight text-white">
                Create your account and choose how you want to use the platform.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                Register as a player to reserve terrains, or as an owner to
                manage your terrains later.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">
                  Create account
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Fill in the form to get started.
                </p>
              </div>

              <form className="space-y-5">
                <Input
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                />
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
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />

                <Select
                  label="Role"
                  options={[
                    { label: "Player", value: "player" },
                    { label: "Owner", value: "owner" },
                  ]}
                />

                <Button type="submit">Create account</Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400 md:text-left">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
