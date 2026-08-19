const CAREER_PATH_QUERY = `
  MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)
  MATCH (s)-[:RELATED_TO]->(related:Skill)
  MATCH (related)-[:REQUIRED_FOR]->(j:Job {id: $jobId})
  MATCH (j)-[:OFFERED_BY]->(c:Company)
  RETURN {
    userId: u.id,
    skill: s.name,
    relatedSkill: related.name,
    job: j.name,
    company: c.name,
    jobDescription: j.description,
    companyIndustry: c.industry,
    salary: j.salary
  } AS result
  ORDER BY j.salary DESC
`;

const RECOMMENDATION_QUERY = `
  MATCH (u:User {id: $userId})-[:HAS_SKILL]->(known:Skill)
  MATCH (known)-[:RELATED_TO]->(related:Skill)
  MATCH (related)-[:REQUIRED_FOR]->(job:Job)
  MATCH (job)-[:OFFERED_BY]->(company:Company)
  OPTIONAL MATCH (job)<-[:REQUIRED_FOR]-(jobSkill:Skill)
  OPTIONAL MATCH (related)<-[:TEACHES]-(course:Course)
  WITH u, known, related, job, company,
       collect(DISTINCT jobSkill.name) AS requiredSkills,
       collect(DISTINCT course.title) AS courseTitles,
       collect(DISTINCT known.name) AS userSkillNames
  WITH DISTINCT u, known, related, job, company,
       requiredSkills,
       courseTitles,
       userSkillNames,
       [skill IN requiredSkills WHERE NOT skill IN userSkillNames] AS missingSkills,
       [skill IN requiredSkills WHERE skill IN userSkillNames] AS matchedSkills
  RETURN {
    currentSkill: known.name,
    relatedSkill: related.name,
    job: job.name,
    company: company.name,
    matchedSkills: matchedSkills,
    missingSkills: missingSkills,
    courses: CASE WHEN size(courseTitles) = 0 THEN [] ELSE courseTitles END,
    jobSalary: job.salary,
    companyIndustry: company.industry
  } AS result
  ORDER BY job.salary DESC
`;

const GRAPH_QUERY = `
  MATCH (u:User {id: $id})
  OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (s)-[:RELATED_TO]->(related:Skill)
  OPTIONAL MATCH (related)-[:REQUIRED_FOR]->(job:Job)
  OPTIONAL MATCH (job)-[:OFFERED_BY]->(company:Company)
  OPTIONAL MATCH (s)<-[:TEACHES]-(course:Course)
  RETURN u, s, related, job, company, course
`;

const SEARCH_QUERY = `
  MATCH (n)
  WHERE toLower(coalesce(n.name, '')) CONTAINS toLower($query)
     OR toLower(coalesce(n.title, '')) CONTAINS toLower($query)
     OR toLower(coalesce(n.description, '')) CONTAINS toLower($query)
  RETURN n
  LIMIT 25
`;

const USER_WITH_SKILLS = `
  MATCH (u:User {id: $userId})
  OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
  RETURN u, collect(s) AS skills
`;

const JOB_DETAILS_QUERY = `
  MATCH (j:Job {id: $jobId})
  OPTIONAL MATCH (j)-[:OFFERED_BY]->(company:Company)
  OPTIONAL MATCH (requiredSkill:Skill)-[:REQUIRED_FOR]->(j)
  OPTIONAL MATCH (related:Skill)-[:RELATED_TO]->(requiredSkill)
  RETURN j, company, collect(DISTINCT requiredSkill) AS requiredSkills,
         collect(DISTINCT related) AS relatedSkills
`;

const SKILLS_BY_USER_QUERY = `
  MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)
  RETURN collect(s) AS skills
`;

module.exports = {
  CAREER_PATH_QUERY,
  RECOMMENDATION_QUERY,
  GRAPH_QUERY,
  SEARCH_QUERY,
  USER_WITH_SKILLS,
  JOB_DETAILS_QUERY,
  SKILLS_BY_USER_QUERY
};
