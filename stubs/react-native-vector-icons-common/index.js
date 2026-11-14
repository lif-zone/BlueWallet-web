import React from 'react';
import {Text} from 'react-native';
export function createIconSet(){
  return ({name, size=24, color='#000', style, ...props})=>
    React.createElement(Text, {
      style: [{fontSize: size, color}, style],
      ...props,
    }, name);
}
