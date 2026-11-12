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
