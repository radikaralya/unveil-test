(function(){'use strict';
const root=document.getElementById('uv-test');if(!root)return;
const data=window.UnveilContent;
const get=s=>root.querySelector(s),intro=get('.uv__intro'),quiz=get('.uv__quiz'),result=get('.uv__result'),next=get('[data-action="next"]');
let index=0,answers=Array(6).fill(null);
// Fixed permutations preserve the result mapping while varying visible answer order.
const order=[[2,0,3,1],[1,3,0,2],[3,2,1,0],[0,2,1,3],[2,1,3,0],[1,0,2,3]];
function focus(el){el.focus({preventScroll:true});const top=root.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top,behavior:'instant'});}
function show(view){intro.hidden=view!=='intro';quiz.hidden=view!=='quiz';result.hidden=view!=='result';}
function render(){show('quiz');get('.uv__step').textContent='Вопрос '+(index+1)+' / 6';const progress=get('.uv__progress');progress.replaceChildren();for(let i=0;i<6;i++){const s=document.createElement('span');if(i<=index)s.className='uv__segment--done';progress.append(s);}
const q=data.questions[index];get('.uv__question').textContent=q.title;const list=get('.uv__options');list.replaceChildren();order[index].forEach((value,position)=>{const label=document.createElement('label');label.className='uv__option';const input=document.createElement('input');input.type='radio';input.name='uv-answer';input.value=String(value);input.checked=answers[index]===value;input.addEventListener('change',()=>{answers[index]=value;next.disabled=false;});const letter=document.createElement('span');letter.className='uv__letter';letter.textContent=['А','Б','В','Г'][position];letter.setAttribute('aria-hidden','true');const text=document.createElement('span');text.className='uv__option-text';text.textContent=q.options[value];label.append(input,letter,text);list.append(label);});next.disabled=answers[index]===null;next.querySelector('.uv__button-text').textContent=index===5?'Узнать свой знак ↗':'Дальше →';focus(get('.uv__question'));}

function finish(){const r=data.results[window.UnveilScoring.calculate(answers)];get('.uv__result-title').textContent='Твой знак — '+r.name;get('.uv__tagline').textContent=r.tagline;const desc=get('.uv__description');desc.replaceChildren();r.paragraphs.forEach(t=>{const p=document.createElement('p');p.textContent=t;desc.append(p);});const img=get('.uv__symbol');img.src=r.image;img.alt=r.name;get('.uv__discussion-text').textContent=r.question;show('result');focus(get('.uv__result-title'));}
get('[data-action="start"]').addEventListener('click',()=>{index=0;render();});get('[data-action="back"]').addEventListener('click',()=>{if(index>0){index--;render();}else{show('intro');focus(get('#uv-title'));}});next.addEventListener('click',()=>{if(answers[index]===null)return;if(index<5){index++;render();}else finish();});get('[data-action="restart"]').addEventListener('click',()=>{answers=Array(6).fill(null);index=0;show('intro');focus(get('#uv-title'));});
})();
