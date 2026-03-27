import { useEffect, useState, useRef } from "react";
import NewsCard from "./NewsCard";
import CategoryBar from "./CategoryBar";
import SearchBar from "./SearchBar";
import {
  getAllNews,
  getCategoryNews,
  searchNews,
} from "../../services/news.service";


function NewsList() {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");


  const observerRef = useRef(null);
  

  //////////////////////////////////////////////////////////
  // FETCH NEWS
  //////////////////////////////////////////////////////////

  useEffect(() => {
  fetchNews();
}, [category, debouncedSearch]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 500); // delay

  return () => clearTimeout(timer);
}, [searchQuery]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);


      let data;

     if (debouncedSearch.trim() !== "") {
  data = await searchNews(debouncedSearch);
} 
else if (category === "all") {
  data = await getAllNews();
} 
else {
  data = await getCategoryNews(category);
}

      setNews(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////////////
  // RESET PAGINATION
  //////////////////////////////////////////////////////////

  useEffect(() => {
    setVisibleCount(10);
  }, [category, debouncedSearch]);

  //////////////////////////////////////////////////////////
  // INFINITE SCROLL
  //////////////////////////////////////////////////////////

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < news.length
        ) {
          setVisibleCount((prev) => prev + 10);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [news, visibleCount]);

  //////////////////////////////////////////////////////////
  // SCROLL TO TOP BUTTON
  //////////////////////////////////////////////////////////

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //////////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////////

  return (
    <div>
      {/* 🔍 SEARCH BAR */}
      <SearchBar onSearch={setSearchQuery} />

      {/* 🔥 CATEGORY BAR */}
      <CategoryBar selected={category} setSelected={setCategory} />

      {/* 🔄 Loading */}
      {loading && (
        <p className="text-center mt-10">Loading news...</p>
      )}

      {/* ❌ Error */}
      {error && (
        <p className="text-center mt-10 text-red-500">{error}</p>
      )}

      {/* 📭 Empty */}
      {!loading && !error && news.length === 0 && (
        <p className="text-center mt-10">No news available</p>
      )}

      {/* 📰 News */}
      {!loading && !error && news.length > 0 && (
        <div>
          {news.slice(0, visibleCount).map((item) => (
            <NewsCard
              key={item.url || item.title}
              title={item.title}
              description={item.description}
              image={item.image}
              source={item.source?.name}
              time={
                item.publishedAt
                  ? new Date(item.publishedAt).toLocaleTimeString()
                  : "N/A"
              }
              url={item.url}
            />
          ))}

          {/* 🔥 Infinite Scroll Trigger */}
          <div ref={observerRef} className="h-10"></div>

          {/* 🔄 Loading more */}
          {visibleCount < news.length && (
            <p className="text-center mt-4 text-slate-400">
              Loading more news...
            </p>
          )}
        </div>
      )}

      {/* 🔝 SCROLL TO TOP BUTTON */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 
                     bg-gradient-to-r from-orange-500 via-rose-500 to-red-600
                     text-white p-3 rounded-full shadow-lg 
                     hover:scale-110 transition-all duration-300"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default NewsList;







