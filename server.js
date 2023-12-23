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
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/upload', upload.array('image'), async (req, res) => {
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    try {
        const apiToken = req.body.apiToken;
        
        if (!apiToken) {
            return res.status(400).send('API token is required.');
        }
        const printifyResponses = await Promise.all(req.files.map(async (file) => {
            const uploadedImageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            const response = await uploadToPrintify(apiToken, file.filename, uploadedImageUrl);

            // Delete the file after successful upload to Printify
            fs.unlinkSync(file.path);

           
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

async function uploadToPrintify(fileName, imageUrl) {
    const requestBody = {
        file_name: fileName,
        url: imageUrl
    };
console.log('Request Body:', requestBody);
    const config = {
    headers: {
        'Authorization': 'Bearer ' + apiToken
        }
    };

    return axios.post('https://api.printify.com/v1/uploads/images.json', requestBody, config);
    
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
