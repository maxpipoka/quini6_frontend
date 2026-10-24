import{N as a}from"./NumberBall-Cx1oW5js.js";import"./index-Dq4ZvVuH.js";import"./_commonjsHelpers-CqkleIqs.js";import"./schemas-D7573uKe.js";const H={title:"Draws/NumberBall",component:a,tags:["autodocs"],argTypes:{number:{control:"number",min:0,max:45},size:{control:"select",options:["sm","md","lg"]},variant:{control:"select",options:["primary","secondary","success","warning"]}}},r={args:{number:23}},s={args:{number:5,variant:"primary"}},n={args:{number:12,variant:"secondary"}},c={args:{number:34,variant:"success"}},m={args:{number:41,variant:"warning"}},t={args:{number:45,size:"sm"}},l={args:{number:7,size:"lg"}},o={render:()=>React.createElement("div",{className:"flex flex-wrap gap-2"},Array.from({length:46},(e,p)=>React.createElement(a,{key:p,number:p,size:"sm"})))},i={render:()=>React.createElement("div",{className:"flex flex-wrap items-center gap-4"},React.createElement("div",{className:"flex flex-col gap-2"},React.createElement("span",{className:"font-medium"},"Primary:"),React.createElement("div",{className:"flex gap-2"},[5,12,23,34,41].map(e=>React.createElement(a,{key:e,number:e,variant:"primary"})))),React.createElement("div",{className:"flex flex-col gap-2"},React.createElement("span",{className:"font-medium"},"Secondary:"),React.createElement("div",{className:"flex gap-2"},[5,12,23,34,41].map(e=>React.createElement(a,{key:e,number:e,variant:"secondary"})))),React.createElement("div",{className:"flex flex-col gap-2"},React.createElement("span",{className:"font-medium"},"Success:"),React.createElement("div",{className:"flex gap-2"},[5,12,23,34,41].map(e=>React.createElement(a,{key:e,number:e,variant:"success"})))),React.createElement("div",{className:"flex flex-col gap-2"},React.createElement("span",{className:"font-medium"},"Warning:"),React.createElement("div",{className:"flex gap-2"},[5,12,23,34,41].map(e=>React.createElement(a,{key:e,number:e,variant:"warning"})))))};var d,u,g;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    number: 23
  }
}`,...(g=(u=r.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var v,f,N;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    number: 5,
    variant: 'primary'
  }
}`,...(N=(f=s.parameters)==null?void 0:f.docs)==null?void 0:N.source}}};var b,x,y;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    number: 12,
    variant: 'secondary'
  }
}`,...(y=(x=n.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var E,R,S;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    number: 34,
    variant: 'success'
  }
}`,...(S=(R=c.parameters)==null?void 0:R.docs)==null?void 0:S.source}}};var k,w,z;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    number: 41,
    variant: 'warning'
  }
}`,...(z=(w=m.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var B,A,P;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    number: 45,
    size: 'sm'
  }
}`,...(P=(A=t.parameters)==null?void 0:A.docs)==null?void 0:P.source}}};var W,_,D;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    number: 7,
    size: 'lg'
  }
}`,...(D=(_=l.parameters)==null?void 0:_.docs)==null?void 0:D.source}}};var h,L,V;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">\r
      {Array.from({
      length: 46
    }, (_, i) => <NumberBall key={i} number={i} size="sm" />)}\r
    </div>
}`,...(V=(L=o.parameters)==null?void 0:L.docs)==null?void 0:V.source}}};var O,T,j;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-4">\r
      <div className="flex flex-col gap-2">\r
        <span className="font-medium">Primary:</span>\r
        <div className="flex gap-2">\r
          {[5, 12, 23, 34, 41].map(n => <NumberBall key={n} number={n} variant="primary" />)}\r
        </div>\r
      </div>\r
      <div className="flex flex-col gap-2">\r
        <span className="font-medium">Secondary:</span>\r
        <div className="flex gap-2">\r
          {[5, 12, 23, 34, 41].map(n => <NumberBall key={n} number={n} variant="secondary" />)}\r
        </div>\r
      </div>\r
      <div className="flex flex-col gap-2">\r
        <span className="font-medium">Success:</span>\r
        <div className="flex gap-2">\r
          {[5, 12, 23, 34, 41].map(n => <NumberBall key={n} number={n} variant="success" />)}\r
        </div>\r
      </div>\r
      <div className="flex flex-col gap-2">\r
        <span className="font-medium">Warning:</span>\r
        <div className="flex gap-2">\r
          {[5, 12, 23, 34, 41].map(n => <NumberBall key={n} number={n} variant="warning" />)}\r
        </div>\r
      </div>\r
    </div>
}`,...(j=(T=i.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};const I=["Default","Primary","Secondary","Success","Warning","Small","Large","AllNumbers","AllVariants"];export{o as AllNumbers,i as AllVariants,r as Default,l as Large,s as Primary,n as Secondary,t as Small,c as Success,m as Warning,I as __namedExportsOrder,H as default};
