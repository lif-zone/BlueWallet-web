
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

