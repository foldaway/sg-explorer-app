import React from 'react';

interface Props {
  value: number;
}

const Storeys: React.FC<Props> = function (props) {
  const { value } = props;

  const chunks = React.useMemo(() => {
    const result = new Array(value);
    result.fill(0);
    return result;
  }, [value]);

  return (
    <div className="flex w-8 flex-col">
      <span className="self-center font-medium">{value}F</span>

      <div className="flex flex-col divide-y divide-dashed divide-gray-600 border border-gray-800 dark:divide-gray-400 dark:border-gray-100">
        {chunks.map((_chunk, index) => (
          <div key={index} className="flex h-2 shrink-0"></div>
        ))}
      </div>
    </div>
  );
};

export default Storeys;
