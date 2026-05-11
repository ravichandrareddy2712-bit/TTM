import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Users, Zap, ArrowRight, Layout, Shield } from "lucide-react";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Layout className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Team Task Manager</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
          <Link to="/signup" className="btn-primary py-2 px-5 text-sm">Join Free</Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-32">
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-8">
            <Zap size={14} />
            <span>Introducing v2.0 - Now with Real-time Sync</span>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight md:text-8xl lg:text-9xl">
            Manage Tasks <br />
            <span className="text-gradient">Like Magic.</span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 md:text-xl">
            Empower your team with a workspace that's as fast as you are. 
            Assign tasks, track progress, and celebrate wins together.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup" className="btn-primary w-full sm:w-auto text-lg px-8">
              Start Building <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary w-full sm:w-auto text-lg px-8">
              Watch Demo
            </Link>
          </div>
        </motion.section>

        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-40 grid gap-6 md:grid-cols-3"
        >
          {[
            { 
              title: "Smart Visibility", 
              desc: "Get a bird's-eye view of every project and task in real-time.",
              icon: <Layout className="text-blue-400" /> 
            },
            { 
              title: "Team Collaboration", 
              desc: "Add members, assign roles, and communicate effortlessly.",
              icon: <Users className="text-purple-400" /> 
            },
            { 
              title: "Enterprise Security", 
              desc: "Your data is encrypted and protected with industry-best standards.",
              icon: <Shield className="text-pink-400" /> 
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="glass-card group"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-blue-600/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 text-center">
        <p className="text-slate-500">© 2024 Team Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
