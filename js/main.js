// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
    .register('../sw_cached_pages.js')
    .then(reg => console.log("Registered Scope:", reg.scope))
    .catch(err => console.log(`Error: ${err}`))
  })
}
