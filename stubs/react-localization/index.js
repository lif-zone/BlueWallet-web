class LocalizedStrings {
  constructor(strings){
    this._defaultLang = 'en';
    this._strings = strings;
    Object.assign(this, strings.en || strings[Object.keys(strings)[0]] || {});
  }
  setLanguage(){}
  getLanguage(){ return 'en'; }
  getInterfaceLanguage(){ return 'en'; }
  formatString(str, ...args){
    if (!str) return '';
    let result = str;
    for (let i=0; i<args.length; i++){
      if (typeof args[i]=='object' && args[i]!==null){
        for (let k of Object.keys(args[i]))
          result = result.replace('{'+k+'}', args[i][k]);
      } else {
        result = result.replace('{'+i+'}', args[i]);
      }
    }
    return result;
  }
  getString(key, lang){ return this[key] || key; }
  getAvailableLanguages(){ return ['en']; }
}
export default LocalizedStrings;
export {LocalizedStrings};
