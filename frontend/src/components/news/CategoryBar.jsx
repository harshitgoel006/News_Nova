import { motion } from "framer-motion";

function CategoryBar({ selected, setSelected }) {
  const categories = [
    "all", "technology", "business", "sports", "science", "health", "entertainment", "politics"
  ];

  const premiumGradient = "bg-gradient-to-r from-orange-500 via-rose-500 to-red-600";

  return (
    <div className="relative w-full mb-10 px-1">
      {/* Container with Masking for smooth fade effect */}
      <div 
        className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 90%, transparent)'
        }}
      >
        {categories.map((cat) => {
          const isSelected = selected === cat;
          
          return (
            <motion.button
              key={cat}
              onClick={() => {
                if (selected !== cat) {
                  setSelected(cat);
                }
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`
                relative px-6 py-2.5 rounded-[18px] text-[13px] font-bold tracking-wide 
                whitespace-nowrap transition-all duration-500 snap-center first:ml-4 last:mr-4
                ${isSelected 
                  ? "text-white shadow-[0_10px_20px_-5px_rgba(244,63,94,0.3)]" 
                  : "bg-white/70 text-slate-500 border border-slate-100 hover:border-rose-200 hover:text-rose-600 shadow-sm"
                }
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className={`absolute inset-0 ${premiumGradient} rounded-[18px] -z-10`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBar;