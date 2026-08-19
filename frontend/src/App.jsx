import { Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import MySkills from './pages/MySkills';
import CareerExplorer from './pages/CareerExplorer';
import JobDetails from './pages/JobDetails';
import SkillsExplorer from './pages/SkillsExplorer';
import GraphExplorer from './pages/GraphExplorer';
import { getHealth, getUsers } from './services/api';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/skills', label: 'My Skills' },
  { to: '/explorer', label: 'Career Paths' },
  { to: '/jobs', label: 'Opportunities' },
  { to: '/skills-explorer', label: 'Skill Explorer' },
  { to: '/graph', label: 'Graph Explorer' }
];

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('u1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const health = await getHealth();
        if (health && health.status !== 'ok') {
          setError('Unable to load your career graph');
          return;
        }

        const list = await getUsers();
        setUsers(list || []);
        if (list && list.length > 0 && !list.some((user) => user.id === selectedUser)) {
          setSelectedUser(list[0].id);
        }
      } catch (err) {
        setError('Unable to load your career graph');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const activeUser = users.find((user) => user.id === selectedUser) || users[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">S</div>
          <div>
            <h1>SkillGraph</h1>
            <small>Career Intelligence</small>
          </div>
        </div>

        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="user-panel">
          <div className="user-panel-header">
            <span className="eyebrow">Current employee</span>
          </div>
          <div className="employee-selector-wrap">
            <select
              aria-label="Select current employee"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          {activeUser ? (
            <div className="employee-summary">
              <div className="employee-dot" />
              <div>
                <strong>{activeUser.name}</strong>
                <small>{activeUser.role || 'Career profile'}</small>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      <main className="main-panel">
        {loading ? (
          <div className="page-skeleton">
            <div className="skeleton-header" />
            <div className="skeleton-grid-4" />
            <div className="skeleton-grid-2" />
          </div>
        ) : null}
        {error && !loading ? (
          <div className="empty-state-panel error-panel">
            <div className="empty-icon">!</div>
            <h3>Unable to load your career graph</h3>
            <p>We couldn't reach the SkillGraph service.</p>
            <button type="button" className="button button-primary" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        ) : null}
        {!loading && !error ? (
          <Routes>
            <Route path="/" element={<Dashboard userId={selectedUser} />} />
            <Route path="/skills" element={<MySkills userId={selectedUser} />} />
            <Route path="/explorer" element={<CareerExplorer userId={selectedUser} />} />
            <Route path="/jobs" element={<JobDetails userId={selectedUser} />} />
            <Route path="/skills-explorer" element={<SkillsExplorer userId={selectedUser} />} />
            <Route path="/graph" element={<GraphExplorer userId={selectedUser} />} />
          </Routes>
        ) : null}
      </main>
    </div>
  );
}

export default App;
