
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

