document.addEventListener('DOMContentLoaded', function () {

    /**scrolling effects when clicking get started */

    const getStartedBtn = document.querySelector('.button--primary');
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




    /*For hero animation */


    particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#fff" }, //This property defines the color of the particles
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
            image: { src: "img/github.svg", width: 100, height: 100 }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
      



    // The how it works tabs sections

      
    document.querySelectorAll('.tabs__button').forEach(button => {
        button.addEventListener('click', () => {
            const sideMenu = button.parentElement;
            const tabsContainer = sideMenu.parentElement;
            const tabNumber = button.dataset.tabTarget;
            const tabToActivate = tabsContainer.querySelector(tabNumber);
    
            sideMenu.querySelectorAll('.tabs__button').forEach(button => {
                button.classList.remove('tabs__button--active');
            });
    
            tabsContainer.querySelectorAll('.tabs__pane').forEach(tab => {
                tab.classList.remove('tabs__pane--active');
            });
    
            button.classList.add('tabs__button--active');
            tabToActivate.classList.add('tabs__pane--active');
        });
    });
    


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


