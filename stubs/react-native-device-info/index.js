
export const getUniqueId = async()=>'web-device';
export const getDeviceType = ()=>'Desktop';
export const isTablet = ()=>false;
export const getVersion = ()=>'0.0.0';
export const getBundleId = ()=>'io.bluewallet.bluewallet';
export const isEmulator = async()=>false;
const DeviceInfo = { getUniqueId, getDeviceType, isTablet, getVersion, getBundleId, isEmulator, getPowerState: async()=>({batteryLevel:1,batteryState:'full',lowPowerMode:false}) };
export default DeviceInfo;

