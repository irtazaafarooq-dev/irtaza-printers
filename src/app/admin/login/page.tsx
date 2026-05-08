"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Success! Send them to the dashboard and force a hard refresh
        window.location.href = "/admin/orders";
      } else {
        setError("Incorrect password. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6 fixed inset-0 z-[100]">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-neutral-200 text-center">
        
        <div className="w-16 h-16 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={28} />
        </div>
        
        <h1 className="text-3xl font-serif text-neutral-900 mb-2">Admin Portal</h1>
        <p className="text-neutral-500 mb-8">Enter your master password to access the dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 text-center tracking-widest font-mono"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-neutral-900 text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors disabled:opacity-70 flex justify-center items-center h-[52px]"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Unlock Dashboard"}
          </button>
        </form>

      </div>
    </div>
  );
}