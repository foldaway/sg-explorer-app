import React from 'react';

const AttributionWidget: React.FC = function () {
  return (
    <div className="absolute bottom-0 right-0 flex items-center bg-sky-100/80 px-2 py-0.5 text-xs text-gray-800 backdrop-blur-sm dark:bg-sky-700/80 dark:text-gray-100">
      <img
        className="h-4 w-4"
        src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png"
        alt="OneMap logo"
      />
      &nbsp;
      <a
        className="text-sky-800 underline dark:text-sky-200"
        href="https://www.onemap.gov.sg/"
        target="_blank"
        rel="noopener noreferrer"
      >
        OneMap
      </a>
      &nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;
      <a
        className="text-sky-800 underline dark:text-sky-200"
        href="https://www.sla.gov.sg/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Singapore Land Authority
      </a>
    </div>
  );
};

export default AttributionWidget;
