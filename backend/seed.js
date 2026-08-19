require('dotenv').config();
const { getDriver, closeDriver } = require('./src/config/db');

const userData = [
  { id: 'u1', name: 'Ava Patel', role: 'Data Analyst', location: 'Seattle' },
  { id: 'u2', name: 'Marcus Chen', role: 'Software Engineer', location: 'Boston' },
  { id: 'u3', name: 'Priya Singh', role: 'Product Manager', location: 'Austin' },
  { id: 'u4', name: 'Elijah Brooks', role: 'ML Engineer', location: 'New York' },
  { id: 'u5', name: 'Sofia Nguyen', role: 'Frontend Developer', location: 'San Francisco' },
  { id: 'u6', name: 'Daniel Kim', role: 'Cloud Engineer', location: 'Chicago' },
  { id: 'u7', name: 'Noah Rodriguez', role: 'Systems Engineer', location: 'Denver' },
  { id: 'u8', name: 'Maya Johnson', role: 'Analytics Lead', location: 'Portland' },
  { id: 'u9', name: 'Liam Walker', role: 'DevOps Engineer', location: 'Atlanta' },
  { id: 'u10', name: 'Emma Smith', role: 'AI Researcher', location: 'Los Angeles' }
];

const skillData = [
  { id: 's1', name: 'Python', category: 'Language' },
  { id: 's2', name: 'SQL', category: 'Data' },
  { id: 's3', name: 'JavaScript', category: 'Language' },
  { id: 's4', name: 'React', category: 'Frontend' },
  { id: 's5', name: 'Machine Learning', category: 'AI' },
  { id: 's6', name: 'Data Analysis', category: 'Analytics' },
  { id: 's7', name: 'Statistics', category: 'Analytics' },
  { id: 's8', name: 'Cloud Architecture', category: 'Infrastructure' },
  { id: 's9', name: 'Docker', category: 'DevOps' },
  { id: 's10', name: 'Kubernetes', category: 'DevOps' },
  { id: 's11', name: 'TensorFlow', category: 'AI' },
  { id: 's12', name: 'PyTorch', category: 'AI' },
  { id: 's13', name: 'Natural Language Processing', category: 'AI' },
  { id: 's14', name: 'Product Strategy', category: 'Business' },
  { id: 's15', name: 'UX Research', category: 'Design' },
  { id: 's16', name: 'Node.js', category: 'Backend' },
  { id: 's17', name: 'API Design', category: 'Backend' },
  { id: 's18', name: 'Graph Databases', category: 'Data' },
  { id: 's19', name: 'Data Visualization', category: 'Analytics' },
  { id: 's20', name: 'ETL Pipelines', category: 'Data' },
  { id: 's21', name: 'Causal Inference', category: 'Analytics' },
  { id: 's22', name: 'Prompt Engineering', category: 'AI' },
  { id: 's23', name: 'Model Deployment', category: 'AI' },
  { id: 's24', name: 'System Design', category: 'Engineering' },
  { id: 's25', name: 'Cybersecurity', category: 'Security' },
  { id: 's26', name: 'A/B Testing', category: 'Product' },
  { id: 's27', name: 'Java', category: 'Language' },
  { id: 's28', name: 'Spring Boot', category: 'Backend' },
  { id: 's29', name: 'Microservices', category: 'Architecture' },
  { id: 's30', name: 'TypeScript', category: 'Language' },
  { id: 's31', name: 'AWS', category: 'Cloud' },
  { id: 's32', name: 'Terraform', category: 'DevOps' },
  { id: 's33', name: 'CI/CD', category: 'DevOps' },
  { id: 's34', name: 'GraphQL', category: 'API' }
];

const companyData = [
  { id: 'c1', name: 'Microsoft', industry: 'Technology' },
  { id: 'c2', name: 'Google', industry: 'Technology' },
  { id: 'c3', name: 'Amazon', industry: 'Technology' },
  { id: 'c4', name: 'Meta', industry: 'Technology' },
  { id: 'c5', name: 'Stripe', industry: 'Fintech' },
  { id: 'c6', name: 'Databricks', industry: 'Data' },
  { id: 'c7', name: 'Shopify', industry: 'Ecommerce' },
  { id: 'c8', name: 'Airbnb', industry: 'Travel' },
  { id: 'c9', name: 'Netflix', industry: 'Media' },
  { id: 'c10', name: 'Snowflake', industry: 'Data' },
  { id: 'c11', name: 'GitHub', industry: 'Developer Tools' },
  { id: 'c12', name: 'Uber', industry: 'Mobility' }
];

