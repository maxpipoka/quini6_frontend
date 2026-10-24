import{R as e}from"./index-Dq4ZvVuH.js";const n=({prizes:a})=>e.createElement("table",{className:"w-full border-collapse",role:"table"},e.createElement("thead",null,e.createElement("tr",{className:"bg-neutral-50 dark:bg-neutral-800"},e.createElement("th",{className:"border-b border-border p-3 text-left text-sm font-semibold text-text-primary"},"Categoría"),e.createElement("th",{className:"border-b border-border p-3 text-right text-sm font-semibold text-text-primary"},"Ganadores"),e.createElement("th",{className:"border-b border-border p-3 text-right text-sm font-semibold text-text-primary"},"Premio"))),e.createElement("tbody",null,a.map((r,t)=>e.createElement("tr",{key:t,className:t%2===0?"bg-surface":"dark:bg-neutral-800/50 bg-neutral-50"},e.createElement("td",{className:"border-border/50 border-b p-3 text-sm text-text-primary"},r.category),e.createElement("td",{className:"border-border/50 border-b p-3 text-right text-sm text-text-secondary"},r.winners.toLocaleString("es-AR")),e.createElement("td",{className:"border-border/50 border-b p-3 text-right text-sm font-medium text-primary-600 dark:text-primary-400"},"$",r.amount.toLocaleString("es-AR"))))));n.__docgenInfo={description:"",methods:[],displayName:"PrizeTable",props:{prizes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  category: string;
  winners: number;
  amount: number;
}`,signature:{properties:[{key:"category",value:{name:"string",required:!0}},{key:"winners",value:{name:"number",required:!0}},{key:"amount",value:{name:"number",required:!0}}]}}],raw:`{
  category: string;
  winners: number;
  amount: number;
}[]`},description:""}}};export{n as P};
