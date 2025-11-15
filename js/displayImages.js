(async function loadAndDisplay() {
    try {
        const data = await window.globalDataReady;
        logData(data)
        displayDays(data)
    } catch (err) {
        console.error('Error waiting for globalDataReady in displayImages:', err);
    }
})();

function logData(data) {
    console.log('displayImages: data', data);
}

function displayDays(data) {
    let days = document.getElementById('days');
    const daysData = data["data"]["days"];
    console.log(daysData);
    daysData.forEach((value, _) => {
        let headerString = `Day ${value.day} - ${value.date}`;
        const headerElement = createHeader(headerString);
        days.appendChild(headerElement);

        let dayDiv = document.createElement('div');
        dayDiv.id = `day${value.day}`;
        console.log(`day id ${dayDiv.id}`);
        dayDiv.className = 'day';
        const models = value.models;
        models.forEach((model, _) => {
            const imgElement = createImageElement(model);
            dayDiv.appendChild(imgElement);
        });

        days.appendChild(dayDiv);
    });
}

function createHeader(headerString) {
    const headerElement = document.createElement('h1');
    headerElement.innerText = headerString;
    return headerElement;
}

function createImageElement(model) {
    const modelName = model.model;
    const imagePath = model.imagePath;
    const imageAlt = model.imageDescription;
    const imageType = model.imageType;
    const modelPath = model.modelPath;
    let imgElement = document.createElement("img");
    imgElement.id = modelName;
    imgElement.className = (imageType === "square") ? "modelImageSquare" : "modelImageRectangle";
    imgElement.src = imagePath;
    imgElement.alt = imageAlt;
    imgElement.onclick = () => {
        createScene(modelPath);
        startAnimation();
    };

    return imgElement;
}