let sliderVisibility = true;
let initialSlidersLoaded = false;

function displaySliders() {
    let sliders = document.getElementById('slidercontainer');
    sliders.style.display = 'block';
    sliderVisibility = true;
}

function hideSliders() {
    let sliders = document.getElementById("slidercontainer");
    sliders.querySelectorAll('*').forEach(child => child.style.display = 'none');
    sliders.style.display = 'none';
    sliderVisibility = false;
}

function updateSliderVisibility() {
    if (sliderVisibility) {
        hideSliders()
    } else {
        displaySliders()
    }
}

function updateModelSliders() {
    updateSliderValue('ModelPositionX', 0);
    updateSliderValue('ModelPositionY', 0);
    updateSliderValue('ModelPositionZ', 0);

}

function updateSliderValue(id, value) {
    let slider = document.getElementById(id);
    slider.value = value;
    let valueElement = document.getElementById(`${id}Value`);
    valueElement.innerText = value;
}

function createDiv(id) {
    let div = document.createElement('div');
    div.id = id;

    return div
}

function createModelSliders(container) {
    const x = createSlider('ModelPositionX', updateModelX, 0.01, -10, 0, 10);
    const y = createSlider('ModelPositionY', updateModelY, 0.01, -10, 0, 10);
    const z = createSlider('ModelPositionZ', updateModelZ, 0.01, -10, 0, 10);

    container.appendChild(x);
    container.appendChild(y);
    container.appendChild(z);
}

function createRotationSliders(container) {
    const x = createSlider('ModelRotationX', updateRotationX, 0.5, -360, 0, 360);
    const y = createSlider('ModelRotationY', updateRotationY, 0.5, -360, 0, 360);
    const z = createSlider('ModelRotationZ', updateRotationZ, 0.5, -360, 0, 360);

    container.appendChild(x);
    container.appendChild(y);
    container.appendChild(z);
}

function createScaleSlider(container) {
    const scale = createSlider('ModelScale', updateModelScale, 1, -100, DEFAULT_SCALE, 100);

    container.appendChild(scale);
}

function createLightMenu(container) {
    const x = createSlider('LightPositionX', updateLightPositionX, 0.01, -5, 0, 5);
    const y = createSlider('LightPositionY', updateLightPositionY, 0.01, -5, 1, 5);
    const z = createSlider('LightPositionZ', updateLightPositionZ, 0.01, -5, 2, 5);
    const intensity = createSlider('LightIntensity', updateLightIntensity, 0.01, 0, 5, 10);

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
    });
}

function createCameraSliders(container) {
    const x = createSlider('CameraPositionX', updateCameraX, 0.01, -100, 0, 100);
    const y = createSlider('CameraPositionY', updateCameraY, 0.01, -100, 1, 100);
    const z = createSlider('CameraPositionZ', updateCameraZ, 0.01, -100, 2, 100);

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
    valueElement.innerHTML = `${id} value: <span id="${id}Value">${value}</span>`;
    sliderContainer.appendChild(valueElement);

    // wire the live update for this slider
    sliderElement.addEventListener('input', function () {
        const v = document.getElementById(`${id}Value`);
        if (v) v.innerHTML = this.value;
        func(this.value);
    });

    return sliderContainer;
}

function createSliders(modelName, modeldata, useDefaults) {
    const slidersContainer = document.getElementById("sliderscontainer");
    if (!slidersContainer) return; // guard

    // If we've already created the set of sliders, don't recreate them.
    if (initialSlidersLoaded) {
        updateModelSliders();
        return;
    }

    let modelSliders = createDiv('modelsliders');
    createModelSliders(modelSliders);
    createRotationSliders(modelSliders);
    createScaleSlider(modelSliders);

    let lightMenu = createDiv('lightmenu');
    createLightMenu(lightMenu);

    let cameraSliders = createDiv('camerasliders');
    createCameraSliders(cameraSliders);

    slidersContainer.appendChild(modelSliders);
    slidersContainer.appendChild(lightMenu);
    slidersContainer.appendChild(cameraSliders);

    // Ensure container is visible when sliders are created
    slidersContainer.style.display = 'block';

    initialSlidersLoaded = true;
}