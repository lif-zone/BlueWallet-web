
import React from 'react';
import {View, Text, ScrollView, Image, FlatList} from 'react-native';
function _strip({entering, exiting, layout, sharedTransitionTag, sharedTransitionStyle, animatedProps, ...rest}){
  return rest;
}
const Animated = {
  View: React.forwardRef((props,ref)=>React.createElement(View, {..._strip(props),ref})),
  Text: React.forwardRef((props,ref)=>React.createElement(Text, {..._strip(props),ref})),
  ScrollView: React.forwardRef((props,ref)=>React.createElement(ScrollView, {..._strip(props),ref})),
  Image: React.forwardRef((props,ref)=>React.createElement(Image, {..._strip(props),ref})),
  FlatList: React.forwardRef((props,ref)=>React.createElement(FlatList, {..._strip(props),ref})),
  createAnimatedComponent: (comp)=>React.forwardRef((props,ref)=>React.createElement(comp, {..._strip(props),ref})),
};
export default Animated;
export const useSharedValue = (v)=>({value:v});
export const useAnimatedStyle = (fn)=>fn();
export const withTiming = (v)=>v;
export const withDelay = (_,v)=>v;
export const withSpring = (v)=>v;
export const withRepeat = (v)=>v;
export const withSequence = (...args)=>args[args.length-1];
function _chain(){
  let o = {};
  o.duration = ()=>o;
  o.easing = ()=>o;
  o.delay = ()=>o;
  o.springify = ()=>o;
  o.damping = ()=>o;
  o.mass = ()=>o;
  o.stiffness = ()=>o;
  o.overshootClamping = ()=>o;
  o.restDisplacementThreshold = ()=>o;
  o.restSpeedThreshold = ()=>o;
  o.withInitialValues = ()=>o;
  o.withCallback = ()=>o;
  o.build = ()=>o;
  return o;
}
const _ef = v=>v;
export const Easing = {linear:_ef, ease:_ef, quad:_ef, cubic:_ef, poly:()=>_ef,
  sin:_ef, circle:_ef, exp:_ef, elastic:()=>_ef, back:()=>_ef, bounce:_ef,
  bezier:()=>_ef, in:()=>_ef, out:()=>_ef, inOut:()=>_ef};
export const Layout = _chain();
export const FadeIn = _chain();
export const FadeOut = _chain();
export const SlideInRight = _chain();
export const SlideOutRight = _chain();
export const SlideInLeft = _chain();
export const SlideOutLeft = _chain();
export const ZoomIn = _chain();
export const ZoomOut = _chain();
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
export const LinearTransition = _chain();
export const FadingTransition = _chain();
export const SequencedTransition = _chain();
export const JumpingTransition = _chain();
export const useAnimatedReaction = ()=>{};
export const useAnimatedKeyboard = ()=>({state:{value:0},height:{value:0}});
export const KeyboardState = {CLOSED:0,OPEN:1,CLOSING:2,OPENING:3};