const jobData = [
  { id: 'j1', name: 'AI Engineer', description: 'Build production AI systems and ML workflows.', salary: 220000 },
  { id: 'j2', name: 'Data Analyst', description: 'Explore data, generate insights, and inform decisions.', salary: 145000 },
  { id: 'j3', name: 'Frontend Engineer', description: 'Create delightful user experiences with modern frontend tooling.', salary: 180000 },
  { id: 'j4', name: 'Cloud Engineer', description: 'Design and operate cloud-native systems.', salary: 190000 },
  { id: 'j5', name: 'Product Analyst', description: 'Blend analytics and product strategy to drive impact.', salary: 160000 },
  { id: 'j6', name: 'ML Engineer', description: 'Ship machine learning models into production environments.', salary: 215000 },
  { id: 'j7', name: 'Full Stack Engineer', description: 'Work across client and server systems to build end-to-end features.', salary: 200000 },
  { id: 'j8', name: 'Data Engineer', description: 'Build data pipelines and ensure reliable data delivery.', salary: 175000 },
  { id: 'j9', name: 'Product Manager', description: 'Drive product vision and roadmap across complex systems.', salary: 185000 },
  { id: 'j10', name: 'Research Scientist', description: 'Advance applied AI research and experimentation.', salary: 240000 },
  { id: 'j11', name: 'DevOps Engineer', description: 'Automate deployment, monitoring, and reliability improvements.', salary: 195000 },
  { id: 'j12', name: 'Backend Engineer', description: 'Architect scalable APIs and distributed services.', salary: 210000 },
  { id: 'j13', name: 'Java Backend Engineer', description: 'Build distributed backend services with Java and Spring Boot.', salary: 205000 },
  { id: 'j14', name: 'Senior Frontend Engineer', description: 'Lead product UI experiences with React and TypeScript.', salary: 210000 },
  { id: 'j15', name: 'Cloud Architect', description: 'Design robust cloud platforms and deployment systems for scale.', salary: 235000 }
];

const courseData = [
  { id: 'cr1', title: 'Deep Learning Fundamentals', provider: 'Coursera' },
  { id: 'cr2', title: 'PyTorch Essentials', provider: 'Udacity' },
  { id: 'cr3', title: 'Modern React Patterns', provider: 'Frontend Masters' },
  { id: 'cr4', title: 'Advanced SQL for Analysts', provider: 'Mode' },
  { id: 'cr5', title: 'Data Modeling with Graphs', provider: 'Pluralsight' },
  { id: 'cr6', title: 'Cloud Architecture and Design', provider: 'A Cloud Guru' },
  { id: 'cr7', title: 'Product Analytics Foundations', provider: 'Coursera' },
  { id: 'cr8', title: 'NLP for Practitioners', provider: 'Fast.ai' },
  { id: 'cr9', title: 'Kubernetes in Practice', provider: 'Linux Foundation' },
  { id: 'cr10', title: 'System Design Interview Prep', provider: 'Educative' },
  { id: 'cr11', title: 'Experimentation and A/B Testing', provider: 'Optimizely' },
  { id: 'cr12', title: 'Python for Data Science', provider: 'DataCamp' },
  { id: 'cr13', title: 'Java Spring Boot Mastery', provider: 'Spring Academy' },
  { id: 'cr14', title: 'TypeScript for Frontend Architects', provider: 'Frontend Masters' },
  { id: 'cr15', title: 'AWS Cloud Foundations', provider: 'AWS Skill Builder' },
  { id: 'cr16', title: 'Terraform for Production', provider: 'HashiCorp' }
];

