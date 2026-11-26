import { isEnabled } from "./flags.js";
import { renderNewCheckout, renderOldCheckout, renderSearch } from "./views.js";

export function checkoutPage() {
  if (isEnabled("new-checkout")) {
    renderNewCheckout();
  } else {
    renderOldCheckout();
  }
}

export function searchBox() {
  renderSearch({ v2: isEnabled("new-serach") });
}

export const paymentsOn = !isEnabled("kill-switch-payments");
