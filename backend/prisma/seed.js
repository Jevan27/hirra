import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SKILL_CATEGORIES_DATA = [
  {
    name: 'Frontend Development',
    slug: 'frontend-development',
    description: 'Technologies, frameworks, and tools used for building client-side user interfaces and web applications.',
    skills: [
      { name: 'React', slug: 'react' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'Vue.js', slug: 'vuejs' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'Tailwind CSS', slug: 'tailwind-css' },
      { name: 'HTML5 & CSS3', slug: 'html5-css3' },
      { name: 'Angular', slug: 'angular' },
      { name: 'Frontend', slug: 'frontend' }
    ]
  },
  {
    name: 'Backend Development',
    slug: 'backend-development',
    description: 'Server-side programming languages, microservice architectures, API protocols, and database management.',
    skills: [
      { name: 'Node.js', slug: 'nodejs' },
      { name: 'Express.js', slug: 'expressjs' },
      { name: 'Python', slug: 'python' },
      { name: 'Django', slug: 'django' },
      { name: 'Go (Golang)', slug: 'golang' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'REST APIs', slug: 'rest-apis' },
      { name: 'GraphQL', slug: 'graphql' },
      { name: 'Kafka', slug: 'kafka' },
      { name: 'Microservices', slug: 'microservices' }
    ]
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'Native and cross-platform mobile application development for iOS and Android devices.',
    skills: [
      { name: 'React Native', slug: 'react-native' },
      { name: 'Flutter', slug: 'flutter' },
      { name: 'Swift (iOS)', slug: 'swift' },
      { name: 'Kotlin (Android)', slug: 'kotlin' },
      { name: 'iOS', slug: 'ios' },
      { name: 'Android', slug: 'android' }
    ]
  },
  {
    name: 'DevOps & Cloud Infrastructure',
    slug: 'devops-cloud',
    description: 'Containerization, cloud providers, continuous integration, continuous delivery, and infrastructure as code.',
    skills: [
      { name: 'Docker', slug: 'docker' },
      { name: 'Kubernetes', slug: 'kubernetes' },
      { name: 'Amazon Web Services (AWS)', slug: 'aws' },
      { name: 'Google Cloud Platform (GCP)', slug: 'gcp' },
      { name: 'CI/CD Pipelines', slug: 'ci-cd' },
      { name: 'Terraform', slug: 'terraform' },
      { name: 'Linux', slug: 'linux' },
      { name: 'Security', slug: 'security' }
    ]
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'User interface design, user experience research, wireframing, interactive prototyping, and design systems.',
    skills: [
      { name: 'Figma', slug: 'figma' },
      { name: 'Design Systems', slug: 'design-systems' },
      { name: 'User Research', slug: 'user-research' },
      { name: 'Wireframing & Prototyping', slug: 'prototyping' },
      { name: 'UX Research', slug: 'ux-research' },
      { name: 'Branding', slug: 'branding' },
      { name: 'Motion Design', slug: 'motion-design' }
    ]
  },
  {
    name: 'Data & Artificial Intelligence',
    slug: 'data-ai',
    description: 'Data engineering, relational analytics, machine learning modeling, and generative AI systems.',
    skills: [
      { name: 'SQL', slug: 'sql' },
      { name: 'Pandas & NumPy', slug: 'pandas-numpy' },
      { name: 'Machine Learning', slug: 'machine-learning' },
      { name: 'PyTorch / TensorFlow', slug: 'pytorch-tensorflow' },
      { name: 'Data Visualization', slug: 'data-visualization' },
      { name: 'Tableau', slug: 'tableau' },
      { name: 'Computer Vision', slug: 'computer-vision' },
      { name: 'Deep Learning', slug: 'deep-learning' },
      { name: 'NLP', slug: 'nlp' },
      { name: 'Transformers', slug: 'transformers' },
      { name: 'LLM', slug: 'llm' }
    ]
  },
  {
    name: 'Product & Project Management',
    slug: 'product-project-management',
    description: 'Product strategy, Agile development methodologies, roadmap execution, and cross-functional leadership.',
    skills: [
      { name: 'Agile & Scrum', slug: 'agile-scrum' },
      { name: 'Product Roadmapping', slug: 'product-roadmapping' },
      { name: 'Jira & Linear', slug: 'jira-linear' },
      { name: 'A/B Testing', slug: 'ab-testing' },
      { name: 'Fintech', slug: 'fintech' }
    ]
  },
  {
    name: 'Quality Assurance & Testing',
    slug: 'quality-assurance',
    description: 'Automated testing frameworks, end-to-end testing, integration validation, and quality engineering.',
    skills: [
      { name: 'Jest', slug: 'jest' },
      { name: 'Playwright', slug: 'playwright' },
      { name: 'Cypress', slug: 'cypress' },
      { name: 'End-to-End Testing', slug: 'e2e-testing' }
    ]
  }
];

const JOB_ROLES_DATA = [
  { name: 'Frontend Developer', slug: 'frontend-developer', description: 'Specializes in creating performant, accessible, and responsive user interfaces.' },
  { name: 'Backend Developer', slug: 'backend-developer', description: 'Architects scalable server-side systems, database schemas, and microservice APIs.' },
  { name: 'Full Stack Engineer', slug: 'full-stack-engineer', description: 'Bridges client-side UI and server-side infrastructure to deliver end-to-end product features.' },
  { name: 'Mobile App Developer', slug: 'mobile-app-developer', description: 'Designs and builds mobile applications for iOS and Android platforms.' },
  { name: 'UI/UX Designer', slug: 'ui-ux-designer', description: 'Crafts intuitive user experiences, design systems, and visual interfaces.' },
  { name: 'DevOps / Cloud Engineer', slug: 'devops-cloud-engineer', description: 'Automates deployment pipelines, cloud infrastructure, and site reliability.' },
  { name: 'Data Scientist / AI Engineer', slug: 'data-scientist-ai-engineer', description: 'Develops predictive statistical models, machine learning algorithms, and data pipelines.' },
  { name: 'Product Manager', slug: 'product-manager', description: 'Defines product vision, prioritizes feature roadmaps, and coordinates cross-functional delivery.' },
  { name: 'QA / Test Automation Engineer', slug: 'qa-test-automation-engineer', description: 'Ensures application quality through automated test coverage.' },
  { name: 'Engineering Manager', slug: 'engineering-manager', description: 'Leads engineering squads, fosters technical excellence, and mentors developer growth.' }
];

