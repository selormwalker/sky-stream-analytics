import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { Activity, Zap, Shield, Globe, Cpu, AlertTriangle } from 'lucide-react';
import './App.css';

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 100) + 50,
    latency: Math.floor(Math.random() * 30) + 10
  }));
};

const resourceData = [
  { name: 'Compute', value: 45, color: '#00f2fe' },
  { name: 'Storage', value: 72, color: '#4facfe' },
  { name: 'Memory', value: 58, color: '#10b981' },
  { name: 'Network', value: 33, color: '#f59e0b' },
];

function App() {
  const [data, setData] = useState(generateData());
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', msg: 'Latency spike on Node-04', time: '2m ago' },
    { id: 2, type: 'error', msg: 'Auth Service timeout', time: '5m ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          value: Math.floor(Math.random() * 100) + 50,
          latency: Math.floor(Math.random() * 30) + 10
        }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div className="sidebar-logo">SKY STREAM</div>
        <nav>
          <div className="nav-item active"><Activity size={20} /> Dashboard</div>
          <div className="nav-item"><Zap size={20} /> Real-time</div>
          <div className="nav-item"><Cpu size={20} /> Resources</div>
          <div className="nav-item"><Shield size={20} /> Security</div>
          <div className="nav-item"><Globe size={20} /> Global</div>
        </nav>
      </aside>

      <main className="content">
        <header className="top-bar">
          <h2>Network Analytics Console</h2>
          <div className="header-right">
            <div className="status-badge">LIVE STREAMING</div>
          </div>
        </header>

        <div className="main-grid">
          <div className="left-col">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="label">THROUGHPUT</span>
                <span className="value">1.2 GB/s</span>
              </div>
              <div className="stat-card">
                <span className="label">LATENCY</span>
                <span className="value">14ms</span>
              </div>
              <div className="stat-card">
                <span className="label">ACTIVE NODES</span>
                <span className="value">1,024</span>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-wrapper">
                <h3>Data Throughput (Live Pulse)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 200]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                    <Area type="monotone" dataKey="value" stroke="#00f2fe" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-wrapper">
                <h3>Resource Allocation (%)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff60', fontSize: 12}} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {resourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <aside className="alerts-panel">
            <div className="panel-header">
              <AlertTriangle size={18} />
              <span>ACTIVE ALERTS</span>
            </div>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  <div className="alert-dot"></div>
                  <div className="alert-content">
                    <p className="alert-msg">{alert.msg}</p>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
