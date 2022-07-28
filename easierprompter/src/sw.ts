import { getElement } from "./utils";

// Based on the code on:
// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://developers.google.com/web/fundamentals/codelabs/offline/

function serviceWorkersSupported(supported: boolean): void {
  const element = getElement("sw-support");
  element.classList.remove("maybe");
  if (supported) {
    element.classList.add("yes");
    element.textContent = "is probably";
  } else {
    element.classList.add("no");
    element.textContent = "is not";
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(() => {
      console.log("Registered Service Worker");
      serviceWorkersSupported(true);
    }).catch((err) => {
      console.error("Service worker registration failed:", err);
      serviceWorkersSupported(false);
    });
  });
} else {
  serviceWorkersSupported(false);
}
