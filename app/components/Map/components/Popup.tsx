/* eslint-disable no-inner-declarations */
import React from 'react';
import { MapContext } from '../contexts/MapContext';

interface Props extends React.PropsWithChildren {
  coords: number[];
  onClose?(): void;
}

const Popup: React.FC<Props> = function (props) {
  const { coords, onClose, children } = props;

  const mapContext = React.useContext(MapContext);

  React.useEffect(() => {
    if (mapContext != null) {
      function listener() {
        onClose?.();
      }

      mapContext.eventManager.on('pointerdown', listener);

      return () => {
        mapContext.eventManager.off('pointerdown', listener);
      };
    }
  }, [mapContext, onClose]);

  const position = React.useMemo(() => {
    if (mapContext == null) {
      return null;
    }

    return mapContext.viewport.project(coords);
  }, [coords, mapContext]);

  return (
    <div
      className="absolute flex h-10 w-10 flex-col"
      style={{
        left: position?.[0],
        top: position?.[1],
      }}
    >
      {children}
    </div>
  );
};

export default Popup;
