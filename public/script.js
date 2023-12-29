document.addEventListener('DOMContentLoaded', function() {
    const pond = FilePond.create(document.getElementById('imageInput'), {
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append(fieldName, file, file.name);
                formData.append('apiToken', document.getElementById('apiTokenInput').value);

                const request = new XMLHttpRequest();
                request.open('POST', '/upload');
                request.onload = function() {
                    if (request.status >= 200 && request.status < 300) {
                        load(request.responseText);
                    } else {
                        error('oh no');
                    }
                };
                request.send(formData);
                return {
                    abort: () => {
                        request.abort();
                        abort();
                    }
                };
            },
            revert: null, // Prevent FilePond from sending a DELETE request
        
        }
    });

    // No need to handle form submission here as FilePond handles file upload
});
