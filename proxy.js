// proxy.js - X-Frame-Options Bypass Handler
// Fetches and injects any page into iframe bypassing X-Frame-Options

window.RobloxProxy = (function() {
    'use strict';
    
    const PRIVATE_SERVER_LINK = "https://www.roblox.com/games/920587237/Adopt-Me";
    
    async function fetchPage(targetUrl) {
        try {
            // Fetch the page with credentials
            const response = await fetch(targetUrl, {
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
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
            
            // Remove all X-Frame-Options headers and meta tags
            html = html.replace(/<meta[^>]*X-Frame-Options[^>]*>/gi, '');
            html = html.replace(/<meta[^>]*x-frame-options[^>]*>/gi, '');
            html = html.replace(/<meta[^>]*frame-ancestors[^>]*>/gi, '');
            
            // Remove frame busting scripts
            html = html.replace(/<script[^>]*>if\(top!=self.*?<\/script>/gi, '');
            html = html.replace(/if\(top!=self\)top\.location\.replace\(location\.href\)/gi, '');
            html = html.replace(/window\.top\s*!==\s*window\.self/gi, 'false');
            
            // Inject style for proper iframe rendering
            const injectStyle = `
                <style>
                    body { margin: 0; padding: 0; overflow-y: auto !important; }
                    iframe, object, embed { max-width: 100%; }
                    #modal-container, .modal, [class*="modal"] { display: none !important; }
                </style>
                <script>
                    // Prevent frame busting
                    window.self !== window.top && (function() {
                        Object.defineProperty(window, 'self', { get: function() { return window; } });
                        Object.defineProperty(window, 'top', { get: function() { return window; } });
                        Object.defineProperty(window, 'parent', { get: function() { return window; } });
                        window.frameElement = null;
                    })();
                <\/script>
            `;
            html = html.replace('</head>', injectStyle + '</head>');
            
            return html;
            
        } catch (error) {
            console.error("Proxy fetch error:", error);
            throw error;
        }
    }
    
    function getPrivateServerLink() {
        return PRIVATE_SERVER_LINK;
    }
    
    return {
        fetchPage: fetchPage,
        getPrivateServerLink: getPrivateServerLink
    };
})();
