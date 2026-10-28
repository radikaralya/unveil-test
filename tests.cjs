const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { calculate } = require('./scoring.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'content.js'), 'utf8'), context);
const {questions, results} = context.window.UnveilContent;
assert.equal(questions.length, 6);
assert.equal(results.length, 4);
for (const question of questions) {
  assert.equal(question.options.length, 4);
  assert.ok(question.title && question.options.every(Boolean));
}
for (const result of results) {
  assert.equal(result.paragraphs.length, 2);
  assert.ok(result.paragraphs.every(p => !p.includes('**')));
  assert.ok(fs.existsSync(path.join(__dirname, result.image)));
}
// All 4^6 response combinations, including two-way and three-way ties.
for (let code = 0; code < 4096; code++) {
  const answers = Array.from({length:6}, (_,i) => (code >> (2*i)) & 3);
  const candidates = [0,1,2,3].map(symbol => ({symbol, count:answers.filter(a=>a===symbol).length, last:answers.lastIndexOf(symbol)}));
  candidates.sort((a,b) => b.count-a.count || b.last-a.last);
  assert.equal(calculate(answers), candidates[0].symbol);
}
for (const bad of [[], [0,1,2], [0,1,2,3,0,null], [0,1,2,3,0,4]]) {
  assert.throws(() => calculate(bad), TypeError);
}
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (!/^https?:/.test(match[1])) assert.ok(fs.existsSync(path.join(__dirname, match[1])), match[1]);
}
for(const match of fs.readFileSync(path.join(__dirname,'styles.css'),'utf8').matchAll(/url\('([^']+)'\)/g)) assert.ok(fs.existsSync(path.join(__dirname,match[1])));
assert.ok(!html.includes('tildacdn.com'));
assert.ok(!html.includes('vb-u7q'));
console.log('OK: 4096 combinations, tie-breaking, invalid answers, content and local assets.');
