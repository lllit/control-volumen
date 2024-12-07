document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: getVolume,
        }, (results) => {
            if (results && results[0] && results[0].result !== undefined) {
                const volume = results[0].result * 100;
                const volumeSlider = document.getElementById('volumeSlider');
                volumeSlider.value = volume;
                updateSliderColor(volume);
                updateVolumeIcon(volume);
            }
        });
    });

    document.querySelector('.window-buttons img').addEventListener('click', function () {
        window.close();
    });

});

document.getElementById('volumeSlider').addEventListener('input', function () {
    const volume = this.value / 100;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: setVolume,
            args: [volume]
        });
    });

    // Mostrar/ocultar SVG según el volumen
    updateVolumeIcon(this.value);

    // Actualizar el color del control deslizante
    updateSliderColor(this.value);
});

document.getElementById('volumeIcon').addEventListener('click', function () {
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider.value == 0) {
        volumeSlider.value = 100;
    } else {
        volumeSlider.value = 0;
    }
    const volume = volumeSlider.value / 100;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: setVolume,
            args: [volume]
        });
    });

    // Mostrar/ocultar SVG según el volumen
    updateVolumeIcon(volumeSlider.value);

    // Actualizar el color del control deslizante
    updateSliderColor(volumeSlider.value);
});

function setVolume(volume) {
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(element => {
        element.volume = volume;
    });
}

function getVolume() {
    const mediaElements = document.querySelectorAll('video, audio');
    if (mediaElements.length > 0) {
        return mediaElements[0].volume;
    }
    return 1; // Volumen por defecto si no hay elementos de audio/video
}

function updateVolumeIcon(volume) {
    if (volume == 0) {
        document.getElementById('volumeOn').style.display = 'none';
        document.getElementById('volumeOff').style.display = 'block';
    } else {
        document.getElementById('volumeOn').style.display = 'block';
        document.getElementById('volumeOff').style.display = 'none';
    }
}

function updateSliderColor(value) {
    const slider = document.getElementById('volumeSlider');
    const percentage = value / 100;
    const red = Math.min(255, 255 * (1 - percentage));
    const green = Math.min(255, 255 * percentage);
    const blue = 0;
    slider.style.background = `linear-gradient(to right, rgb(${red}, ${green}, ${blue}) ${value}%, #ccc ${value}%)`;
}