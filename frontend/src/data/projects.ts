import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'hotel-kiosk',
    title: 'Hotel Self-Service Kiosk',
    shortDescription:
      'Self-service kiosk solution for a US-based hospitality client to streamline guest operations.',
    description:
      'Developing a self-service kiosk solution for a US-based hospitality client to streamline guest operations and improve customer experience. Built with React Native, TypeScript, and Expo for tablet-first kiosk environments.',
    category: 'web',
    tech: ['React Native', 'TypeScript', 'Expo'],
    features: [
      'Check-in',
      'Check-out',
      'Visitor Management',
      'Room Extension',
      'Guest Support',
    ],
    problem:
      'Hotels face long front-desk queues, manual check-in processes, and fragmented guest services that reduce operational efficiency and guest satisfaction.',
    solution:
      'A tablet-first self-service kiosk that digitizes core hospitality workflows — enabling guests to check in, check out, manage visitors, extend stays, and access support without front-desk dependency.',
    architecture:
      'Modular React Native architecture with reusable TypeScript components, Expo for cross-platform deployment, and a scalable state management layer optimized for kiosk touch interfaces.',
    challenges: [
      'Designing intuitive touch-first UX for diverse guest demographics',
      'Building offline-capable flows for unreliable network environments',
      'Ensuring HIPAA-adjacent data handling for guest information',
      'Optimizing performance on dedicated kiosk hardware',
    ],
    implementation: [
      'Implemented digital workflows for check-in, check-out, visitor management, room extensions, and guest support',
      'Designed tablet-first responsive interfaces optimized for kiosk environments',
      'Built scalable frontend architecture using reusable React Native components and TypeScript',
      'Integrated hospitality automation APIs for real-time room and guest data',
    ],
    results: [
      'Streamlined guest operations for US-based hospitality client',
      'Reduced front-desk queue times through self-service automation',
      'Delivered production-ready kiosk interface with enterprise-grade UX',
    ],
    featured: true,
  },
  {
    id: '2',
    slug: 'ecoshield-ai',
    title: 'EcoShieldAI',
    shortDescription:
      'AI-powered environmental monitoring platform for ecosystem protection and ESG fraud detection.',
    description:
      'An AI-powered full-stack application for environmental monitoring, ecosystem protection, and ESG fraud detection. Leverages machine learning to analyze sustainability reports, detect environmental threats, and visualize risk on an interactive dashboard.',
    category: 'ai',
    tech: ['Python', 'FastAPI', 'React', 'scikit-learn', 'Cython'],
    features: [
      'ESG Validation',
      'PDF Processing',
      'Fraud Detection',
      'Risk Dashboard',
      'AI-Driven Analysis',
      'REST API',
    ],
    problem:
      'Organizations increasingly publish sustainability reports with inflated or misleading ESG claims (greenwashing), while environmental threats require real-time detection and analysis that manual review cannot scale to handle.',
    solution:
      'An AI-powered platform with Python ML backend and interactive dashboard that ingests environmental data and sustainability PDFs, runs inference using trained models, and returns predictions and risk assessments for visualization.',
    architecture:
      'Full-stack architecture with React frontend, Python/FastAPI backend, C/Cython extensions for high-performance ML inference, REST API connecting models to the dashboard, and modular backend/frontend separation.',
    challenges: [
      'Extracting structured data from heterogeneous PDF report formats',
      'Building accurate fraud-risk scoring with limited labeled training data',
      'Optimizing compute-intensive ML inference with C/Cython extensions',
      'Designing intuitive risk visualization for non-technical stakeholders',
    ],
    implementation: [
      'Built PDF extraction pipelines and ESG metric validation workflows',
      'Developed fraud-risk scoring mechanisms using AI-assisted analysis',
      'Created React + FastAPI dashboard for real-time ESG assessment',
      'Implemented REST API endpoints for data ingestion, analysis, and results retrieval',
      'Accelerated ML inference with C and Cython extensions',
    ],
    results: [
      'Automated ESG report analysis reducing manual review time',
      'Identified greenwashing indicators with AI-assisted risk scoring',
      'Delivered interactive dashboard for sustainability risk visualization',
      'Co-authored open-source project on GitHub',
    ],
    github: 'https://github.com/PriyanshiG-HUB/Ecoshield-Ai',
    linkedin:
      'https://www.linkedin.com/posts/priyanshi-gajiwala-1b00b7323_esg-intelligence-fraud-detection-system-share-7466709011820728320-DkEt',
    youtube: 'https://www.youtube.com/watch?v=1YGyFrV1YRE',
    featured: true,
  },
  {
    id: '3',
    slug: 'treeforge',
    title: 'TreeForge',
    shortDescription:
      'Python CLI tool that forges entire project structures from a simple tree diagram.',
    description:
      'TreeForge is a lightweight Python CLI tool that reads a folder/file tree structure and materializes it into a real project on disk — complete with starter file contents for .py, .jsx, .js, .html, .css, .md, and .json files.',
    category: 'ai',
    tech: ['Python', 'CLI'],
    features: [
      'Paste & Go Tree Parsing',
      'Auto-create Nested Folders',
      'Starter File Boilerplate',
      'Smart Depth Parsing',
      'Live Progress Log',
      'Zero Dependencies',
    ],
    problem:
      'Developers frequently sketch project folder structures in READMEs or diagrams but must manually create each directory and boilerplate file — a repetitive and error-prone process.',
    solution:
      'A single-file Python CLI that parses standard tree diagram notation (├──, └──, │) and instantly generates the full project structure with sensible starter content for each file type.',
    architecture:
      'Pure Python standard-library CLI with depth-based path stack parsing. Files are detected by extension and receive type-specific boilerplate; folders are created recursively from nested tree input.',
    challenges: [
      'Parsing variable-depth tree structures with │ connector characters',
      'Generating meaningful starter content per file extension',
      'Handling both trailing-slash and plain folder names',
      'Supporting deeply nested structures (10+ levels)',
    ],
    implementation: [
      'Built depth-aware parser using │ character counting before tree markers',
      'Implemented auto-boilerplate for Python, React, HTML, CSS, Markdown, and JSON files',
      'Added live progress logging for every created file and folder',
      'Designed zero-dependency single-file architecture for easy distribution',
    ],
    results: [
      'Instant project scaffolding from pasted tree diagrams',
      'Eliminated manual folder and file creation overhead',
      'Published as open-source developer productivity tool on GitHub',
    ],
    github: 'https://github.com/PriyanshiG-HUB/TreeForge',
    linkedin:
      'https://www.linkedin.com/posts/priyanshi-gajiwala-1b00b7323_opentowork-buildinpublic-python-activity-7447513323232940032-x9r8',
    youtube: 'https://youtu.be/eoIckKaAdYI',
  },
  {
    id: '4',
    slug: 'ola-data-analysis',
    title: 'Ola Data Analysis',
    shortDescription:
      'Ride booking analytics and cancellation analysis with Python ML and Power BI dashboards.',
    description:
      'Comprehensive analysis of Ola ride booking data combining Python-based data analysis and Power BI dashboards to identify trends in demand, revenue, customer behavior, and ride cancellations with ML-based cancellation risk prediction.',
    category: 'data-analytics',
    tech: ['Python', 'Pandas', 'scikit-learn', 'Power BI', 'Jupyter'],
    features: [
      'Booking Trend Analysis',
      'Revenue by Vehicle Type',
      'Cancellation Pattern Study',
      'ML Cancellation Prediction',
      'Power BI Dashboards',
      'EDA Visualizations',
    ],
    problem:
      'Ride-hailing platforms face high cancellation rates, revenue leakage, and operational inefficiencies without data-driven insights into booking trends, payment behavior, and cancellation root causes.',
    solution:
      'End-to-end analytics pipeline processing 10,000+ booking records with Python EDA, feature engineering, ML cancellation prediction, and interactive Power BI dashboards for business decision support.',
    architecture:
      'Three-layer pipeline: raw CSV data ingestion and cleaning, Jupyter notebook analysis with scikit-learn ML models, and Power BI dashboard layer with DAX metrics across booking overview, revenue, and cancellation pages.',
    challenges: [
      'Cleaning inconsistent date formats and missing values at scale',
      'Engineering binary cancellation indicators from multi-status booking data',
      'Building interpretable ML models for cancellation risk prediction',
      'Designing multi-page Power BI dashboards with actionable KPIs',
    ],
    implementation: [
      'Processed and cleaned Ola booking dataset with derived cancellation features',
      'Performed EDA on daily trends, revenue by vehicle, and payment method distribution',
      'Built cancellation prediction model using scikit-learn',
      'Designed 3-page Power BI dashboard covering bookings, revenue, and cancellations',
      'Generated visual exports for trend, revenue, and cancellation analysis',
    ],
    results: [
      'Identified ~62% booking completion rate and Prime Sedan as top revenue driver',
      'Revealed driver-side cancellations exceed customer-side cancellations',
      'Demonstrated cash and low-fare rides carry higher cancellation probability',
      'Delivered actionable business recommendations for driver incentives and digital payments',
    ],
    github: 'https://github.com/PriyanshiG-HUB/Ola_Data_Analysis',
    linkedin:
      'https://www.linkedin.com/posts/priyanshi-gajiwala-1b00b7323_dataanalytics-powerbi-python-activity-7425535942335168512-6Gin',
  },
  {
    id: '5',
    slug: 'delhi-weather-aqi',
    title: 'Delhi Weather AQI',
    shortDescription:
      'Delhi 2025 weather and air quality analytics with Python EDA and Power BI dashboards.',
    description:
      'Analyzes Delhi\'s 2025 weather and air quality data to uncover patterns affecting public health and environmental conditions, transforming raw environmental data into actionable insights via Python analysis and Power BI dashboards.',
    category: 'data-analytics',
    tech: ['Python', 'Pandas', 'NumPy', 'Power BI', 'Jupyter'],
    features: [
      'Temperature Trend Analysis',
      'Seasonal AQI Fluctuations',
      'PM2.5 vs PM10 Study',
      'Hourly Pollution Patterns',
      'Interactive Dashboards',
      'Weather–Pollution Correlation',
    ],
    problem:
      'Delhi faces severe air quality crises with seasonal pollution spikes, yet public monitoring lacks accessible, interactive analytics connecting weather patterns to AQI variations for informed urban planning.',
    solution:
      'Environmental analytics pipeline with data preprocessing, exploratory analysis of temperature and AQI trends, PM contribution studies, and multi-page Power BI dashboards with month, location, and weather filters.',
    architecture:
      'Data pipeline from raw environmental datasets through Python preprocessing and EDA notebooks to Power BI dashboards with KPI cards, heatmaps, trend charts, and interactive slicers for decision support.',
    challenges: [
      'Handling missing and inconsistent environmental sensor readings',
      'Standardizing measurement units across temperature and pollution metrics',
      'Correlating weather conditions with pollution level variations',
      'Building filterable dashboards for multi-dimensional environmental data',
    ],
    implementation: [
      'Cleaned and preprocessed Delhi 2025 weather and AQI datasets',
      'Analyzed monthly temperature trends and seasonal AQI fluctuations',
      'Studied PM2.5 vs PM10 pollution contributions and hourly patterns',
      'Built Power BI dashboards with weather overview, air quality, and pollution analysis pages',
      'Added interactive filters for month, location, and weather condition',
    ],
    results: [
      'Identified AQI peaks during winter with severe pollution patterns',
      'Found pollution rises during night and early morning hours',
      'Demonstrated rainfall significantly improves air quality',
      'Generated recommendations for winter pollution control and green transport',
    ],
    github: 'https://github.com/PriyanshiG-HUB/Delhi_Weather_AQI',
    linkedin:
      'https://www.linkedin.com/posts/priyanshi-gajiwala-1b00b7323_dataanalytics-python-powerbi-activity-7419445966610628608-x2P-',
  },
]

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

export const getRelatedProjects = (slug: string): Project[] =>
  projects.filter((p) => p.slug !== slug).slice(0, 2)

export const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI' },
  { id: 'web', label: 'Web' },
  { id: 'data-analytics', label: 'Data Analytics' },
] as const

export const categoryLabels: Record<Project['category'], string> = {
  ai: 'AI',
  web: 'Web',
  'data-analytics': 'Data Analytics',
}

export const getCategoryLabel = (category: Project['category']): string =>
  categoryLabels[category] ?? category
