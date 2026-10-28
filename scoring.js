/* Чистая логика подсчёта. Работает в браузере и Node.js. */
(function(root){
  'use strict';
  function calculate(answers){
    if(!Array.isArray(answers)||answers.length!==6||answers.some(v=>!Number.isInteger(v)||v<0||v>3)){
      throw new TypeError('Нужно шесть ответов от 0 до 3.');
    }
    const scores=[0,0,0,0];
    answers.forEach(value=>scores[value]++);
    const maximum=Math.max(...scores);
    // При равенстве побеждает последний ответ, относящийся к одному из лидеров.
    for(let i=answers.length-1;i>=0;i--){
      if(scores[answers[i]]===maximum)return answers[i];
    }
  }
  const api=Object.freeze({calculate});
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.UnveilScoring=api;
})(typeof window!=='undefined'?window:globalThis);
