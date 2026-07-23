import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getErrorMessage } from "../api/axios";
import { authApi } from "../api/services";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      toast.success("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 mesh-bg">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="font-display text-2xl font-bold gradient-text inline-block">
            CryptoVault
          </Link>
          <h2 className="mt-6 font-display text-2xl font-bold text-white">Create New Password</h2>
          <p className="mt-2 text-zinc-400">
            Please enter your new password below.
          </p>
        </div>

        <div className="space-y-6">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
            minLength={6}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Reset Password
          </Button>
          <p className="text-center text-sm text-zinc-500">
            <Link to="/login" className="text-cyan-400 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}
