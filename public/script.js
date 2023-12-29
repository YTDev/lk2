document.addEventListener('DOMContentLoaded', function() {
    const pond = FilePond.create(document.getElementById('imageInput'), {
        instantUpload: false,
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append(fieldName, file, file.name);
                
                // Append the API token from the input field to the FormData
                formData.append('apiToken', document.getElementById('apiTokenInput').value);

                const request = new XMLHttpRequest();
                request.open('POST', '/upload');
                request.onload = function() {
                    if (request.status >= 200 && request.status < 300) {
                        load(request.responseText);
                    } else {
                        error('Upload failed');
                    }
                };
                request.onerror = function() {
                    error('Upload failed');
                };
                request.send(formData);
                
                return {
                    abort: () => {
                        request.abort();
                        abort();
                    }
                };
            }
        }
    });

    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Manually process each file
        pond.getFiles().forEach(fileItem => {
            pond.processFile(fileItem.id).then(file => {
                console.log('File uploaded', file);
            }).catch(error => {
                console.error('File upload error', error);
            });
        });
    });
});
