
import React from 'react';
const c = (tag)=>({children, ...props})=>React.createElement(tag=='Svg'?'svg':tag.toLowerCase(), props, children);
export const Svg = c('Svg');
export const Circle = c('Circle');
export const Rect = c('Rect');
export const Path = c('Path');
export const G = c('G');
export const Text = c('Text');
export const Line = c('Line');
export const Polygon = c('Polygon');
export const Polyline = c('Polyline');
export const Defs = c('Defs');
export const Stop = c('Stop');
export const LinearGradient = c('LinearGradient');
export const RadialGradient = c('RadialGradient');
export const ClipPath = c('ClipPath');
export const Use = c('Use');
export default Svg;

