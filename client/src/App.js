import React, { Component } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import UploadButton from './components/upload-button';
import './App.css';

class App extends Component {
  state = {
    loading: false,
    success: null,
    message: ''
  };

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

      this.setState({ success: res.status === 201, message: data })
    } catch (err) {
      console.error(err);
    }

    // hide loading spinner
    this.setState({ loading: false });
  };

  render() {
    const { loading, success, message } = this.state;

    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Can has cats?
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="container">
          <div>
            Please upload your cats below.
          </div>
          <br />
          <UploadButton onUpload={this.handleUpload} loading={loading} success={success}>
            { message || 'Upload' }
          </UploadButton>
        </div>
      </>
    );
  }
}

export default App;
