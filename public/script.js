
// Disable auto discover for all elements:
Dropzone.autoDiscover = false;

document.addEventListener("DOMContentLoaded", function() {
    // Create a Dropzone for the #imageDropzone element
    var myDropzone = new Dropzone("#imageDropzone", {
        url: "/upload",
        autoProcessQueue: false,
        addRemoveLinks: true,
        paramName: "image", // The name that will be used to transfer the file
    });

    // Handle the form submission
    document.getElementById("uploadForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Append the API Token to Dropzone's formData
        var apiTokenInput = document.getElementById('apiTokenInput');
        myDropzone.on("sending", function(file, xhr, formData) {
            formData.append("apiToken", apiTokenInput.value);
        });

        // Process the queue when the form is submitted
        myDropzone.processQueue();

        // Listen for the "complete" event on all files
        myDropzone.on("queuecomplete", function() {
            // Your existing code to fetch '/upload' and handle the response
            fetch('/upload', {
                method: 'POST',
                body: myDropzone.getAcceptedFiles() // Send the accepted files
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('responseContainer').innerHTML = 
                    `<p>Images uploaded. Printify responses: ${JSON.stringify(data.printifyResponses)}</p>`;
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
