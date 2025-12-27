import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MorningRitual } from './components/MorningRitual';
import { ActionCenter } from './components/ActionCenter';
import { Journal } from './components/Journal';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ritual" element={<MorningRitual />} />
          <Route path="/action" element={<ActionCenter />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;