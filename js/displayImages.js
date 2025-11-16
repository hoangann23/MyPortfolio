(async function loadAndDisplay() {
    try {
        const imagedata = await window.imageDataReady;
        const modeldata = await window.modelDataReady;
        console.log("image data: ", imagedata);
        console.log("modeldata: ", modeldata);
        displayDays(imagedata, modeldata)
    } catch (err) {
        console.error('Error waiting for globalDataReady in displayImages:', err);
    }
})();

function displayDays(imagedata, modeldata) {
    let days = document.getElementById('days');
    const daysData = imagedata["data"]["days"];
    daysData.forEach((value, _) => {
        let headerString = `Day ${value.day} - ${value.date}`;
        const headerElement = createHeader(headerString);
        days.appendChild(headerElement);

        let dayDiv = document.createElement('div');
        dayDiv.id = `day${value.day}`;
        dayDiv.className = 'day';
        const models = value.models;
        models.forEach((model, _) => {
            const imgElement = createImageElement(model, modeldata);
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

function createImageElement(model, modeldata) {
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
        if (modelName === getCurrentModel()) return;
        updateCurrentModel(modelName);
        let useDefaults = true; // use pre-defined default values if model defaults aren't listed
        if (modeldata[modelName]) useDefaults = false;
        createScene(modelPath, modeldata, useDefaults);
        startAnimation();
        createMenu(modelName, modeldata, useDefaults);
    };

    return imgElement;
}