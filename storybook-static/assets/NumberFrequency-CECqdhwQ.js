import{R as r}from"./index-Dq4ZvVuH.js";import{N as t}from"./NumberBall-Cx1oW5js.js";const u=({data:a,highlightNumber:n})=>r.createElement("div",{className:"grid grid-cols-10 gap-2",role:"list","aria-label":"Frecuencia de números"},a.map(e=>r.createElement("article",{key:e.number,className:`
            rounded-lg border border-border bg-surface p-2
            text-center transition-all duration-150
            ${e.number===n?"ring-2 ring-primary-500":""}
          `,role:"listitem"},r.createElement(t,{number:e.number,size:"sm"}),r.createElement("div",{className:"mt-1 space-y-1"},r.createElement("div",{className:"h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",role:"progressbar","aria-valuenow":e.percentage,"aria-valuemin":0,"aria-valuemax":100,"aria-label":`Frecuencia del número ${e.number}: ${e.percentage}%`},r.createElement("div",{className:"h-full bg-primary-500 transition-all duration-300",style:{width:`${e.percentage}%`}})),r.createElement("div",{className:"flex justify-between text-[10px] text-text-muted"},r.createElement("span",null,e.count),r.createElement("span",null,e.percentage.toFixed(1),"%"))))));u.__docgenInfo={description:"",methods:[],displayName:"NumberFrequency",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  number: number;
  count: number;
  percentage: number;
}`,signature:{properties:[{key:"number",value:{name:"number",required:!0}},{key:"count",value:{name:"number",required:!0}},{key:"percentage",value:{name:"number",required:!0}}]}}],raw:`{
  number: number;
  count: number;
  percentage: number;
}[]`},description:""},highlightNumber:{required:!1,tsType:{name:"number"},description:""}}};export{u as N};
