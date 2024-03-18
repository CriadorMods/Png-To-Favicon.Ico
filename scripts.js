
var fileInput = document.getElementById('fileInput');
var fileDropArea = document.getElementById('fileDropArea');
var convertBtn = document.getElementById('convertBtn');
var downloadLink = document.getElementById('downloadLink');
var fileNameDisplay = document.getElementById('fileName');
var progressBarContainer = document.getElementById('progressBarContainer');
var progressBarFill = document.getElementById('progressBarFill');
var message = document.getElementById('message');

fileInput.addEventListener('change', handleFileSelect);
convertBtn.addEventListener('click', convertToICO);

fileDropArea.addEventListener('dragover', handleDragOver);
fileDropArea.addEventListener('dragleave', handleDragLeave);
fileDropArea.addEventListener('drop', handleFileDrop);

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    fileDropArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    fileDropArea.classList.remove('dragover');
}

function handleFileSelect(event) {
    event.preventDefault();
    event.stopPropagation();

    var files = event.target.files;
    handleFiles(files);
}

function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    fileDropArea.classList.remove('dragover');

    var files = event.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        var file = files[0];
        var fileName = file.name.toLowerCase();
        if (fileName.endsWith('.png')) {
            fileNameDisplay.textContent = 'Selected File: ' + file.name;
            convertBtn.disabled = false; 
        } else {
            showMessage('Please select a PNG file.', 'error');
            convertBtn.disabled = true; 
        }
    }
}

async function convertToICO() {
    var files = fileInput.files || [];
    if (files.length === 0) {
        showMessage('Please select a PNG file.', 'error');
        return;
    }

    var file = files[0];
    var fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.png')) {
        showMessage('Please select a PNG file.', 'error');
        return;
    }

    showMessage('');
    progressBarContainer.style.display = 'block';

    var size = document.querySelector('input[name="faviconSize"]:checked').value;
    var bitDepth = document.querySelector('input[name="bitDepth"]:checked').value;
    var dataURL = await convertToICOAsync(file, size, bitDepth);
    if (dataURL) {
        downloadLink.href = dataURL;
        downloadLink.style.display = 'inline-block';
        downloadLink.setAttribute('download', 'favicon.ico');
        showMessage('Conversion completed successfully.', 'success');
    } else {
        showMessage('An error occurred during conversion.', 'error');
    }

    progressBarContainer.style.display = 'none';
    progressBarFill.style.width = '0%';
}

function convertToICOAsync(file, size, bitDepth) {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = async function(event) {
            var img = new Image();
            img.onload = async function() {
                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, 0, 0, size, size);

                var dataURL = await createICO(canvas, bitDepth);
                resolve(dataURL);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function createICO(canvas, bitDepth) {
    return new Promise((resolve) => {
        canvas.toBlob(function(blob) {
            var reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            reader.readAsDataURL(blob);
        }, 'image/x-icon', bitDepth);
    });
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = 'message ' + type;
}

const storedColor = localStorage.getItem('backgroundColor');

if (storedColor) {
if (storedColor.startsWith('linear-gradient')) {
document.body.style.background = storedColor;
} else {
document.body.style.backgroundColor = storedColor;
}
}

document.addEventListener('DOMContentLoaded', function() {
document.getElementById('warning-message').style.display = 'block';
});
