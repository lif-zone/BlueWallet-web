
export const RESULTS = {UNAVAILABLE:'unavailable',DENIED:'denied',LIMITED:'limited',GRANTED:'granted',BLOCKED:'blocked'};
export const check = async()=>RESULTS.UNAVAILABLE;
export const request = async()=>RESULTS.UNAVAILABLE;
export const checkNotifications = async()=>({status:RESULTS.UNAVAILABLE,settings:{}});
export const requestNotifications = async()=>({status:RESULTS.UNAVAILABLE,settings:{}});
export const PERMISSIONS = {IOS:{},ANDROID:{}};
export const openSettings = async()=>{};

