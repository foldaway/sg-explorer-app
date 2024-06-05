import { DeckGLRef, FlyToInterpolator, MapViewState } from 'deck.gl';
import React from 'react';
import { applyViewStateConstraints } from '../util/applyViewStateConstraints';

interface Props {
  deckRef: React.RefObject<DeckGLRef | null>;
  cachedViewState: React.RefObject<MapViewState>;
}

const ZoomWidget: React.FC<Props> = function (props) {
  const { deckRef, cachedViewState } = props;

  const zoomBy = React.useCallback(
    (delta: number) => {
      const currentState = cachedViewState.current;
      if (currentState == null) {
        return;
      }

      const { minZoom, maxZoom } = currentState;

      const deck = deckRef.current?.deck ?? null;
      if (deck == null) {
        return;
      }

      const [mapView] = deck.getViews();
      const viewId = mapView.id;

      const [viewport] = deck.getViewports();

      const nextZoom = viewport.zoom + delta;

      if (minZoom != null && nextZoom < minZoom) {
        return;
      } else if (maxZoom != null && nextZoom > maxZoom) {
        return;
      }

      const nextViewState: MapViewState = {
        ...currentState,
        zoom: viewport.zoom + delta,
        transitionDuration: 200,
        transitionInterpolator: new FlyToInterpolator(),
      };

      // https://github.com/visgl/deck.gl/blob/303d1da801cc89c55aea97637e7871c6586d4e6a/modules/widgets/src/zoom-widget.tsx#L113-L114
      // @ts-expect-error Using private method temporary until there's a public one
      deck._onViewStateChange({
        viewId,
        viewState: applyViewStateConstraints(nextViewState),
        interactionState: {},
      });
    },
    [cachedViewState, deckRef]
  );

  const handleZoomIn: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    zoomBy(0.5);
  };

  const handleZoomOut: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    zoomBy(-0.5);
  };

  return (
    <div className="absolute bottom-8 right-4 flex divide-x divide-gray-800 overflow-hidden rounded-lg bg-sky-100/80 dark:divide-gray-100 dark:bg-sky-700/80">
      <button
        className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-800 hover:bg-sky-200 dark:text-gray-100 dark:hover:bg-sky-600"
        onClick={handleZoomIn}
      >
        <svg
          width="12px"
          height="12px"
          viewBox="0 0 24 24"
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
              d="M4 12H20M12 4V20"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      <button
        className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-800 hover:bg-sky-200 dark:text-gray-100 dark:hover:bg-sky-600"
        onClick={handleZoomOut}
      >
        <svg
          width="12px"
          height="12px"
          viewBox="0 0 24 24"
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
              d="M6 12L18 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default ZoomWidget;
