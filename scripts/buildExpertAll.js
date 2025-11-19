#!/usr/bin/env node
const { spawnSync } = require('child_process');
const codes = ['kjv','web','asv','niv','nlt','ylt']; // add 'esv' if you split ESV locally

function run(code){
  const res = spawnSync(process.execPath, ['scripts/buildExpertPool.js', code], { stdio: 'inherit' });
  if(res.status !== 0){ console.warn(`[expert:all] Failed for ${code}`); }
}

for(const c of codes){
  console.log(`\n[expert:all] Building pool for ${c.toUpperCase()}...`);
  run(c);
}
console.log('\n[expert:all] Done');

