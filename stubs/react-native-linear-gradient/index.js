
import React from 'react';
import {View} from 'react-native';
export default function LinearGradient({children, colors, style, start, end, locations, ...props}){
  let bg = colors?.length
    ? 'linear-gradient(to bottom, '+colors.join(', ')+')'
    : 'linear-gradient(to bottom, #1e3799, #0c2461)';
  return React.createElement(View, {style: [style, {backgroundImage: bg}]}, children);
}

