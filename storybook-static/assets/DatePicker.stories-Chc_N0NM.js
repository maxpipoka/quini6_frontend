import{r as c,R as d}from"./index-Dq4ZvVuH.js";import"./_commonjsHelpers-CqkleIqs.js";function S(e,r,o){if(!e)return;const n=new Date(e);if(isNaN(n.getTime()))return"Fecha inválida";if(r){const a=new Date(r);if(!isNaN(a.getTime())&&n<a)return`La fecha debe ser posterior a ${x(r)}`}if(o){const a=new Date(o);if(!isNaN(a.getTime())&&n>a)return`La fecha debe ser anterior a ${x(o)}`}}function x(e){try{return new Date(e).toLocaleDateString("es-AR",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return e}}function J(e){const r=new Date(e);return isNaN(r.getTime())?"":r.toISOString()}function T(e){try{const r=new Date(e),o=r.getFullYear(),n=String(r.getMonth()+1).padStart(2,"0"),a=String(r.getDate()).padStart(2,"0"),t=String(r.getHours()).padStart(2,"0"),s=String(r.getMinutes()).padStart(2,"0");return`${o}-${n}-${a}T${t}:${s}`}catch{return""}}const U=({value:e,onChange:r,error:o,disabled:n=!1,min:a,max:t})=>{const[s,v]=c.useState(""),[y,D]=c.useState(void 0),[b,A]=c.useState(!1);c.useEffect(()=>{v(e?T(e):"")},[e]),c.useEffect(()=>{if(b){const l=S(s,a,t);D(l)}},[s,a,t,b]);const H=c.useCallback(l=>{const C=l.target.value;if(v(C),C){const G=J(C);r(G)}else r("")},[r]),Y=c.useCallback(()=>{A(!0);const l=S(s,a,t);D(l)},[s,a,t]),i=b&&y?y:o,j=a?T(a):void 0,z=t?T(t):void 0;return d.createElement("div",{className:"w-full"},d.createElement("label",{htmlFor:"draw-date",className:"mb-1.5 block font-medium text-text-primary"},"Fecha del sorteo"),d.createElement("input",{id:"draw-date",type:"datetime-local",value:s,onChange:H,onBlur:Y,disabled:n,min:j,max:z,"aria-invalid":i?"true":"false","aria-describedby":i?"date-error":void 0,className:`
          w-full
          rounded-lg border bg-surface
          px-4 py-2.5 text-text-primary placeholder-text-muted
          transition-colors duration-150
          focus:outline-none focus:ring-2
          focus:ring-offset-0 disabled:cursor-not-allowed
          disabled:bg-neutral-50 disabled:opacity-50 dark:disabled:bg-neutral-800
          ${i?"dark:focus:ring-error-900/30 border-error-500 focus:border-error-500 focus:ring-error-100":"border-border focus:border-focus focus:ring-focus-ring"}
        `}),i&&d.createElement("p",{id:"date-error",className:"mt-1.5 text-sm text-error-600 dark:text-error-400",role:"alert"},i))};U.__docgenInfo={description:"",methods:[],displayName:"DatePicker",props:{value:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},error:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},min:{required:!1,tsType:{name:"string"},description:""},max:{required:!1,tsType:{name:"string"},description:""}}};const X={title:"Draws/DatePicker",component:U,tags:["autodocs"],argTypes:{value:{control:"text"},error:{control:"text"},disabled:{control:"boolean"},min:{control:"text"},max:{control:"text"}}},u={args:{value:"2024-01-15T10:00:00.000Z",onChange:e=>console.log("Changed:",e)}},g={args:{value:"",onChange:e=>console.log("Changed:",e)}},m={args:{value:"2024-01-15T10:00:00.000Z",error:"La fecha debe ser anterior a hoy",onChange:e=>console.log("Changed:",e)}},p={args:{value:"2024-01-15T10:00:00.000Z",disabled:!0,onChange:e=>console.log("Changed:",e)}},f={args:{value:"2024-06-15T10:00:00.000Z",min:"2024-01-01T00:00:00.000Z",max:"2024-12-31T23:59:59.000Z",onChange:e=>console.log("Changed:",e)}},h={args:{value:"2023-12-15T10:00:00.000Z",onChange:e=>console.log("Changed:",e)}};var E,w,Z;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    value: '2024-01-15T10:00:00.000Z',
    onChange: v => console.log('Changed:', v)
  }
}`,...(Z=(w=u.parameters)==null?void 0:w.docs)==null?void 0:Z.source}}};var N,k,M;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    value: '',
    onChange: v => console.log('Changed:', v)
  }
}`,...(M=(k=g.parameters)==null?void 0:k.docs)==null?void 0:M.source}}};var $,L,q;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    value: '2024-01-15T10:00:00.000Z',
    error: 'La fecha debe ser anterior a hoy',
    onChange: v => console.log('Changed:', v)
  }
}`,...(q=(L=m.parameters)==null?void 0:L.docs)==null?void 0:q.source}}};var F,P,V;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    value: '2024-01-15T10:00:00.000Z',
    disabled: true,
    onChange: v => console.log('Changed:', v)
  }
}`,...(V=(P=p.parameters)==null?void 0:P.docs)==null?void 0:V.source}}};var I,O,W;f.parameters={...f.parameters,docs:{...(I=f.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    value: '2024-06-15T10:00:00.000Z',
    min: '2024-01-01T00:00:00.000Z',
    max: '2024-12-31T23:59:59.000Z',
    onChange: v => console.log('Changed:', v)
  }
}`,...(W=(O=f.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var _,R,B;h.parameters={...h.parameters,docs:{...(_=h.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    value: '2023-12-15T10:00:00.000Z',
    onChange: v => console.log('Changed:', v)
  }
}`,...(B=(R=h.parameters)==null?void 0:R.docs)==null?void 0:B.source}}};const ee=["Default","Empty","WithError","Disabled","WithMinMax","PastDate"];export{u as Default,p as Disabled,g as Empty,h as PastDate,m as WithError,f as WithMinMax,ee as __namedExportsOrder,X as default};
