// clear-browser-cache.js
// Execute este script no console do navegador para limpar cache, service workers e storage
(async function clearAll() {
  try {
    // Limpar localStorage e sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpar todos os service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // Limpar todos os caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }

    alert('Cache, Service Workers e Storage limpos! Recarregue a página.');
  } catch (e) {
    alert('Erro ao limpar cache: ' + e);
  }
})(); 