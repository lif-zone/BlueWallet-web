// node env in browser
import compat, {setImmediate, clearImmediate} from 'lif-kernel/compat';
globalThis.global = globalThis;
import buffer from 'buffer';
globalThis.Buffer = buffer.Buffer;
process.env.NODE_BACKEND = 'js';
process.on = ()=>{};
process.argv = [''+globalThis.location];
process.exit = code=>console.warn('process.exit('+(code||0)+')');
globalThis.setImmediate = setImmediate;
globalThis.clearImmediate = clearImmediate;
globalThis.__DEV__ = false;
globalThis.require = function(path){
  if (typeof path=='string' && path.match(/\.(png|jpg|jpeg|gif|svg|json)$/))
    return {uri: path};
  console.warn('require() not supported:', path);
  return {};
};
