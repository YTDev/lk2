document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    const apiToken = document.getElementById('apiToken').value;
    formData.append('apiToken', apiToken);
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
