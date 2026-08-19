import { useEffect, useState } from 'react';
import { getRecommendations, getJobById } from '../services/api';

function computeMatchScore(match = {}) {
  const matched = Array.isArray(match.matchedSkills) ? match.matchedSkills.length : 0;
  const missing = Array.isArray(match.missingSkills) ? match.missingSkills.length : 0;
  const total = matched + missing || 1;
  return Math.min(99, Math.max(35, Math.round((matched / total) * 100)));
}

function JobDetails({ userId }) {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      const data = await getRecommendations(userId);
      const uniqueJobs = Array.from(new Map((data || []).map((item) => [item.job, item])).values());
      setJobs(uniqueJobs);

      if (uniqueJobs[0]?.job) {
        const details = await getJobById(uniqueJobs[0].job);
        setActiveJob({ ...uniqueJobs[0], ...details, name: details?.name || uniqueJobs[0].job });
      } else {
        setActiveJob(null);
      }
    } catch (err) {
      setError('Unable to load your career graph');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  const selectJob = async (jobName) => {
    try {
      const match = jobs.find((item) => item.job === jobName);
      if (!match) return;
      const details = await getJobById(jobName);
      setActiveJob({ ...match, ...details, name: details?.name || match.job });
    } catch {
      setError('Unable to load your career graph');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton-block small" />
        <div className="job-layout">
          <div className="skeleton-card tall" />
          <div className="skeleton-card tall" />
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
          <p className="eyebrow">Opportunities</p>
          <h2>Job Details</h2>
        </div>
      </header>

      {jobs.length === 0 ? (
        <div className="empty-state-panel">
          <div className="empty-icon">◎</div>
          <h3>No roles connected to this employee</h3>
          <p>Your graph does not currently show any role matches.</p>
        </div>
      ) : (
        <div className="job-layout">
          <div className="job-list card surface-card">
            {jobs.map((job) => (
              <button
                key={job.job}
                type="button"
                className={`job-item ${activeJob?.name === job.job ? 'selected' : ''}`}
                onClick={() => selectJob(job.job)}
              >
                <div>
                  <strong>{job.job}</strong>
                  <span>{job.company}</span>
                </div>
                <span className="badge badge-success">{computeMatchScore(job)}%</span>
              </button>
            ))}
          </div>

          <div className="card surface-card detail-panel">
            {activeJob ? (
              <>
                <div className="section-header compact">
                  <div>
                    <p className="eyebrow">Target role</p>
                    <h3>{activeJob.name}</h3>
                  </div>
                  <span className="badge badge-success">{computeMatchScore(activeJob)}% match</span>
                </div>

                <p className="muted-text">{activeJob.company?.name || activeJob.company || 'Company not yet mapped'}</p>
                <p>{activeJob.description || 'Role description is available in the graph.'}</p>

                <div className="detail-grid compact-grid">
                  <div>
                    <p className="label">Salary</p>
                    <strong>{activeJob.salary ? `$${activeJob.salary.toLocaleString()}` : 'Open'}</strong>
                  </div>
                  <div>
                    <p className="label">Connected company</p>
                    <strong>{activeJob.company?.name || activeJob.company || 'Open'}</strong>
                  </div>
                </div>

                <div className="mini-section">
                  <p className="label">Your path to this role</p>
                  <div className="path-flow" aria-label="Path to role">
                    <span className="path-token">Current skills</span>
                    <span className="arrow">→</span>
                    <span className="path-token">Related skills</span>
                    <span className="arrow">→</span>
                    <span className="path-token">{activeJob.name}</span>
                    <span className="arrow">→</span>
                    <span className="path-token">{activeJob.company?.name || activeJob.company || 'Company'}</span>
                  </div>
                </div>

                <div className="detail-grid compact-grid">
                  <div>
                    <p className="label">Matching skills</p>
                    <div className="tag-list">
                      {(activeJob.matchedSkills || []).map((skill) => (
                        <span key={skill} className="tag tag-success">✓ {skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label">Missing skills</p>
                    <div className="tag-list">
                      {(activeJob.missingSkills || []).map((skill) => (
                        <span key={skill} className="tag tag-warning">+ {skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mini-section">
                  <p className="label">Related courses</p>
                  <ul className="inline-list">
                    {(activeJob.courses || []).slice(0, 3).map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="empty-state-panel compact">
                <div className="empty-icon">◎</div>
                <h3>Select a role</h3>
                <p>Choose a career path to explore the detailed graph fit.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
