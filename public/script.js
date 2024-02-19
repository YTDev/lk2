document.addEventListener('DOMContentLoaded', function () {

    /**scrolling effects when clicking get started */

    const getStartedBtn = document.querySelector('.hero__btn');
    const sectionToScrollTo = document.getElementById('pbu');
  
    getStartedBtn.addEventListener('click', function() {
      sectionToScrollTo.scrollIntoView({ behavior: 'smooth' });
    });





















    /*

    It waits for the DOM to be fully loaded.
    It gets the vertical position of the .header__logo-container with offsetTop.
    It defines a scrollPage function that adds or removes the .header__logo-container--sticky class
    based on the current scroll position.
    It listens for the scroll event on the window and invokes the scrollPage function when the event occurs.
    
    note: window.pageYOffset is depracted so we use document.documentElement.scrollTop instead.

    */
        /*

    It waits for the DOM to be fully loaded.
    It gets the vertical position of the .header__logo-container with offsetTop.
    It defines a scrollPage function that adds or removes the .header__logo-container--sticky class
    based on the current scroll position.
    It listens for the scroll event on the window and invokes the scrollPage function when the event occurs.
    
    note: window.pageYOffset is depracted so we use document.documentElement.scrollTop instead.

    */
    let headerLogoContainer = document.querySelector('.header__main');
    let stickyOffset = headerLogoContainer.offsetTop;
   
    function scrollPage() {
        
        
        if (document.documentElement.scrollTop >= stickyOffset) {
            headerLogoContainer.classList.add('header__main--sticky');
            headerLogoContainer.classList.add('header__main--shadow');
        } else {
            headerLogoContainer.classList.remove('header__main--sticky');
            headerLogoContainer.classList.remove('header__main--shadow');
        }
    }

    window.addEventListener('scroll', scrollPage);





    



    // Initialize FilePond on a specific input element with custom settings
    const pond = FilePond.create(document.getElementById('imageInput'));
    pond.setOptions({
        instantUpload: false, // Disable automatic upload when a file is added
        server: {
            // Define a custom processing function for file uploads
            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData(); // Create a new FormData object to hold file data
                // fieldName is the name of the input field
                // file is the actual file object to send
                formData.append(fieldName, file, file.name); // Append the file to the FormData object

                // Append the API token from a separate input field to the FormData
                formData.append('apiToken', document.getElementById('apiTokenInput').value);

                axios.post('/upload',formData)
                .then(response => {
                    load(response.data) // Call FilePond's load method on success
                })
                .catch(error =>{
                    console.error(error);
                    error("Upload failed");
                })
                
                /*
                
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
                */
                
                
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
        iconUndo: pond.iconRetry,
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








    // Testimonials Slider
    let currentTestimonial = 0;

    function showTestimonial(index) {
        const testimonials = document.querySelectorAll('.testimonial');
        currentTestimonial = (index + testimonials.length) % testimonials.length; // Wrap index safely

        testimonials.forEach((testimonial, idx) => {
            testimonial.style.display = idx === currentTestimonial ? 'block' : 'none';
        });
    }

    function initTestimonialButtons() {
        document.getElementById('prevBtn').addEventListener('click', () => prevTestimonial());
        document.getElementById('nextBtn').addEventListener('click', () => nextTestimonial());
    }

    function prevTestimonial() {
        showTestimonial(currentTestimonial - 1);
    }

    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1);
    }

    showTestimonial(currentTestimonial); // Initial display
    initTestimonialButtons(); // Initialize testimonial buttons
    
});


