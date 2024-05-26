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
    <div className="absolute bottom-8 right-4 flex divide-x-2 divide-sky-500 rounded-lg bg-slate-50/80 dark:divide-sky-700 dark:bg-sky-700/80">
      <button
        className="h-6 w-6 shrink-0 text-base dark:text-slate-200"
        onClick={handleZoomIn}
      >
        +
      </button>
      <button
        className="h-6 w-6 shrink-0 text-base dark:text-slate-200"
        onClick={handleZoomOut}
      >
        -
      </button>
    </div>
  );
};

export default ZoomWidget;
