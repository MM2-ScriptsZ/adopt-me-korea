// proxy.js - Roblox X-Frame-Options Bypass Handler
// Fetches Roblox page and injects into iframe without toast notifications

window.RobloxProxy = (function() {
    'use strict';
    
    const ROBLOX_GAME_URL = "https://www.roblox.com/games/920587237/Adopt-Me";
    
    async function fetchPage(targetUrl) {
        try {
            const response = await fetch(targetUrl, {
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
                }
            });
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            let html = await response.text();
            
            // Add base tag for relative URLs
            if (!html.includes('<base')) {
                html = html.replace('<head>', '<head><base href="' + targetUrl + '">');
            }
            
            // Remove any X-Frame-Options meta tags
            html = html.replace(/<meta[^>]*X-Frame-Options[^>]*>/gi, '');
            html = html.replace(/<meta[^>]*x-frame-options[^>]*>/gi, '');
            
            // Ensure proper rendering in iframe
            const styleTag = '<style>body{margin:0;padding:0;overflow-y:auto;}iframe,object{max-width:100%;}</style>';
            html = html.replace('</head>', styleTag + '</head>');
            
            return html;
            
        } catch (error) {
            console.error("Proxy error:", error);
            throw error;
        }
    }
    
    function getGameUrl() {
        return ROBLOX_GAME_URL;
    }
    
    return {
        fetchPage: fetchPage,
        getGameUrl: getGameUrl
    };
})();