const INDUSTRIES_DATA = [
  { name: 'Technology', slug: 'technology', description: 'Software development, cloud computing, hardware engineering, cybersecurity, and telecommunications.' },
  { name: 'Finance', slug: 'finance', description: 'Banking, fintech, investment management, insurance, and financial services.' },
  { name: 'Healthcare', slug: 'healthcare', description: 'Hospitals, biotechnology, medical devices, health tech, and pharmaceutical research.' },
  { name: 'Hospitality', slug: 'hospitality', description: 'Travel, tourism, hotels, culinary services, events, and leisure entertainment.' },
  { name: 'Retail', slug: 'retail', description: 'E-commerce, consumer goods, retail stores, merchandising, and supply logistics.' },
  { name: 'Education', slug: 'education', description: 'Higher education institutions, EdTech platforms, e-learning, and vocational training.' },
  { name: 'Construction', slug: 'construction', description: 'Civil engineering, commercial and residential architecture, infrastructure, and property development.' },
  { name: 'Manufacturing', slug: 'manufacturing', description: 'Industrial manufacturing, robotics, automotive engineering, supply chains, and materials fabrication.' },
  { name: 'Marketing', slug: 'marketing', description: 'Digital advertising, content strategy, brand design, public relations, and growth marketing.' },
  { name: 'Human Resources', slug: 'human-resources', description: 'Talent acquisition, recruitment tech, workforce management, and organizational development.' },
  { name: 'Transportation', slug: 'transportation', description: 'Logistics, freight management, autonomous transit, aviation, and maritime shipping.' }
];

const JOB_CATEGORIES_DATA = [
  { name: 'Engineering', slug: 'engineering', description: 'Software engineering, cloud infrastructure, and technical architecture.' },
  { name: 'Design & Creative', slug: 'design', description: 'Product design, UI/UX, graphic design, motion graphics, and visual branding.' },
  { name: 'Data & AI', slug: 'data-ai', description: 'Data science, machine learning, analytics, and artificial intelligence.' },
  { name: 'Product Management', slug: 'product-management', description: 'Product strategy, roadmap execution, and technical project management.' },
  { name: 'Marketing & Growth', slug: 'marketing', description: 'Digital advertising, performance marketing, SEO, and user acquisition.' },
  { name: 'Finance & Banking', slug: 'finance', description: 'Fintech, corporate banking, financial analysis, and risk management.' },
  { name: 'Technology', slug: 'technology', description: 'General IT, support, and technology operations.' },
  { name: 'Healthcare', slug: 'healthcare', description: 'Clinical care, telemedicine, medical research, and health tech.' },
  { name: 'Customer Service', slug: 'customer-service', description: 'Customer support, technical assistance, and client success.' },
  { name: 'Human Resources', slug: 'human-resources', description: 'Talent acquisition, people operations, and employee development.' },
  { name: 'Sales', slug: 'sales', description: 'Enterprise sales, account executive roles, and business development.' },
  { name: 'Operations', slug: 'operations', description: 'Business operations, supply chain, and logistics management.' }
];

const COMPANIES_DATA = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Acme Technologies',
    slug: 'acme-technologies',
    location: 'Taguig, Metro Manila, Philippines',
    website: 'https://acme.tech',
    industrySlug: 'technology',
    companySize: '500-1000 employees',
    description: 'Acme Technologies is a premier cloud engineering and SaaS scale-up powering enterprise workflows across Southeast Asia.',
    foundedYear: 2018
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Vercel',
    slug: 'vercel',
    location: 'Global / Remote',
    website: 'https://vercel.com',
    industrySlug: 'technology',
    companySize: '500-1000 employees',
    description: 'Vercel provides developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.',
    foundedYear: 2015
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Quantum Analytics',
    slug: 'quantum-analytics',
    location: 'Makati, Metro Manila, Philippines',
    website: 'https://quantumanalytics.ai',
    industrySlug: 'technology',
    companySize: '200-500 employees',
    description: 'Quantum Analytics delivers cutting-edge algorithmic data modeling, machine learning engines, and predictive analytics for Fortune 500 organizations.',
    foundedYear: 2019
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Globex Corp',
    slug: 'globex-corp',
    location: 'Pasig, Metro Manila, Philippines',
    website: 'https://globex.io',
    industrySlug: 'transportation',
    companySize: '1000-5000 employees',
    description: 'Globex Corporation operates high-throughput distributed microservices for cross-border logistics and international supply chain orchestration.',
    foundedYear: 2012
  },
  {
    id: 'c0000000-0000-0000-0000-000000000005',
    name: 'FinTrust Bank',
    slug: 'fintrust-bank',
    location: 'BGC, Taguig, Philippines',
    website: 'https://fintrustbank.com',
    industrySlug: 'finance',
    companySize: '2500+ employees',
    description: 'FinTrust Bank is a premier next-generation digital bank redefining consumer credit, institutional wealth management, and frictionless payments.',
    foundedYear: 2014
  },
  {
    id: 'c0000000-0000-0000-0000-000000000006',
    name: 'HealthTech Solutions',
    slug: 'healthtech-solutions',
    location: 'Quezon City, Metro Manila, Philippines',
    website: 'https://healthtech.care',
    industrySlug: 'healthcare',
    companySize: '100-250 employees',
    description: 'HealthTech Solutions builds HIPAA-compliant telemedicine portals, clinical AI assistants, and hospital management software for hospital networks.',
    foundedYear: 2020
  },
  {
    id: 'c0000000-0000-0000-0000-000000000007',
    name: 'Supabase',
    slug: 'supabase',
    location: 'Remote',
    website: 'https://supabase.com',
    industrySlug: 'technology',
    companySize: '100-250 employees',
    description: 'Supabase is an open source Firebase alternative providing Postgres databases, authentication, edge functions, and real-time subscriptions.',
    foundedYear: 2020
  },
  {
    id: 'c0000000-0000-0000-0000-000000000008',
    name: 'PayMongo',
    slug: 'paymongo',
    location: 'Taguig, Metro Manila, Philippines',
    website: 'https://paymongo.com',
    industrySlug: 'finance',
    companySize: '200-500 employees',
    description: 'PayMongo is the easiest way for businesses in Southeast Asia to accept online payments, manage transactions, and scale fraud detection.',
    foundedYear: 2019
  },
  {
    id: 'c0000000-0000-0000-0000-000000000009',
    name: 'Canva',
    slug: 'canva',
    location: 'Makati, Metro Manila, Philippines',
    website: 'https://canva.com',
    industrySlug: 'marketing',
    companySize: '3000+ employees',
    description: 'Canva is a global visual communication and collaboration platform that empowers everyone in the world to design anything and publish anywhere.',
    foundedYear: 2012
  },
  {
    id: 'c0000000-0000-0000-0000-000000000010',
    name: 'Grab',
    slug: 'grab',
    location: 'Pasig, Metro Manila, Philippines',
    website: 'https://grab.com',
    industrySlug: 'transportation',
    companySize: '5000+ employees',
    description: 'Grab is Southeast Asia\'s leading superapp, providing everyday services such as deliveries, mobility, financial services, and enterprise solutions.',
    foundedYear: 2012
  }
];

