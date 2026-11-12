
export const getLocales = ()=>[{languageCode:'en',countryCode:'US',languageTag:'en-US',isRTL:false}];
export const findBestLanguageTag = ()=>({languageTag:'en',isRTL:false});
export const getNumberFormatSettings = ()=>({decimalSeparator:'.',groupingSeparator:','});
export const getCurrencies = ()=>['USD'];
export const getCountry = ()=>'US';
export const getCalendar = ()=>'gregorian';
export const getTemperatureUnit = ()=>'fahrenheit';
export const getTimeZone = ()=>Intl.DateTimeFormat().resolvedOptions().timeZone;
export const uses24HourClock = ()=>false;
export const addEventListener = ()=>({remove:()=>{}});
export const removeEventListener = ()=>{};

