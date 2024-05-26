import type { MetaFunction } from '@remix-run/node';
import Map from '~/components/Map';

export const meta: MetaFunction = () => {
  return [
    { title: 'SG Explorer' },
    {
      name: 'description',
      content: 'SG Explorer is a mapping app that explores its infrastructure.',
    },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col h-screen">
      <Map />
    </div>
  );
}
