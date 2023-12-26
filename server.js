const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('https://lk2-production.up.railway.app/uploads/'));
// app.use('/uploads', express.static(path.join(__dirname, 'https://lk2-production.up.railway.app/uploads/')));



// Upload endpoint
app.post('/upload', upload.array('image'), async (req, res) => {
    console.log('API Token:', req.body.apiToken); // Log the API token
    console.log('Files:', req.files);
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    const apiToken = req.body.apiToken;
        
    if (!apiToken) {
        return res.status(400).send('API token is required.');
    }
    try {

            const printifyResponses = await Promise.all(req.files.map(async (file) => {
            const uploadedImageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            console.log("image link :"+uploadedImageUrl);
            console.log("filename :"+file.filename);
            console.log("api token :"+apiToken);
            const response = await uploadToPrintify(apiToken, file.filename, uploadedImageUrl);

            // Delete the file after successful upload to Printify
            try {
                fs.unlinkSync(filePath);
                console.log('File deleted successfully');
              } catch (err) {
                console.error('Error occurred while deleting the file:', err);
              }

           
            return response.data;
        }));

        res.send({ 
            message: 'Images uploaded and files deleted successfully',
            printifyResponses 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing files');
    }
});

async function uploadToPrintify(apiToken, fileName, imageUrl) {
    const requestBody = {
        file_name: fileName,
        url: imageUrl
    };

    const config = {
        headers: {
            'Authorization': 'Bearer ' + apiToken
        }
    };

    try {
        return await axios.post('https://api.printify.com/v1/uploads/images.json', requestBody, config);
    } catch (error) {
        console.error('Printify API error:', error.response ? error.response.data : error);
        throw error; // Re-throw the error to be caught in the calling function
    }
}


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
