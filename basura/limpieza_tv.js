/**
 * Rutina de limpieza profunda de Hardware y Memoria para Android TV
 * Purga instancias de Clappr, JWPlayer, Plyr y HLS.js
 */
function purgarMemoriaTV() {
    console.log("Iniciando purga de memoria y hardware...");

    // 1. Limpiar JWPlayer
    if (typeof jwplayer !== 'undefined') {
        try {
            var jwContainers = document.querySelectorAll('.jwplayer, [id^="jwplayer"]');
            jwContainers.forEach(function(div) {
                if (jwplayer(div.id)) { jwplayer(div.id).remove(); }
            });
        } catch (e) { }
    }

    // 2. Limpiar Clappr previo
    if (window.player && typeof window.player.destroy === 'function') {
        window.player.destroy();
        window.player = null;
    }

    // 3. Limpiar Plyr
    if (typeof Plyr !== 'undefined' && window.player && window.player instanceof Plyr) {
        window.player.destroy();
    }

    // 4. Limpiar HLS.js residual
    if (window.hls) {
        window.hls.destroy();
        window.hls = null;
    }

    // 5. Liberar el decodificador de video (Hardware)
    var allVideos = document.querySelectorAll('video');
    allVideos.forEach(function(v) {
        v.pause();
        v.src = "";
        v.removeAttribute('src');
        v.load();
        v.remove();
    });

    // 6. Limpiar cachés
    if (window.sessionStorage) { window.sessionStorage.clear(); }
    
    console.log("Limpieza completada.");
}

// Ejecutamos la limpieza automáticamente al cargar el script
purgarMemoriaTV();