const projectData = [
  { id: 'p1', name: 'Customer Insights Dashboard', description: 'Built explainable dashboards for product performance.' },
  { id: 'p2', name: 'Demand Forecasting Engine', description: 'Created forecasting models for marketing spend optimization.' },
  { id: 'p3', name: 'Career Graph Explorer', description: 'Visualized skill and career connections for talent planning.' },
  { id: 'p4', name: 'Recommendation Service', description: 'Developed personalized learning recommendations for employees.' },
  { id: 'p5', name: 'SaaS Analytics Platform', description: 'Designed analytics pipelines for subscription health metrics.' },
  { id: 'p6', name: 'Deployment Automation', description: 'Built CI/CD flows for multi-service deployments.' },
  { id: 'p7', name: 'Graph Knowledge Base', description: 'Connected employees, skills, and learning paths via graph queries.' },
  { id: 'p8', name: 'Search Personalization', description: 'Improved ranking and retrieval for recommendation systems.' },
  { id: 'p9', name: 'ML Ops Pipeline', description: 'Operationalized model training and monitoring with production safeguards.' },
  { id: 'p10', name: 'UX Testing Lab', description: 'Created experiments to measure product understanding and usability.' },
  { id: 'p11', name: 'Microservice Migration', description: 'Modernized monoliths into resilient distributed Java services.' },
  { id: 'p12', name: 'Global Frontend Platform', description: 'Scaled a unified frontend platform across product teams.' },
  { id: 'p13', name: 'Kubernetes Reliability Rollout', description: 'Improved deployment resilience and cloud platform operations.' }
];

