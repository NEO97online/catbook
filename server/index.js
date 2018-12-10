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

// configure a destination for file uploads
const upload = multer({ dest: 'uploads/' });

// handle post requests with images to the /upload path
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    // send the image to gcloud for label detection
    const results = await visionClient.labelDetection(req.file.path);
    const labels = results[0].labelAnnotations.map(x => x.description);

    // check if we can has cat
    const hazCat = labels.includes('cat');

    if (hazCat) {
      res.status(201).send('Thanx 4 has cat.');
    } else {
      res.status(400).send('No has cat!');
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
})

// start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));
