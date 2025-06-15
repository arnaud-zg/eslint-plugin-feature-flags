// Components file
import { getFeatureFlag } from '../../../shared/feature-flags';
import { shouldShowLegacyUI } from './utils';

export function Header() {
  if (shouldShowLegacyUI()) {
    return renderLegacyHeader();
  } else {
    return renderModernHeader();
  }
}

export function Navigation() {
  return renderLegacyNavigation();
}

function renderLegacyHeader() {
  return '<div>Legacy Header</div>';
}

function renderModernHeader() {
  return '<div>Modern Header</div>';
}

function renderLegacyNavigation() {
  return '<nav>Legacy Navigation</nav>';
}

function renderModernNavigation() {
  return '<nav>Modern Navigation</nav>';
}
