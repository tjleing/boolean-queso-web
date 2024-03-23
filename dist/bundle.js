(()=>{"use strict";var e={924:(e,n,t)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.ingredients=void 0;var r=t(233),a={name:"white bread",cost:1,power:1,effect:function(e){e.ingredients.map((function(e){return e.power++,e}))},type:r.IngredientType.MEAT,effectText:"",flavorText:"the plainest option"},o={name:"bacon",cost:1,power:1,effect:function(e){e.ingredients.map((function(e){return e.power++,e}))},type:r.IngredientType.MEAT,effectText:"on complete, add one to each ingredient in this sandwich",flavorText:"bacon goes on everything"},i=new Map;n.ingredients=i,i.set("bacon",o),i.set("white bread",a)},233:(e,n)=>{var t;Object.defineProperty(n,"__esModule",{value:!0}),n.IngredientType=void 0,function(e){e[e.BREAD=0]="BREAD",e[e.MEAT=1]="MEAT",e[e.VEGETABLE=2]="VEGETABLE",e[e.CONDIMENT=3]="CONDIMENT"}(t||(n.IngredientType=t={}))}},n={};function t(r){var a=n[r];if(void 0!==a)return a.exports;var o=n[r]={exports:{}};return e[r](o,o.exports,t),o.exports}(()=>{var e=t(924),n=["white bread","bacon"],r=Array(n.length).fill(0),a=document.getElementById("ingredients"),o=[],i=document.getElementById("myBoard"),d=[];function c(){for(var t in a.innerHTML="",n){var r=document.createElement("div");r.className="tooltip",r.draggable=!0;var c=document.createElement("span");r.appendChild(c);var T=document.createElement("span");T.className="tooltipText";var g=e.ingredients.get(n[t]);T.innerHTML="".concat(g.name,": ").concat(g.cost,"/").concat(g.power,"<br><br>"),""!==g.effectText&&(T.innerHTML+="".concat(g.effectText,"<br><br>")),T.innerHTML+="<i>".concat(g.flavorText,"</i>"),r.onclick=u.bind(null,t),r.ondragstart=f.bind(null,t),r.appendChild(T),a.appendChild(r),o.push(c)}i.innerHTML="",function(){var e=document.createElement("div");e.ondrop=l.bind(null,0),e.ondragover=p,i.appendChild(e),d.push(e)}(),s(),document.getElementById("drawButton").onclick=v}function f(e,n){n.dataTransfer.setData("ingId",e.toString()),n.dataTransfer.dropEffect="copy"}function l(t,a){a.preventDefault();var o=a.dataTransfer.getData("ingId"),i=document.createElement("div"),c=document.createElement("span"),f=n[o];c.innerText=e.ingredients.get(f).name,r[o]--,s(),i.appendChild(c),d[t].insertBefore(i,d[t].firstChild)}function p(e){e.preventDefault()}function s(){for(var e in o){var t=n[e];o[e].innerText="".concat(t,": ").concat(r[e])}}function u(e){var n=o[e];""===n.style.border?n.style.border="1px solid red":n.style.border=""}function v(){for(var e=n.length,t=0;t<3;++t){var a=Math.floor(Math.random()*e);r[a]++}s()}!function(){for(var e in n)r[e]=0;c()}()})()})();