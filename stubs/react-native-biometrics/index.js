
export default class ReactNativeBiometrics {
  isSensorAvailable = async()=>({available:false,biometryType:null});
  simplePrompt = async()=>({success:false});
  createKeys = async()=>({publicKey:''});
}

