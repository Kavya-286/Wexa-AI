import { useEffect, useState } from 'react';
import { getUserById } from '../services/api';

function MySkills({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      const data = await getUserById(userId);
      setUser(data);
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
          <p className="eyebrow">Profile</p>
          <h2>My Skills</h2>
        </div>
      </header>

      <div className="card surface-card profile-card">
        <div className="profile-meta">
          <div className="employee-dot large" />
          <div>
            <h3>{user?.name || 'Employee'}</h3>
            <p>{user?.role || 'Career profile'} · {user?.location || 'Multiple locations'}</p>
          </div>
        </div>
      </div>

      {user?.skills?.length ? (
        <div className="skills-grid">
          {(user.skills || []).map((skill) => (
            <div key={skill.id || skill.name} className="skill-card">
              <div className="skill-dot" />
              <div>
                <h4>{skill.name}</h4>
                <small>{skill.category || 'Skill'}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-panel">
          <div className="empty-icon">◎</div>
          <h3>No skills connected</h3>
          <p>This employee does not currently have skills mapped into the graph.</p>
        </div>
      )}
    </div>
  );
}

export default MySkills;
