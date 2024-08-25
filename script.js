document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.spiderweb')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            showFullScreen(content);
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid .spiderweb file.');
    }
});

document.getElementById('okButton').addEventListener('click', function() {
    const textInput = document.getElementById('textInput').value;
    if (textInput.trim()) {
        showFullScreen(textInput);
    } else {
        alert('Please enter or upload valid .spiderweb code.');
    }
});

function showFullScreen(content) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';  // Clear previous content
    parseSpiderWeb(content, outputDiv);
    openFullScreen(outputDiv);
}

function parseSpiderWeb(content, outputDiv) {
    const lines = content.split('\n');
    let html = '';

    lines.forEach(line => {
        line = line.trim(); // Trim whitespace
        if (line.startsWith('pageTitle:')) {
            document.title = escapeHtml(line.replace('pageTitle:', '').trim());
        } else if (line.startsWith('title:')) {
            html += `<h1>${escapeHtml(line.replace('title:', '').trim())}</h1>`;
        } else if (line.startsWith('header:')) {
            html += `<h2>${escapeHtml(line.replace('header:', '').trim())}</h2>`;
        } else if (line.startsWith('paragraph:')) {
            html += `<p>${escapeHtml(line.replace('paragraph:', '').trim())}</p>`;
        } else if (line.startsWith('button(') && line.includes('):')) {
            const urlMatch = line.match(/button\((.*?)\):/);
            if (urlMatch) {
                const url = urlMatch[1];
                const text = line.split('):')[1].trim();
                html += `<a href="${encodeURI(url)}" target="_blank"><button>${escapeHtml(text)}</button></a>`;
            }
        } else if (line.startsWith('webImage:')) {
            const imgUrl = line.replace('webImage:', '').trim();
            html += `<img src="${encodeURI(imgUrl)}" alt="Image" style="max-width:100%;height:auto;">`;
        } else if (line === 'space') {
            html += `<br>`;
        } else if (line) {
            html += `<p>${escapeHtml(line)}</p>`; // Treat any other text as a paragraph
        }
    });

    outputDiv.innerHTML = html;
}

function openFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

// Function to escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
