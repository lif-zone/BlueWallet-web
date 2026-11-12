
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

