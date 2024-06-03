import {
  BitmapLayer,
  DeckGL,
  DeckGLRef,
  FlyToInterpolator,
  GeoJsonLayer,
  LayersList,
  MapView,
  MapViewState,
  PickingInfo,
  TileLayer,
  WebMercatorViewport,
} from 'deck.gl';
import { Feature, Geometry } from 'geojson';
import React from 'react';
import { LAYER_ID_HDB } from '~/constants';
import { HDBRecord } from '~/types/HDB';
import AttributionWidget from './components/AttributionWidget';
import HDBDetails from './components/HDBDetails';
import Popup from './components/Popup';
import ZoomWidget from './components/ZoomWidget';
import { BOUNDS_NE, BOUNDS_SW } from './constants';
import { MapContext } from './contexts/MapContext';
import useNightMode from './hooks/useNightMode';
import { applyViewStateConstraints } from './util/applyViewStateConstraints';

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
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: 'auto',
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

  const [isHDBLayerEnabled, setIsHDBLayerEnabled] = React.useState(true);

  const [popupInfo, setPopupInfo] = React.useState<PickingInfo<
    Feature<Geometry, HDBRecord>
  > | null>(null);

  const tileLayer = React.useMemo(() => {
    return new TileLayer<ImageBitmap>({
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
  }, [isNightMode]);

  const layers = React.useMemo<LayersList>(() => {
    const result: LayersList = [tileLayer];

    if (isHDBLayerEnabled) {
      const geojsonLayer = new GeoJsonLayer<HDBRecord>({
        id: LAYER_ID_HDB,
        data: 'https://assets.sge.foldaway.space/hdbLayer.geojson',
        filled: true,
        getLineWidth: 10,
        pickable: true,
        autoHighlight: true,
        getLineColor() {
          return [255, 0, 0, 128];
        },
        onClick(pickingInfo) {
          setPopupInfo(pickingInfo);
        },
      });
      result.push(geojsonLayer);
    }

    return result;
  }, [isHDBLayerEnabled, tileLayer]);

  const handlePopupClose = React.useCallback(() => {
    setPopupInfo(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex grow flex-col overflow-hidden bg-blue-400 dark:bg-sky-950"
    >
      <DeckGL
        ref={deckRef}
        controller
        ContextProvider={MapContext.Provider}
        layers={layers}
        views={new MapView({ repeat: true })}
        initialViewState={initialViewState}
        onViewStateChange={(e) => {
          const result = applyViewStateConstraints(e.viewState);
          cachedViewState.current = result;
          return result;
        }}
      >
        <div className="absolute left-4 top-4 w-64 rounded-lg bg-sky-100/80 px-4 py-2 backdrop-blur-sm dark:bg-sky-700/80 dark:text-slate-200">
          <h1 className="mb-2 text-2xl font-bold text-sky-600 dark:text-sky-200">
            SG Explorer
          </h1>

          <label className="flex items-center text-sm">
            <input
              className="mr-2"
              type="checkbox"
              checked={isHDBLayerEnabled}
              onChange={(e) => {
                setIsHDBLayerEnabled(e.target.checked);
              }}
            />
            <div className="mr-1 h-4 w-4 rounded-full bg-red-500"></div>
            <span>HDBs</span>
          </label>
        </div>

        <ZoomWidget deckRef={deckRef} cachedViewState={cachedViewState} />
        <AttributionWidget />
        {popupInfo != null &&
          popupInfo.object != null &&
          popupInfo.coordinate != null &&
          popupInfo.layer?.id === LAYER_ID_HDB && (
            <Popup coords={popupInfo.coordinate}>
              <HDBDetails
                record={popupInfo.object.properties}
                onClose={handlePopupClose}
              />
            </Popup>
          )}
      </DeckGL>
    </div>
  );
};

export default Map;
