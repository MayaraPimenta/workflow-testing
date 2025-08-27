import packageJson from '../package.json';

// For a footer function
export function getFooter() {
  return `App Version: ${packageJson.version}`;
}

console.log(getFooter());