
import React from 'react';
const Animated = {
  View: React.forwardRef((props,ref)=>React.createElement('div',{...props,ref})),
  Text: React.forwardRef((props,ref)=>React.createElement('span',{...props,ref})),
  ScrollView: React.forwardRef((props,ref)=>React.createElement('div',{...props,ref,style:{...props.style,overflow:'auto'}})),
  Image: React.forwardRef((props,ref)=>React.createElement('img',{...props,ref})),
  FlatList: React.forwardRef((props,ref)=>React.createElement('div',{...props,ref})),
  createAnimatedComponent: (comp)=>comp,
};
export default Animated;
export const useSharedValue = (v)=>({value:v});
export const useAnimatedStyle = (fn)=>fn();
export const withTiming = (v)=>v;
export const withDelay = (_,v)=>v;
export const withSpring = (v)=>v;
export const withRepeat = (v)=>v;
export const withSequence = (...args)=>args[args.length-1];
export const Easing = {linear:v=>v,ease:v=>v,bezier:()=>v=>v,in:()=>v=>v,out:()=>v=>v,inOut:()=>v=>v};
export const Layout = {};
export const FadeIn = {duration:()=>FadeIn};
export const FadeOut = {duration:()=>FadeOut};
export const SlideInRight = {};
export const SlideOutRight = {};
export const runOnJS = (fn)=>fn;
export const runOnUI = (fn)=>fn;
export const useAnimatedRef = ()=>React.createRef();
export const measure = ()=>({});
export const scrollTo = ()=>{};
export const cancelAnimation = ()=>{};
export const makeMutable = (v)=>({value:v});
export const interpolate = (v)=>v;
export const Extrapolation = {CLAMP:'clamp',EXTEND:'extend'};
export const useAnimatedScrollHandler = ()=>({});

