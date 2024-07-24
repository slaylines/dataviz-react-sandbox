import React from 'react';
import { Sparkline } from './components';

const App: React.FC = () => {
  const sparklineData = Array.from({ length: 100 }, (_, index) => {
    const x = (index / 99) * 4 * Math.PI;
    return 4 * Math.sin(x);
  });


  return (
    <div className="px-4 py-2">
      <h1 className="mb-2">Examples</h1>
      <h2 className="mb-2">1. Sparkline</h2>
      <div className="w-64 h-24 p-1 border border-outline text-primary">
        <Sparkline data={sparklineData} />
       </div>
    </div>
  )
};

export default App;