async function seed() {
  const driver = getDriver();
  const session = driver.session({ database: 'neo4j' });

  try {
    await session.run(`
      MATCH (n) DETACH DELETE n
    `);

    for (const user of userData) {
      await session.run(`
        CREATE (:User {id: $id, name: $name, role: $role, location: $location})
      `, user);
    }

    for (const skill of skillData) {
      await session.run(`
        CREATE (:Skill {id: $id, name: $name, category: $category})
      `, skill);
    }

    for (const company of companyData) {
      await session.run(`
        CREATE (:Company {id: $id, name: $name, industry: $industry})
      `, company);
    }

    for (const job of jobData) {
      await session.run(`
        CREATE (:Job {id: $id, name: $name, description: $description, salary: $salary})
      `, job);
    }

    for (const course of courseData) {
      await session.run(`
        CREATE (:Course {id: $id, title: $title, provider: $provider})
      `, course);
    }

    for (const project of projectData) {
      await session.run(`
        CREATE (:Project {id: $id, name: $name, description: $description})
      `, project);
    }

    const skillNameMap = new Map(skillData.map((skill) => [skill.name, skill.id]));
    const companyIdMap = new Map(companyData.map((company) => [company.name, company.id]));
    const jobIdMap = new Map(jobData.map((job) => [job.name, job.id]));
    const courseIdMap = new Map(courseData.map((course) => [course.title, course.id]));
    const projectIdMap = new Map(projectData.map((project) => [project.name, project.id]));

    const userSkillPairs = {
      u1: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'],
      u2: ['Java', 'Spring Boot', 'Microservices', 'SQL'],
      u3: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      u4: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      u5: ['JavaScript', 'React', 'UX Research'],
      u6: ['Cloud Architecture', 'Docker', 'Kubernetes', 'System Design'],
      u7: ['Python', 'SQL', 'System Design', 'Cybersecurity'],
      u8: ['Statistics', 'Data Analysis', 'A/B Testing'],
      u9: ['Docker', 'Kubernetes', 'Cloud Architecture', 'Python'],
      u10: ['Python', 'Machine Learning', 'Natural Language Processing', 'Prompt Engineering']
    };

    for (const [userId, skills] of Object.entries(userSkillPairs)) {
      for (const skillName of skills) {
        await session.run(`
          MATCH (u:User {id: $userId})
          MATCH (s:Skill {name: $skillName})
          MERGE (u)-[:HAS_SKILL]->(s)
        `, { userId, skillName });
      }
    }

    const relatedPairs = [
      ['Python', 'Machine Learning'],
      ['Python', 'Data Analysis'],
      ['SQL', 'Data Analysis'],
      ['JavaScript', 'React'],
      ['React', 'JavaScript'],
      ['React', 'TypeScript'],
      ['TypeScript', 'Node.js'],
      ['Java', 'Spring Boot'],
      ['Spring Boot', 'Microservices'],
      ['Microservices', 'API Design'],
      ['AWS', 'Docker'],
      ['AWS', 'Kubernetes'],
      ['Kubernetes', 'Terraform'],
      ['Machine Learning', 'TensorFlow'],
      ['Machine Learning', 'PyTorch'],
      ['Machine Learning', 'Natural Language Processing'],
      ['Cloud Architecture', 'Docker'],
      ['Cloud Architecture', 'Kubernetes'],
      ['System Design', 'API Design'],
      ['Data Visualization', 'SQL'],
      ['Statistics', 'Causal Inference'],
      ['Prompt Engineering', 'Natural Language Processing'],
      ['Graph Databases', 'SQL'],
      ['GraphQL', 'API Design']
    ];

    for (const [source, target] of relatedPairs) {
      await session.run(`
        MATCH (s:Skill {name: $source}), (t:Skill {name: $target})
        MERGE (s)-[:RELATED_TO]->(t)
      `, { source, target });
    }

    const jobRequirements = {
      'AI Engineer': ['Python', 'Machine Learning', 'PyTorch', 'Model Deployment'],
      'Data Analyst': ['SQL', 'Python', 'Data Analysis', 'Data Visualization'],
      'Frontend Engineer': ['JavaScript', 'React', 'API Design'],
      'Cloud Engineer': ['Cloud Architecture', 'Docker', 'Kubernetes', 'System Design'],
      'Product Analyst': ['SQL', 'Data Analysis', 'A/B Testing', 'Product Strategy'],
      'ML Engineer': ['Python', 'Machine Learning', 'TensorFlow', 'Model Deployment'],
      'Full Stack Engineer': ['JavaScript', 'Node.js', 'React', 'API Design'],
      'Data Engineer': ['SQL', 'ETL Pipelines', 'Python', 'Cloud Architecture'],
      'Product Manager': ['Product Strategy', 'SQL', 'Data Analysis'],
      'Research Scientist': ['Python', 'Machine Learning', 'Statistics', 'Prompt Engineering'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'Cloud Architecture', 'System Design'],
      'Backend Engineer': ['Node.js', 'API Design', 'System Design', 'Python'],
      'Java Backend Engineer': ['Java', 'Spring Boot', 'Microservices', 'SQL'],
      'Senior Frontend Engineer': ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      'Cloud Architect': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'System Design']
    };

    for (const [jobName, skillNames] of Object.entries(jobRequirements)) {
      const jobId = jobIdMap.get(jobName);
      for (const skillName of skillNames) {
        await session.run(`
          MATCH (j:Job {id: $jobId})
          MATCH (s:Skill {name: $skillName})
          MERGE (s)-[:REQUIRED_FOR]->(j)
        `, { jobId, skillName });
      }
    }

    const companyJobs = {
      'Microsoft': ['AI Engineer', 'ML Engineer', 'Cloud Engineer'],
      'Google': ['Research Scientist', 'AI Engineer', 'Data Engineer'],
      'Amazon': ['AI Engineer', 'Backend Engineer', 'Data Engineer', 'Cloud Architect'],
      'Meta': ['Product Analyst', 'Data Analyst', 'Frontend Engineer'],
      'Stripe': ['Full Stack Engineer', 'Product Analyst', 'Data Analyst'],
      'Databricks': ['Data Engineer', 'ML Engineer', 'Data Analyst'],
      'Shopify': ['Frontend Engineer', 'Product Manager', 'Data Analyst'],
      'Airbnb': ['Product Manager', 'Data Analyst', 'Research Scientist'],
      'Netflix': ['Product Analyst', 'Data Analyst', 'Frontend Engineer'],
      'Snowflake': ['Data Engineer', 'Cloud Engineer', 'AI Engineer'],
      'GitHub': ['Senior Frontend Engineer', 'Cloud Architect', 'Java Backend Engineer'],
      'Uber': ['Java Backend Engineer', 'Senior Frontend Engineer', 'Cloud Architect']
    };

    for (const [companyName, jobs] of Object.entries(companyJobs)) {
      const companyId = companyIdMap.get(companyName);
      if (!companyId) {
        console.warn(`Skipping company relationship for unknown company: ${companyName}`);
        continue;
      }

      for (const jobName of jobs) {
        const jobId = jobIdMap.get(jobName);
        if (!jobId) {
          console.warn(`Skipping company/job relationship: company=${companyName}, missing job=${jobName}`);
          continue;
        }

        await session.run(`
          MATCH (c:Company {id: $companyId})
          MATCH (j:Job {id: $jobId})
          MERGE (j)-[:OFFERED_BY]->(c)
        `, { companyId, jobId });
      }
    }

    const courseSkills = {
      'Deep Learning Fundamentals': ['Machine Learning', 'PyTorch'],
      'PyTorch Essentials': ['PyTorch', 'Model Deployment'],
      'Modern React Patterns': ['React', 'JavaScript'],
      'Advanced SQL for Analysts': ['SQL', 'Data Analysis'],
      'Data Modeling with Graphs': ['Graph Databases', 'SQL'],
      'Cloud Architecture and Design': ['Cloud Architecture', 'System Design'],
      'Product Analytics Foundations': ['Product Strategy', 'A/B Testing'],
      'NLP for Practitioners': ['Natural Language Processing', 'Prompt Engineering'],
      'Kubernetes in Practice': ['Kubernetes', 'Docker'],
      'System Design Interview Prep': ['System Design', 'API Design'],
      'Experimentation and A/B Testing': ['A/B Testing', 'Product Strategy'],
      'Python for Data Science': ['Python', 'Data Analysis'],
      'Java Spring Boot Mastery': ['Java', 'Spring Boot', 'Microservices'],
      'TypeScript for Frontend Architects': ['TypeScript', 'React', 'Node.js'],
      'AWS Cloud Foundations': ['AWS', 'Cloud Architecture', 'Terraform'],
      'Terraform for Production': ['Terraform', 'AWS', 'CI/CD']
    };

    for (const [courseName, skillNames] of Object.entries(courseSkills)) {
      const courseId = courseIdMap.get(courseName);
      for (const skillName of skillNames) {
        await session.run(`
          MATCH (c:Course {id: $courseId})
          MATCH (s:Skill {name: $skillName})
          MERGE (c)-[:TEACHES]->(s)
        `, { courseId, skillName });
      }
    }

    const projectSkills = {
      'Customer Insights Dashboard': ['SQL', 'Data Visualization'],
      'Demand Forecasting Engine': ['Python', 'Statistics', 'Data Analysis'],
      'Career Graph Explorer': ['Graph Databases', 'SQL', 'React'],
      'Recommendation Service': ['Python', 'Machine Learning', 'SQL'],
      'SaaS Analytics Platform': ['Data Analysis', 'SQL', 'ETL Pipelines'],
      'Deployment Automation': ['Docker', 'Kubernetes', 'Cloud Architecture'],
      'Graph Knowledge Base': ['Graph Databases', 'API Design', 'Python'],
      'Search Personalization': ['Python', 'SQL', 'Data Analysis'],
      'ML Ops Pipeline': ['Machine Learning', 'PyTorch', 'Model Deployment'],
      'UX Testing Lab': ['UX Research', 'A/B Testing', 'React'],
      'Microservice Migration': ['Java', 'Spring Boot', 'Microservices'],
      'Global Frontend Platform': ['React', 'TypeScript', 'Node.js'],
      'Kubernetes Reliability Rollout': ['AWS', 'Docker', 'Kubernetes', 'Terraform']
    };

    for (const [projectName, skillNames] of Object.entries(projectSkills)) {
      const projectId = projectIdMap.get(projectName);
      if (!projectId) {
        console.warn(`Skipping project relationship for unknown project: ${projectName}`);
        continue;
      }

      for (const skillName of skillNames) {
        await session.run(`
          MATCH (p:Project {id: $projectId})
          MATCH (s:Skill {name: $skillName})
          MERGE (p)-[:USES]->(s)
        `, { projectId, skillName });
      }
    }

    for (const [userId, skillNames] of Object.entries(userSkillPairs)) {
      const completedCourse = skillNames.includes('Machine Learning') ? 'Deep Learning Fundamentals' : 'Python for Data Science';
      const courseId = courseIdMap.get(completedCourse);
      if (courseId) {
        await session.run(`
          MATCH (u:User {id: $userId})
          MATCH (c:Course {id: $courseId})
          MERGE (u)-[:COMPLETED]->(c)
        `, { userId, courseId });
      }
    }

    console.log('Seeded SkillGraph graph database successfully');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    throw error;
  } finally {
    await closeDriver();
  }
}

seed();
