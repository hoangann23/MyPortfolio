// Expose a shared promise that resolves when the data is loaded.
// Consumers can await `window.globalDataReady` or use `.then()`.
window.globalDataReady = fetch('/data/days.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
        return response.json();
    })
    .then(data => {
        // make it available globally for non-module scripts
        window.globalData = data;
        console.log('data: ', window.globalData);
        return data;
    })
    .catch(error => {
        console.error('Error loading data:', error);
        // rethrow so consumers awaiting the promise see the rejection
        throw error;
    });

