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
This means in the incoming POST request, there can be multiple files uploaded under the field name 'image'. For example, in an HTML form, this would correspond to an input like <input type="file" name="image" multiple>.
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

app.post('/upload', upload.array('image'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.'); // Return error if no files were uploaded
    }

    const apiToken = req.body.apiToken; // Extract API token from request body
    if (!apiToken) {
        return res.status(400).send('API token is required.'); // Return error if API token is missing
    }

    try {
        // Process each uploaded file
        const printifyResponses = await Promise.all(req.files.map(async (file) => {
            const uploadedImageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`; // Create URL for uploaded image
            const response = await uploadToPrintify(apiToken, file.filename, uploadedImageUrl); // Upload image to Printify

            // Delete the file from the server
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('Error occurred while deleting the file:', err);
            }

            return response.data; // Return the response data from Printify
        }));

        // Send response back to client
        res.send({ 
            message: 'Images uploaded and files deleted successfully',
            printifyResponses
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing files'); // Handle any errors during processing
    }
});

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