const JOBS_DATA = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    title: 'Senior Frontend Engineer',
    companySlug: 'acme-technologies',
    location: 'Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 80000,
    salaryMax: 120000,
    categorySlug: 'engineering',
    experienceLevel: 'SENIOR',
    description: 'We are seeking a Senior Frontend Engineer to lead frontend architecture and user experience across our core cloud management portal. You will build high-performance React and TypeScript applications with modern micro-frontend patterns.',
    responsibilities: [
      'Architect and build reusable UI component systems with React, TypeScript, and modern CSS',
      'Collaborate closely with product designers and backend engineers to define API contracts',
      'Optimize core web vitals, client-side bundle size, and rendering performance',
      'Mentor mid-level and junior frontend engineers through PR reviews and tech talks',
      'Maintain automated testing pipelines including Jest, React Testing Library, and Playwright'
    ],
    requirements: [
      '5+ years of production experience in building web applications with modern React & TypeScript',
      'Deep understanding of state management, browser rendering cycles, and web performance',
      'Experience with modern build tooling (Vite, Turbopack, Webpack) and REST/GraphQL APIs',
      'Strong aesthetic sensibility and attention to typography, spacing, and micro-interactions',
      'Excellent communication and collaboration skills in a hybrid engineering squad'
    ],
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Frontend']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    title: 'Product Designer',
    companySlug: 'vercel',
    location: 'Manila, Philippines',
    workplaceType: 'REMOTE',
    jobType: 'CONTRACT',
    salaryMin: 65000,
    salaryMax: 88000,
    categorySlug: 'design',
    experienceLevel: 'MID_LEVEL',
    description: 'Vercel is looking for a Product Designer to design world-class developer workflows, cloud deployment interfaces, and dashboard experiences that delight millions of engineers globally.',
    responsibilities: [
      'Design intuitive, responsive desktop and mobile experiences for developer tools and analytics dashboards',
      'Create high-fidelity interactive prototypes in Figma with strict design token fidelity',
      'Conduct customer interviews and usability sessions with software engineers and engineering managers',
      'Partner with frontend engineers to ensure design implementation matches vision down to the pixel',
      'Evolve our design system with accessible components, micro-animations, and documentation'
    ],
    requirements: [
      '3+ years designing complex developer products, SaaS dashboards, or productivity software',
      'Mastery of Figma, design systems, auto-layout, and interactive prototyping',
      'Understanding of HTML/CSS fundamentals and technical constraints of web platforms',
      'Strong portfolio demonstrating user journey mapping, information architecture, and UI polish',
      'Ability to articulate design decisions clearly to cross-functional stakeholders'
    ],
    tags: ['Figma', 'User Research', 'Design Systems', 'Wireframing & Prototyping']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    title: 'Data Scientist',
    companySlug: 'quantum-analytics',
    location: 'Makati, Metro Manila, Philippines',
    workplaceType: 'ONSITE',
    jobType: 'FULL_TIME',
    salaryMin: 110000,
    salaryMax: 150000,
    categorySlug: 'data-ai',
    experienceLevel: 'SENIOR',
    description: 'Quantum Analytics is hiring a Data Scientist to build predictive analytics models, machine learning pipelines, and recommendation algorithms for enterprise client datasets.',
    responsibilities: [
      'Develop statistical models and machine learning pipelines for predictive customer behavior',
      'Process and analyze terabytes of structured and unstructured multi-source data',
      'Deploy scalable ML models to production environments using Docker and Kubernetes',
      'Collaborate with business intelligence leads to translate executive questions into data experiments',
      'Present actionable quantitative findings to enterprise C-level stakeholders'
    ],
    requirements: [
      '4+ years of data science or machine learning engineering experience in production',
      'Expertise in Python, pandas, scikit-learn, PyTorch/TensorFlow, and SQL',
      'Experience with data warehousing (Snowflake, BigQuery) and ETL orchestration (Airflow)',
      'Strong background in probability, linear algebra, and experimental design (A/B testing)',
      'Degree in Computer Science, Statistics, Mathematics, or equivalent quantitative discipline'
    ],
    tags: ['Python', 'Machine Learning', 'SQL', 'PyTorch / TensorFlow']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    title: 'Backend Developer (Go)',
    companySlug: 'globex-corp',
    location: 'Manila, Philippines',
    workplaceType: 'REMOTE',
    jobType: 'FULL_TIME',
    salaryMin: 95000,
    salaryMax: 140000,
    categorySlug: 'engineering',
    experienceLevel: 'MID_LEVEL',
    description: 'Globex Corp is looking for a Backend Developer specializing in Go (Golang) to develop high-throughput, low-latency microservices powering our international logistics tracking network.',
    responsibilities: [
      'Design, build, and maintain high-performance REST and gRPC microservices in Go',
      'Optimize PostgreSQL and Redis database queries for sub-millisecond execution times',
      'Implement event-driven asynchronous architectures using Apache Kafka and RabbitMQ',
      'Write comprehensive unit, integration, and load tests to guarantee 99.99% system availability',
      'Participate in on-call incident triage and continuous observability improvements'
    ],
    requirements: [
      '3+ years of professional backend software engineering with at least 2 years in Golang',
      'Demonstrated experience with distributed systems, concurrency models, and goroutines',
      'Solid knowledge of relational database design, indexing strategies, and ACID transactions',
      'Hands-on familiarity with Docker, Kubernetes, Prometheus, and Grafana',
      'Strong problem-solving abilities and dedication to clean, idiomatic code'
    ],
    tags: ['Go (Golang)', 'Microservices', 'Kafka', 'PostgreSQL']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    title: 'Technical Project Manager',
    companySlug: 'fintrust-bank',
    location: 'BGC, Taguig, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 120000,
    salaryMax: 180000,
    categorySlug: 'product-management',
    experienceLevel: 'LEAD',
    description: 'FinTrust Bank is looking for a Technical Project Manager to oversee critical digital banking modernization initiatives, regulatory compliance integrations, and multi-team release trains.',
    responsibilities: [
      'Lead cross-functional agile squads through sprint planning, backlog grooming, and milestone delivery',
      'Manage technical dependencies, risk mitigation strategies, and timeline roadmaps for payment gateway projects',
      'Interface between executive banking stakeholders, compliance officers, and software engineering leads',
      'Track and report project velocity, sprint burn-down metrics, and resource allocations',
      'Champion agile best practices and foster a high-trust, continuous delivery engineering culture'
    ],
    requirements: [
      '5+ years of project or program management experience within tech companies or fintech institutions',
      'Strong technical background (prior software development or technical architecture experience preferred)',
      'PMP, PMI-ACP, or Scrum Master certification is an advantage',
      'Experience navigating security, compliance, and regulatory governance (PCI-DSS, BSP frameworks)',
      'Superb stakeholder management, negotiation, and written communication skills'
    ],
    tags: ['Agile & Scrum', 'Jira & Linear', 'Fintech']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    title: 'UX Researcher',
    companySlug: 'healthtech-solutions',
    location: 'Quezon City, Metro Manila, Philippines',
    workplaceType: 'ONSITE',
    jobType: 'CONTRACT',
    salaryMin: 70000,
    salaryMax: 90000,
    categorySlug: 'design',
    experienceLevel: 'MID_LEVEL',
    description: 'HealthTech Solutions needs a passionate UX Researcher to lead generative and evaluative user studies with clinical physicians, nurses, and patients to improve telemedicine healthcare outcomes.',
    responsibilities: [
      'Plan and execute qualitative and quantitative user research studies across clinical environments',
      'Conduct in-depth interviews, contextual inquiries, and usability benchmarking tests',
      'Synthesize research data into actionable user personas, empathy maps, and journey flows',
      'Present user insights and evidence-based design recommendations to product teams',
      'Maintain a centralized research repository to empower data-driven product decisions'
    ],
    requirements: [
      '3+ years conducting UX research for digital applications (healthcare/medtech experience is a huge plus)',
      'Proficiency in user research tools (Dovetail, UserTesting, Maze, Optimal Workshop, Figma)',
      'Deep understanding of ethical research protocols, patient confidentiality, and consent frameworks',
      'Strong storytelling capabilities with visual presentations and executive summaries',
      'Degree in HCI, Cognitive Psychology, Human Factors, Anthropology, or related field'
    ],
    tags: ['UX Research', 'User Research', 'Figma']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000007',
    title: 'Full Stack Engineer (Node + React)',
    companySlug: 'paymongo',
    location: 'Taguig, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 90000,
    salaryMax: 135000,
    categorySlug: 'engineering',
    experienceLevel: 'MID_LEVEL',
    description: 'Join PayMongo to build next-generation merchant checkout experiences, merchant analytics dashboards, and developer API SDKs used by tens of thousands of merchants across the Philippines.',
    responsibilities: [
      'Build scalable REST APIs in Node.js and TypeScript connected to Postgres and Redis',
      'Develop responsive, accessible merchant dashboard interfaces using React and Tailwind CSS',
      'Integrate with national banking payment rails (InstaPay, PESONet, Maya, GCash)',
      'Ensure adherence to PCI-DSS compliance and secure coding standards',
      'Write thorough end-to-end integration tests and participate in sprint planning'
    ],
    requirements: [
      '3+ years experience with modern JavaScript / TypeScript across Node.js and React',
      'Familiarity with SQL relational database schema design, indexing, and transactions',
      'Experience building or integrating financial or third-party webhooks and APIs',
      'Understanding of security fundamentals (OAuth2, CSRF, JWT, data sanitization)',
      'Comfortable with Git workflows, code reviews, and CI/CD automated deployment'
    ],
    tags: ['Node.js', 'React', 'TypeScript', 'Fintech', 'PostgreSQL']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000008',
    title: 'Senior Database Reliability Engineer',
    companySlug: 'supabase',
    location: 'Manila, Philippines',
    workplaceType: 'REMOTE',
    jobType: 'FULL_TIME',
    salaryMin: 140000,
    salaryMax: 195000,
    categorySlug: 'engineering',
    experienceLevel: 'SENIOR',
    description: 'Supabase is looking for a Database Reliability Engineer to maintain, tune, and automate the fleet of millions of hosted Postgres instances running worldwide.',
    responsibilities: [
      'Automate Postgres provisioning, backups, replication, failover, and disaster recovery',
      'Optimize WAL archiving, connection pooling (PgBouncer/Supavisor), and query execution plans',
      'Diagnose database bottlenecks, memory leaks, and disk I/O performance at scale',
      'Contribute to open source database tools and Supabase core infrastructure',
      'Participate in a global follow-the-sun on-call rotation'
    ],
    requirements: [
      '5+ years operating large-scale PostgreSQL production clusters in cloud environments',
      'Deep understanding of Postgres internals, query planner, locking mechanisms, and extensions',
      'Strong automation skills in Go, Rust, or Python alongside Linux system internals',
      'Experience with Kubernetes, AWS/Fly.io/GCP, and Infrastructure as Code (Terraform)',
      'Excellent async written documentation skills'
    ],
    tags: ['PostgreSQL', 'Linux', 'Terraform', 'Go (Golang)']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000009',
    title: 'Senior Brand & Visual Designer',
    companySlug: 'canva',
    location: 'Makati, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 85000,
    salaryMax: 115000,
    categorySlug: 'design',
    experienceLevel: 'SENIOR',
    description: 'Canva is looking for an extraordinary Visual & Brand Designer to create visually stunning marketing campaigns, product launch assets, and design system illustrations.',
    responsibilities: [
      'Craft compelling marketing creatives, landing page art direction, and digital campaigns',
      'Produce vector iconography, 3D illustrations, and motion graphics for global launches',
      'Collaborate with marketing managers and copywriters to define creative narrative',
      'Maintain brand consistency across all digital touchpoints and global localized campaigns',
      'Contribute innovative templates and creative assets to the Canva creator library'
    ],
    requirements: [
      '4+ years experience in brand design, advertising, or visual communication',
      'Expert knowledge of Figma, Adobe Creative Suite (Illustrator, Photoshop, After Effects)',
      'Strong typography, color theory, layout composition, and storytelling expertise',
      'Experience creating motion design or animated vector assets is a big plus',
      'Compelling visual portfolio showcasing branding and digital campaigns'
    ],
    tags: ['Figma', 'Branding', 'Motion Design']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000010',
    title: 'Machine Learning Engineer (Computer Vision)',
    companySlug: 'grab',
    location: 'Pasig, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 115000,
    salaryMax: 160000,
    categorySlug: 'data-ai',
    experienceLevel: 'SENIOR',
    description: 'Grab is hiring a Machine Learning Engineer to develop computer vision algorithms for merchant menu OCR extraction, driver face verification, and road safety intelligence.',
    responsibilities: [
      'Train, fine-tune, and deploy deep learning models for image segmentation, OCR, and object detection',
      'Optimize model inference latencies for mobile on-device and edge cloud deployment',
      'Build automated dataset annotation, data augmentation, and model evaluation pipelines',
      'Partner with mobile app engineers to integrate ML SDKs into iOS and Android client apps',
      'Publish internal research reports and benchmark against state-of-the-art vision models'
    ],
    requirements: [
      '4+ years applied experience in computer vision, deep learning, or machine learning systems',
      'Proficiency with PyTorch or TensorFlow, OpenCV, Python, and CUDA acceleration',
      'Experience quantizing models (TensorRT, ONNX, TFLite) for low-latency inference',
      'Strong software engineering foundation with clean code, testing, and CI/CD pipelines',
      'Master\'s or Bachelor\'s degree in Computer Science, Artificial Intelligence, or related field'
    ],
    tags: ['Computer Vision', 'PyTorch / TensorFlow', 'Python', 'Deep Learning', 'Machine Learning']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000011',
    title: 'Lead Product Manager (Growth)',
    companySlug: 'paymongo',
    location: 'Taguig, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 130000,
    salaryMax: 185000,
    categorySlug: 'product-management',
    experienceLevel: 'LEAD',
    description: 'Lead the Growth Product squad at PayMongo to optimize self-serve merchant onboarding, conversion funnels, and enterprise checkout adoption across the Philippines.',
    responsibilities: [
      'Define growth strategy, product vision, and OKRs for merchant acquisition and activation',
      'Design and execute rapid A/B experiments across landing pages, signup flows, and KYC onboarding',
      'Analyze behavioral funnel metrics using Amplitude, Mixpanel, and SQL queries',
      'Collaborate with engineering leads, product designers, and growth marketers',
      'Present quarterly performance updates to executive leadership'
    ],
    requirements: [
      '5+ years product management experience with a proven track record of driving user growth in SaaS/fintech',
      'Data-fluent with strong SQL capabilities and rigorous experimentation methodology',
      'Strong customer empathy and technical understanding of web architecture and APIs',
      'Proven leadership skills managing agile scrum teams and mentoring junior PMs',
      'Exceptional written and oral communication skills'
    ],
    tags: ['Product Roadmapping', 'A/B Testing', 'Fintech', 'SQL']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000012',
    title: 'DevOps & Cloud Security Architect',
    companySlug: 'acme-technologies',
    location: 'Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 110000,
    salaryMax: 155000,
    categorySlug: 'engineering',
    experienceLevel: 'SENIOR',
    description: 'Acme Technologies is seeking a Cloud Security Architect to design, harden, and automate multi-region AWS and GCP cloud infrastructure while ensuring SOC2 and ISO27001 compliance.',
    responsibilities: [
      'Architect secure multi-tenant cloud infrastructure using Terraform and AWS CDK',
      'Implement automated vulnerability scanning, container security (Trivy/Falco), and secret management',
      'Maintain CI/CD pipelines with GitHub Actions and automated security gates',
      'Conduct regular penetration testing and security architecture reviews for microservices',
      'Lead incident response and disaster recovery simulation drills'
    ],
    requirements: [
      '5+ years experience in Cloud Infrastructure, DevOps, and Information Security',
      'AWS Certified Solutions Architect or Security Specialty certification preferred',
      'Extensive experience with Kubernetes, Docker, Terraform, and Linux administration',
      'Knowledge of identity management (IAM, OAuth, SAML, Zero Trust)',
      'Strong scripting abilities in Python, Bash, or Go'
    ],
    tags: ['Amazon Web Services (AWS)', 'Kubernetes', 'Security', 'Terraform']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000013',
    title: 'Junior Frontend Developer (React)',
    companySlug: 'acme-technologies',
    location: 'Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 45000,
    salaryMax: 65000,
    categorySlug: 'engineering',
    experienceLevel: 'JUNIOR',
    description: 'Start your software engineering career with Acme Technologies! You will work alongside senior developers to build responsive web pages, interactive widgets, and test suites.',
    responsibilities: [
      'Implement UI components from Figma design specs using React and Tailwind CSS',
      'Write unit tests and component tests using Vitest and React Testing Library',
      'Debug browser compatibility issues and improve page load responsiveness',
      'Participate actively in daily standups, sprint reviews, and technical workshops',
      'Refactor legacy JavaScript code to clean, typed TypeScript modules'
    ],
    requirements: [
      '1-2 years of personal, internship, or professional web development experience',
      'Solid foundation in HTML5, modern CSS, JavaScript (ES6+), and React',
      'Familiarity with Git version control and pull request workflows',
      'Eager to learn modern web standards, state management, and testing practices',
      'Bachelor\'s degree in CS/IT or impressive portfolio of self-built web applications'
    ],
    tags: ['React', 'JavaScript', 'TypeScript', 'HTML5 & CSS3']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000014',
    title: 'Data Analyst (Marketing & Revenue)',
    companySlug: 'grab',
    location: 'Pasig, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 60000,
    salaryMax: 85000,
    categorySlug: 'data-ai',
    experienceLevel: 'MID_LEVEL',
    description: 'Grab is looking for a Data Analyst to extract business intelligence, create executive dashboards, and analyze campaign ROI for our regional food and transport verticals.',
    responsibilities: [
      'Write complex SQL queries across BigQuery datasets to analyze merchant and consumer metrics',
      'Build real-time Tableau and PowerBI dashboards for executive business reviews',
      'Evaluate promotional campaigns, voucher elasticities, and customer lifetime value',
      'Conduct cohort analysis to identify driver retention trends and churn drivers',
      'Collaborate with commercial managers to recommend revenue optimization strategies'
    ],
    requirements: [
      '2-4 years experience in data analytics, business intelligence, or quantitative analysis',
      'High proficiency in SQL and data visualization tools (Tableau, Looker, Power BI)',
      'Basic Python/R scripting skills for data manipulation and statistical testing',
      'Strong analytical mindset with ability to translate complex data into executive stories',
      'Degree in Economics, Statistics, Business Analytics, or Computer Science'
    ],
    tags: ['SQL', 'Tableau', 'Data Visualization']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000015',
    title: 'Senior Financial Risk Analyst',
    companySlug: 'fintrust-bank',
    location: 'BGC, Taguig, Philippines',
    workplaceType: 'ONSITE',
    jobType: 'FULL_TIME',
    salaryMin: 95000,
    salaryMax: 130000,
    categorySlug: 'finance',
    experienceLevel: 'SENIOR',
    description: 'FinTrust Bank is looking for a Senior Financial Risk Analyst to monitor credit exposure, model liquidity scenarios, and ensure compliance with BSP financial guidelines.',
    responsibilities: [
      'Develop risk assessment models for consumer loan underwriting and credit portfolio scoring',
      'Perform stress testing, VaR calculations, and liquidity risk simulations',
      'Prepare regulatory risk reports for the Central Bank and internal audit committees',
      'Evaluate algorithmic fraud detection models and recommend threshold adjustments',
      'Partner with data science to implement automated credit approval workflows'
    ],
    requirements: [
      '4+ years experience in credit risk modeling, banking analytics, or financial audit',
      'Strong knowledge of Basel III/IV frameworks, IFRS 9, and local BSP regulations',
      'Proficiency with Excel modeling, SQL, and financial risk software (SAS/R)',
      'CFA, FRM, or relevant professional certification is a strong advantage',
      'Bachelor\'s degree in Finance, Actuarial Science, or Quantitative Economics'
    ],
    tags: ['Fintech', 'SQL']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000016',
    title: 'Software Engineering Intern (Summer 2026)',
    companySlug: 'vercel',
    location: 'Manila, Philippines',
    workplaceType: 'REMOTE',
    jobType: 'INTERNSHIP',
    salaryMin: 30000,
    salaryMax: 40000,
    categorySlug: 'engineering',
    experienceLevel: 'ENTRY_LEVEL',
    description: 'Join Vercel as a Software Engineering Intern! Work directly with open source core maintainers building Next.js, v0, and the Vercel platform.',
    responsibilities: [
      'Contribute bug fixes, performance improvements, and documentation to developer tools',
      'Build demo applications showcasing modern Next.js App Router and React Server Components',
      'Collaborate with senior engineers during code reviews and weekly technical demos',
      'Participate in intern hackathons and build end-to-end cloud projects'
    ],
    requirements: [
      'Currently pursuing a degree in Computer Science, Software Engineering, or self-taught builder',
      'Proficient with JavaScript, TypeScript, and React',
      'Active GitHub profile with personal projects or open source contributions',
      'Passion for developer experience, web performance, and modern frontend tools',
      'Available for a 3 to 6 month full-time or part-time internship'
    ],
    tags: ['React', 'TypeScript', 'Next.js']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000017',
    title: 'Performance Marketing Manager',
    companySlug: 'healthtech-solutions',
    location: 'Quezon City, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 75000,
    salaryMax: 105000,
    categorySlug: 'marketing',
    experienceLevel: 'MID_LEVEL',
    description: 'HealthTech Solutions is hiring a Performance Marketing Manager to run paid digital user acquisition campaigns (Google Ads, Meta Ads, TikTok) for our telemedicine consultation app.',
    responsibilities: [
      'Manage and optimize 7-figure monthly digital ad budgets across search, social, and display channels',
      'Run iterative creative A/B testing on ad copy, video hooks, and landing page conversions',
      'Track CAC, ROAS, LTV, and conversion attribution using Google Analytics 4 and AppsFlyer',
      'Collaborate with video editors and graphic designers to generate high-converting ad assets',
      'Analyze weekly performance reports and scale winning campaign structures'
    ],
    requirements: [
      '3+ years managing paid acquisition campaigns in mobile apps, SaaS, or healthcare services',
      'Proven track record scaling Google Ads (Search, PMax) and Meta Ads Manager profitably',
      'Strong analytical skills with Google Sheets/Excel modeling and data attribution understanding',
      'Familiarity with App Store Optimization (ASO) and mobile attribution partners',
      'Creative mindset with an understanding of consumer psychology'
    ],
    tags: ['A/B Testing']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000018',
    title: 'Senior Mobile Engineer (React Native)',
    companySlug: 'globex-corp',
    location: 'Pasig, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 100000,
    salaryMax: 145000,
    categorySlug: 'engineering',
    experienceLevel: 'SENIOR',
    description: 'Globex Corp is hiring a Senior Mobile Engineer to build our offline-first cross-platform driver and fleet tracking mobile application for iOS and Android.',
    responsibilities: [
      'Architect and build cross-platform mobile apps with React Native, TypeScript, and Expo',
      'Implement real-time background geolocation tracking, BLE hardware connectivity, and offline SQLite sync',
      'Optimize memory usage, 60fps animations, and battery efficiency for field devices',
      'Manage App Store and Google Play release pipelines with Fastlane and EAS',
      'Mentor mobile developers and establish automated mobile E2E testing with Maestro/Detox'
    ],
    requirements: [
      '4+ years of production experience in React Native and mobile app development',
      'Experience writing native iOS (Swift/Obj-C) or Android (Kotlin/Java) bridge modules',
      'Deep understanding of mobile architecture, state management (Zustand/Redux), and offline caching',
      'Familiarity with location services, push notifications, and biometric authentication',
      'Published apps on the Apple App Store and Google Play Store'
    ],
    tags: ['React Native', 'TypeScript', 'iOS', 'Android']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000019',
    title: 'Enterprise Account Executive (Fintech)',
    companySlug: 'paymongo',
    location: 'Taguig, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 90000,
    salaryMax: 140000,
    categorySlug: 'finance',
    experienceLevel: 'SENIOR',
    description: 'Drive high-value enterprise payment partnerships with top e-commerce brands, conglomerates, and multinational retailers expanding across the Philippines.',
    responsibilities: [
      'Own full-cycle enterprise sales from outbound prospecting, solution discovery, and contract closing',
      'Deliver tailored payment gateway presentations and technical proposals to C-level executives',
      'Partner with solutions engineers to structure custom pricing and API integration roadmaps',
      'Maintain accurate CRM pipeline forecasting in HubSpot/Salesforce',
      'Consistently exceed quarterly quota targets'
    ],
    requirements: [
      '4+ years of quota-carrying B2B SaaS, enterprise software, or fintech sales experience',
      'Demonstrated track record of closing high six-figure enterprise contracts',
      'Deep understanding of payments, merchant acquiring, and retail technology landscapes',
      'Strong executive presence, consultative negotiation skills, and persistence',
      'Bachelor\'s degree in Business, Marketing, Communications, or related field'
    ],
    tags: ['Fintech']
  },
  {
    id: 'd0000000-0000-0000-0000-000000000020',
    title: 'AI Research Scientist (LLMs & Agents)',
    companySlug: 'quantum-analytics',
    location: 'Makati, Metro Manila, Philippines',
    workplaceType: 'HYBRID',
    jobType: 'FULL_TIME',
    salaryMin: 135000,
    salaryMax: 190000,
    categorySlug: 'data-ai',
    experienceLevel: 'SENIOR',
    description: 'Quantum Analytics is looking for an AI Research Scientist to conduct novel research in autonomous agentic workflows, RAG reasoning architectures, and domain-specific LLM fine-tuning.',
    responsibilities: [
      'Design and train specialized transformer architectures and LoRA/PEFT fine-tuning models',
      'Develop multi-agent collaboration frameworks with tool use and self-critique capabilities',
      'Evaluate inference latency, safety guardrails, and hallucination reduction mechanisms',
      'Collaborate with software engineers to deploy production-grade inference endpoints on GPU clusters',
      'Author whitepapers and represent Quantum Analytics at premier AI symposiums'
    ],
    requirements: [
      'PhD or Master\'s degree in Computer Science, AI, or Mathematics with relevant publications',
      '3+ years experience training and deploying LLMs, transformer models, and embedding spaces',
      'Expert knowledge of PyTorch, vLLM, HuggingFace transformers, LangGraph, and Triton',
      'Experience optimizing multi-GPU distributed training (DeepSpeed, FSDP)',
      'Strong mathematical rigor in optimization, attention mechanisms, and information retrieval'
    ],
    tags: ['LLM', 'PyTorch / TensorFlow', 'Deep Learning', 'Transformers', 'NLP']
  }
];

