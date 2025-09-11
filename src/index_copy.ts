import packageJson from '../package.json';

// For a footer function
export function getFooter() {
  return `App Version: ${packageJson.version} 🎉`;
}

console.log(getFooter());

//compile: node dist/index_copy.js
//run: npx ts-node src/index_copy.ts