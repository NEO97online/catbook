import React, { Component } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import UploadButton from './upload-button';

class App extends Component {
  state = {
    loading: false,
    success: null,
    message: '',
    latestCat: null
  };

  componentWillMount() {
    this.fetchCat();
  }

  fetchCat = async () => {
    const res = await fetch('/api/cat');

    if (res.status === 200) {
      const catBlob = await res.blob();
      this.setState({ 
        latestCat: URL.createObjectURL(catBlob)
      });
    }
  }

  handleUpload = async (event) => {
    const file = event.currentTarget.files[0];
    const formData = new FormData();

    // show loading spinner
    this.setState({ loading: true });

    // add the file to the form data
    formData.append('image', file);

    try {
      // send the form data to our server
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      // parse the server response as text
      const data = await res.text();
      this.setState({ success: res.status === 201, message: data });

      // update the latest cat
      this.fetchCat();
    } catch (err) {
      console.error(err);
    }

    // hide loading spinner
    this.setState({ loading: false });
  };

  render() {
    const { loading, success, message, latestCat } = this.state;

    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Can has cats?
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ padding: 32 }}>
          <div>
            Please upload your cats below.
          </div>
          <br />
          <UploadButton
            onUpload={this.handleUpload}
            loading={loading} 
            success={success}
          >
            { message || 'Upload' }
          </UploadButton>
          <br />
          <br />
          {latestCat && <img src={latestCat} alt="cat" />}
        </div>
      </>
    );
  }
}

export default App;