const REVIEWS_DATA = [
  {
    companySlug: 'acme-technologies',
    rating: 5,
    title: 'Exceptional engineering culture and modern stack',
    review: 'Acme provides incredible autonomy, world-class developer tooling, and supportive leadership that genuinely invests in employee career development.',
    pros: 'Competitive compensation, flexible hybrid setup, supportive teammates, cutting-edge tech stack.',
    cons: 'Fast-paced environment during enterprise feature rollouts.',
    employmentStatus: 'CURRENT_EMPLOYEE',
    jobTitle: 'Senior Frontend Engineer'
  },
  {
    companySlug: 'vercel',
    rating: 5,
    title: 'Pioneering developer experience at global scale',
    review: 'Working at Vercel gives you the chance to directly influence the tools that modern web developers love and use every day.',
    pros: '100% remote flexibility, top talent colleagues, incredible product vision.',
    cons: 'Asynchronous work requires strong self-discipline and proactive communication.',
    employmentStatus: 'CURRENT_EMPLOYEE',
    jobTitle: 'Product Designer'
  },
  {
    companySlug: 'quantum-analytics',
    rating: 4,
    title: 'Great place for serious ML and data science work',
    review: 'Strong analytical talent, access to massive GPU compute clusters, and meaningful enterprise problems to solve.',
    pros: 'High caliber research team, great bonuses, state of the art GPU access.',
    cons: 'Client deadlines can be demanding.',
    employmentStatus: 'CURRENT_EMPLOYEE',
    jobTitle: 'Data Scientist'
  },
  {
    companySlug: 'paymongo',
    rating: 5,
    title: 'Leading the fintech revolution in Southeast Asia',
    review: 'Impactful work modernizing payments across the Philippines. The team is passionate, high-energy, and collaborative.',
    pros: 'Great BGC office, HMO from day one, equity grants, fast learning curve.',
    cons: 'Fintech compliance and audit requirements add operational rigor.',
    employmentStatus: 'CURRENT_EMPLOYEE',
    jobTitle: 'Full Stack Engineer'
  },
  {
    companySlug: 'grab',
    rating: 4,
    title: 'High scale challenges and great perks',
    review: 'Working at Grab offers unprecedented scale and real-world impact on everyday mobility and food delivery.',
    pros: 'Grab credits, great HMO, smart colleagues, impactful regional scope.',
    cons: 'Large organization matrix structure can slow some approvals.',
    employmentStatus: 'CURRENT_EMPLOYEE',
    jobTitle: 'Machine Learning Engineer'
  }
];

