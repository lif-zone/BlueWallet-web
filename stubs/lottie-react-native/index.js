
import React from 'react';
export default function LottieView(props){
  let s = Array.isArray(props.style) ? Object.assign({}, ...props.style) : props.style;
  return React.createElement('div',{style:s});
}

