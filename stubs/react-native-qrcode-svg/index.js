
import React from 'react';
export default function QRCode({value,size=200}){
  return React.createElement('div',{style:{width:size,height:size,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center'}}, 'QR:'+((value||'').slice(0,20))+'...');
}

