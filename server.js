// Import necessary modules
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Set the port, default to 3000 if not specified in environment

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set destination directory for uploaded files
    },
    filename: (req, file, cb) => {
        // Set filename for uploaded files
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }); // Create Multer instance with custom storage settings

// Serve static files
app.use(express.static('public')); // Serve files from 'public' directory
app.use('/uploads', express.static('uploads')); // Serve files from 'uploads' directory

// Define the file upload endpoint
/*
app.post(...):

app is an instance of an Express application.
.post(...) is a method to define a route for handling POST requests. POST requests are typically 
used for submitting data to the server.

'/upload':

This is the path or endpoint on your server. When a POST request is made to http://[your-server]/upload, 
this route will be triggered.

upload.array('image'):

upload is an instance of multer, a middleware for handling multipart/form-data, which is 
primarily used for uploading files.
.array('image') tells Multer to accept an array of files, all with the field name 'image'. 
This means in the incoming POST request, there can be multiple files uploaded under the field name 'image'. For example, 
in an HTML form, this would correspond to an input like <input type="file" name="image" multiple>.

async (req, res) => { ... }:

This part defines an asynchronous function that will be executed when the route is matched.
async indicates that the function is asynchronous, which allows the use of await within it.
req (short for "request") is an object containing information about the HTTP request that 
triggered the route. It includes things like the body of the request, any parameters, headers, etc.
res (short for "response") is an object used to send back the desired HTTP response.
The function body (inside { ... }) contains the code that will be executed when the route is
accessed. This typically involves processing the uploaded files, performing some actions, 
and then sending a response back to the client.
*/

app.post('/upload', upload.single('image'), async (req, res) => {
    //upload.single('image') this will run first before moving to the rest of the code, basically
    //it go to the formData and grab the 'image' and then upload it to the 'uploads' folder 
    // req.file is the `image` file
    // req.body will hold the text fields, if there were any
    if(!req.file){
        return res.status(400).send('No file uploaded.');
    }
    const apiToken = req.body.apiToken;
    if (!apiToken) {
        return res.status(400).send('API token is required.');
    }
    try {
        const uploadedImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const response = await uploadToPrintify(apiToken, req.file.filename, uploadedImageUrl);
        // console.log("The link: "+uploadedImageUrl);
        
        // Delete the file from the server after uploading
        try {
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.error('Error occurred while deleting the file:', err);
        }

        res.send({
            message: 'Image uploaded and file deleted successfully',
            printifyResponse: response.data
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing file');
    }
})


// Function to handle uploading images to Printify
async function uploadToPrintify(apiToken, fileName, imageUrl) {
    const requestBody = {
        file_name: fileName, // File name for the image
        url: imageUrl // URL of the image
    };

    const config = {
        headers: {
            'Authorization': 'Bearer ' + apiToken // Authorization header with API token
        }
    };

    // console.log("Here is the object I'm sending : "+JSON.stringify(requestBody, null, 4));

    try {
        return await axios.post('https://api.printify.com/v1/uploads/images.json', requestBody, config); // POST request to Printify
    } catch (error) {
        console.error('Printify API error:', error.response ? error.response.data : error);
        throw error; // Propagate error for handling upstream
    }

}

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`); // Log the server start and port
});


/*

The behavior you're observing in the console logs is indeed due to the overlapping of multiple asynchronous 
requests to the /upload endpoint. When multiple files are uploaded simultaneously, each file triggers an 
independent HTTP POST request to your server. These requests are handled concurrently by Node.js, which 
can lead to overlapping execution of asynchronous operations. Let me explain this with an example:

Example Scenario:
Imagine you're uploading three files almost simultaneously to your server:

File A (starts at time T1)
File B (starts shortly after A, at time T1+Δ)
File C (starts shortly after B, at time T1+2Δ)
Each file upload initiates a separate request to the /upload endpoint. Since Node.js is highly efficient 
at handling I/O operations asynchronously, it doesn't wait for one file to be completely processed before 
starting with the next one. The requests are processed in parallel.

What Happens in the Server:
T1: Request for File A arrives. It starts processing.
T1+Δ: Request for File B arrives. Processing for File A is ongoing, but Node.js starts processing File B concurrently.
T1+2Δ: Request for File C arrives. Processing for both File A and File B is ongoing. Node.js starts processing File C 
concurrently.
In Terms of Your Console Logs:
Each request executes uploadToPrintify, which immediately logs "Here is the object I'm sending..."
Right after calling uploadToPrintify, each request logs "The link..."
Resulting Log Sequence:
Due to the asynchronous nature and the slight differences in processing times, the logs interleave. You might see 
something like this:

"Here is the object I'm sending" for File A
"Here is the object I'm sending" for File B
"The link" for File A
"Here is the object I'm sending" for File C
"The link" for File B
"The link" for File C
Why This Happens:
The "Here is the object I'm sending" log is part of the asynchronous uploadToPrintify function.
The "The link" log is executed right after the asynchronous call, which doesn't wait for the completion of uploadToPrintify.
Since the requests are independent, their respective asynchronous operations overlap and interleave.
Key Takeaway:
This behavior is a typical characteristic of asynchronous programming in environments like Node.js. It efficiently handles 
multiple operations concurrently, leading to overlapping execution, especially evident in I/O-bound tasks like handling HTTP 
requests or performing network operations. 

*/