# ReZone Analytics 🌍

**Advanced GeoAI & Transformer-Powered Recommendation System**

A cutting-edge analytics platform that combines geospatial intelligence, AI-powered recommendations, and comprehensive business analytics to provide actionable insights for location-based decision making.

![ReZone Analytics](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue)

## 🚀 Live Demo

**[View Live Application](https://rezone.netlify.app)**

## ✨ Features

### 🌍 GeoAI Analytics
- **6 Major Global Regions**: NYC, San Francisco, London, Tokyo, Sydney, Toronto
- **Real Demographics**: Population, income, age distribution, regional interests
- **Interactive Region Selection**: Choose specific locations for detailed analysis
- **Geo-Clustering**: Advanced location-based user clustering algorithms
- **Regional Trends**: Category-specific trend analysis with seasonality patterns
- **Mobility Patterns**: Local, commuter, traveler, and nomad user classification

### 🤖 AI-Powered Recommendations
- **Transformer Models**: Hugging Face integration for semantic understanding
- **Behavior Analysis**: Deep learning patterns for user preference prediction
- **Contextual Relevance**: Location and time-aware recommendations
- **Novelty Scoring**: Balance between familiar and discovery-oriented suggestions
- **Confidence Metrics**: AI confidence levels for recommendation quality

### 📊 Advanced Analytics
- **Demand Forecasting**: ARIMA-based time series prediction
- **Inventory Management**: Stock optimization with reorder point analysis
- **Product Analysis**: Category performance and rating distribution
- **Collaborative Filtering**: Hybrid user-based and item-based recommendations
- **Real-time Dashboards**: Interactive charts and visualizations

### 🎯 Business Intelligence
- **Regional Spending Patterns**: Location-specific purchasing behavior
- **Peak Hours Analysis**: Time-based activity optimization
- **Category Trends**: Product category performance by region
- **Demographic Insights**: Age, income, and interest correlations
- **Growth Metrics**: Regional expansion opportunities

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons

### AI & Machine Learning
- **Hugging Face Transformers** - Semantic embeddings
- **TensorFlow.js** - Client-side ML
- **ML-Matrix** - Mathematical computations
- **Simple Statistics** - Statistical analysis

### Geospatial
- **Leaflet** - Interactive maps
- **React Leaflet** - React map components
- **D3-Geo** - Geographic projections
- **Turf.js** - Spatial analysis

### Data Processing
- **ARIMA Forecasting** - Time series prediction
- **Collaborative Filtering** - Recommendation algorithms
- **K-means Clustering** - User segmentation
- **Cosine Similarity** - Semantic matching

## 🏗️ Architecture

```
src/
├── components/           # React components
│   ├── GeoAI/           # Geospatial analytics
│   ├── AI/              # AI recommendations
│   ├── Analytics/       # Business intelligence
│   └── Charts/          # Data visualizations
├── utils/               # Core algorithms
│   ├── geoAI.ts         # Geospatial engine
│   ├── transformerRecommender.ts  # AI models
│   ├── arimaForecasting.ts        # Time series
│   └── collaborativeFiltering.ts  # Recommendations
├── data/                # Sample datasets
│   ├── geoSampleData.ts # Regional data
│   └── sampleData.ts    # User/item data
└── types/               # TypeScript definitions
    ├── geo.ts           # Geospatial types
    ├── ai.ts            # AI model types
    └── index.ts         # Core types
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/1violett/sb1-1am4lujt.git
   cd sb1-1am4lujt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### 1. GeoAI Analytics
- Select a geographic region from the dropdown
- Generate sample data for realistic analysis
- Explore clusters, trends, and demographics
- View regional insights and spending patterns

### 2. AI Recommendations
- Choose a user from the selector
- View transformer-based recommendations
- Analyze behavior patterns and confidence scores
- Explore AI-generated insights and reasoning

### 3. Demand Forecasting
- Upload CSV data or use sample datasets
- Configure ARIMA parameters (p, d, q)
- Run forecasting models
- View predictions with accuracy metrics

### 4. Business Analytics
- Monitor inventory levels and reorder points
- Analyze product performance by category
- Track user ratings and reviews
- Identify trending products and categories

## 🌟 Key Capabilities

### Geospatial Intelligence
- **Location-based Clustering**: Automatically group users by geographic proximity
- **Regional Trend Analysis**: Identify category preferences by location
- **Mobility Pattern Recognition**: Classify user movement behaviors
- **Demographic Correlation**: Link location data with user characteristics

### AI-Powered Insights
- **Semantic Understanding**: Use transformer models for deep content analysis
- **Behavioral Prediction**: Forecast user actions and preferences
- **Contextual Recommendations**: Consider time, location, and user state
- **Confidence Scoring**: Provide reliability metrics for AI decisions

### Business Optimization
- **Demand Prediction**: Forecast product demand with statistical models
- **Inventory Optimization**: Minimize stockouts and overstock situations
- **Market Segmentation**: Identify distinct user groups and preferences
- **Performance Tracking**: Monitor KPIs and business metrics

## 📊 Sample Data

The application includes comprehensive sample datasets:

### Geographic Regions
- **Manhattan, NYC**: High-income tech professionals
- **San Francisco**: Tech-savvy sustainability enthusiasts  
- **Central London**: Culture and finance focused users
- **Tokyo Shibuya**: Gaming and technology enthusiasts
- **Sydney CBD**: Outdoor and fitness oriented users
- **Toronto Downtown**: Multicultural diverse interests

### User Profiles
- Realistic demographic distributions
- Location-specific preferences
- Behavioral patterns and mobility data
- Purchase history and ratings

### Product Catalog
- Electronics, fashion, books, home goods
- Feature vectors for similarity analysis
- Price ranges and category classifications
- User ratings and review data

## 🔧 Configuration

### Environment Variables
```env
VITE_HUGGINGFACE_API_KEY=your_api_key_here
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### ARIMA Parameters
- **p**: Autoregressive order (1-5)
- **d**: Differencing order (0-3)  
- **q**: Moving average order (1-5)

### AI Model Settings
- **Model**: sentence-transformers/all-MiniLM-L6-v2
- **Embedding Size**: 384 dimensions
- **Similarity Threshold**: 0.7
- **Confidence Threshold**: 0.6

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for transformer models
- **OpenStreetMap** for geographic data
- **Recharts** for visualization components
- **Tailwind CSS** for styling framework

## 📞 Support

For questions, issues, or feature requests:
- Create an [Issue](https://github.com/1violett/sb1-1am4lujt/issues)
- Email: support@rezone-analytics.com
- Documentation: [Wiki](https://github.com/1violett/sb1-1am4lujt/wiki)

---

**Built with ❤️ for the future of location intelligence**

![Footer](https://img.shields.io/badge/Made%20with-React%20%7C%20TypeScript%20%7C%20AI-blue)