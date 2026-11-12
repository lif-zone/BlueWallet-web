export const BiometryTypes = {FaceID:'FaceID', TouchID:'TouchID', Biometrics:'Biometrics'};
export default class ReactNativeBiometrics {
  isSensorAvailable = async()=>({available:false, biometryType:null});
  simplePrompt = async()=>({success:false});
  createKeys = async()=>({publicKey:''});
  deleteKeys = async()=>({keysDeleted:true});
}
