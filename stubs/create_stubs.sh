#!/bin/bash
# Create stub packages for React Native native modules
cd "$(dirname "$0")"

create_stub() {
  local name=$1
  local code=$2
  local dir=$(echo "$name" | sed 's/@//;s/\//-/g')
  mkdir -p "$dir"
  echo "{\"name\":\"$name\",\"version\":\"0.0.0\",\"main\":\"index.js\"}" > "$dir/package.json"
  echo "$code" > "$dir/index.js"
}

# Simple no-op stubs
create_stub "react-native-default-preference" "
const DefaultPreference = {
  get: async()=>null,
  set: async()=>{},
  clear: async()=>{},
  getMultiple: async()=>({}),
  setMultiple: async()=>{},
  clearMultiple: async()=>{},
  getAll: async()=>({}),
  clearAll: async()=>{},
  setName: ()=>{},
  getName: ()=>'',
};
export default DefaultPreference;
module.exports = DefaultPreference;
"

create_stub "react-native-fs" "
const RNFS = {
  DocumentDirectoryPath: '/documents',
  CachesDirectoryPath: '/caches',
  writeFile: async()=>{},
  readFile: async()=>'',
  exists: async()=>false,
  unlink: async()=>{},
  mkdir: async()=>{},
  readDir: async()=>[],
  stat: async()=>({}),
  copyFile: async()=>{},
  moveFile: async()=>{},
};
export default RNFS;
module.exports = RNFS;
"

create_stub "react-native-share" "
const Share = { open: async()=>{}, isPackageInstalled: async()=>false };
export default Share;
module.exports = Share;
"

create_stub "react-native-haptic-feedback" "
const HapticFeedback = { trigger: ()=>{} };
export default HapticFeedback;
module.exports = HapticFeedback;
"

create_stub "react-native-device-info" "
export const getUniqueId = async()=>'web-device';
export const getDeviceType = ()=>'Desktop';
export const isTablet = ()=>false;
export const getVersion = ()=>'0.0.0';
export const getBundleId = ()=>'io.bluewallet.bluewallet';
export const isEmulator = async()=>false;
const DeviceInfo = { getUniqueId, getDeviceType, isTablet, getVersion, getBundleId, isEmulator, getPowerState: async()=>({batteryLevel:1,batteryState:'full',lowPowerMode:false}) };
export default DeviceInfo;
"

create_stub "react-native-localize" "
export const getLocales = ()=>[{languageCode:'en',countryCode:'US',languageTag:'en-US',isRTL:false}];
export const findBestLanguageTag = ()=>({languageTag:'en',isRTL:false});
export const getNumberFormatSettings = ()=>({decimalSeparator:'.',groupingSeparator:','});
export const getCurrencies = ()=>['USD'];
export const getCountry = ()=>'US';
export const getCalendar = ()=>'gregorian';
export const getTemperatureUnit = ()=>'fahrenheit';
export const getTimeZone = ()=>Intl.DateTimeFormat().resolvedOptions().timeZone;
export const uses24HourClock = ()=>false;
export const addEventListener = ()=>({remove:()=>{}});
export const removeEventListener = ()=>{};
"

create_stub "react-native-image-picker" "
export const launchImageLibrary = async()=>({didCancel:true});
export const launchCamera = async()=>({didCancel:true});
"

create_stub "react-native-camera-kit-no-google" "
export const detectQRCodeInImage = async()=>null;
export const CameraScreen = ()=>null;
"

create_stub "react-native-biometrics" "
export default class ReactNativeBiometrics {
  isSensorAvailable = async()=>({available:false,biometryType:null});
  simplePrompt = async()=>({success:false});
  createKeys = async()=>({publicKey:''});
}
"

create_stub "react-native-keychain" "
export const setGenericPassword = async()=>false;
export const getGenericPassword = async()=>false;
export const resetGenericPassword = async()=>false;
export const ACCESSIBLE = {};
export const ACCESS_CONTROL = {};
export const AUTHENTICATION_TYPE = {};
export const SECURITY_LEVEL = {};
export const STORAGE_TYPE = {};
export default {setGenericPassword,getGenericPassword,resetGenericPassword,ACCESSIBLE,ACCESS_CONTROL,AUTHENTICATION_TYPE,SECURITY_LEVEL,STORAGE_TYPE};
"

create_stub "react-native-notifications" "
export class Notifications {
  static registerRemoteNotifications(){}
  static events(){return{registerRemoteNotificationsRegistered:()=>({remove:()=>{}}),registerNotificationReceivedForeground:()=>({remove:()=>{}}),registerNotificationOpened:()=>({remove:()=>{}})}}
  static postLocalNotification(){}
  static getInitialNotification(){return Promise.resolve(null)}
}
export class Notification {}
"

create_stub "react-native-permissions" "
export const RESULTS = {UNAVAILABLE:'unavailable',DENIED:'denied',LIMITED:'limited',GRANTED:'granted',BLOCKED:'blocked'};
export const check = async()=>RESULTS.UNAVAILABLE;
export const request = async()=>RESULTS.UNAVAILABLE;
export const checkNotifications = async()=>({status:RESULTS.UNAVAILABLE,settings:{}});
export const requestNotifications = async()=>({status:RESULTS.UNAVAILABLE,settings:{}});
export const PERMISSIONS = {IOS:{},ANDROID:{}};
"

