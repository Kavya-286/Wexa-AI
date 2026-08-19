import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations, getUserById } from '../services/api';

function computeMatchScore(match = {}) {
  const matched = Array.isArray(match.matchedSkills) ? match.matchedSkills.length : 0;
  const missing = Array.isArray(match.missingSkills) ? match.missingSkills.length : 0;
  const total = matched + missing || 1;
  return Math.min(99, Math.max(35, Math.round((matched / total) * 100)));
}

function Dashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      const [userData, recData] = await Promise.all([
        getUserById(userId),
        getRecommendations(userId)
      ]);

      const sorted = [...(recData || [])].sort((a, b) => computeMatchScore(b) - computeMatchScore(a));
      setUser(userData);
      setRecommendations(sorted);
    } catch (err) {
      setError('Unable to load your career graph');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  const strongestRole = recommendations[0] || null;
  const strongestScore = strongestRole ? computeMatchScore(strongestRole) : 0;
  const uniqueCompanies = Array.from(new Map((recommendations || []).map((item) => [item.company, item.company])).values()).filter(Boolean);
  const uniqueMissingSkills = Array.from(new Set((recommendations || []).flatMap((item) => item.missingSkills || []))).slice(0, 6);
  const insightText = strongestRole
    ? `Your ${user?.skills?.slice(0, 2).map((skill) => skill.name).join(' + ') || 'core skills'} combination connects you to ${recommendations.length} roles. Adding ${strongestRole.missingSkills?.[0] || 'key adjacent skills'} unlocks additional opportunities.`
    : 'Your graph is still developing. Explore more roles to surface new opportunities.';

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton-block large" />
        <div className="stats-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
        <div className="content-grid">
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
          <p className="eyebrow">Overview</p>
          <h2>Good morning, {user?.name || 'Employee'}</h2>
          <p className="page-subtitle">
            Your career graph connects your skills to {recommendations.length || 0} relevant opportunities.
          </p>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card primary">
          <span>Total Skills</span>
          <strong>{user?.skills?.length || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Career Matches</span>
          <strong>{recommendations.length}</strong>
        </div>
        <div className="stat-card">
          <span>Skill Gaps</span>
          <strong>{uniqueMissingSkills.length}</strong>
        </div>
        <div className="stat-card">
          <span>Potential Companies</span>
          <strong>{uniqueCompanies.length}</strong>
        </div>
      </section>

      <section className="content-grid two-up">
        <div className="card surface-card">
          <div className="section-header compact">
            <div>
              <p className="eyebrow">Career readiness</p>
              <h3>{strongestRole?.job || 'Target role'}</h3>
            </div>
            <span className="badge badge-success">{strongestScore}% match</span>
          </div>

          <div className="readiness-row">
            <div className="readiness-score-ring" aria-label={`Career readiness score ${strongestScore}%`}>
              <span>{strongestScore}%</span>
            </div>
            <div className="readiness-copy">
              <p className="muted-text">{strongestRole?.company || 'Connected employer'}</p>
              <div className="tag-list">
                {(strongestRole?.matchedSkills || []).slice(0, 5).map((skill) => (
                  <span key={skill} className="tag tag-success">✓ {skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-header">
              <span>Readiness</span>
              <strong>{strongestScore}%</strong>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${strongestScore}%` }} />
            </div>
          </div>

          <div className="detail-grid compact-grid">
            <div>
              <p className="label">You have</p>
              <div className="tag-list">
                {(strongestRole?.matchedSkills || []).map((skill) => (
                  <span key={skill} className="tag tag-success">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="label">Missing</p>
              <div className="tag-list">
                {(strongestRole?.missingSkills || []).map((skill) => (
                  <span key={skill} className="tag tag-warning">+ {skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card surface-card">
          <div className="section-header compact">
            <div>
              <p className="eyebrow">Career insight</p>
              <h3>Graph signal</h3>
            </div>
          </div>
          <p className="insight-copy">{insightText}</p>
          <div className="mini-list">
            {recommendations.slice(0, 4).map((item) => (
              <div key={`${item.job}-${item.company}`} className="mini-row">
                <div>
                  <strong>{item.job}</strong>
                  <small>{item.company}</small>
                </div>
                <span className="badge badge-neutral">{computeMatchScore(item)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card surface-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Opportunity ranking</p>
            <h3>Top Career Paths</h3>
          </div>
          <Link to="/jobs" className="button button-secondary">Inspect roles</Link>
        </div>

        {recommendations.length === 0 ? (
          <div className="empty-state-panel">
            <div className="empty-icon">◎</div>
            <h3>No career matches yet</h3>
            <p>Add more skills or explore adjacent roles to generate a stronger roadmap.</p>
          </div>
        ) : (
          <div className="role-list">
            {recommendations.slice(0, 4).map((item) => {
              const score = computeMatchScore(item);
              return (
                <div key={`${item.job}-${item.company}`} className="role-item">
                  <div className="role-main">
                    <div>
                      <h4>{item.job}</h4>
                      <p>{item.company}</p>
                    </div>
                    <span className="badge badge-success">{score}% match</span>
                  </div>

                  <div className="progress-track" aria-hidden="true">
                    <div className="progress-fill" style={{ width: `${score}%` }} />
                  </div>

                  <div className="detail-grid compact-grid">
                    <div>
                      <p className="label">Matching skills</p>
                      <div className="tag-list">
                        {(item.matchedSkills || []).slice(0, 4).map((skill) => (
                          <span key={skill} className="tag tag-success">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="label">Skill gaps</p>
                      <div className="tag-list">
                        {(item.missingSkills || []).slice(0, 4).map((skill) => (
                          <span key={skill} className="tag tag-warning">+ {skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="role-actions">
                    <Link to="/jobs" className="button button-primary">Inspect career path</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
