import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 500 
    },
    
    description: { 
      type: String, 
      trim: true, 
      maxlength: 2000 
    },
    
    url: { 
      type: String, 
      required: true, 
      trim: true 
    },
    
    uniqueKey: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    
    image: { 
      type: String, 
      default: null 
    },
    
    source: { 
      type: String, 
      trim: true, 
      index: true 
    },
    
    publishedAt: { 
      type: Date, 
      required: true, 
      index: true 
    },
    
    category: {
      type: String,
      enum: ["technology","business","sports","science","health","entertainment","politics","general"],
      default: "general", 
      index: true,
    },
    
    country: { 
      type: String, 
      default: "in", 
      index: true 
    },
    
    views: { 
      type: Number, 
      default: 0 
    },
    
    isTrending: { 
      type: Boolean, 
      default: false, 
      index: true 
    },

}, { timestamps: true });

newsSchema.index(
  { 
    country: 1, 
    category: 1, 
    publishedAt: -1 
  }
);

export const News = mongoose.model("News", newsSchema);
