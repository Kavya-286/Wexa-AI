# Interview Notes

## Why CognoDB?
CognoDB is a graph-native database that is well suited to representing connected career knowledge. It supports relationship-heavy queries without requiring complex joins or denormalization. For this project, it is a natural fit because users, skills, jobs, training, and employers are all connected in a network.

## Why graph database?
Graph databases are designed for relationships. In this project, a user is connected to skills, skills are connected to other skills, skills are connected to jobs, and jobs are connected to companies. Modeling this in a graph produces more intuitive data access and more meaningful traversal than static tables.

## Why not PostgreSQL?
PostgreSQL is excellent for tabular and transactional workloads, but it does not model networked relationships as naturally as a graph database. The career graph would require multiple joins, additional tables, and less-transparent traversal logic. Graph databases make relationship exploration the primary abstraction.

## What are nodes?
Nodes are the entities in the graph. In SkillGraph, nodes include User, Skill, Job, Company, Course, and Project. Each node has properties such as name, role, title, description, and category.

## What are relationships?
Relationships connect nodes and carry meaning. Examples include HAS_SKILL, RELATED_TO, REQUIRED_FOR, OFFERED_BY, TEACHES, and USES. They make the graph expressive and explain why a user may be a good fit for a role.

## What is multi-hop traversal?
Multi-hop traversal is the process of following multiple relationships to move from one node to another. In this app, we go from a User to a Skill to Related Skills to Jobs to Companies. That creates a career path view rather than a simple one-to-one lookup.

## Explain the recommendation query
The recommendation query starts from a user and their current skills, finds related skills, then checks which jobs require those skills and which companies offer those jobs. It also pulls recommended courses that teach the missing or adjacent skills. This creates a graph-based recommendation engine using connected data.

## Explain parameterized Cypher
Parameterized Cypher uses query variables instead of string concatenation. This avoids SQL/Cypher injection risk and keeps queries readable. For example, the userId is passed as a parameter instead of embedded directly into the graph query string.

## Explain backend architecture
The backend is a Node.js + Express service. It exposes REST API routes, calls graph service methods, and runs Neo4j/Cypher queries against CognoDB. This keeps the logic separated into routes, services, and queries so the application is maintainable and easy to test.

## Explain security
Security is handled by keeping database credentials in environment variables and never hardcoding them into source files. The project uses `.env.example` for documentation and `.env` for local secrets. Errors are also sanitized so the frontend never displays stack traces or credentials.

## Explain error handling
If the database cannot be reached, the backend returns an HTTP 503 error with a clear message and the frontend displays “Unable to connect to SkillGraph.” This ensures consumers see a useful message without exposing internal details.

## What would you improve with more time?
With more time, I would add authentication, richer skill weighting, advanced graph visualization controls, recommendation scoring, and a production-grade test suite. I would also add a more sophisticated job similarity model and a real user onboarding flow.
