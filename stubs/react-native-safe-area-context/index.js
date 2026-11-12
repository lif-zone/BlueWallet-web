
import React from 'react';
export const SafeAreaProvider = ({children})=>React.createElement('div',null,children);
export const SafeAreaView = React.forwardRef(({children,...props},ref)=>React.createElement('div',{...props,ref},children));
export const useSafeAreaInsets = ()=>({top:0,bottom:0,left:0,right:0});
export const useSafeAreaFrame = ()=>({x:0,y:0,width:window.innerWidth,height:window.innerHeight});
export const initialWindowMetrics = {insets:{top:0,bottom:0,left:0,right:0},frame:{x:0,y:0,width:0,height:0}};

