import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Zap, Shield, Globe } from 'lucide-react';
import './App.css';

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 100) + 50,
    latency: Math.floor(Math.random() * 30) + 10
  }));
};

function App() {
  const [data, setData] = useState(generateData());

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
          <div className="nav-item"><Shield size={20} /> Security</div>
          <div className="nav-item"><Globe size={20} /> Global</div>
        </nav>
      </aside>

      <main className="content">
        <header className="top-bar">
          <h2>Network Analytics Console</h2>
          <div className="status-badge">LIVE STREAMING</div>
        </header>

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

        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>Data Throughput (Live)</h3>
            <ResponsiveContainer width="100%" height={300}>
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
        </div>
      </main>
    </div>
  );
}

export default App;
