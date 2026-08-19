# SkillGraph — Career & Skill Graph Explorer

## Overview
SkillGraph is a graph-powered career recommendation application built with React, Vite, Express, and CognoDB. It models users, skills, courses, jobs, companies, and projects as a connected graph so users can explore career paths, missing skills, and relevant learning opportunities.

## Problem
Career planning is rarely linear. People accumulate skills across languages, tools, and domains, yet most career recommendation systems flatten that information into static lists. SkillGraph helps surface hidden relationships between what a user knows, what they are missing, and where they may fit next.

## Features
- Personalized dashboard with career signals
- User skill profile view
- Multi-hop skill-to-job traversal
- Recommendations for missing skills and courses
- Job detail and company matching views
- Searchable skills explorer
- Graph explorer that visualizes connected nodes and relationships
- Error handling for unavailable CognoDB connections

## Why a graph database?
A graph database represents real-world relationships naturally. In a career context, a person is connected to skills, skills connect to other skills, and skills connect to jobs, companies, and courses. This is a graph problem by nature rather than a table problem.

## Architecture
Frontend: React + Vite + JavaScript
Backend: Node.js + Express
Database driver: Neo4j JavaScript driver
Database: CognoDB Cloud

User interactions flow from the React frontend into the Express API, which executes parameterized Cypher queries through the Neo4j driver against CognoDB.

## Graph data model
### Node types
- User
- Skill
- Job
- Company
- Course
- Project

### Relationship types
- (User)-[:HAS_SKILL]->(Skill)
- (Skill)-[:RELATED_TO]->(Skill)
- (Skill)-[:REQUIRED_FOR]->(Job)
- (Job)-[:OFFERED_BY]->(Company)
- (Course)-[:TEACHES]->(Skill)
- (Project)-[:USES]->(Skill)
- Optional: (User)-[:COMPLETED]->(Course)
- Optional: (User)-[:WORKED_ON]->(Project)

## Important Cypher queries
```cypher
MATCH (u:User {id: $userId})
  -[:HAS_SKILL]->(s:Skill)
  -[:RELATED_TO]->(related:Skill)
  -[:REQUIRED_FOR]->(j:Job)
  -[:OFFERED_BY]->(c:Company)
RETURN related, j, c
```

```cypher
MATCH (u:User {id: $userId})-[:HAS_SKILL]->(known:Skill)
MATCH (known)-[:RELATED_TO]->(related:Skill)
OPTIONAL MATCH (related)-[:REQUIRED_FOR]->(job:Job)
OPTIONAL MATCH (job)-[:OFFERED_BY]->(company:Company)
OPTIONAL MATCH (related)<-[:TEACHES]-(course:Course)
RETURN related, job, company, collect(DISTINCT course)
```

## Multi-hop traversal explanation
Multi-hop traversal is the ability to follow relationships through more than one edge. In this project, the system starts from a User, follows skills, then related skills, then required jobs, then companies. This reveals not just direct matches but entire career pathways and employment opportunities hidden in the graph.

This traversal is naturally represented by a graph because the data is relational and networked. A SQL table would require many joins and additional logic; a graph database stores the relationships as first-class citizens and can follow them efficiently.

## Project structure
```text
skillgraph/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── queries/
│   │   ├── middleware/
│   │   ├── app.js
│   │   └── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── README.md
├── INTERVIEW_NOTES.md
├── DEMO_SCRIPT.md
└── .gitignore
```

## CognoDB setup
This project expects a CognoDB Cloud instance. Configure your environment with the following values.

### Environment variables
Create a `.env` file in the backend directory with:

```env
COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password
PORT=5001
```

The project also includes `.env.example` as a template.

## Local setup
### 1. Install backend dependencies
```bash
cd skillgraph/backend
npm install
```

### 2. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env` and add your CognoDB credentials.

## Seed instructions
```bash
cd skillgraph/backend
npm run seed
```

The seed script creates realistic users, skills, jobs, companies, courses, projects, and all necessary relationships.

## Running instructions
### Start backend
```bash
cd skillgraph/backend
npm run dev
```

### Start frontend
```bash
cd skillgraph/frontend
npm run dev
```

The frontend automatically proxies requests to the Express API.

## Screenshots
Add screenshots here after you run the app locally or capture a demo environment.

## Deployment instructions
- Provision a CognoDB Cloud database instance.
- Set environment variables in your deployment platform.
- Build the frontend:
  ```bash
  cd skillgraph/frontend
  npm run build
  ```
- Serve the frontend static assets with the platform of your choice.
- Run the backend as a Node.js service with the same environment vars.

## Demo link placeholder
https://your-demo-link.example.com

## Why this project matters
SkillGraph demonstrates that graph modeling naturally supports career discovery. The relationships between a user, skills, learning content, jobs, and employers can all be traversed and explained visually, which is a strong match for graph database use cases.
