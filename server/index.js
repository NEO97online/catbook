// load environment variables from .env file, if it exists
require('dotenv').config();

// import dependencies
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

// write out our gcloud credentials
fs.writeFileSync(path.join(__dirname, 'gcloud-credentials.json'), process.env.SERVICE_ACCOUNT_JSON);

// create Cloud Vision client
const visionClient = new ImageAnnotatorClient();

// create express app
const app = express();

// define path for file uploads
const uploadPath = path.join(__dirname, 'uploads');

// clear out any old uploads
if (fs.existsSync(uploadPath)) {
  fs.rmdirSync(uploadPath);
}

// configure multer to use the uploads folder
const upload = multer({ dest: 'uploads/' });

// we'll store the file path to the latest cat in memory
let latestCat;

// handle post requests with images to the /upload path
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.send(500);
      return;
    }
    
    // get the file path uploaded via multer
    const filePath = req.file.path;

    // send the image to gcloud for label detection
    const results = await visionClient.labelDetection(filePath);
    const labels = results[0].labelAnnotations.map(x => x.description);

    // check if we can has cat
    const hazCat = labels.includes('cat');

    if (hazCat) {
      latestCat = filePath;
      res.status(201).send('Thanx 4 has cat.');
    } else {
      res.status(400).send('No has cat!');
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// handle get requests to retrieve the last uploaded cat
app.get('/api/cat', async (req, res) => {
  if (latestCat) {
    res.sendFile(path.join(__dirname, latestCat));
  } else {
    res.status(404).send('No has any catz!');
  }
});

// start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));
