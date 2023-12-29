document.addEventListener('DOMContentLoaded', function() {
    const inputElement = document.querySelector('input[type="file"]');

    // Initialize FilePond with server configuration
    const pond = FilePond.create(inputElement, {
        server: {
            process: {
                url: '/upload',
                method: 'POST'
            }
            // You can add other server endpoints like 'revert' if needed
        }
    });

    // Optionally, handle additional events or custom logic
    // Example: Showing response in 'responseContainer'
    pond.on('processfile', (error, file) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        // Assuming you want to show some response after file processing
        document.getElementById('responseContainer').textContent = 'File uploaded successfully';
    });
});
