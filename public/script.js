// Disable auto discover for all elements:
Dropzone.autoDiscover = false;

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Dropzone
    var myDropzone = new Dropzone("#imageDropzone", {
        url: "/upload",
        autoProcessQueue: false,
        addRemoveLinks: true,
        paramName: 'image', // The name that will be used to transfer the file
        parallelUploads: 10, // Adjust as per your requirements
        uploadMultiple: false, // Allow multiple file uploads
        maxFiles: 10, // Adjust the maximum number of files here
        // You can add more options as required
    });

    // Add the API token to Dropzone's formData
    myDropzone.on("sending", function(file, xhr, formData) {
    
        // Check if apiToken is already appended
        if (!formData.has('apiToken')) {
        var apiTokenInput = document.getElementById('apiTokenInput');
        formData.append("apiToken", apiTokenInput.value);
        }
        // Debugging: Log formData entries
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
    });

    // Handle form submission
    document.getElementById("uploadForm").addEventListener("submit", function(event) {
        event.preventDefault();
        myDropzone.processQueue(); // Process the uploaded files
    });

    // Handle the response after all files have been uploaded
    myDropzone.on("queuecomplete", function() {
        fetch('/upload', {
            method: 'POST',
            body: myDropzone.getAcceptedFiles()
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('responseContainer').innerHTML = 
                `<p>Images uploaded. Printify responses: ${JSON.stringify(data.printifyResponses)}</p>`;
        })
        .catch(error => console.error('Error:', error));
        myDropzone.removeAllFiles(); // Clear the Dropzone area after upload
    });
});
