/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(() => {
  console.log("Inforario UTM Extension Installed");
});

// Opción A: Intercepción de Red (Observación asíncrona)
let isProcessing = false;

chrome.webRequest.onHeadersReceived.addListener(
  ((details: any) => {
    // Ignorar explícitamente peticiones de la propia extensión para evitar bucles
    if (details.initiator && details.initiator.startsWith('chrome-extension://')) {
      return;
    }

    if (isProcessing) return;

    // Buscar si es un PDF o el certificado SGU
    const isPdf = details.responseHeaders?.some(
      (header: any) => 
        (header.name.toLowerCase() === 'content-type' && header.value?.toLowerCase().includes('application/pdf')) ||
        (header.name.toLowerCase() === 'content-disposition' && header.value?.toLowerCase().includes('.pdf'))
    );

    if (isPdf && details.url.includes('utm.edu.ec')) {
      console.log("PDF Detectado en la red:", details.url);
      
      isProcessing = true;

      // Realizamos un fetch de fondo; este incluirá automáticamente las cookies del host
      fetch(details.url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/pdf'
        }
      })
        .then(res => {
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/pdf')) {
            throw new Error("La respuesta del servidor no es un PDF válido. Sesión posiblemente expirada.");
          }
          return res.blob();
        })
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Guardamos en memoria (session) para que la UI de React lo consuma
            chrome.storage.session.set({ 'sgu_pdf_data': base64data }, () => {
              // Abrimos la app
              chrome.tabs.create({ url: 'index.html' });
              
              // Liberamos el candado después de 2 segundos para evitar múltiples triggers simultáneos
              setTimeout(() => {
                isProcessing = false;
              }, 2000);
            });
          };
          reader.readAsDataURL(blob);
        })
        .catch(err => {
          console.error("Error en fetch de background (Opción A):", err);
          isProcessing = false;
        });
    }
  }) as any,
  { urls: ["*://*.utm.edu.ec/*", "*://sgu.utm.edu.ec/*"] },
  ["responseHeaders"]
);

// Listener principal desde el DOM (content.ts)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "PDF_URL_DETECTED" && request.url) {
    console.log("URL de visor PDF detectada (Directo iframe):", request.url);
    
    // Activar el candado para que la intercepción de red no lo duplique
    isProcessing = true;
    
    fetch(request.url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/pdf'
      }
    })
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
          throw new Error("La respuesta del servidor no es un PDF válido. Sesión posiblemente expirada.");
        }
        return res.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          chrome.storage.session.set({ 'sgu_pdf_data': base64data }, () => {
            chrome.tabs.create({ url: 'index.html' });
            
            // Liberar candado
            setTimeout(() => { isProcessing = false; }, 2000);
          });
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error("Error en fetch de PDF_URL_DETECTED:", err);
        isProcessing = false;
      });
      
    sendResponse({ status: "processing" });
  }
});
