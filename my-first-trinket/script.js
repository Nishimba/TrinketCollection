function logTrinketMessage(level, message) {
  if (window.parent) {
    // IMPORTANT: Always specify the targetOrigin for security.
    // The main Electron app's renderer process expects the trinket's own origin.
    window.parent.postMessage({
      type: 'trinket-log', // A custom type to identify our log messages
      level: level,       // 'info', 'warn', 'error'
      message: message
    }, window.location.origin); // Use the trinket's own origin
  }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Trinket script loaded!');
    // Add your trinket's JavaScript logic here
    logTrinketMessage('info', 'My first trinket has loaded and is ready!');
});