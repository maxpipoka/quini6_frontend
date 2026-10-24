import{r as l,R as u}from"./index-Dq4ZvVuH.js";import{f as T}from"./schemas-D7573uKe.js";import"./_commonjsHelpers-CqkleIqs.js";function re(r){if(r==="")return;const n=parseInt(r,10);if(isNaN(n))return"Debe ser un número";if(n<0||n>45)return"Debe estar entre 0 y 45"}function F(r){if(new Set(r).size!==r.length)return"Los números no pueden repetirse"}function oe(r){const{index:n,value:c,onChange:w,onBlur:S,error:m,disabled:p,autoAdvance:t}=r,d=m??"",[i,f]=l.useState(c),N=u.useRef(null);l.useEffect(()=>{f(c)},[c]);const k=o=>{const e=o.target.value;if(/^\d*$/.test(e)&&!(e.length>2)&&(f(e),w(n,e),t&&e.length===2)){const s=document.querySelector(`[data-number-index="${n+1}"]`);s==null||s.focus()}},h=()=>{S(n)},A=o=>{if(o.key==="Backspace"&&i===""&&n>0){const e=document.querySelector(`[data-number-index="${n-1}"]`);e==null||e.focus()}if(o.key==="ArrowRight"&&n<5){const e=document.querySelector(`[data-number-index="${n+1}"]`);e==null||e.focus()}if(o.key==="ArrowLeft"&&n>0){const e=document.querySelector(`[data-number-index="${n-1}"]`);e==null||e.focus()}};return u.createElement("div",{className:"relative"},u.createElement("input",{ref:N,type:"text",inputMode:"numeric",pattern:"[0-9]*",value:i,onChange:k,onBlur:h,onKeyDown:A,disabled:p,maxLength:2,"aria-label":`Número ${n+1}`,"data-number-index":n,className:`
          w-full rounded-lg
          border bg-surface p-2
          text-center text-heading-md font-semibold text-text-primary
          placeholder-text-muted transition-colors
          duration-150 focus:outline-none
          focus:ring-2 focus:ring-offset-0
          disabled:cursor-not-allowed disabled:bg-neutral-50
          disabled:opacity-50 dark:disabled:bg-neutral-800
          ${d?"dark:focus:ring-error-900/30 border-error-500 focus:border-error-500 focus:ring-error-100":"border-border focus:border-focus focus:ring-focus-ring"}
        `,placeholder:"--"}),d&&u.createElement("p",{className:"absolute bottom-full left-0 mb-1 text-xs text-error-600 dark:text-error-400",role:"alert"},d))}const Y=({value:r,onChange:n,error:c,disabled:w=!1,autoAdvance:S=!0})=>{const[m,p]=l.useState(r.map(o=>o===null?"":T(o))),[t,d]=l.useState(Array(6).fill("")),[i,f]=l.useState(Array(6).fill(!1));l.useEffect(()=>{p(r.map(o=>o===null?"":T(o)))},[r]);const N=l.useCallback((o,e)=>{const s=[...m];s[o]=e,p(s);const I=re(e),b=[...t];b[o]=I??"",d(b);const g=s.map(a=>a===""?null:parseInt(a,10)).filter(a=>a!==null);if(g.length===6&&F(g)){const Z=t.map((ne,ee)=>{const V=g[ee];return V!==void 0&&g.indexOf(V)!==g.lastIndexOf(V)?"Los números no pueden repetirse":""});d(Z)}const D=s.map(a=>a===""?null:parseInt(a,10)).filter(a=>a!==null&&a>=0&&a<=45);D.length===6&&(F(D)||n(D))},[m,t,n]),k=l.useCallback(o=>{const e=[...i];e[o]=!0,f(e)},[i]),h=t.some(o=>o==="Los números no pueden repetirse"),A=t.findIndex(o=>o==="Los números no pueden repetirse");return u.createElement("div",{className:"flex gap-2",role:"group","aria-label":"Selección de 6 números"},Array.from({length:6}).map((o,e)=>{const b=i[e]&&t[e]||h&&A===e?t[e]??"":"";return u.createElement(oe,{key:e,index:e,value:m[e],onChange:N,onBlur:k,error:b,disabled:w,autoAdvance:S})}),c&&!h&&u.createElement("p",{className:"mt-2 text-sm text-error-600 dark:text-error-400",role:"alert"},c))};Y.__docgenInfo={description:"",methods:[],displayName:"NumberInput",props:{value:{required:!0,tsType:{name:"Array",elements:[{name:"unknown"}],raw:"(number | null)[]"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: number[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"value"}],return:{name:"void"}}},description:""},error:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},autoAdvance:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};const le={title:"Draws/NumberInput",component:Y,tags:["autodocs"],argTypes:{value:{control:"object"},error:{control:"text"},disabled:{control:"boolean"},autoAdvance:{control:"boolean"}},parameters:{controls:{expanded:!0}}},v={args:{value:[0,0,0,0,0,0],onChange:r=>console.log("Changed:",r)}},E={args:{value:[5,12,23,34,41,45],onChange:r=>console.log("Changed:",r)}},y={args:{value:[5,12,0,0,0,0],onChange:r=>console.log("Changed:",r)}},C={args:{value:[5,12,23,34,41,45],error:"Esta combinación ya ha sido sorteada",onChange:r=>console.log("Changed:",r)}},x={args:{value:[5,12,23,34,41,45],disabled:!0,onChange:r=>console.log("Changed:",r)}},q={args:{value:[5,12,23,5,41,45],onChange:r=>console.log("Changed:",r)}};var L,$,B;v.parameters={...v.parameters,docs:{...(L=v.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    value: [0, 0, 0, 0, 0, 0],
    onChange: v => console.log('Changed:', v)
  }
}`,...(B=($=v.parameters)==null?void 0:$.docs)==null?void 0:B.source}}};var _,R,U;E.parameters={...E.parameters,docs:{...(_=E.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    value: [5, 12, 23, 34, 41, 45],
    onChange: v => console.log('Changed:', v)
  }
}`,...(U=(R=E.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var W,O,K;y.parameters={...y.parameters,docs:{...(W=y.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    value: [5, 12, 0, 0, 0, 0],
    onChange: v => console.log('Changed:', v)
  }
}`,...(K=(O=y.parameters)==null?void 0:O.docs)==null?void 0:K.source}}};var P,j,z;C.parameters={...C.parameters,docs:{...(P=C.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    value: [5, 12, 23, 34, 41, 45],
    error: 'Esta combinación ya ha sido sorteada',
    onChange: v => console.log('Changed:', v)
  }
}`,...(z=(j=C.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var M,G,H;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: [5, 12, 23, 34, 41, 45],
    disabled: true,
    onChange: v => console.log('Changed:', v)
  }
}`,...(H=(G=x.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,Q,X;q.parameters={...q.parameters,docs:{...(J=q.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    value: [5, 12, 23, 5, 41, 45],
    onChange: v => console.log('Changed:', v)
  }
}`,...(X=(Q=q.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const ue=["Default","WithValues","PartialValues","WithError","Disabled","DuplicateError"];export{v as Default,x as Disabled,q as DuplicateError,y as PartialValues,C as WithError,E as WithValues,ue as __namedExportsOrder,le as default};
