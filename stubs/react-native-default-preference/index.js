const store = {};
const DefaultPreference = {
  get: async(key)=>store[key]||null,
  set: async(key, val)=>{ store[key] = val; },
  clear: async(key)=>{ delete store[key]; },
  getMultiple: async(keys)=>keys.map(k=>store[k]||null),
  setMultiple: async(obj)=>Object.assign(store, obj),
  clearMultiple: async(keys)=>keys.forEach(k=>delete store[k]),
  getAll: async()=>({...store}),
  clearAll: async()=>{ for (let k in store) delete store[k]; },
  setName: ()=>{},
  getName: ()=>'',
};
export default DefaultPreference;
