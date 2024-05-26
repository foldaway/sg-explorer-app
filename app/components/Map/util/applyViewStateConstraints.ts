import { MapViewState, WebMercatorViewport } from 'deck.gl';
import { BOUNDS_SW, BOUNDS_NE } from '../constants';

/**
 * https://deck.gl/docs/developer-guide/interactivity#add-constraints-to-view-state
 */
export function applyViewStateConstraints(
  viewState: MapViewState
): MapViewState {
  const viewport = new WebMercatorViewport(viewState);

  const BOUNDS_XY_SW = viewport.project(BOUNDS_SW);
  const BOUNDS_XY_NE = viewport.project(BOUNDS_NE);

  const VIEWPORT_BOUNDS_XY_SW = [
    BOUNDS_XY_SW[0] + viewport.width / 2,
    BOUNDS_XY_SW[1] - viewport.height / 2,
  ];
  const VIEWPORT_BOUNDS_XY_NE = [
    BOUNDS_XY_NE[0] - viewport.width / 2,
    BOUNDS_XY_NE[1] + viewport.height / 2,
  ];

  const VIEWPORT_BOUNDS_COORDS_SW = viewport.unproject(VIEWPORT_BOUNDS_XY_SW);
  const VIEWPORT_BOUNDS_COORDS_NE = viewport.unproject(VIEWPORT_BOUNDS_XY_NE);

  const longitude = Math.min(
    VIEWPORT_BOUNDS_COORDS_NE[0],
    Math.max(VIEWPORT_BOUNDS_COORDS_SW[0], viewState.longitude)
  );
  const latitude = Math.min(
    VIEWPORT_BOUNDS_COORDS_NE[1],
    Math.max(VIEWPORT_BOUNDS_COORDS_SW[1], viewState.latitude)
  );

  return {
    ...viewState,
    latitude,
    longitude,
  } satisfies MapViewState;
}
