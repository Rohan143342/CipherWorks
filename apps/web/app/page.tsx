import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative font-sans selection:bg-indigo-500/30">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-screen w-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-screen animate-float" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-violet-600/30 blur-[120px] mix-blend-screen animate-float" style={{ animationDuration: '12s', animationDelay: '1s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative z-10 flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-float cursor-pointer hover:bg-white/10 transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-slate-300">BugForge v1.0 is live</span>
        </div>

        {/* Hero Typography */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center mb-6 leading-tight">
          Ship software <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 animate-gradient-x">
            without the chaos.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mb-12 font-light leading-relaxed">
          The premium workspace for modern engineering teams. Track issues, manage projects, and ship faster with military-grade security built right in.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link 
            href="/dashboard" 
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-full overflow-hidden transition-transform hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link 
            href="https://github.com" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/5 rounded-full border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105"
          >
            View Source Code
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full">
          {[
            {
              icon: ShieldCheck,
              title: "Enterprise Security",
              desc: "OWASP Top 10 hardened with strict rate limits, HTTP security headers, and encrypted sessions.",
              color: "text-emerald-400"
            },
            {
              icon: Zap,
              title: "Blazing Fast",
              desc: "Optimized queries, global cache-control, and a highly responsive Next.js frontend architecture.",
              color: "text-amber-400"
            },
            {
              icon: Users,
              title: "Seamless Collaboration",
              desc: "Real-time task tracking, deep project analytics, and intelligent workspace member management.",
              color: "text-sky-400"
            }
          ].map((feat, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md transition-all hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
