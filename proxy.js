// proxy.js - X-Frame-Options Bypass Handler
// This module fetches and injects pages to bypass framing restrictions

window.ProxyHelper = (function() {
    'use strict';
    
    const PRIVATE_SERVER_URL = "https://www.roblox.com/games/920587237/Adopt-Me";
    
    async function fetchPage(targetUrl) {
        try {
            const response = await fetch(targetUrl, {
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            let html = await response.text();
            
            // Inject base tag for relative resources
            if (!html.includes('<base')) {
                html = html.replace('<head>', `<head><base href="${targetUrl}">`);
            } else {
                html = html.replace(/<base[^>]*>/, `<base href="${targetUrl}">`);
            }
            
            // Remove X-Frame-Options meta tags and headers are irrelevant in srcdoc
            html = html.replace(/<meta[^>]*X-Frame-Options[^>]*>/gi, '');
            html = html.replace(/<meta[^>]*x-frame-options[^>]*>/gi, '');
            
            // Inject styles to ensure proper iframe rendering
            const injectStyle = `
                <style>
                    body { margin: 0; padding: 0; }
                    iframe, object, embed { max-width: 100%; }
                    html { overflow-y: auto; }
                </style>
            `;
            html = html.replace('</head>', `${injectStyle}</head>`);
            
            // Add viewport meta if missing
            if (!html.includes('viewport')) {
                const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
                html = html.replace('<head>', `<head>${viewportMeta}`);
            }
            
            return html;
            
        } catch (error) {
            console.error("Proxy fetch error:", error);
            throw error;
        }
    }
    
    function getPrivateServerUrl() {
        return PRIVATE_SERVER_URL;
    }
    
    return {
        fetchPage: fetchPage,
        getPrivateServerUrl: getPrivateServerUrl
    };
})();
