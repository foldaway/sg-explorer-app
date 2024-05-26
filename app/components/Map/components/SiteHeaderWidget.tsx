import React from 'react';

const SiteHeaderWidget: React.FC = function () {
  return (
    <div className="absolute left-4 top-4 rounded-lg bg-slate-50/80 px-4 py-2 dark:bg-sky-700/80 dark:text-slate-200">
      <h1 className="text-2xl font-bold">SG Explorer</h1>
    </div>
  );
};

export default SiteHeaderWidget;
