let initialSlidersLoaded = false;

let model = '';
let defaults = true;

function getSliderValue(id) {
    let slider = document.getElementById(id);
    return slider.value;
}

function addNewModelData(modelData) {
    let dp = DEFAULT_MODEL_POSITION;
    let dr = DEFAULT_MODEL_ROTATION;
    let dc = DEFAULT_CAMERA_POSITION;
    let dt = DEFAULT_TRANSLATIONS;
    let ds = DEFAULT_SCALE;

    modelData[model] = {
        "default_scale": ds,
        "default_position": dp,
        "default_rotation": dr,
        "default_camera": dc,
        "translations": dt,
        "camera_translations": dt,
        "light_translations": dt
    }
}

function writeModelData(modelData, fileName, contentType) {
    var link = document.createElement('a');
    var file = new Blob([JSON.stringify(modelData, null, 2)], {type: contentType});
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    console.log('model data', modelData);
}

function updateData(modelData) {
    saveModelData(modelData);
    saveCameraData(modelData);
}

function saveModelData(modelData) {
    let posX = getSliderValue('ModelPositionX');
    let posY = getSliderValue('ModelPositionY');
    let posZ = getSliderValue('ModelPositionZ');

    let rotX = getSliderValue('ModelRotationX');
    let rotY = getSliderValue('ModelRotationY');
    let rotZ = getSliderValue('ModelRotationZ');

    let scale = getSliderValue('ModelScale');

    modelData[model]['default_position']['x'] = posX;
    modelData[model]['default_position']['y'] = posY;
    modelData[model]['default_position']['z'] = posZ;

    modelData[model]['default_rotation']['x'] = rotX;
    modelData[model]['default_rotation']['y'] = rotY;
    modelData[model]['default_rotation']['z'] = rotZ;

    modelData[model]['default_scale'] = scale;
}

function saveCameraData(modelData) {
    let posX = getSliderValue('CameraPositionX');
    let posY = getSliderValue('CameraPositionY');
    let posZ = getSliderValue('CameraPositionZ');

    modelData[model]['default_camera']['x'] = posX;
    modelData[model]['default_camera']['y'] = posY;
    modelData[model]['default_camera']['z'] = posZ;
}

function resetModelSliders(modeldata) {
    let default_rotation = (defaults) ? DEFAULT_MODEL_ROTATION : modeldata[model]['default_rotation'];
    let default_position = (defaults) ? DEFAULT_MODEL_POSITION : modeldata[model]['default_position'];
    let default_scale = (defaults) ? DEFAULT_SCALE : modeldata[model]['default_scale'];
    updateSliderValue('ModelPositionX', default_position.x);
    updateSliderValue('ModelPositionY', default_position.y);
    updateSliderValue('ModelPositionZ', default_position.z);

    updateSliderValue('ModelRotationX', default_rotation.x);
    updateSliderValue('ModelRotationY', default_rotation.y);
    updateSliderValue('ModelRotationZ', default_rotation.z);

    updateSliderValue('ModelScale', default_scale);
}

function resetLightMenu(modeldata) {
    let defaultPosition = (defaults) ? DEFAULT_CAMERA_POSITION : modelData[model]['default_camera'];
    updateSliderValue('LightPositionX', defaultPosition.x);
    updateSliderValue('LightPositionY', defaultPosition.y);
    updateSliderValue('LightPositionZ', defaultPosition.z);
    updateSliderValue('LightIntensity', DEFAULT_LIGHT_INTENSITY);

    let lightCheckbox = document.getElementById('lightCameraCheckbox');
    lightCheckbox.checked = true;

}

function resetCameraSliders(modeldata) {
    let defaultPosition = (defaults) ? DEFAULT_CAMERA_POSITION : modelData[model]['default_camera'];
    
    updateSliderValue('CameraPositionX', defaultPosition.x);
    updateSliderValue('CameraPositionY', defaultPosition.y);
    updateSliderValue('CameraPositionZ', defaultPosition.z);
}

