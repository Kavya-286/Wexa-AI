import { useEffect, useState } from 'react';
import { getSkills, getJobs, getCompanies, getCourses, searchSkills } from '../services/api';

function SkillsExplorer({ userId }) {
  const [skills, setSkills] = useState([]);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobData, setJobData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const [skillData, jobs, companies, courses] = await Promise.all([
        getSkills(),
        getJobs(),
        getCompanies(),
        getCourses()
      ]);

      setSkills(skillData || []);
      setJobData(jobs || []);
      setCompanyData(companies || []);
      setCourseData(courses || []);
      setResults((skillData || []).slice(0, 10));
    } catch (err) {
      setError('Unable to load your career graph');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [userId]);

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults(skills.slice(0, 10));
      return;
    }

    try {
      const matches = await searchSkills(value);
      setResults((matches || []).slice(0, 12));
    } catch {
      setError('Unable to load your career graph');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton-block small" />
        <div className="skeleton-card large" />
        <div className="skills-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state-panel error-panel">
        <div className="empty-icon">!</div>
        <h3>Unable to load your career graph</h3>
        <p>We couldn't reach the SkillGraph service.</p>
        <button type="button" className="button button-primary" onClick={load}>Try again</button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Explore</p>
          <h2>Skill Explorer</h2>
        </div>
      </header>

      <div className="card surface-card search-box">
        <input
          aria-label="Search skills"
          type="text"
          value={query}
          placeholder="Search for a skill or capability…"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {results.length === 0 ? (
        <div className="empty-state-panel">
          <div className="empty-icon">◎</div>
          <h3>No skills connected to that search</h3>
          <p>Try another skill name or browse the current graph.</p>
        </div>
      ) : (
        <div className="skills-grid">
          {results.map((skill) => {
            const skillName = skill.name || skill.title || 'Skill';
            const relatedJobs = jobData.filter((job) => (job.name || '').toLowerCase().includes(skillName.toLowerCase().split(' ')[0] || ''));
            const relatedCompanies = companyData.slice(0, 2);
            const relatedCourses = courseData.filter((course) => (course.title || '').toLowerCase().includes(skillName.toLowerCase().split(' ')[0] || '')).slice(0, 2);

            return (
              <div key={skill.id || skill.name} className="skill-card interactive">
                <div className="skill-card-header">
                  <div className="skill-dot" />
                  <div>
                    <h4>{skillName}</h4>
                    <small>{skill.category || 'Skill'}</small>
                  </div>
                </div>

                <div className="mini-section compact">
                  <p className="label">Related jobs</p>
                  <div className="tag-list">
                    {relatedJobs.length ? relatedJobs.slice(0, 2).map((job) => (
                      <span key={job.id || job.name} className="tag tag-neutral">{job.name}</span>
                    )) : <span className="tag tag-neutral">Graph-based role</span>}
                  </div>
                </div>

                <div className="mini-section compact">
                  <p className="label">Companies</p>
                  <div className="tag-list">
                    {relatedCompanies.length ? relatedCompanies.slice(0, 2).map((company) => (
                      <span key={company.id || company.name} className="tag tag-neutral">{company.name}</span>
                    )) : <span className="tag tag-neutral">Across roles</span>}
                  </div>
                </div>

                <div className="mini-section compact">
                  <p className="label">Learning</p>
                  <div className="tag-list">
                    {relatedCourses.length ? relatedCourses.slice(0, 2).map((course) => (
                      <span key={course.id || course.title} className="tag tag-success">{course.title}</span>
                    )) : <span className="tag tag-success">Career path course</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SkillsExplorer;
