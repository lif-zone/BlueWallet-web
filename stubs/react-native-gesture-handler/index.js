
import React from 'react';
let fs = s=>Array.isArray(s) ? Object.assign({}, ...s) : s;
export const GestureHandlerRootView = ({children, style, ...props})=>React.createElement('div',{...props, style: fs(style)},children);
export const PanGestureHandler = ({children})=>children;
export const TapGestureHandler = ({children})=>children;
export const LongPressGestureHandler = ({children})=>children;
export const ScrollView = React.forwardRef(({style, ...props},ref)=>React.createElement('div',{...props,ref,style:{...fs(style),overflow:'auto'}}));
export const FlatList = React.forwardRef(({style, ...props},ref)=>React.createElement('div',{...props,ref,style:fs(style)}));
export const Swipeable = ({children})=>children;
export const RectButton = ({children, style, onPress, ...props})=>React.createElement('div',{...props,style:fs(style),onClick:onPress},children);
export const BorderlessButton = ({children, style, onPress, ...props})=>React.createElement('div',{...props,style:fs(style),onClick:onPress},children);
export const TouchableOpacity = React.forwardRef(({children, style, onPress, ...props},ref)=>React.createElement('div',{...props,ref,style:fs(style),onClick:onPress},children));
export const State = {UNDETERMINED:0,FAILED:1,BEGAN:2,CANCELLED:3,ACTIVE:4,END:5};
export const Directions = {RIGHT:1,LEFT:2,UP:4,DOWN:8};
export const Gesture = {Pan:()=>({}),Tap:()=>({}),LongPress:()=>({})};
export const GestureDetector = ({children})=>children;
export default {ScrollView,FlatList,Swipeable,RectButton,BorderlessButton,TouchableOpacity,GestureHandlerRootView,State,Directions};
