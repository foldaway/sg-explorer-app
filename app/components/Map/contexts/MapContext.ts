import { DeckGLContextValue } from 'deck.gl';
import React from 'react';

export const MapContext = React.createContext<DeckGLContextValue | null>(null);
