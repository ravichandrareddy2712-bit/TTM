import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Layout, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created! Welcome aboard.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 p-4">
      {/* Animated Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Layout className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-slate-400">Join thousands of teams managing tasks efficiently.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 shadow-2xl">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  className="input-field pl-10" 
                  placeholder="John Doe" 
                  required 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  className="input-field pl-10" 
                  placeholder="name@company.com" 
                  type="email" 
                  required 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  className="input-field pl-10" 
                  placeholder="••••••••" 
                  type="password" 
                  required 
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                />
              </div>
            </div>

            <button disabled={loading} className="btn-primary w-full mt-6 py-4">
              {loading ? "Creating Account..." : "Sign Up"} <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link className="font-semibold text-blue-400 hover:text-blue-300 transition-colors" to="/login">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;
