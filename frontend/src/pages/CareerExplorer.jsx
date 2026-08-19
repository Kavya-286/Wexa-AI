import { useEffect, useState } from 'react';
import { getRecommendations, getUserById } from '../services/api';

function computeMatchScore(match = {}) {
  const matched = Array.isArray(match.matchedSkills) ? match.matchedSkills.length : 0;
  const missing = Array.isArray(match.missingSkills) ? match.missingSkills.length : 0;
  const total = matched + missing || 1;
  return Math.min(99, Math.max(35, Math.round((matched / total) * 100)));
}

function CareerExplorer({ userId }) {
  const [matches, setMatches] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
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
      setUserSkills((userData?.skills || []).map((skill) => skill.name));
      setMatches(sorted.slice(0, 6));
    } catch (err) {
      setError('Unable to load your career graph');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton-block small" />
        <div className="content-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton-card tall" />
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
          <p className="eyebrow">Career paths</p>
          <h2>Career Explorer</h2>
        </div>
      </header>

      {matches.length === 0 ? (
        <div className="empty-state-panel">
          <div className="empty-icon">◎</div>
          <h3>No career matches yet</h3>
          <p>There are no role matches connected to this employee profile.</p>
        </div>
      ) : (
        <section className="content-grid">
          {matches.map((match, index) => {
            const score = computeMatchScore(match);
            return (
              <div key={`${match.job}-${index}`} className="card surface-card role-card">
                <div className="section-header compact">
                  <div>
                    <p className="eyebrow">Role match</p>
                    <h3>{match.job}</h3>
                  </div>
                  <span className="badge badge-success">{score}%</span>
                </div>

                <p className="muted-text">{match.company}</p>

                <div className="path-flow" aria-label="Career path flow">
                  <span className="path-token">{match.currentSkill || 'Current skill'}</span>
                  <span className="arrow">→</span>
                  <span className="path-token">{match.relatedSkill || 'Related skill'}</span>
                  <span className="arrow">→</span>
                  <span className="path-token">{match.job}</span>
                  <span className="arrow">→</span>
                  <span className="path-token">{match.company}</span>
                </div>

                <div className="progress-block">
                  <div className="progress-header">
                    <span>Match strength</span>
                    <strong>{score}%</strong>
                  </div>
                  <div className="progress-track" aria-hidden="true">
                    <div className="progress-fill" style={{ width: `${score}%` }} />
                  </div>
                </div>

                <div className="detail-grid compact-grid">
                  <div>
                    <p className="label">You have</p>
                    <div className="tag-list">
                      {(match.matchedSkills || []).map((skill) => (
                        <span key={skill} className="tag tag-success">✓ {skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label">Skill gaps</p>
                    <div className="tag-list">
                      {(match.missingSkills || []).map((skill) => (
                        <span key={skill} className="tag tag-warning">+ {skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mini-section">
                  <p className="label">Why this role?</p>
                  <p className="muted-text">
                    Your {match.currentSkill || 'core skill'} foundation is already aligned to this role, and {match.missingSkills?.[0] || 'targeted adjacent skills'} are the main unlocks.
                  </p>
                </div>

                {(match.courses || []).length > 0 ? (
                  <div className="mini-section">
                    <p className="label">Recommended learning</p>
                    <ul className="inline-list">
                      {(match.courses || []).slice(0, 3).map((course) => (
                        <li key={course}>{course}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </section>
      )}

      <section className="card surface-card">
        <div className="section-header compact">
          <div>
            <p className="eyebrow">Current profile</p>
            <h3>Skill landscape</h3>
          </div>
        </div>
        <div className="tag-list">
          {userSkills.map((skill) => (
            <span key={skill} className="tag tag-neutral">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CareerExplorer;
