document.addEventListener('DOMContentLoaded', function () {
    // Initialize FilePond on a specific input element with custom settings
    const pond = FilePond.create(document.getElementById('imageInput'));
    pond.setOptions({

        instantUpload: false, // Disable automatic upload when a file is added
        server: {
            // Define a custom processing function for file uploads
            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData(); // Create a new FormData object to hold file data
                formData.append(fieldName, file, file.name); // Append the file to the FormData object

                // Append the API token from a separate input field to the FormData
                formData.append('apiToken', document.getElementById('apiTokenInput').value);

                // Create a new XMLHttpRequest to send the FormData to the server
                const request = new XMLHttpRequest();
                request.open('POST', '/upload'); // Open a POST request to the '/upload' endpoint
                request.onload = function () {
                    // Function called when the request completes
                    if (request.status >= 200 && request.status < 300) {
                        load(request.responseText); // Call FilePond's load method on success
                    } else {
                        error('Upload failed'); // Call FilePond's error method on failure
                    }
                };
                request.onerror = function () {
                    error('Upload failed'); // Call FilePond's error method if the request fails
                };
                request.send(formData); // Send the FormData to the server

                // Return an object with an abort function to cancel the upload if needed
                return {
                    abort: () => {
                        request.abort(); // Cancel the XMLHttpRequest
                        abort(); // Call FilePond's abort method
                    }
                };
            },
            revert: null, // Prevent FilePond from sending a DELETE request
            // ... other server options if any 
        },
        iconUndo: pond.iconDone,
        labelTapToUndo: 'Success',
        labelFileProcessingComplete: 'Upload complete',

    })

    document.getElementById('uploadForm').addEventListener('submit', function (event) {
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
