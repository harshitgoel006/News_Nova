import { motion } from "framer-motion";

function About() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FDFDFF] py-20 px-6"
    >
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight mb-8">
          The Future of <span className="text-rose-600 italic">News.</span>
        </h1>

        <p className="text-xl text-slate-600 font-serif leading-relaxed italic border-l-4 border-rose-500 pl-6 mb-10">
          NewsNova is a modern news platform built to deliver clarity, speed, and trust in a world full of information overload.
        </p>

        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">

          <p>
            In today’s fast-paced digital landscape, news is everywhere — but not all of it matters. 
            <strong> NewsNova</strong> cuts through the noise by curating only the most relevant, 
            high-quality stories from trusted global sources.
          </p>

          <p>
            Our goal is simple: <strong>make news smarter and easier to consume.</strong> 
            With a clean, distraction-free interface and intelligent aggregation, 
            we ensure you stay informed without feeling overwhelmed.
          </p>

          <p>
            Built using modern technologies like the MERN stack, NewsNova focuses on performance, 
            reliability, and a premium user experience. Every feature — from real-time updates to 
            personalized feeds — is designed to keep you one step ahead.
          </p>

          <p>
            This isn’t just another news website. It’s a <strong>new way to experience news.</strong>
          </p>

        </div>

      </div>
    </motion.div>
  );
}

export default About;