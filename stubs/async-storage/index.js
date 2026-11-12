const PREFIX = '@AsyncStorage:';

const AsyncStorage = {
  getItem: async(key)=>{
    try { return localStorage.getItem(PREFIX+key); }
    catch(e){ return null; }
  },
  setItem: async(key, value)=>{
    try { localStorage.setItem(PREFIX+key, value); }
    catch(e){}
  },
  removeItem: async(key)=>{
    try { localStorage.removeItem(PREFIX+key); }
    catch(e){}
  },
  mergeItem: async(key, value)=>{
    try {
      let existing = localStorage.getItem(PREFIX+key);
      if (existing){
        let merged = {...JSON.parse(existing), ...JSON.parse(value)};
        localStorage.setItem(PREFIX+key, JSON.stringify(merged));
      } else {
        localStorage.setItem(PREFIX+key, value);
      }
    } catch(e){}
  },
  clear: async()=>{
    try {
      let keys = [];
      for (let i=0; i<localStorage.length; i++){
        let k = localStorage.key(i);
        if (k && k.startsWith(PREFIX))
          keys.push(k);
      }
      keys.forEach(k=>localStorage.removeItem(k));
    } catch(e){}
  },
  getAllKeys: async()=>{
    try {
      let keys = [];
      for (let i=0; i<localStorage.length; i++){
        let k = localStorage.key(i);
        if (k && k.startsWith(PREFIX))
          keys.push(k.slice(PREFIX.length));
      }
      return keys;
    } catch(e){ return []; }
  },
  multiGet: async(keys)=>{
    return keys.map(k=>[k, localStorage.getItem(PREFIX+k)]);
  },
  multiSet: async(pairs)=>{
    pairs.forEach(([k, v])=>localStorage.setItem(PREFIX+k, v));
  },
  multiRemove: async(keys)=>{
    keys.forEach(k=>localStorage.removeItem(PREFIX+k));
  },
  multiMerge: async(pairs)=>{
    for (let [k, v] of pairs)
      await AsyncStorage.mergeItem(k, v);
  },
};

export default AsyncStorage;
