document.addEventListener('DOMContentLoaded', function() {
    // Initialize FilePond on the file input
    const pond = FilePond.create(document.getElementById('imageInput'));

    // Handle form submission
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Use FilePond's API to get the files
        const files = pond.getFiles();

        // Create FormData and append files
        let formData = new FormData();
        formData.append('apiToken', document.getElementById('apiTokenInput').value);
        files.forEach(fileItem => {
            formData.append('image', fileItem.file);
        });

        // Fetch request
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('responseContainer').innerHTML = 
                `<p>Images uploaded: ${JSON.stringify(data)}</p>`;
        })
        .catch(error => console.error('Error:', error));
    });
});
