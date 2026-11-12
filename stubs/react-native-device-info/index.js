export const getUniqueId = async()=>'web-device';
export const getDeviceType = ()=>'Desktop';
export const isTablet = ()=>false;
export const getVersion = ()=>'0.0.0';
export const getBundleId = ()=>'io.bluewallet.bluewallet';
export const isEmulator = async()=>false;
export const getApplicationName = ()=>'BlueWallet';
export const getSystemName = ()=>'Web';
export const getSystemVersion = ()=>'1.0';
export const hasGmsSync = ()=>false;
export const hasHmsSync = ()=>false;
export const getModel = ()=>'Web';
export const getDeviceId = ()=>'web';
export const getBrand = ()=>'Web';
export const getMacAddress = async()=>'00:00:00:00:00:00';
export const getApiLevel = async()=>0;
export const getFirstInstallTime = async()=>0;
const DeviceInfo = { getUniqueId, getDeviceType, isTablet, getVersion, getBundleId, isEmulator,
  getPowerState: async()=>({batteryLevel:1,batteryState:'full',lowPowerMode:false}),
  getApplicationName, getSystemName, getSystemVersion, hasGmsSync, hasHmsSync,
  getModel, getDeviceId, getBrand, getMacAddress, getApiLevel, getFirstInstallTime };
export default DeviceInfo;
