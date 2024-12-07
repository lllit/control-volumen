document.getElementById('volumeSlider').addEventListener('input', function () {
    const volume = this.value / 100;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: setVolume,
            args: [volume]
        });
    });
});

function setVolume(volume) {
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(element => {
        element.volume = volume;
    });
}