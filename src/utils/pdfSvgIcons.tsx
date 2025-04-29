import React from 'react';
import { Svg, Path, Circle } from '@react-pdf/renderer';

export const BreadIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path stroke="#846358" fill="none" d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </Svg>
);

export const JournalIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path stroke="#846358" fill="none" d="M4 6h16v12H4z"/>
    <Path stroke="#846358" fill="none" d="M8 6v12M12 6v12"/>
  </Svg>
);

export const IngredientsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" stroke="#846358" fill="none"/>
    <Path stroke="#846358" fill="none" d="M12 8v8M8 12h8"/>
  </Svg>
);

export const ResultsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path stroke="#846358" fill="none" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
    <Path stroke="#846358" fill="none" d="M9 17h6M9 13h6M9 9h6"/>
  </Svg>
);

export const ClockIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke="#846358" fill="none"/>
    <Path stroke="#846358" fill="none" d="M12 6v6l4 2"/>
  </Svg>
);