function updateCameraSliders() {
    let cameraPosition = getCameraPosition();
    updateSliderValue('CameraPositionX', cameraPosition.x);
    updateSliderValue('CameraPositionY', cameraPosition.y);
    updateSliderValue('CameraPositionZ', cameraPosition.z);
}

function updateLightSlidersToMatchCamera() {
    let cameraPosition = getCameraPosition();
    updateSliderValue('LightPositionX', cameraPosition.x);
    updateSliderValue('LightPositionY', cameraPosition.y);
    updateSliderValue('LightPositionZ', cameraPosition.z);
}

function updateSliderValue(id, value) {
    let slider = document.getElementById(id);
    slider.value = value;
    let valueElement = document.getElementById(`${id}Value`);
    valueElement.innerText = parseFloat(value).toFixed(4);
}

function createDiv(id) {
    let div = document.createElement('div');
    div.id = id;

    return div
}

function createModelSliders(container, modelData) {
    let translationsXYZ = (defaults) ? DEFAULT_TRANSLATIONS : modelData[model]['translations']
    let x_range = translationsXYZ.x_range;
    let y_range = translationsXYZ.y_range;
    let z_range = translationsXYZ.z_range;
    let defaultPosition = (defaults) ? DEFAULT_MODEL_POSITION : modelData[model]['default_position'];
    const x = createSlider('ModelPositionX', updateModelX, x_range.step, x_range.min, defaultPosition.x, x_range.max);
    const y = createSlider('ModelPositionY', updateModelY, y_range.step, y_range.min, defaultPosition.y, y_range.max);
    const z = createSlider('ModelPositionZ', updateModelZ, z_range.step, z_range.min, defaultPosition.z, z_range.max);

    container.appendChild(x);
    container.appendChild(y);
    container.appendChild(z);
}

function createRotationSliders(container, modelData) {
    let defaultRotation = (defaults) ? DEFAULT_MODEL_ROTATION : modelData[model]['default_rotation'];
    const x = createSlider('ModelRotationX', updateRotationX, 0.5, -360, defaultRotation.x, 360);
    const y = createSlider('ModelRotationY', updateRotationY, 0.5, -360, defaultRotation.y, 360);
    const z = createSlider('ModelRotationZ', updateRotationZ, 0.5, -360, defaultRotation.z, 360);

    container.appendChild(x);
    container.appendChild(y);
    container.appendChild(z);
}

function createScaleSlider(container, modelData) {
    let defaultScale = (defaults) ? DEFAULT_SCALE : modelData[model]['default_scale'];
    const scale = createSlider('ModelScale', updateModelScale, 1, -100, DEFAULT_SCALE, 100);

    container.appendChild(scale);
}

function createLightMenu(container, modelData) {
    let defaultPosition = (defaults) ? DEFAULT_CAMERA_POSITION : modelData[model]['default_camera'];
    let defaultTranslations = (defaults) ? DEFAULT_TRANSLATIONS : modelData[model]['light_translations'];
    const x = createSlider('LightPositionX', updateLightPositionX, defaultTranslations.x_range.step, defaultTranslations.x_range.min, defaultPosition.x, defaultTranslations.x_range.max);
    const y = createSlider('LightPositionY', updateLightPositionY, defaultTranslations.y_range.step, defaultTranslations.y_range.min, defaultPosition.y, defaultTranslations.y_range.max);
    const z = createSlider('LightPositionZ', updateLightPositionZ, defaultTranslations.z_range.step, defaultTranslations.z_range.min, defaultPosition.z, defaultTranslations.z_range.max);
    const intensity = createSlider('LightIntensity', updateLightIntensity, 0.01, 0, DEFAULT_LIGHT_INTENSITY, 10);

    container.appendChild(x);
    container.appendChild(y);
    container.appendChild(z);
    container.appendChild(intensity);

    const checkboxDiv = createDiv('lightCheckbox');
    const attachLightToCamera = document.createElement('input');
    attachLightToCamera.id = 'lightCameraCheckbox';
    attachLightToCamera.type = 'checkbox';
    attachLightToCamera.name = 'attachLightToCamera';
    attachLightToCamera.checked = true;
    checkboxDiv.appendChild(attachLightToCamera);

    const label = document.createElement('label');
    label.htmlFor = 'lightCameraCheckbox';
    label.textContent = 'Attach Light to Camera';
    checkboxDiv.appendChild(label);

    container.appendChild(checkboxDiv);

    attachLightToCamera.addEventListener('input', function() {
        fixLightToCamera();
        if (getIsLightAttachedToCamera()) {
            updateLightSlidersToMatchCamera();
        }
    });
}

