import{R as e}from"./index-Dq4ZvVuH.js";import{f as E,D as k}from"./DrawCard-CilIqh3F.js";import{P as D}from"./PrizeTable-GE0aLpKX.js";import{N as P}from"./NumberFrequency-CECqdhwQ.js";import"./_commonjsHelpers-CqkleIqs.js";import"./NumberBall-Cx1oW5js.js";import"./schemas-D7573uKe.js";const N=({draw:r,onPrev:i,onNext:x,hasPrev:v,hasNext:q})=>e.createElement("article",{className:"space-y-6"},e.createElement("header",{className:"flex items-center justify-between"},e.createElement("div",null,e.createElement("h1",{className:"text-heading-xl font-bold text-text-primary"},"Sorteo #",r.officialNumber),e.createElement("time",{className:"text-body text-text-secondary",dateTime:r.date},E(r.date,"EEEE, dd MMMM yyyy"))),e.createElement("div",{className:"flex gap-2"},e.createElement("button",{onClick:i,disabled:!v,className:"rounded-lg border border-border bg-surface px-4 py-2 text-text-primary hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800","aria-label":"Sorteo anterior"},"← Anterior"),e.createElement("button",{onClick:x,disabled:!q,className:"rounded-lg border border-border bg-surface px-4 py-2 text-text-primary hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800","aria-label":"Sorteo siguiente"},"Siguiente →"))),e.createElement("section",{"aria-labelledby":"numbers-heading",className:"space-y-2"},e.createElement("h2",{id:"numbers-heading",className:"text-heading-md font-semibold text-text-primary"},"Números ganadores"),e.createElement(k,{draw:{officialNumber:r.officialNumber,date:r.date,numbers:r.numbers,complementary:r.complementary,reintegro:r.reintegro}})),e.createElement("section",{"aria-labelledby":"prizes-heading",className:"space-y-2"},e.createElement("h2",{id:"prizes-heading",className:"text-heading-md font-semibold text-text-primary"},"Premios"),e.createElement("div",{className:"overflow-x-auto"},e.createElement(D,{prizes:r.prizes}))),e.createElement("section",{"aria-labelledby":"frequency-heading",className:"space-y-2"},e.createElement("h2",{id:"frequency-heading",className:"text-heading-md font-semibold text-text-primary"},"Frecuencia histórica de números"),e.createElement(P,{data:r.frequencies})));N.__docgenInfo={description:"",methods:[],displayName:"DrawDetail",props:{draw:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  officialNumber: number;
  date: string;
  numbers: number[];
  complementary: number;
  reintegro: number;
  prizes: {
    category: string;
    winners: number;
    amount: number;
  }[];
  frequencies: {
    number: number;
    count: number;
    percentage: number;
  }[];
}`,signature:{properties:[{key:"officialNumber",value:{name:"number",required:!0}},{key:"date",value:{name:"string",required:!0}},{key:"numbers",value:{name:"Array",elements:[{name:"number"}],raw:"number[]",required:!0}},{key:"complementary",value:{name:"number",required:!0}},{key:"reintegro",value:{name:"number",required:!0}},{key:"prizes",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  category: string;
  winners: number;
  amount: number;
}`,signature:{properties:[{key:"category",value:{name:"string",required:!0}},{key:"winners",value:{name:"number",required:!0}},{key:"amount",value:{name:"number",required:!0}}]}}],raw:`{
  category: string;
  winners: number;
  amount: number;
}[]`,required:!0}},{key:"frequencies",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  number: number;
  count: number;
  percentage: number;
}`,signature:{properties:[{key:"number",value:{name:"number",required:!0}},{key:"count",value:{name:"number",required:!0}},{key:"percentage",value:{name:"number",required:!0}}]}}],raw:`{
  number: number;
  count: number;
  percentage: number;
}[]`,required:!0}}]}},description:""},onPrev:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onNext:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},hasPrev:{required:!1,tsType:{name:"boolean"},description:""},hasNext:{required:!1,tsType:{name:"boolean"},description:""}}};const C={title:"Draws/DrawDetail",component:N,tags:["autodocs"],argTypes:{draw:{control:"object"},hasPrev:{control:"boolean"},hasNext:{control:"boolean"}}},o={officialNumber:3245,date:"2024-01-15T10:00:00Z",numbers:[5,12,23,34,41,45],complementary:3,reintegro:7,prizes:[{category:"6 aciertos",winners:0,amount:0},{category:"5 aciertos + C",winners:2,amount:125e3},{category:"5 aciertos",winners:45,amount:3500},{category:"4 aciertos",winners:2100,amount:50},{category:"3 aciertos",winners:45e3,amount:10},{category:"2 aciertos",winners:58e4,amount:4},{category:"Reintegro",winners:12e5,amount:1}],frequencies:Array.from({length:46},(r,i)=>({number:i,count:Math.floor(Math.random()*200),percentage:Math.random()*50}))},a={args:{draw:o,hasPrev:!0,hasNext:!0}},n={args:{draw:{...o,officialNumber:1},hasPrev:!1,hasNext:!0}},t={args:{draw:{...o,officialNumber:3500},hasPrev:!0,hasNext:!1}},s={args:{draw:{...o,prizes:[{category:"Sin premios",winners:0,amount:0}]},hasPrev:!0,hasNext:!0}};var m,u,c;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    draw: mockDraw,
    hasPrev: true,
    hasNext: true
  }
}`,...(c=(u=a.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};var l,d,b;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    draw: {
      ...mockDraw,
      officialNumber: 1
    },
    hasPrev: false,
    hasNext: true
  }
}`,...(b=(d=n.parameters)==null?void 0:d.docs)==null?void 0:b.source}}};var p,g,y;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    draw: {
      ...mockDraw,
      officialNumber: 3500
    },
    hasPrev: true,
    hasNext: false
  }
}`,...(y=(g=t.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var f,h,w;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    draw: {
      ...mockDraw,
      prizes: [{
        category: 'Sin premios',
        winners: 0,
        amount: 0
      }]
    },
    hasPrev: true,
    hasNext: true
  }
}`,...(w=(h=s.parameters)==null?void 0:h.docs)==null?void 0:w.source}}};const F=["Default","FirstDraw","LastDraw","NoPrizes"];export{a as Default,n as FirstDraw,t as LastDraw,s as NoPrizes,F as __namedExportsOrder,C as default};
