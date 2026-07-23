import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getErrorMessage } from "../api/axios";
import { authApi } from "../api/services";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
      toast.success("Password reset link sent to your email!");
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
          <h2 className="mt-6 font-display text-2xl font-bold text-white">Reset Password</h2>
          <p className="mt-2 text-zinc-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center text-emerald-400">
            <p className="font-medium">Check your inbox</p>
            <p className="mt-2 text-sm text-emerald-500/80">
              We've sent a password reset link to {email}.
            </p>
            <Link to="/login" className="mt-6 inline-block w-full rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Send Reset Link
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Remember your password?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </motion.form>
    </div>
  );
}
