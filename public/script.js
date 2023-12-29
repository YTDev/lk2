document.addEventListener('DOMContentLoaded', () => {


const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create(inputElement);

// Mock server processing
FilePond.setOptions({
    server: {
        process: '/upload',
        
    }
});


document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    console.log(formData.keys);
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

})