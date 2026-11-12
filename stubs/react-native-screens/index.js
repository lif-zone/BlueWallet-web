
import React from 'react';
export const enableScreens = ()=>{};
export const Screen = ({children,...props})=>React.createElement('div',props,children);
export const ScreenContainer = ({children,...props})=>React.createElement('div',props,children);
export const ScreenStack = ({children,...props})=>React.createElement('div',props,children);
export const ScreenStackHeaderConfig = ()=>null;
export const NativeStackView = ({children})=>children;

