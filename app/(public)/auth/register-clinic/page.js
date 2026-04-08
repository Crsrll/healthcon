"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterClinic } from "@/hooks/useRegisterClinic";

export default function RegisterClinicPage() {
  const router = useRouter();

  const [clinicName, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ltoNumber, setLtoNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { registerClinic, loading, error } = useRegisterClinic();

  const handleRegister = async () => {
    const result = await registerClinic({
      clinicName,
      phone,
      email,
      ltoNumber,
      password,
      confirmPassword,
    });

    if (result.success) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-md">

        <h1 className="text-2xl font-bold mb-2">Register Clinic</h1>
        <p className="text-gray-400 mb-6 text-sm">
          Fill in your clinic details to get started
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">

          <input
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            type="text"
            placeholder="Clinic Name"
            className="border p-3 rounded"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Phone Number"
            className="border p-3 rounded"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="border p-3 rounded"
          />

          <input
            value={ltoNumber}
            onChange={(e) => setLtoNumber(e.target.value)}
            type="text"
            placeholder="DOH LTO Number"
            className="border p-3 rounded"
          />

          {/* Password */}
          <div className="flex gap-2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="border p-3 rounded flex-1"
            />
            <button onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex gap-2">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="border p-3 rounded flex-1"
            />
            <button onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-black text-white p-4 rounded font-bold mt-2"
          >
            {loading ? "Registering..." : "Register Clinic"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="cursor-pointer text-blue-600 font-bold"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}