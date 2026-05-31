import { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, Zap, Shield, Globe, Cpu, AlertTriangle, Download, Filter, Search, Server, HardDrive, Share2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import './App.css';

// --- Simulation Logic ---
const generateData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    time: i,
    throughput: Math.floor(Math.random() * 800) + 200,
    latency: Math.floor(Math.random() * 40) + 5,
    packets: Math.floor(Math.random() * 1000) + 500,
  }));
};

const regionData = [
  { name: 'North America', value: 400, color: '#00f2fe' },
  { name: 'Europe', value: 300, color: '#4facfe' },
  { name: 'Asia Pacific', value: 200, color: '#10b981' },
  { name: 'South America', value: 100, color: '#f59e0b' },
];

const initialEvents = [
  { id: 1, type: 'info', msg: 'System check complete. Nodes healthy.', time: 'Just now' },
  { id: 2, type: 'warning', msg: 'High latency detected in US-EAST-1', time: '2m ago' },
  { id: 3, type: 'error', msg: 'API Gateway connection timeout', time: '5m ago' },
  { id: 4, type: 'info', msg: 'Backup completed successfully', time: '12m ago' },
];

function App() {
  const [data, setData] = useState(generateData());
  const [events, setEvents] = useState(initialEvents);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState('all');

  // Real-time Update Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const newData = [...prev.slice(1), {
          time: last.time + 1,
          throughput: Math.max(100, last.throughput + (Math.random() * 100 - 50)),
          latency: Math.max(2, last.latency + (Math.random() * 10 - 5)),
          packets: Math.max(400, last.packets + (Math.random() * 200 - 100))
        }];
        return newData;
      });

      // Occasional new event
      if (Math.random() > 0.85) {
        const types = ['info', 'warning', 'error'];
        const msgs = ['Node synchronization active', 'Inbound traffic surge', 'Protocol mismatch detected', 'Security handshake verified'];
        const type = types[Math.floor(Math.random() * types.length)];
        setEvents(prev => [{
          id: Date.now(),
          type,
          msg: msgs[Math.floor(Math.random() * msgs.length)],
          time: 'Now'
        }, ...prev.slice(0, 8)]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `sky-stream-metrics-${Date.now()}.json`);
  };

  const filteredData = useMemo(() => {
    if (filter === 'all') return data;
    return data.filter(d => filter === 'low' ? d.latency < 20 : d.latency >= 20);
  }, [data, filter]);

  return (
    <div className="dashboard-container">
      <aside className="nexus-sidebar">
        <div className="sidebar-brand">
           <div className="brand-icon"><Share2 size={24} /></div>
           <span>SKY STREAM</span>
        </div>
        
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
             <Activity size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('nodes')} className={activeTab === 'nodes' ? 'active' : ''}>
             <Server size={18} /> Edge Nodes
          </button>
          <button onClick={() => setActiveTab('storage')} className={activeTab === 'storage' ? 'active' : ''}>
             <HardDrive size={18} /> Storage
          </button>
          <button onClick={() => setActiveTab('security')} className={activeTab === 'security' ? 'active' : ''}>
             <Shield size={18} /> Security
          </button>
        </nav>

        <div className="sidebar-footer">
           <div className="system-health">
              <div className="health-hdr">SYSTEM HEALTH</div>
              <div className="health-bar"><div className="health-progress" style={{width: '94%'}}></div></div>
              <div className="health-status">94% OPTIMAL</div>
           </div>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="nexus-header">
           <div className="header-left">
              <h1>Advanced Analytics <span className="v-badge">v2.4.0</span></h1>
              <p>Real-time telemetry and predictive traffic monitoring</p>
           </div>
           <div className="header-actions">
              <div className="search-box">
                 <Search size={16} />
                 <input type="text" placeholder="Search system logs..." />
              </div>
              <button onClick={exportData} className="btn-icon"><Download size={18} /></button>
           </div>
        </header>

        <div className="stats-row">
           <div className="stat-card neon-border">
              <div className="stat-icon t-cyan"><Zap size={20} /></div>
              <div className="stat-info">
                 <span className="stat-label">AGGREGATE THROUGHPUT</span>
                 <span className="stat-val">{(data[data.length-1].throughput / 100).toFixed(2)} TB/s</span>
              </div>
           </div>
           <div className="stat-card neon-border">
              <div className="stat-icon t-green"><Activity size={20} /></div>
              <div className="stat-info">
                 <span className="stat-label">SYSTEM LATENCY</span>
                 <span className="stat-val">{data[data.length-1].latency.toFixed(1)}ms</span>
              </div>
           </div>
           <div className="stat-card neon-border">
              <div className="stat-icon t-amber"><Globe size={20} /></div>
              <div className="stat-info">
                 <span className="stat-label">GLOBAL REACH</span>
                 <span className="stat-val">184 Countries</span>
              </div>
           </div>
        </div>

        <div className="nexus-grid">
           <div className="grid-main">
              <div className="viz-card">
                 <div className="card-header">
                    <h3>Throughput / Packet Pulse</h3>
                    <div className="card-controls">
                       <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                       <button onClick={() => setFilter('low')} className={filter === 'low' ? 'active' : ''}>Low Latency</button>
                    </div>
                 </div>
                 <div className="chart-area">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={filteredData}>
                        <defs>
                          <linearGradient id="glowCyan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#ffffff30', fontSize: 10}} />
                        <Tooltip contentStyle={{ backgroundColor: '#030816', border: '1px solid #ffffff10', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="throughput" stroke="#00f2fe" strokeWidth={3} fill="url(#glowCyan)" />
                        <Area type="monotone" dataKey="packets" stroke="#4facfe" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="grid-half">
                 <div className="viz-card small">
                    <h3>Traffic Correlation (Latency vs Packets)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                       <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                          <XAxis type="number" dataKey="packets" name="Packets" hide />
                          <YAxis type="number" dataKey="latency" name="Latency" hide />
                          <ZAxis type="number" range={[50, 400]} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Scatter name="Packets" data={data} fill="#10b981" opacity={0.6} />
                       </ScatterChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="viz-card small">
                    <h3>Regional Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                       <PieChart>
                          <Pie
                            data={regionData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {regionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="grid-side">
              <div className="viz-card event-panel">
                 <div className="panel-hdr">
                    <AlertTriangle size={16} />
                    <span>LIVE EVENT LOG</span>
                 </div>
                 <div className="event-list">
                    {events.map(event => (
                      <div key={event.id} className={`event-item ${event.type}`}>
                         <div className="event-marker"></div>
                         <div className="event-body">
                            <div className="event-msg">{event.msg}</div>
                            <div className="event-meta">{event.time} • 2.4 TB/s payload</div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="btn-ghost">View All History</button>
              </div>

              <div className="viz-card mini-stats">
                 <div className="mini-stat">
                    <span className="mini-label">ACTIVE NODES</span>
                    <span className="mini-val">2,841</span>
                 </div>
                 <div className="mini-stat">
                    <span className="mini-label">SSL UPTIME</span>
                    <span className="mini-val">99.99%</span>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;
