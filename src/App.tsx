import React from 'react';
import { Sparkline } from './components';

const App: React.FC = () => {
  const sparklineData = [
    10, 12, 15, 9, 7, 8, 13, 16, 12, 10,
    14, 18, 21, 19, 22, 24, 23, 20, 17,
  ];

  return (
    <div className="px-4 py-2">
      <h1 className="mb-2">Examples</h1>
      <h2 className="mb-2">1. Sparkline</h2>
      <div className="w-48 h-16 p-1 border border-outline text-primary">
        <Sparkline data={sparklineData} />
       </div>
    </div>
  )
};

export default App;
