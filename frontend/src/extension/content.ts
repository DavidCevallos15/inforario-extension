/// <reference types="chrome"/>

console.log("Inforario UTM Content Script loaded");

let lastExtractedUrl = '';

const observeSGUViewer = () => {
  const observer = new MutationObserver((mutations, obs) => {
    // Buscar específicamente iframe con la URL del reporte de horario
    const iframes = document.querySelectorAll('iframe');
    
    for (const iframe of Array.from(iframes)) {
      const src = iframe.getAttribute('src');
      if (src && src.includes('reporte_horario_clases')) {
        if (src !== lastExtractedUrl) {
          console.log("Visor PDF detectado en DOM (iframe SGU):", src);
          lastExtractedUrl = src;
          
          let finalUrl = src;
          // Si es relativa, hacerla absoluta
          if (!finalUrl.startsWith('http') && !finalUrl.startsWith('blob:')) {
             finalUrl = new URL(finalUrl, window.location.href).href;
          }
          
          if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
              type: "PDF_URL_DETECTED",
              url: finalUrl
            });
          } else {
            console.warn("Inforario: Contexto de extensión inválido o huérfano. Por favor recarga la página.");
          }
        }
      }
    }
  });

  // Empezar a observar cambios en todo el body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  });
};

// Iniciar observación tan pronto se cargue el script
observeSGUViewer();
