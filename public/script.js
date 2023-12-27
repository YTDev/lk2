document.addEventListener('DOMContentLoaded', function() {
    // Initialize FilePond
    FilePond.registerPlugin(
	
        // encodes the file as base64 data
      FilePondPluginFileEncode,
        
        // validates the size of the file
        FilePondPluginFileValidateSize,
        
        // corrects mobile image orientation
        FilePondPluginImageExifOrientation,
        
        // previews dropped images
      FilePondPluginImagePreview
    );
    const inputElement = document.querySelector('input[type="file"]');
    const pond = FilePond.create(inputElement);

    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the FilePond file objects
        const files = pond.getFiles();

        // Create a new FormData object
        let formData = new FormData(this);

        // Append each file to the FormData
        files.forEach(fileItem => {
            formData.append('image', fileItem.file);
        });

        // Perform the AJAX request
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('responseContainer').innerHTML = 
                `<p>Images uploaded. Printify responses: ${JSON.stringify(data.printifyResponses)}</p>`;
        })
        .catch(error => console.error('Error:', error));
    });
});
