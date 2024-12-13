import{createRoot as e}from"react-dom/client";function t(...e){}const r=t,n=e=>e,o=n,s=e=>(...t)=>e,a=s,c=e=>t=>e(t),i=c,l=e=>t=>t(e),u=l,d=e=>t=>e(t)(t),p=d,g=e=>t=>r=>e(r)(t),m=g,f=e=>t=>r=>e(t(r)),h=f,E=e=>t=>r=>e(r)(t(r)),S=E,A=e=>t=>r=>e(t(r))(r),O=A,y=e=>t=>r=>n=>e(t(n))(r(n)),R=y,w=e=>t=>r=>n=>e(t(r))(t(n)),C=w,T=e=>{return(t=t=>e((e=>t(t)(e))))(t);var t},_=T;var b=Object.freeze({__proto__:null,noop:t,N:r,identity:n,I:o,constant:s,K:a,apply:c,A:i,thrush:l,T:u,duplication:d,W:p,flip:g,C:m,compose:f,B:h,substitution:E,S:S,chain:A,S_:O,converge:y,S2:R,psi:w,P:C,fixPoint:T,Y:_});const U=e=>({...e,middleware:n}),v=e=>e=>(...t)=>e(...t),N=(...e)=>0,L=(e,t)=>e.concat(t.middleware);function I(...e){return 0===e.length?n:1===e.length?e[0]:e.reduce(((e,t)=>(...r)=>e(t(...r))))}function H(...e){return t=>(...r)=>{const n=t(...r),o=e.map((e=>e(n))),s=I(...o)(n.middleware);return{...n,middleware:s}}}const P=(e={})=>{const{createApi:t=U,middleware:r=[{middleware:v}],sort:n=N,transform:o=L}=e;return H(...r.sort(n).reduce(((e,t,r,n)=>o(e,t,r,n)),[]))(t)},j=/(?<=\[\s*).*?(?=\s*\])/gs,$=/\/\*([^)]{0,})\*\//gm,V=(e,t,r)=>e<=t?t:e>=r?r:e,x=e=>`[${e}m`,M={black:x("30"),blue:x("34"),cyan:x("36"),magenta:x("35"),green:x("32"),white:x("37"),yellow:x("33"),red:x("31"),reset:x("0")},k={debug:M.green,info:M.white,warn:M.yellow,error:M.magenta,fatal:M.red,stop:M.reset},G=(e,t="/")=>Reflect.ownKeys(e).reduce(((r,n)=>{let o={};return o="object"==typeof e[n]?Reflect.ownKeys(e[n]).reduce(((r,o)=>(r[`${n.toString()}${t}${o.toString()}`]=e[n][o],r)),{}):{[n]:e[n]},{...r,...o}}),{}),D=e=>t=>new Proxy(t,e),B=e=>e.toJSON(),q=(e=B)=>()=>{const t=new Date;return{raw:t,formatted:e(t)}},J=e=>Object.values(e).reduce(((e,t)=>e.concat(t.toString())),[]),F=()=>`${ee(8)}-${ee(4)}-${ee(4)}-${ee(4)}-${ee(12)}`,K=e=>Reflect.ownKeys(e).reduce(((t,r)=>(void 0!==e[r]&&(t[r]=e[r]),t)),{}),Q=e=>{if(e.length<2||e.length%2!=0||e.match(/[0-9a-fA-F]/g).length!==e.length)throw new Error("Hexidecimal is 0-9 and a-f characters and even length only.");const t=e.match(/[\s\S]{1,2}/g)||[];return Array.from(t).reduce(((e,t)=>e.concat(String.fromCharCode(parseInt(t,16)))),"")},z=(e,t,r={})=>e.reduce(((e,n,o)=>{const s=t[o];let a="";return"function"==typeof s?a=s(r)??"":"string"==typeof s&&(a=s),e.concat(n,a)}),""),W=()=>"object"==typeof process&&"string"==typeof process.versions?.node,Y=e=>JSON.parse(JSON.stringify(e)),Z=/\/\/.*/gm,X=e=>Object.keys(Y(e)).reduce(((t,r)=>"string"!=typeof e[r]?t.concat(Object.keys(e[r]).reduce(((t,n)=>t.concat(`${r}.${n}=${e[r][n]}`)),[]).join("&")):t.concat(`${r}=${e[r]}`)),[]).join("&"),ee=e=>{if(e%2!=0)throw new Error("Length must be even: "+e);return re(e,{filterRegex:/[g-zG-Z]/g})},te=(e=4,t={})=>{const{bigint:r=!1,prefix:n="",sign:o="+"}=t;if(!r&&(1>e||e>15))throw new Error("Non-BigInt integer digit count must be with the range of 1 to 15.");const s=Math.floor(e),a=Math.random().toString().slice(2,2+s);if(a.length!==s)return te(Number(s)-a.length,{bigint:r,prefix:n.concat(a),sign:o});const c=o+n.concat(a);return r?BigInt(c):Number(c)},re=(e=20,{prefix:t="",filterRegex:r}={})=>{let n=Math.random().toString(36).slice(2,2+e);return n=r?n.replace(r,""):n,n.length!==e?re(e-n.length,{prefix:t.concat(n),filterRegex:r}):t.concat(n)},ne=e=>e.replace($,"").replace(Z,""),oe=e=>e.replace(/\s{1,}/gm," ").replace(/\n/gm,"").trim(),se=e=>{const t={};for(const[r,n]of e)if(r.includes(".")){const[e,o]=r.split(".");t[e]=t[e]??{},t[e][o]=t[e][o]??{},t[e][o]=n}else t[r]=t[r]?[t[r],n]:n;return t},ae=(e,t)=>{Object.keys(e).forEach((r=>{void 0!==t[r]&&(e[r]=t[r])}))},ce=e=>Array.from(Array(e.length).keys()).reduce(((t,r)=>t.concat(e.charCodeAt(r).toString(16))),""),ie=e=>t=>r=>{const{action:n}=e,{cache:o,key:s,value:a}=r;switch(n?.type){case"CACHE_CLEAR":return t({...r,result:new Map});case"CACHE_GET_VALUE":return t({...r,result:o.get(s)});case"CACHE_HAS_VALUE":return t({...r,result:o.has(s)});case"CACHE_LENGTH":{let e=0;for(const t of o.keys())e+=1;return t({...r,result:e})}case"CACHE_REMOVE_VALUE":return t({...r,result:o.delete(s,a)});case"CACHE_SET_VALUE":return o.set(s,a),t({...r});default:return t(r)}};var le;!function(e){e.CACHE_CLEAR="CACHE_CLEAR",e.CACHE_GET_VALUE="CACHE_GET_VALUE",e.CACHE_HAS_VALUE="CACHE_HAS_VALUE",e.CACHE_LENGTH="CACHE_LENGTH",e.CACHE_REMOVE_VALUE="CACHE_REMOVE_VALUE",e.CACHE_SET_VALUE="CACHE_SET_VALUE"}(le||(le={}));class ue{cache=new Map;cacheName;constructor(e={}){const{name:t=re()}=e;this.cacheName=t}get length(){let e=0;for(const t of this.cache.keys())e+=1;return e}hasValue(e){return this.cache.has(e)}get name(){return this.cacheName}setValue(e,t){this.cache.set(e,t)}getValue(e){return this.cache.get(e)}removeValue(e){return this.cache.delete(e)}clear(){this.cache=new Map}}function de(e={}){const{createApi:t,middleware:r=[{middleware:ie}],sort:n,transform:o,name:s=re()}=e;let a=new Map;const c=s,i=P({createApi:t,middleware:r,sort:n,transform:o});return{clear(){const{result:e}=i({action:{type:le.CACHE_CLEAR}}).middleware({cache:a});a=e},getValue(e){const{result:t}=i({action:{type:le.CACHE_GET_VALUE}}).middleware({cache:a,key:e});return t},hasValue(e){const{result:t}=i({action:{type:le.CACHE_HAS_VALUE}}).middleware({cache:a,key:e});return t},get length(){const{result:e}=i({action:{type:le.CACHE_LENGTH}}).middleware({cache:a});return e},get name(){return c},removeValue(e){const{result:t}=i({action:{type:le.CACHE_REMOVE_VALUE}}).middleware({cache:a,key:e});return t},setValue(e,t){i({action:{type:le.CACHE_SET_VALUE}}).middleware({cache:a,key:e,value:t})}}}const pe=e=>{const{callback:t,createApi:r,middleware:n,sort:o,transform:s}=e,a=P({createApi:r,middleware:n,sort:o,transform:s});return(e,r,n)=>{let o,s;"number"==typeof n?s=n:n&&(o=n);const c=K({api:a,descriptor:o,parameterIndex:s,propertyKey:r,target:e});return t(c)}},ge=e=>pe(e),me=e=>pe(e),fe=e=>t=>{e(t)},he=({callback:e,newDescriptor:t})=>(r,n,o)=>{e?e(r,n,o):t&&ae(o,t)},Ee=(e=t)=>(t,r,n)=>{e(t,r,n)},Se=({callback:e,accessors:t})=>(r,n)=>{e?e(r,n):t&&Reflect.defineProperty(r,n,t)};var Ae,Oe;function ye(e){const{abortControllerOptions:t={},createApi:r,middleware:n,middlewareOptions:o={},request:s,requestInitOptions:a={},sort:c,transform:i}=e,{reason:l="Controller was aborted.",timeout:u=5e3}=t;let{signal:d}=a;if(!d){const e=new AbortController,t=AbortSignal.timeout(u);d=AbortSignal.any([e.signal,t]),setTimeout((()=>e.abort(l)),u)}const p=P({createApi:r,middleware:n,sort:c,transform:i});return async e=>{const t={...a,...e},{requestOptions:r}=p({action:{data:{options:o},type:Oe.HTTP_REQUEST}}).middleware({requestOptions:[s,{...t,signal:d}]}),n=await fetch(...r);return p({action:{data:{options:o},type:Oe.HTTP_RESPONSE}}).middleware(n)}}function Re(e,t){return async r=>{const n={...t,...r};return n.requestInitOptions=n.requestInitOptions?{...n.requestInitOptions,method:e}:{method:e},ye(n)}}function we(e){return{connect:Re(Ae.CONNECT,e),delete:Re(Ae.DELETE,e),get:Re(Ae.GET,e),head:Re(Ae.HEAD,e),options:Re(Ae.OPTIONS,e),patch:Re(Ae.PATCH,e),post:Re(Ae.POST,e),put:Re(Ae.PUT,e),trace:Re(Ae.TRACE,e)}}!function(e){e.CONNECT="CONNECT",e.DELETE="DELETE",e.GET="GET",e.HEAD="HEAD",e.OPTIONS="OPTIONS",e.PATCH="PATCH",e.POST="POST",e.PUT="PUT",e.TRACE="TRACE"}(Ae||(Ae={})),function(e){e.HTTP_REQUEST="HTTP_REQUEST",e.HTTP_RESPONSE="HTTP_RESPONSE"}(Oe||(Oe={}));const Ce=e=>t=>r=>{if("LOGGER_LOG_LINE"===e.action.type){const{logLine:e,output:t}=r,{lineOptions:n,logRecord:o}=e,{level:s}=n;t["fatal"===s?"error":s](o.formatted)}return t(r)},Te=e=>t=>r=>{const{args:n,lineOptions:o}=r;return"LOGGER_CREATE_LINE"===e.action.type?t({lineOptions:o,logRecord:{raw:{args:n,lineOptions:o},formatted:o.formatter({args:n,lineOptions:o})}}):t(r)},_e=e=>{const{args:t,lineOptions:r,template:n=be}=e,{level:o,prefix:s,timeStamp:a}=r;return n({args:t,escapeStart:W()?k[o]:"",escapeStop:W()?k.stop:"",level:o,prefix:s,timeStamp:a})},be=(e={})=>{const{args:t,escapeStart:r,escapeStop:n,level:o,prefix:s,timeStamp:a}=e;return[`${r}[${[a.formatted,o.toUpperCase(),s].filter(Boolean).join(" | ")}]:`,JSON.stringify(t,null,2),n].join(" ")};var Ue;!function(e){e.LOGGER_CREATE_LINE="LOGGER_CREATE_LINE",e.LOGGER_LOG_LINE="LOGGER_LOG_LINE"}(Ue||(Ue={}));const ve=(e={})=>{let{formatter:t=_e,level:r="info",prefix:n="",output:o=globalThis.console}=e;const{createApi:s,middleware:a=[{middleware:Ce},{middleware:Te}],middlewareOptions:c={},sort:i,transform:l}=e,u=P({createApi:s,middleware:a,sort:i,transform:l});return{updateOptions(e={}){t=e.formatter||t,r=e.level||r,n=e.prefix||n,o=e.output||o},log(...e){const s=q()(),a={formatter:t,level:r,prefix:n,timeStamp:s},i=u({action:{data:{options:c},type:Ue.LOGGER_CREATE_LINE}}).middleware({args:e,lineOptions:a});u({action:{data:{options:c},type:Ue.LOGGER_LOG_LINE}}).middleware({logLine:i,output:o})}}};var Ne;!function(e){e.MATCH="MATCH"}(Ne||(Ne={}));const Le=(e={})=>{const{createApi:t,middleware:r,options:n={},sort:o,transform:s}=e,a=P({createApi:t,middleware:r,sort:o,transform:s});return(e,t)=>a({action:{type:Ne.MATCH,data:{options:n}}}).middleware(e,t)},Ie=(e={},t={})=>{const{logger:r=globalThis.console.log}=t;return{...e,get:(e,t,n)=>e[t]?e[t]:(r(`Something went wrong... '${t.toString()}' does not exist on ${n}.`),e)}},He=(e={})=>{const{createApi:t,sort:r,transform:n,defaultHandler:o={},defaultTarget:s={},methodName:a="match",middleware:c}=e;return D(Ie(o))({...Pe(s),[a]:Le({createApi:t,middleware:c,sort:r,transform:n})})},Pe=e=>{let t;const r={get be(){return{instanceOf(e,n){const o=t.eval(n);return r.eq(!0,o instanceof e)},typeOf(e,n){const o=t.eval(n);return r.eq(e,typeof o)},get array(){return this.instanceOf(Array)},get bigint(){return this.typeOf("bigint")},get boolean(){return this.typeOf("boolean")},get false(){return r.eq(!1)},get function(){return this.typeOf("function")},get NaN(){if(!t.negate&&!isNaN(t.eval()))throw new Error(`Expected is not a NaN value: ${t.eval()}`);return this.typeOf("number")},get number(){return this.typeOf("number")},get null(){return r.eq(null)},get object(){return this.typeOf("object")},get set(){return this.instanceOf(Set)},get string(){return this.typeOf("string")},get symbol(){return this.typeOf("symbol")},get true(){return r.eq(!0)},get undefined(){return this.typeOf("undefined")}}},eq(e,r){const n=t.eval(r);if(t.negate&&n===e||!t.negate&&n!==e)throw new Error(`Expected: ${t.negate?"not":""} ${n}, actual: ${e}.`);return!0},include(e,n){const o=t.eval(n);switch(typeof o){case"object":return o instanceof Array?r.eq(!0,o.includes(e)):r.eq(!0,Reflect.ownKeys(o).includes(e));case"string":return r.eq(!0,o.includes(e));default:throw new Error(`Unsupported type. Currently only strings, objects and arrays are supported. Provided: ${o}.`)}},get not(){return t.negate=!t.negate,r},get to(){return r},throw(e,n){let o,s,a;try{a=t.eval(n),a()}catch(e){o=e,s=!0}if(t.negate){if(e)r.eq(!1,o instanceof e);else if(s)throw new Error(`Expected expression: ${a.toString()}, threw error when not expected to: ${o}`)}else if(e)r.eq(!0,o instanceof e);else if(!s)throw new Error(`Expected expression: ${a.toString()}, did not throw error when expected to: ${a.toString()}`)}};return{...e,expect(e){var n;return t={expression:n=e,eval:e=>{const t=e||n;return"function"==typeof t?t():t},negate:!1},r}}},je=t=>{const{Component:r,rootElement:n}=t;let o;if("string"==typeof n){if(o=document.body.querySelector(n),!o)throw new Error(`Root Element query selector is invalid: ${n}`)}else o=n;e(o).render(r)},$e=e=>{const{Component:t,logger:r=globalThis.console.warn,rootElement:n,renderFunc:o=je}=e;try{if(["complete","interactive"].includes(document.readyState))setTimeout((()=>o({Component:t,rootElement:n})),0);else{const e=()=>{o({Component:t,rootElement:n}),globalThis.removeEventListener("DOMContentLoaded",e)};globalThis.addEventListener("DOMContentLoaded",e)}return!0}catch(e){return r(e),!1}};function Ve(e={}){const{current:t,future:r=[],past:n=[]}=e;return{past:n,current:t,future:r}}const xe=(e,t)=>{t&&t>0&&(e.past.length>t&&(e.past=e.past.slice(0,t)),e.future.length>t&&(e.future=e.future.slice(0,t)))};function Me(e={}){const{idFactory:t=F,limit:r}=e;let{history:n=Ve()}=e;const o={clear:()=>{n=Ve()},getHistory:()=>n,getState:()=>n.current,jumpToFutureRevision:e=>{let t;for(const[r,s]of n.future.entries())if(s.revisionId===e){t=o.redo(r+1);break}return t},jumpToPastRevision:e=>{let t;for(const[r,s]of n.past.entries())if(s.revisionId===e){t=o.undo(r+1);break}return t},jumpToRevision:e=>{if(n.current.revisionId===e)return n.current;const t=o.jumpToPastRevision(e);if(t&&t.revisionId===e)return t;const r=o.jumpToFutureRevision(e);return r&&r.revisionId===e?r:void 0},redo:(e=1)=>{if(e>=1&&n.future.length>=e){const t=e-1,o=n.future[t],s=n.current;n.current=o;const a=n.future.slice(0,t);n.future=n.future.slice(e,n.future.length),n.past.unshift(...[s,...a].reverse()),xe(n,r)}return n.current},setState:e=>{const o=Y(n);try{return n.current={revisionId:t(e),value:e},n.future=[],n.past.unshift(o.current),xe(n,r),n.current}catch(e){return n=o,n.current}},undo:(e=1)=>{if(e>=1&&n.past.length>=e){const t=e-1,o=n.past[t],s=n.current;n.current=o;const a=n.past.slice(0,t);n.past=n.past.slice(e,n.past.length),n.future.unshift(...[s,...a].reverse()),xe(n,r)}return n.current}};return o}const ke=e=>{const{actions:t={},name:r=re()}=e;let n=new Map;const o={dispatch:(e,t)=>o.hasAction(t.type)?o.getAction(t.type)(e):e,getAction:e=>n.get(e),getAllActions(){const e={};for(const[t,r]of n)e[t]=r;return e},hasAction:e=>n.has(e),get name(){return r},removeAction:e=>{n.delete(e)},removeAllActions(){n=new Map},setAction:(e,t)=>{n.set(e,t)},setActions:(e={})=>{Reflect.ownKeys(e).forEach((t=>{o.setAction(t,e[t])}))}};return o.setActions(t),o},Ge=e=>{const{historyCtl:r}=e;return e=>{const{data:n,type:o}=e.action,{subscribers:s}=n;let a={log:t,updateOptions:t};if(n?.options?.logger){const e=["Reducer Store Dispatch",n.options.logger.prefix].join(" - ");a=ve({prefix:e})}return e=>t=>{const{action:n,callback:c,reducerAction:i,state:l}=t;if("@DISPATCH_ACTION"===o)switch(n.type){case"@CLEAR":return a.log("Action: [@CLEAR]"),r.clear();case"@JUMP_TO_FUTURE_REVISION":{a.log("Action: [@JUMP_TO_FUTURE_REVISION]",{action:n,state:l});const{revisionId:e}=n.data;return r.jumpToFutureRevision(e)}case"@JUMP_TO_PAST_REVISION":{a.log("Action: [@JUMP_TO_PAST_REVISION]",{action:n,state:l});const{revisionId:e}=n.data;return r.jumpToPastRevision(e)}case"@JUMP_TO_REVISION":{a.log("Action: [@JUMP_TO_REVISION]",{action:n,state:l});const{revisionId:e}=n.data;return r.jumpToRevision(e)}case"@REDO":{a.log("Action: [@REDO]",{action:n});const{steps:e}=n.data;return r.redo(e)}case"@UNDO":{a.log("Action: [@UNDO]: ",{action:n});const{steps:e}=n.data;return r.undo(e)}default:{a.log({action:n,state:l});const e=i(l,n);a.log({result:e});const t=r.setState(e.value);for(const[e,r]of s)r({action:n,state:l,newState:t});return}}else"@SUBSCRIBE"===o?s.set(c,c):"@UNSUBSCRIBE"===o&&s.delete(c);return e(t)}}};var De;!function(e){e.DISPATCH_ACTION="@DISPATCH_ACTION",e.SUBSCRIBE="@SUBSCRIBE",e.UNSUBSCRIBE="@UNSUBSCRIBE",e.CLEAR="@CLEAR",e.JUMP_TO_FUTURE_REVISION="@JUMP_TO_FUTURE_REVISION",e.JUMP_TO_PAST_REVISION="@JUMP_TO_PAST_REVISION",e.JUMP_TO_REVISION="@JUMP_TO_REVISION",e.REDO="@REDO",e.UNDO="@UNDO"}(De||(De={}));const Be=J(De),qe=e=>{const{historyCtl:t=Me(),name:r,options:n={},createApi:o,sort:s,transform:a,reducers:c}=e;let{middleware:i=[]}=e;const l=G(c);i=[{middleware:Ge({historyCtl:t})},...i];const u=new Map,d=P({createApi:o,middleware:i,sort:s,transform:a});return{get actions(){return l},dispatch(e){const r=l[e.type];if(r||Be.includes(e.type)){const o=t.getState();d({action:{type:De.DISPATCH_ACTION,data:{options:n,subscribers:u}}}).middleware({action:e,reducerAction:r,state:o})}},getState:()=>t.getState(),get name(){return r},subscribe:e=>(d({action:{data:{options:n,subscribers:u},type:De.SUBSCRIBE}}).middleware({callback:e}),()=>{d({action:{data:{options:n,subscribers:u},type:De.UNSUBSCRIBE}}).middleware({callback:e})})}};class Je extends URL{static generatedObjectURLS=[];static createObjectURL(e){const t=super.createObjectURL(e);return this.generatedObjectURLS=this.generatedObjectURLS.concat(t),t}static get currentUrl(){return new Je(globalThis.location.href)}static get objectURLS(){return this.generatedObjectURLS}static revokeObjectURL(e){this.generatedObjectURLS.includes(e)&&(this.generatedObjectURLS=this.generatedObjectURLS.filter((t=>t!==e))),super.revokeObjectURL(e)}static revokeAllObjectURLs(){this.generatedObjectURLS.forEach((e=>this.revokeObjectURL(e)))}constructor(e){super(e)}get params(){return se(this.searchParams)}set params(e){this.search=X(e)}}class Fe{static globalResources=new Map;static controllerNames=[];static create(e){const{controller:t,name:r}=e;this.globalResources.set(`${t.toString()}/${r.toString()}`,e)}static delete(e,t){return this.globalResources.delete(`${e.toString()}/${t.toString()}`)}static get(e,t){return this.globalResources.get(`${e.toString()}/${t.toString()}`)}static update(e){const{controller:t,name:r,url:n}=e,o=this.get(t,r);o&&(o.url=n,this.globalResources.set(`${t.toString()}/${r.toString()}`,o))}static list(){const e={};for(const[t,r]of this.globalResources){const[n,o]=t.toString().split("/");e[n]=e[n]??{},e[n][o]=r}return e}static validateIdString(e){return null!==e.match(/^((?!\/).)*$/i)}controllerName;controllerResources=new Map;names=[];constructor(e){if(!Fe.validateIdString(e.toString()))throw new Error(`Controller: '${e.toString()}' must not include the character ':'.`);if(Fe.controllerNames.includes(e))throw new Error(`Controller: '${e.toString()}' already taken.`);this.controllerName=e,Fe.controllerNames.push(e)}get name(){return this.controllerName.toString()}get resources(){const e={};for(const[t,r]of this.controllerResources)e[t.toString()]=r;return e}create(e){try{const{name:t}=e;if(!Fe.validateIdString(t.toString()))throw new Error(`Resource: '${t.toString()}' must not include the character ':'.`);if(this.names.includes(t))throw new Error(`Resource: '${t.toString()}' already taken.`);const r=Qe(e)();return this.controllerResources.set(t,r),Fe.get(this.controllerName,r.name)?Fe.update({controller:this.controllerName,name:r.name,url:r.url}):Fe.create({controller:this.controllerName,name:r.name,url:r.url}),r}catch(e){console.warn(e)}}delete(e){try{const t=this.controllerResources.get(e.toString());return!!t&&(t.revokeUrl(),this.controllerResources.delete(e)&&Fe.delete(this.controllerName,e))}catch(e){return console.warn(e),!1}}get(e){return this.controllerResources.get(e)}update(e){try{const t=this.controllerResources.get(e.name),{data:r=t.data,mimeType:n=t.mimeType,name:o,factory:s=t.factory}=e;t.revokeUrl();const a=Qe({data:r,factory:s,mimeType:n,name:o})();return this.controllerResources.set(o,a),Fe.get(this.controllerName,t.name)?Fe.update({controller:this.controllerName,name:t.name,url:t.url}):Fe.create({controller:this.controllerName,name:t.name,url:t.url}),a}catch(e){console.warn(e)}}}const Ke=e=>(t,...r)=>{const{factory:o=n,mimeType:s="text/javascript",name:a,...c}=e;let i;return{get blob(){return new Blob([this.toString()],{type:s})},get data(){return z(t,r,c)},get factory(){return o},get mimeType(){return s},get name(){return a},revokeUrl(){Je.revokeObjectURL(i),i=""},toString(){return o(this.data)},get url(){return i&&0!==i.length||(i=Je.createObjectURL(this.blob)),i}}},Qe=e=>(t={})=>{const{data:r,mimeType:o,name:s,factory:a=n}={...e,...t};let c;return{get blob(){return new Blob([this.data],{type:o})},get data(){return r},get factory(){return a},get mimeType(){return o},get name(){return s},revokeUrl(){Je.revokeObjectURL(c),c=void 0},toString(){return a(this.data)},get url(){return c||(c=Je.createObjectURL(this.blob)),c}}};export{le as CACHE_ACTIONS,Oe as HTTPCLIENT_ACTIONS,Ae as HTTPMethods,ye as HttpClient,Ue as LOGGER_ACTIONS,Ne as MATCHER_ACTIONS,ue as MapCache,Fe as ResourceController,De as STORE_ACTIONS,Je as URLManager,H as applyMiddleware,j as arrayContentsRegex,$ as blockCommentRegEx,V as clamp,Re as clientFactory,x as colorCode,M as colorCodes,k as colorEscapeCodes,b as combinators,I as compose,ge as createClassDecorator,fe as createClassHandler,me as createClassMemberDecorator,he as createClassMethodHandler,Ee as createClassParameterHandler,Se as createClassPropertyHandler,pe as createDecorator,Ve as createHistory,Me as createHistoryController,we as createHttpClient,ve as createLogger,de as createMapCache,Le as createMatcher,Ie as createMatcherProxyHandler,P as createMiddlewareApi,G as createNamespacedRecord,Pe as createProxiedMatchTarget,He as createProxiedMatcher,D as createProxy,ke as createReducer,Qe as createResource,qe as createStore,Ke as createTextResource,q as createTimeStamp,J as enumToArray,F as fakeUuid,K as filterUndefinedFromObject,Q as hexToUtf,z as interpolate,W as isNode,Y as jsonObjectCopy,Z as lineCommentRegEx,$e as mountRootComponent,X as objectToSearchParams,U as passthroughCreateApi,v as passthroughMiddleware,N as passthroughSort,L as passthroughTransform,ee as randomHexString,te as randomInteger,re as randomString,ne as removeComments,oe as removeWhitespace,se as searchParamsToObject,ae as updateConstObject,ce as utfToHex};
