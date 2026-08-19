import { useEffect, useState } from 'react';
import { getUserById, getGraph } from '../services/api';

function GraphExplorer({ userId }) {
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [depth, setDepth] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      const user = await getUserById(userId);
      const graphData = await getGraph(user.id);
      setGraph(graphData || { nodes: [], links: [] });
      setSelectedNode(user || graphData?.nodes?.[0] || null);
    } catch (err) {
      setError('Unable to load your career graph');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  const visibleNodes = (graph.nodes || []).filter((node) => {
    if (depth === 1) {
      return node.type === 'User' || node.type === 'Skill';
    }
    if (depth === 2) {
      return ['User', 'Skill', 'Job', 'Company'].includes(node.type);
    }
    return true;
  });

  const connectedNodes = selectedNode
    ? (graph.links || []).filter(
        (link) => link.source === selectedNode.id || link.target === selectedNode.id
      )
    : [];

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton-block small" />
        <div className="graph-layout">
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
          <p className="eyebrow">Visualization</p>
          <h2>Graph Explorer</h2>
        </div>
      </header>

      <div className="graph-controls card surface-card">
        <div className="segment-control" aria-label="Choose graph depth">
          {[1, 2, 3].map((value) => (
            <button
              key={value}
              type="button"
              className={`segment-button ${depth === value ? 'active' : ''}`}
              onClick={() => setDepth(value)}
            >
              Depth {value}
            </button>
          ))}
        </div>
        <button type="button" className="button button-secondary" onClick={() => setSelectedNode(null)}>
          Reset graph
        </button>
      </div>

      {visibleNodes.length === 0 ? (
        <div className="empty-state-panel">
          <div className="empty-icon">◎</div>
          <h3>No graph data connected</h3>
          <p>This employee has no graph data mapped yet.</p>
        </div>
      ) : (
        <div className="graph-layout">
          <div className="card surface-card graph-card">
            <div className="graph-flow">
              {visibleNodes.map((node, index) => (
                <div key={node.id || `${node.type}-${index}`} className="node-cluster-wrapper">
                  <button
                    type="button"
                    className={`graph-node node-${(node.type || 'skill').toLowerCase()}`}
                    onClick={() => setSelectedNode(node)}
                  >
                    {node.name || node.title || node.id || 'Node'}
                  </button>
                  {index < visibleNodes.length - 1 ? <span className="arrow">→</span> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="card surface-card detail-panel">
            <div className="section-header compact">
              <div>
                <p className="eyebrow">Node detail</p>
                <h3>{selectedNode ? selectedNode.name || selectedNode.title || 'Selected node' : 'No node selected'}</h3>
              </div>
            </div>

            {selectedNode ? (
              <>
                <div className="detail-grid compact-grid">
                  <div>
                    <p className="label">Type</p>
                    <strong>{selectedNode.type || 'Node'}</strong>
                  </div>
                  <div>
                    <p className="label">Connected nodes</p>
                    <strong>{connectedNodes.length}</strong>
                  </div>
                </div>

                <div className="mini-section">
                  <p className="label">Connections</p>
                  <div className="tag-list">
                    {connectedNodes.length ? connectedNodes.slice(0, 6).map((link, idx) => {
                      const targetNode = graph.nodes.find((node) => node.id === link.source || node.id === link.target);
                      return (
                        <button
                          key={`${link.source}-${link.target}-${idx}`}
                          type="button"
                          className="tag tag-neutral interactive-tag"
                          onClick={() => setSelectedNode(targetNode || selectedNode)}
                        >
                          {targetNode?.name || targetNode?.title || 'Related'}
                        </button>
                      );
                    }) : <span className="tag tag-neutral">No direct links</span>}
                  </div>
                </div>

                <button type="button" className="button button-primary">Explore connections</button>
              </>
            ) : (
              <div className="empty-state-panel compact">
                <div className="empty-icon">◎</div>
                <h3>Select a node</h3>
                <p>Choose any graph node to inspect its connections.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphExplorer;
