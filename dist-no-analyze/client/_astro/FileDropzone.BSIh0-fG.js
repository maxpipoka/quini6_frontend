import{j as r}from"./jsx-runtime.XzvtRIBH.js";import{r as a}from"./index.DGmsvSKE.js";import"./_sentry-release-injection-file.Cdo5z5XN.js";(function(){try{var n=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},i=new n.Error().stack;i&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[i]="e5e7e127-24c3-4e25-a0e6-e43b482ab0d8",n._sentryDebugIdIdentifier="sentry-dbid-e5e7e127-24c3-4e25-a0e6-e43b482ab0d8")}catch{}})();const A=({accept:n=".csv,.xlsx",maxSize:i=10*1024*1024,onFileSelected:c,onError:p,disabled:s=!1,className:y="","data-testid":j})=>{const C=a.useRef(null),f=a.useRef(null),[d,h]=a.useState(null),[$,m]=a.useState(!1),[v,x]=a.useState(null),t=a.useId(),g=e=>e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`,b=a.useCallback(e=>{x(null);const l=n.split(",").map(o=>o.trim().toLowerCase()),I="."+e.name.split(".").pop()?.toLowerCase();if(!l.some(o=>o===I||o===e.type)){const o=`Tipo de archivo no permitido. Use: ${n}`;return x(o),p?.(o),!1}if(e.size>i){const o=`Archivo demasiado grande. Máximo: ${g(i)}`;return x(o),p?.(o),!1}return!0},[n,i,p]),u=a.useCallback(e=>{b(e)&&(h(e),c?.(e))},[b,c]),k=a.useCallback(()=>{h(null),f.current&&(f.current.value=""),c?.(null)},[c]),N=a.useCallback(e=>{e.preventDefault(),e.stopPropagation(),s||m(!0)},[s]),D=a.useCallback(e=>{e.preventDefault(),e.stopPropagation(),!d&&!s&&m(!1)},[d,s]),w=a.useCallback(e=>{if(e.preventDefault(),e.stopPropagation(),m(!1),s)return;const l=e.dataTransfer?.files[0];l&&u(l)},[s,u]),L=a.useCallback(e=>{const l=e.target.files?.[0];l&&u(l)},[u]),z=a.useCallback(e=>{e.stopPropagation(),k()},[k]);return r.jsxs("div",{ref:C,id:t,"data-testid":j,className:`
        rounded-lg border-2 border-dashed p-8 text-center
        transition-all duration-200
        ${s?"cursor-not-allowed opacity-50":"cursor-pointer"}
        ${$?"dark:bg-primary-900/20 border-primary-400 bg-primary-50":"border-neutral-300 dark:border-neutral-600"}
        ${d?"dark:bg-primary-900/20 border-primary-400 bg-primary-50":""}
        dark:bg-neutral-800/50 bg-neutral-50
        ${y}
      `,onDragOver:N,onDragLeave:D,onDrop:w,children:[r.jsx("input",{ref:f,type:"file",id:`${t}-input`,className:"sr-only",accept:n,disabled:s,"aria-describedby":`${t}-hint`,onChange:L,"aria-label":"Seleccionar archivo CSV o XLSX"}),r.jsxs("label",{htmlFor:`${t}-input`,className:"inline-flex cursor-pointer flex-col items-center gap-4","aria-label":"Arrastra y suelta un archivo aquí o haz clic para seleccionar",children:[r.jsx("svg",{className:"size-12 text-neutral-400 dark:text-neutral-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"})}),r.jsxs("div",{children:[r.jsx("p",{className:"text-lg font-medium text-neutral-900 dark:text-neutral-100",children:"Arrastra y suelta un archivo aquí"}),r.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",id:`${t}-hint`,children:["o haz clic para seleccionar ",r.jsx("span",{className:"font-medium",children:".csv, .xlsx"})]})]})]}),d&&r.jsx("div",{id:`${t}-selected`,className:"mt-4","aria-live":"polite",children:r.jsxs("div",{className:"flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800",children:[r.jsxs("div",{className:"flex items-center gap-3",children:[r.jsx("svg",{className:"size-6 text-primary-600 dark:text-primary-400",fill:"currentColor",viewBox:"0 0 20 20","aria-hidden":"true",children:r.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),r.jsxs("div",{children:[r.jsx("p",{className:"font-medium text-neutral-900 dark:text-neutral-100",children:d.name}),r.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:g(d.size)})]})]}),r.jsx("button",{type:"button",id:`${t}-remove`,className:"rounded p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:text-neutral-300","aria-label":"Eliminar archivo seleccionado",onClick:z,children:r.jsx("svg",{className:"size-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})}),v&&r.jsx("div",{id:`${t}-error`,className:"dark:bg-error-900/20 mt-3 rounded-lg border border-error-400 bg-error-50 p-3 text-sm text-error-600 dark:border-error-700 dark:text-error-400",role:"alert","aria-live":"assertive",children:v}),r.jsx("style",{children:`
        #${t}:focus-visible {
          outline: 2px solid var(--color-primary-500);
          outline-offset: 2px;
        }

        @media (forced-colors: active) {
          #${t} {
            forced-color-adjust: none;
            border-color: CanvasText;
            background-color: Canvas;
          }
          #${t}:hover {
            border-color: Highlight;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #${t} {
            transition: none;
          }
        }
      `})]})};export{A as default};
