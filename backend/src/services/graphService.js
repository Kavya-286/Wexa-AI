const { getDriver } = require('../config/db');
const {
  CAREER_PATH_QUERY,
  RECOMMENDATION_QUERY,
  GRAPH_QUERY,
  SEARCH_QUERY,
  USER_WITH_SKILLS,
  JOB_DETAILS_QUERY,
  SKILLS_BY_USER_QUERY
} = require('../queries/careerQueries');

async function runQuery(query, params = {}) {
  const driver = getDriver();
  const session = driver.session({ database: 'neo4j' });

  try {
    return await session.run(query, params);
  } catch (error) {
    throw error;
  } finally {
    await session.close();
  }
}

async function getUsers() {
  const result = await runQuery('MATCH (u:User) RETURN u ORDER BY u.name');
  return result.records.map((record) => record.get('u').properties);
}

async function getUserById(userId) {
  const result = await runQuery(USER_WITH_SKILLS, { userId });
  if (result.records.length === 0) {
    return null;
  }

  const record = result.records[0];
  const user = record.get('u').properties;
  const skills = record.get('skills').map((s) => s.properties);
  return { ...user, skills };
}

async function getSkills() {
  const result = await runQuery('MATCH (s:Skill) RETURN s ORDER BY s.name');
  return result.records.map((record) => record.get('s').properties);
}

async function getSkillById(skillId) {
  const result = await runQuery('MATCH (s:Skill {id: $skillId}) RETURN s', { skillId });
  if (result.records.length === 0) return null;
  return result.records[0].get('s').properties;
}

async function getJobs() {
  const result = await runQuery('MATCH (j:Job) RETURN j ORDER BY j.name');
  return result.records.map((record) => record.get('j').properties);
}

async function getJobById(jobId) {
  const result = await runQuery(`
    MATCH (j:Job)
    WHERE j.id = $jobId OR toLower(j.name) = toLower($jobId)
    OPTIONAL MATCH (j)-[:OFFERED_BY]->(company:Company)
    OPTIONAL MATCH (requiredSkill:Skill)-[:REQUIRED_FOR]->(j)
    RETURN j, company, collect(DISTINCT requiredSkill) AS requiredSkills
  `, { jobId });

  if (result.records.length === 0) return null;
  const record = result.records[0];
  const job = record.get('j').properties;
  const company = record.get('company') ? record.get('company').properties : null;
  const requiredSkills = record.get('requiredSkills') ? record.get('requiredSkills').map((skill) => skill.properties) : [];
  return { ...job, company, requiredSkills };
}

async function getCompanies() {
  const result = await runQuery('MATCH (c:Company) RETURN c ORDER BY c.name');
  return result.records.map((record) => record.get('c').properties);
}

async function getCourses() {
  const result = await runQuery('MATCH (c:Course) RETURN c ORDER BY c.title');
  return result.records.map((record) => record.get('c').properties);
}

async function getProjects() {
  const result = await runQuery('MATCH (p:Project) RETURN p ORDER BY p.name');
  return result.records.map((record) => record.get('p').properties);
}

async function getRecommendations(userId) {
  const result = await runQuery(RECOMMENDATION_QUERY, { userId });
  return result.records.map((record) => record.get('result'));
}

async function getCareerPath(userId, jobId) {
  const result = await runQuery(CAREER_PATH_QUERY, { userId, jobId });
  return result.records.map((record) => record.get('result'));
}

async function getGraph(id) {
  const result = await runQuery(GRAPH_QUERY, { id });
  const nodes = new Map();
  const links = [];

  result.records.forEach((record) => {
    const userNode = record.get('u');
    const skillNode = record.get('s');
    const relatedNode = record.get('related');
    const jobNode = record.get('job');
    const companyNode = record.get('company');
    const courseNode = record.get('course');

    const nodeEntries = [{ node: userNode, type: 'User' }, { node: skillNode, type: 'Skill' }, { node: relatedNode, type: 'Skill' }, { node: jobNode, type: 'Job' }, { node: companyNode, type: 'Company' }, { node: courseNode, type: 'Course' }];

    for (const entry of nodeEntries) {
      const n = entry.node;
      if (!n) continue;
      const props = n.properties;
      const idValue = props.id || props.name || props.title || Math.random().toString(16).slice(2);
      nodes.set(idValue, {
        id: idValue,
        label: props.name || props.title || props.id || entry.type,
        type: n.labels[0] || entry.type,
        ...props
      });
    }

    if (userNode && skillNode) {
      links.push({ source: userNode.properties.id, target: skillNode.properties.id, type: 'HAS_SKILL' });
    }
    if (skillNode && relatedNode) {
      links.push({ source: skillNode.properties.id, target: relatedNode.properties.id, type: 'RELATED_TO' });
    }
    if (relatedNode && jobNode) {
      links.push({ source: relatedNode.properties.id, target: jobNode.properties.id, type: 'REQUIRED_FOR' });
    }
    if (jobNode && companyNode) {
      links.push({ source: jobNode.properties.id, target: companyNode.properties.id, type: 'OFFERED_BY' });
    }
    if (courseNode && skillNode) {
      links.push({ source: courseNode.properties.id, target: skillNode.properties.id, type: 'TEACHES' });
    }
  });

  return {
    nodes: [...nodes.values()],
    links: links.filter((link, index, arr) => arr.findIndex((item) => item.source === link.source && item.target === link.target && item.type === link.type) === index)
  };
}

async function search(query) {
  const result = await runQuery(SEARCH_QUERY, { query });
  return result.records.map((record) => record.get('n').properties);
}

module.exports = {
  getUsers,
  getUserById,
  getSkills,
  getSkillById,
  getJobs,
  getJobById,
  getCompanies,
  getCourses,
  getProjects,
  getRecommendations,
  getCareerPath,
  getGraph,
  search
};
