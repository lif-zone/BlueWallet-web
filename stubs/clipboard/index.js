const Clipboard = {
  getString: async()=>{
    try { return await navigator.clipboard.readText(); }
    catch(e){ return ''; }
  },
  setString: (text)=>{
    try { navigator.clipboard.writeText(text); }
    catch(e){}
  },
  hasString: async()=>{
    try {
      let text = await navigator.clipboard.readText();
      return text && text.length>0;
    } catch(e){ return false; }
  },
  hasURL: async()=>false,
  hasNumber: async()=>false,
  hasWebURL: async()=>false,
  getImage: async()=>null,
  setImage: ()=>{},
  addListener: ()=>({remove:()=>{}}),
  removeAllListeners: ()=>{},
};
export default Clipboard;
