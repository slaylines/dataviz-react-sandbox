import React, { useRef, useEffect, useState } from 'react';

type SparklineProps = {
  data: number[];
}

const Sparkline: React.FC<SparklineProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!data || data.length < 2) return null;

  const { width, height } = dimensions;
  const min = Math.min(...data);
  const max = Math.max(...data);

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = ((value - min) / (max - min)) * height;

    return `${x},${height - y}`;
  }).join(' ');

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          className="fill-none stroke-2 stroke-current"
          points={points}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Sparkline;
