/**
 * Rutina de limpieza ULTRA-PROFUNDA para Android TV
 * Purga: JWPlayer, Clappr, Plyr, HLS.js, ExoPlayer (Web wrappers) y Native Android Player.
 */
function purgarMemoriaTV() {
    console.log("Iniciando purga total de hardware y motores de video...");

    // 1. Limpiar JWPlayer
    if (typeof jwplayer !== 'undefined') {
        try {
            var jwContainers = document.querySelectorAll('.jwplayer, [id^="jwplayer"]');
            jwContainers.forEach(function(div) {
                if (jwplayer(div.id)) { jwplayer(div.id).remove(); }
            });
        } catch (e) { }
    }

    // 2. Limpiar Clappr
    if (window.player && typeof window.player.destroy === 'function') {
        window.player.destroy();
        window.player = null;
    }

    // 3. Limpiar Plyr
    if (typeof Plyr !== 'undefined' && window.player && window.player instanceof Plyr) {
        window.player.destroy();
    }

    // 4. Limpiar ExoPlayer (Wrappers comunes en Web como Shaka Player o similares)
    // Muchos reproductores basados en ExoPlayer exponen una instancia 'player' o 'shaka'
    if (window.shaka) {
        try {
            window.shaka.destroy();
            window.shaka = null;
        } catch (e) { }
    }

    // 5. Limpiar HLS.js residual
    if (window.hls) {
        try {
            window.hls.stopLoad();
            window.hls.detachMedia();
            window.hls.destroy();
            window.hls = null;
        } catch (e) { }
    }

    // 6. Limpieza del Reproductor Estándar de Android y Hardware de Video
    // Esta es la parte más importante para liberar el decodificador físico
    var allVideos = document.querySelectorAll('video, audio');
    allVideos.forEach(function(v) {
        try {
            v.pause();
            // Cortamos el flujo de datos inmediatamente
            if (v.src !== "") {
                v.src = "";
                v.removeAttribute('src');
                v.load(); // Fuerza al motor nativo de Android a soltar el buffer
            }
            // Limpiamos los "SourceBuffers" internos (propio de ExoPlayer/HLS nativo)
            if (v.mediaKeys) {
                v.setMediaKeys(null);
            }
            v.remove(); // Elimina el elemento del DOM
        } catch (e) { }
    });

    // 7. Limpieza de memoria volátil
    if (window.sessionStorage) { window.sessionStorage.clear(); }
    
    // 8. Forzar recolector de basura (si el navegador lo permite)
    if (window.gc) { window.gc(); }

    console.log("Purga de hardware finalizada.");
}

// Ejecución inmediata al ser llamado en el HEAD
purgarMemoriaTV();

