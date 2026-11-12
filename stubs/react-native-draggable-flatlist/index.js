
import React from 'react';
export default function DraggableFlatList({data,renderItem,keyExtractor,...props}){
  return React.createElement('div',null,(data||[]).map((item,index)=>renderItem({item,index,drag:()=>{},isActive:false})));
}
export const ScaleDecorator = ({children})=>children;
export const ShadowDecorator = ({children})=>children;
export const OpacityDecorator = ({children})=>children;