function createCameraSliders(container, modelData) {
    let defaultPosition = (defaults) ? DEFAULT_CAMERA_POSITION : modelData[model]['default_camera'];
    let defaultTranslations = (defaults) ? DEFAULT_TRANSLATIONS : modelData[model]['camera_translations'];
    const x = createSlider('CameraPositionX', updateCameraX, defaultTranslations.x_range.step, defaultTranslations.x_range.min, defaultPosition.x, defaultTranslations.x_range.max);
    const y = createSlider('CameraPositionY', updateCameraY, defaultTranslations.y_range.step, defaultTranslations.y_range.min, defaultPosition.y, defaultTranslations.y_range.max);
    const z = createSlider('CameraPositionZ', updateCameraZ, defaultTranslations.z_range.step, defaultTranslations.z_range.min, defaultPosition.z, defaultTranslations.z_range.max);

    container.appendChild(x);
    container.appendChild(y);
    container.appendChild(z);
}


function createSlider(id, func, step = 0.01, min = -100, value = 0, max = 100) {
    let sliderContainer = document.createElement('div');
    sliderContainer.className = 'slidercontainer';

    let sliderElement = document.createElement('input');
    sliderElement.type = "range";
    sliderElement.min = min;
    sliderElement.value = value;
    sliderElement.max = max;
    sliderElement.step = 0.01;
    sliderElement.id = id;
    sliderContainer.appendChild(sliderElement);

    const valueElement = document.createElement('p');
    valueElement.innerHTML = `${id} value: <span id="${id}Value">${parseFloat(value).toFixed(4)}</span>`;
    sliderContainer.appendChild(valueElement);

    // wire the live update for this slider
    sliderElement.addEventListener('input', function () {
        const v = document.getElementById(`${id}Value`);
        if (v) v.innerHTML = parseFloat(this.value).toFixed(4);
        func(this.value);
    });

    return sliderContainer;
}

function createMenu(modelName, modeldata, useDefaults) {
    const slidersContainer = document.getElementById("sliderscontainer");
    if (!slidersContainer) return; // guard

    model = modelName;
    defaults = useDefaults;

    // useDefaults is true if the model hasn't been added to data yet
    // we can just write the defaults to the model data and in theory we 
    // should be able to remove the default condition checks
    if (useDefaults) {
        addNewModelData(modeldata);
    }

    // If we've already created the set of sliders, don't recreate them.
    if (initialSlidersLoaded) {
        resetModelSliders(modeldata);
        resetLightMenu(modeldata);
        resetCameraSliders(modeldata);
        return;
    }

    let modelSliders = createDiv('modelsliders');
    createModelSliders(modelSliders, modeldata);
    createRotationSliders(modelSliders, modeldata);
    createScaleSlider(modelSliders, modeldata);

    let lightMenu = createDiv('lightmenu');
    createLightMenu(lightMenu, modeldata);

    let cameraSliders = createDiv('camerasliders');
    createCameraSliders(cameraSliders, modeldata);

    let saveButton = document.createElement('button');
    saveButton.id = "saveButton";
    saveButton.onclick = () => {
        updateData(modeldata);
        writeModelData(modeldata, "models.json", "text/plain");
    };
    cameraSliders.appendChild(saveButton);

    slidersContainer.appendChild(modelSliders);
    slidersContainer.appendChild(lightMenu);
    slidersContainer.appendChild(cameraSliders);

    initialSlidersLoaded = true;

}