create_stub "react-native-background-fetch" "
const BackgroundFetch = {
  STATUS_RESTRICTED:0,STATUS_DENIED:1,STATUS_AVAILABLE:2,
  NETWORK_TYPE_NONE:0,NETWORK_TYPE_ANY:1,
  configure:async()=>0,
  scheduleTask:async()=>{},
  stop:async()=>{},
  start:async()=>{},
  finish:(id)=>{},
};
export default BackgroundFetch;
module.exports = BackgroundFetch;
"

create_stub "react-native-linear-gradient" "
import React from 'react';
export default function LinearGradient({children, style, ...props}){
  return React.createElement('div', {style:{...style, background:'linear-gradient(to bottom, #1e3799, #0c2461)'}}, children);
}
"

create_stub "react-native-get-random-values" "
// Web crypto.getRandomValues is available natively
"

create_stub "react-native-svg" "
import React from 'react';
const c = (tag)=>({children, ...props})=>React.createElement(tag=='Svg'?'svg':tag.toLowerCase(), props, children);
export const Svg = c('Svg');
export const Circle = c('Circle');
export const Rect = c('Rect');
export const Path = c('Path');
export const G = c('G');
export const Text = c('Text');
export const Line = c('Line');
export const Polygon = c('Polygon');
export const Polyline = c('Polyline');
export const Defs = c('Defs');
export const Stop = c('Stop');
export const LinearGradient = c('LinearGradient');
export const RadialGradient = c('RadialGradient');
export const ClipPath = c('ClipPath');
export const Use = c('Use');
export default Svg;
"

create_stub "react-native-reanimated" "
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
"

create_stub "react-native-safe-area-context" "
import React from 'react';
export const SafeAreaProvider = ({children})=>React.createElement('div',null,children);
export const SafeAreaView = React.forwardRef(({children,...props},ref)=>React.createElement('div',{...props,ref},children));
export const useSafeAreaInsets = ()=>({top:0,bottom:0,left:0,right:0});
export const useSafeAreaFrame = ()=>({x:0,y:0,width:window.innerWidth,height:window.innerHeight});
export const initialWindowMetrics = {insets:{top:0,bottom:0,left:0,right:0},frame:{x:0,y:0,width:0,height:0}};
"

create_stub "react-native-screens" "
import React from 'react';
export const enableScreens = ()=>{};
export const Screen = ({children,...props})=>React.createElement('div',props,children);
export const ScreenContainer = ({children,...props})=>React.createElement('div',props,children);
export const ScreenStack = ({children,...props})=>React.createElement('div',props,children);
export const ScreenStackHeaderConfig = ()=>null;
export const NativeStackView = ({children})=>children;
"

create_stub "react-native-gesture-handler" "
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
"

create_stub "react-native-draggable-flatlist" "
import React from 'react';
export default function DraggableFlatList({data,renderItem,keyExtractor,...props}){
  return React.createElement('div',null,(data||[]).map((item,index)=>renderItem({item,index,drag:()=>{},isActive:false})));
}
export const ScaleDecorator = ({children})=>children;
export const ShadowDecorator = ({children})=>children;
export const OpacityDecorator = ({children})=>children;
"

create_stub "react-native-tcp-socket" "
export default {createConnection:()=>({on:()=>{},write:()=>{},destroy:()=>{},end:()=>{}})};
"

create_stub "react-native-secure-key-store" "
export default {set:async()=>{},get:async()=>null,remove:async()=>{}};
"

create_stub "react-native-handoff" "
export default {updateActivity:()=>{},clearActivity:()=>{}};
"

create_stub "react-native-prompt-android" "
export default ()=>{};
"

create_stub "react-native-capture-protection" "
export default {allow:()=>{},prevent:()=>{},addEventListener:()=>({remove:()=>{}})};
"

create_stub "react-native-context-menu-view" "
import React from 'react';
export default function ContextMenuView({children,...props}){return React.createElement('div',props,children);}
"

create_stub "react-native-blue-crypto" "
export default {scrypt:async()=>new Uint8Array(32)};
"

create_stub "react-native-worklets" "
export const useWorklet = ()=>()=>{};
export const createWorklet = (fn)=>fn;
export const runOnWorklet = (fn)=>fn;
export default {};
"

create_stub "lottie-react-native" "
import React from 'react';
export default function LottieView(props){return React.createElement('div',{style:props.style});}
"

create_stub "react-native-qrcode-svg" "
import React from 'react';
export default function QRCode({value,size=200}){
  return React.createElement('div',{style:{width:size,height:size,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center'}}, 'QR:'+((value||'').slice(0,20))+'...');
}
"

create_stub "bugsnag-react-native" "
export default {start:()=>{},notify:()=>{},leaveBreadcrumb:()=>{}};
"

create_stub "@bugsnag/react-native" "
export default {start:()=>({getPlugin:()=>null}),notify:()=>{},leaveBreadcrumb:()=>{},isStarted:()=>false};
"

create_stub "realm" "
export default class Realm {
  static open = async()=>new Realm();
  objects(){return[];}
  write(fn){fn();}
  create(){}
  delete(){}
  close(){}
  static UpdateMode = {Modified:'modified',All:'all'};
}
"

echo "All stubs created."
