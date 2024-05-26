import {
  BitmapLayer,
  DeckGL,
  DeckGLRef,
  MapView,
  MapViewState,
  TileLayer,
  WebMercatorViewport,
} from 'deck.gl';
import React from 'react';
import ZoomWidget from './components/ZoomWidget';
import { BOUNDS_NE, BOUNDS_SW } from './constants';
import { applyViewStateConstraints } from './util/applyViewStateConstraints';
import SiteHeaderWidget from './components/SiteHeaderWidget';
import AttributionWidget from './components/AttributionWidget';
import useNightMode from './hooks/useNightMode';

const Map: React.FC = function () {
  const [initialViewState, setInitialViewState] = React.useState<MapViewState>({
    latitude: 1.2868108,
    longitude: 103.8545349,
    // minZoom: 10,
    maxZoom: 19,
    zoom: 10,
  });

  const cachedViewState = React.useRef<MapViewState>(initialViewState);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const deckRef = React.useRef<DeckGLRef>(null);

  const resetCamera = React.useCallback(() => {
    const container = containerRef.current;

    if (container == null) {
      return;
    }

    const { width, height } = container.getBoundingClientRect();

    const viewport = new WebMercatorViewport({
      ...cachedViewState.current,
      width,
      height,
    });

    const BOUNDS_XY_SW = viewport.project(BOUNDS_SW);
    const BOUNDS_XY_NE = viewport.project(BOUNDS_NE);

    const distanceX = BOUNDS_XY_NE[0] - BOUNDS_XY_SW[0];
    const distanceY = BOUNDS_XY_SW[1] - BOUNDS_XY_NE[1];

    /**
     * https://github.com/visgl/deck.gl/blob/a51fc6966994b1fcb90a534baf563b3cd1444f0a/modules/core/src/viewports/viewport.ts#L446
     */
    const zoomFactor = Math.max(width / distanceX, height / distanceY);
    const currentScale = viewport.scale;
    const desiredScale = currentScale * zoomFactor;
    const desiredZoom = Math.log2(desiredScale);

    const minZoom = desiredZoom;

    setInitialViewState({
      minZoom,
      maxZoom: 19,
      latitude: cachedViewState.current.latitude,
      longitude: cachedViewState.current.longitude,
      zoom: desiredZoom,
    });
  }, []);

  React.useLayoutEffect(() => {
    resetCamera();

    window.addEventListener('resize', resetCamera);

    return () => {
      window.removeEventListener('resize', resetCamera);
    };
  }, [resetCamera]);

  const isNightMode = useNightMode();

  const tileLayer = new TileLayer<ImageBitmap>({
    id: 'OneMapLayer',
    data: isNightMode
      ? ['https://www.onemap.gov.sg/maps/tiles/Night_HD/{z}/{x}/{y}.png']
      : ['https://www.onemap.gov.sg/maps/tiles/Default_HD/{z}/{x}/{y}.png'],
    // data: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256,
    maxRequests: 20,
    pickable: true,
    renderSubLayers(props) {
      const [[west, south], [east, north]] = props.tile.boundingBox;
      const { data, ...otherProps } = props;

      return [
        new BitmapLayer(otherProps, {
          image: data,
          bounds: [west, south, east, north],
        }),
      ];
    },
  });

  return (
    <div
      ref={containerRef}
      className="flex grow flex-col overflow-hidden bg-blue-400 dark:bg-sky-950"
    >
      <DeckGL
        ref={deckRef}
        controller
        layers={[tileLayer]}
        views={new MapView({ repeat: true })}
        initialViewState={initialViewState}
        onViewStateChange={(e) => {
          const result = applyViewStateConstraints(e.viewState);
          cachedViewState.current = result;
          return result;
        }}
      >
        <SiteHeaderWidget />
        <ZoomWidget deckRef={deckRef} cachedViewState={cachedViewState} />
        <AttributionWidget />
      </DeckGL>
    </div>
  );
};

export default Map;
