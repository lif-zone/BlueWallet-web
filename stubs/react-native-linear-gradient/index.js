
import React from 'react';
export default function LinearGradient({children, style, ...props}){
  return React.createElement('div', {style:{...style, background:'linear-gradient(to bottom, #1e3799, #0c2461)'}}, children);
}

