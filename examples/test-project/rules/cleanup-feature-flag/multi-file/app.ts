// Main app file
import { Header, Navigation } from './components';
import { shouldShowLegacyUI } from './utils';

function renderApp() {
  const header = Header();
  const nav = Navigation();
  const content = shouldShowLegacyUI() ? getLegacyContent() : getModernContent();
  
  return `${header}${nav}${content}`;
}

function getLegacyContent() {
  return '<div>Legacy Content</div>';
}

function getModernContent() {
  return '<div>Modern Content</div>';
}

console.log(renderApp());
