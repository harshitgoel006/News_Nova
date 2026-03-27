import NewsList from "../components/news/NewsList";

function Home() {
  return (
    // mt-32 ya mt-40 add kiya hai taaki Fixed Navbar ke niche space bane
    <div className="max-w-4xl mx-auto pt-32 pb-10 px-4">
      {/* Heading ko thoda "Royal" touch diya */}
      <div className="mb-10 text-center">
        <span className="text-rose-500 font-bold text-xs uppercase tracking-[0.3em]">Curated for you</span>
        <h1 className="text-4xl font-serif font-bold text-slate-900 mt-2">
          NewsNova <span className="italic text-slate-500 underline decoration-rose-200">Briefing</span>
        </h1>
      </div>
      
      <NewsList />
    </div>
  );
}

export default Home;