async function main() {
  console.log('🌱 Starting Hirra Master Data & Mock Data Seed...');

  // 1. Seed Skill Categories and Skills
  console.log('📦 Seeding Skill Categories and Skills...');
  const skillMap = new Map();
  for (const categoryData of SKILL_CATEGORIES_DATA) {
    const category = await prisma.skillCategory.upsert({
      where: { slug: categoryData.slug },
      update: { name: categoryData.name, description: categoryData.description },
      create: { name: categoryData.name, slug: categoryData.slug, description: categoryData.description }
    });

    for (const skillData of categoryData.skills) {
      const skill = await prisma.skill.upsert({
        where: { slug: skillData.slug },
        update: { name: skillData.name, categoryId: category.id },
        create: { name: skillData.name, slug: skillData.slug, categoryId: category.id }
      });
      skillMap.set(skill.name.toLowerCase(), skill.id);
      skillMap.set(skill.slug.toLowerCase(), skill.id);
    }
  }

  // 2. Seed Job Roles
  console.log('💼 Seeding Job Roles...');
  for (const roleData of JOB_ROLES_DATA) {
    await prisma.jobRole.upsert({
      where: { slug: roleData.slug },
      update: { name: roleData.name, description: roleData.description },
      create: { name: roleData.name, slug: roleData.slug, description: roleData.description }
    });
  }

  // 3. Seed Industries
  console.log('🏢 Seeding Industries...');
  const industryMap = new Map();
  for (const industryData of INDUSTRIES_DATA) {
    const ind = await prisma.industry.upsert({
      where: { slug: industryData.slug },
      update: { name: industryData.name, description: industryData.description },
      create: { name: industryData.name, slug: industryData.slug, description: industryData.description }
    });
    industryMap.set(ind.slug, ind.id);
  }

  // 4. Seed Job Categories
  console.log('📑 Seeding Job Categories...');
  const categoryMap = new Map();
  for (const categoryData of JOB_CATEGORIES_DATA) {
    const cat = await prisma.jobCategory.upsert({
      where: { slug: categoryData.slug },
      update: { name: categoryData.name, description: categoryData.description },
      create: { name: categoryData.name, slug: categoryData.slug, description: categoryData.description }
    });
    categoryMap.set(cat.slug, cat.id);
  }

  // 5. Seed Demo Employer & Candidate Users
  console.log('👥 Seeding Demo Users...');
  const userMap = new Map();
  for (let i = 0; i < COMPANIES_DATA.length; i++) {
    const comp = COMPANIES_DATA[i];
    const userUid = `e0000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`;
    const email = `employer.${comp.slug}@hirra.dev`;
    const user = await prisma.user.upsert({
      where: { email },
      update: { firstName: comp.name, lastName: 'Admin', role: 'EMPLOYER' },
      create: {
        uid: userUid,
        email,
        firstName: comp.name,
        lastName: 'Admin',
        role: 'EMPLOYER',
        emailVerified: true
      }
    });
    userMap.set(comp.slug, user.uid);
  }

  // Reviewer Candidate User
  const reviewerUid = 'e0000000-0000-0000-0000-000000000099';
  const reviewer = await prisma.user.upsert({
    where: { email: 'candidate.reviewer@hirra.dev' },
    update: { firstName: 'Alex', lastName: 'Mercer', role: 'CANDIDATE' },
    create: {
      uid: reviewerUid,
      email: 'candidate.reviewer@hirra.dev',
      firstName: 'Alex',
      lastName: 'Mercer',
      role: 'CANDIDATE',
      emailVerified: true
    }
  });

  // 6. Seed Companies
  console.log('🏢 Seeding Companies...');
  const companyMap = new Map();
  for (const compData of COMPANIES_DATA) {
    const industryId = industryMap.get(compData.industrySlug) || null;
    const company = await prisma.company.upsert({
      where: { slug: compData.slug },
      update: {
        name: compData.name,
        description: compData.description,
        website: compData.website,
        companySize: compData.companySize,
        foundedYear: compData.foundedYear,
        city: compData.location,
        country: 'Philippines',
        industryId,
        isVerified: true
      },
      create: {
        id: compData.id,
        name: compData.name,
        slug: compData.slug,
        description: compData.description,
        website: compData.website,
        companySize: compData.companySize,
        foundedYear: compData.foundedYear,
        city: compData.location,
        country: 'Philippines',
        industryId,
        isVerified: true
      }
    });
    companyMap.set(compData.slug, company.id);

    // Seed Company Member (Owner)
    const ownerUid = userMap.get(compData.slug);
    if (ownerUid) {
      await prisma.companyMember.upsert({
        where: { userId_companyId: { userId: ownerUid, companyId: company.id } },
        update: { companyRole: 'OWNER', status: 'ACTIVE' },
        create: {
          userId: ownerUid,
          companyId: company.id,
          companyRole: 'OWNER',
          status: 'ACTIVE',
          joinedAt: new Date()
        }
      });
    }
  }

  // 7. Seed Jobs & JobSkills
  console.log('💼 Seeding Jobs & JobSkills...');
  for (const jobData of JOBS_DATA) {
    const companyId = companyMap.get(jobData.companySlug);
    const createdBy = userMap.get(jobData.companySlug);
    const categoryId = categoryMap.get(jobData.categorySlug) || null;

    if (!companyId || !createdBy) continue;

    const job = await prisma.job.upsert({
      where: { id: jobData.id },
      update: {
        title: jobData.title,
        companyId,
        createdBy,
        categoryId,
        description: jobData.description,
        responsibilities: JSON.stringify(jobData.responsibilities),
        requirements: JSON.stringify(jobData.requirements),
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        salaryCurrency: 'PHP',
        jobType: jobData.jobType,
        workplaceType: jobData.workplaceType,
        experienceLevel: jobData.experienceLevel,
        location: jobData.location,
        status: 'PUBLISHED'
      },
      create: {
        id: jobData.id,
        title: jobData.title,
        companyId,
        createdBy,
        categoryId,
        description: jobData.description,
        responsibilities: JSON.stringify(jobData.responsibilities),
        requirements: JSON.stringify(jobData.requirements),
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        salaryCurrency: 'PHP',
        jobType: jobData.jobType,
        workplaceType: jobData.workplaceType,
        experienceLevel: jobData.experienceLevel,
        location: jobData.location,
        status: 'PUBLISHED'
      }
    });

    // Link JobSkills
    for (const tagName of jobData.tags) {
      const skillId = skillMap.get(tagName.toLowerCase());
      if (skillId) {
        await prisma.jobSkill.upsert({
          where: { jobId_skillId: { jobId: job.id, skillId } },
          update: { isRequired: true },
          create: { jobId: job.id, skillId, isRequired: true }
        });
      }
    }
  }

  // 8. Seed Company Reviews
  console.log('⭐ Seeding Company Reviews...');
  for (const rev of REVIEWS_DATA) {
    const companyId = companyMap.get(rev.companySlug);
    if (!companyId) continue;

    await prisma.companyReview.upsert({
      where: { userId_companyId: { userId: reviewer.uid, companyId } },
      update: {
        rating: rev.rating,
        title: rev.title,
        review: rev.review,
        pros: rev.pros,
        cons: rev.cons,
        employmentStatus: rev.employmentStatus,
        jobTitle: rev.jobTitle,
        status: 'PUBLISHED',
        isVerified: true
      },
      create: {
        companyId,
        userId: reviewer.uid,
        rating: rev.rating,
        title: rev.title,
        review: rev.review,
        pros: rev.pros,
        cons: rev.cons,
        employmentStatus: rev.employmentStatus,
        jobTitle: rev.jobTitle,
        status: 'PUBLISHED',
        isVerified: true
      }
    });
  }

  console.log('✅ Mock data seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
