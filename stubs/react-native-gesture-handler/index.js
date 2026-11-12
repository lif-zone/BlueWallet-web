
import React from 'react';
export const GestureHandlerRootView = ({children,...props})=>React.createElement('div',props,children);
export const PanGestureHandler = ({children})=>children;
export const TapGestureHandler = ({children})=>children;
export const LongPressGestureHandler = ({children})=>children;
export const ScrollView = React.forwardRef((props,ref)=>React.createElement('div',{...props,ref,style:{...props.style,overflow:'auto'}}));
export const FlatList = React.forwardRef((props,ref)=>React.createElement('div',{...props,ref}));
export const Swipeable = ({children})=>children;
export const RectButton = ({children,...props})=>React.createElement('div',{...props,onClick:props.onPress},children);
export const BorderlessButton = ({children,...props})=>React.createElement('div',{...props,onClick:props.onPress},children);
export const TouchableOpacity = React.forwardRef(({children,...props},ref)=>React.createElement('div',{...props,ref,onClick:props.onPress},children));
export const State = {UNDETERMINED:0,FAILED:1,BEGAN:2,CANCELLED:3,ACTIVE:4,END:5};
export const Directions = {RIGHT:1,LEFT:2,UP:4,DOWN:8};
export const Gesture = {Pan:()=>({}),Tap:()=>({}),LongPress:()=>({})};
export const GestureDetector = ({children})=>children;
export default {ScrollView,FlatList,Swipeable,RectButton,BorderlessButton,TouchableOpacity,GestureHandlerRootView,State,Directions};

