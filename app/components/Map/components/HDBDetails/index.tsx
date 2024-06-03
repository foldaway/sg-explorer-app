import React from 'react';
import { HDBRecord } from '~/types/HDB';
import Storeys from './components/Storeys';
import { PieChart } from 'react-minimal-pie-chart';
import { TOWNS } from './constants/towns';

interface Props {
  record: HDBRecord;
  onClose?(): void;
}

const HDBDetails: React.FC<Props> = function (props) {
  const { record, onClose } = props;

  const {
    blk_no,
    street,
    market_hawker,
    year_completed,
    miscellaneous,
    multistorey_carpark,
    residential,
    precinct_pavilion,
    max_floor_lvl,
    bldg_contract_town,
  } = record;

  const pieData = React.useMemo(() => {
    return [
      {
        name: '1-room rental flats',
        value: record['1room_rental'],
        color: '#93c5fd', // blue-300
      },
      {
        name: '1-room flats',
        value: record['1room_sold'],
        color: '#fde68a', // amber-300
      },
      {
        name: '2-room rental flats',
        value: record['2room_rental'],
        color: '#60a5fa', // blue-400
      },
      {
        name: '2-room flats',
        value: record['2room_sold'],
        color: '#fcd34d', // amber-400
      },
      {
        name: '3-room rental flats',
        value: record['3room_rental'],
        color: '#3b82f6', // blue-500
      },
      {
        name: '3-room flats',
        value: record['3room_sold'],
        color: '#fbbf24', // amber-500
      },
      {
        name: '4-room flats',
        value: record['4room_sold'],
        color: '#f87171', // red-400
      },
      {
        name: '5-room flats',
        value: record['5room_sold'],
        color: '#6ee7b7', // emerald-300
      },
      {
        name: 'Executive flats',
        value: record['exec_sold'],
        color: '#c4b5fd', // violet-300
      },
      {
        name: 'Multi-Generation flats',
        value: record['multigen_sold'],
        color: '#5eead4', // teal-300
      },
    ].filter((item) => item.value > 0);
  }, [record]);

  const age = new Date().getFullYear() - year_completed;

  const numberFormatter = new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit: 'year',
    unitDisplay: 'long',
  });

  return (
    <div className="relative flex w-72 flex-col rounded-lg bg-sky-100/80 px-4 py-3 text-gray-800 shadow-lg backdrop-blur-sm dark:bg-sky-800/80 dark:text-gray-100">
      <button
        className="absolute right-3 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-gray-800 text-gray-800 dark:border-gray-200 dark:text-gray-100"
        onClick={onClose}
      >
        <svg
          width="12px"
          height="12px"
          viewBox="-0.5 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {' '}
            <path
              d="M3 21.32L21 3.32001"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{' '}
            <path
              d="M3 3.32001L21 21.32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{' '}
          </g>
        </svg>
      </button>
      <div className="flex flex-wrap items-center gap-x-2">
        {precinct_pavilion && (
          <div className="flex bg-blue-300 px-2 py-0.5 text-blue-900">
            <span className="text-xs font-bold uppercase">
              Precinct/Pavilion
            </span>
          </div>
        )}
        {residential && (
          <div className="flex bg-emerald-300 px-2 py-0.5 text-emerald-900">
            <span className="text-xs font-bold uppercase">Residential</span>
          </div>
        )}
        {market_hawker && (
          <div className="flex bg-amber-300 px-2 py-0.5 text-amber-900">
            <span className="text-xs font-bold uppercase">
              Wet Market/Hawker Centre
            </span>
          </div>
        )}
        {multistorey_carpark && (
          <div className="flex bg-lime-400 px-2 py-0.5 text-lime-900">
            <span className="text-xs font-bold uppercase">
              Multistorey Carpark
            </span>
          </div>
        )}
        {miscellaneous && (
          <div className="flex bg-violet-300 px-2 py-0.5 text-violet-900">
            <span className="text-xs font-bold uppercase">Misc.</span>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs font-black uppercase leading-none text-gray-600 dark:text-gray-400">
        {TOWNS[bldg_contract_town] ?? bldg_contract_town}
      </p>

      <p className="mt-1 text-2xl leading-none">
        {blk_no} {street}
      </p>

      <div className="mt-2 flex gap-x-1.5">
        <div className="flex items-center justify-center border border-gray-800 px-2 py-1 text-gray-800 dark:border-gray-100 dark:text-gray-100">
          <p className="text-sm font-bold leading-none">{year_completed}</p>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold leading-tight">
            Built: {numberFormatter.format(age)} ago
          </p>
          <p className="text-xs leading-tight">
            {residential && (
              <span className="text-gray-600 dark:text-gray-400">
                Remaining Lease Term: {numberFormatter.format(99 - age)}{' '}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-center gap-x-6">
        <Storeys value={max_floor_lvl} />

        {residential && (
          <PieChart
            data={pieData}
            label={({ x, y, dx, dy, dataEntry }) => (
              <text
                x={x}
                y={y}
                dx={dx}
                dy={dy}
                fontSize={6}
                textAnchor="middle"
              >
                <tspan x={x} dx={dx} dy={dy} fontWeight={700}>
                  {dataEntry.value} ({Math.round(dataEntry.percentage) + '%'})
                </tspan>
                <tspan x={x} dx={dx} dy="1em">
                  {dataEntry.name}
                </tspan>
              </text>
            )}
          />
        )}
      </div>

      <a
        className="text-xs text-sky-600 underline dark:text-sky-200"
        href="https://beta.data.gov.sg/open-data-license"
        target="_blank"
        rel="noreferrer"
      >
        Singapore Open Data License
      </a>
    </div>
  );
};

export default HDBDetails;
