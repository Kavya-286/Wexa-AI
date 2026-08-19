const express = require('express');
const {
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
} = require('../services/graphService');

const router = express.Router();

router.get('/health', async (req, res, next) => {
  try {
    res.json({ status: 'ok', service: 'SkillGraph' });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const data = await getUsers();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const data = await getUserById(req.params.id);
    if (!data) return res.status(404).json({ message: 'User not found.' });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/skills', async (req, res, next) => {
  try {
    const data = await getSkills();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/skills/:id', async (req, res, next) => {
  try {
    const data = await getSkillById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Skill not found.' });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/jobs', async (req, res, next) => {
  try {
    const data = await getJobs();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/jobs/:id', async (req, res, next) => {
  try {
    const data = await getJobById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Job not found.' });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/companies', async (req, res, next) => {
  try {
    const data = await getCompanies();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/courses', async (req, res, next) => {
  try {
    const data = await getCourses();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/projects', async (req, res, next) => {
  try {
    const data = await getProjects();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/recommendations/:userId', async (req, res, next) => {
  try {
    const data = await getRecommendations(req.params.userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/career-path/:userId/:jobId', async (req, res, next) => {
  try {
    const data = await getCareerPath(req.params.userId, req.params.jobId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/graph/:id', async (req, res, next) => {
  try {
    const data = await getGraph(req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const data = await search(query);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
