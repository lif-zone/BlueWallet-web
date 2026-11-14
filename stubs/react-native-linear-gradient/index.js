
import React from 'react';
export default function LinearGradient({children, colors, style, start, end, locations, ...props}){
  let flat = Array.isArray(style) ? Object.assign({}, ...style) : style||{};
  let bg = colors?.length
    ? 'linear-gradient(to bottom, '+colors.join(', ')+')'
    : 'linear-gradient(to bottom, #1e3799, #0c2461)';
  return React.createElement('div', {style:{...flat, background: bg}}, children);
}

