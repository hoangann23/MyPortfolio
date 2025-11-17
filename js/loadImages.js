// Expose a shared promise that resolves when the data is loaded.
// Consumers can await `window.globalDataReady` or use `.then()`.
window.imageDataReady = fetch('../assets/data/days.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
        return response.json();
    })
    .then(data => {
        // make it available globally for non-module scripts
        window.imageData = data;
        console.log('data: ', window.imageData);
        return data;
    })
    .catch(error => {
        console.error('Error loading data:', error);
        // rethrow so consumers awaiting the promise see the rejection
        throw error;
    });


window.modelDataReady = fetch('../assets/data/models.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
        return response.json();
    })
    .then(data => {
        // make it available globally for non-module scripts
        window.modelData = data;
        console.log('data: ', window.modelData);
        return data;
    })
    .catch(error => {
        console.error('Error loading data:', error);
        // rethrow so consumers awaiting the promise see the rejection
        throw error;
    });