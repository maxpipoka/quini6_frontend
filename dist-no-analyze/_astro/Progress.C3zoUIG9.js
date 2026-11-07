import{j as r}from"./jsx-runtime.CbviWkmo.js";import{r as o}from"./index.DGzi4d_y.js";import"./_sentry-release-injection-file.DkACnTTT.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="0257601a-d675-48bc-8ff3-70fbaaf1ed31",e._sentryDebugIdIdentifier="sentry-dbid-0257601a-d675-48bc-8ff3-70fbaaf1ed31")}catch{}})();const b={processing:"Procesando archivo...",committing:"Guardando sorteos...",completed:"Completado",error:"Error"},h={processing:"bg-primary-600",committing:"bg-blue-600",completed:"bg-success-600",error:"bg-error-600"},j=({value:e,stage:t="processing",label:n,showPercentage:c=!0,"aria-live":u="polite",className:m="",id:f})=>{const a=o.useRef(f??`progress-${Math.random().toString(36).slice(2,9)}`),[s,g]=o.useState(e===void 0);o.useEffect(()=>{g(e===void 0)},[e]);const i=n??b[t],d=h[t],l=s?"":`${Math.round(Math.max(0,Math.min(100,e??0)))}%`,p={animation:"indeterminate 1.5s infinite ease-in-out"};return r.jsxs("div",{id:a.current,className:`w-full ${m}`,role:"progressbar","aria-valuenow":s?void 0:Math.round(Math.max(0,Math.min(100,e??0))),"aria-valuemin":0,"aria-valuemax":100,"aria-live":u,"aria-label":i,children:[r.jsxs("div",{className:"mb-2 flex items-center justify-between gap-2",children:[r.jsx("span",{className:"text-sm font-medium text-neutral-700 dark:text-neutral-300",id:`${a.current}-label`,children:i}),c&&!s&&r.jsx("span",{className:"font-mono text-sm text-neutral-500 dark:text-neutral-400",id:`${a.current}-percentage`,children:l})]}),r.jsx("div",{className:"relative h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",children:s?r.jsx("div",{className:`${d} h-full w-1/4`,style:p,"aria-hidden":!0}):r.jsx("div",{id:`${a.current}-bar`,className:`${d} h-full transition-all duration-300 ease-out`,style:{width:l},role:"presentation"})}),n&&r.jsx("p",{className:"mt-1 text-xs text-neutral-500 dark:text-neutral-400",id:`${a.current}-detail`,children:n}),r.jsx("style",{children:`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @media (forced-colors: active) {
          .progress-container > div:last-child {
            forced-color-adjust: none;
            background-color: Canvas;
            border: 1px solid CanvasText;
          }
          .h-full bg-primary-500 rounded-full transition-all duration-300,
          .animate-pulse {
            forced-color-adjust: none;
            background-color: Highlight;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .h-full bg-primary-500 rounded-full transition-all duration-300 {
            transition: none;
          }
          .animate-pulse {
            animation: none;
            width: 50%;
          }
        }
      `})]})};export{j as default};
