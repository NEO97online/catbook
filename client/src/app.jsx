import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from 'reactstrap';
import UploadButton from './upload-button';

class App extends Component {
  state = {
    loading: false,
    success: null,
    message: '',
    preview: null,
    cats: []
  };

  componentWillMount() {
    this.fetchCats();
  }

  fetchCat = (id) => {
    return new Promise(async (resolve) => {
      // fetch the cat image from our server
      const res = await fetch(`/api/cats/${id}`);
      const catBlob = await res.blob();
      // create an object URL to display in an <img> element
      const url = URL.createObjectURL(catBlob);
      // shift the cat into state
      this.setState(prevState => ({
        cats: [{ id, url }, ...prevState.cats]
      }), resolve);
    })
  };

  fetchCats = () => {
    this.setState({ cats: [] }, async () => {
      const res = await fetch('/api/cats');
      const { cats } = await res.json();
      for (const cat of cats) {
        await this.fetchCat(cat);
      }
    })
  };

  handleUpload = async (event) => {
    const file = event.currentTarget.files[0];
    const formData = new FormData();

    // show loading spinner
    this.setState({ loading: true, preview: null, message: '' });

    // add the file to the form data
    formData.append('image', file);

    try {
      // send the form data to our server
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      // parse the server response as json
      const { message } = await res.json();
      // we should receive a 201 response if successful
      const success = res.status === 201;
      this.setState({ success, message });

      // read the uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (success) {
          // shift the uploaded cat onto the state
          this.setState(prevState => ({
            cats: [{ id: prevState.cats.length, url: e.target.result }, ...prevState.cats]
          }));
        } else {
          this.setState({ preview: e.target.result });
        }
      }
      reader.readAsDataURL(file);

    } catch (err) {
      console.error(err);
    }

    // hide loading spinner
    this.setState({ loading: false });
  };

  render() {
    const { loading, success, message, preview, cats } = this.state;

    return (
      <>
        <Navbar color="light" light>
          <NavbarBrand href="/">CatBook</NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink href="https://github.com/michaelauderer/catbook" target="_blank">GitHub</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <div style={{ padding: 32 }}>
          {message && <h6>{message}</h6>}
          {preview && (
            <div className="crossed">
              <img src={preview} alt="upload preview" style={{ maxHeight: 300 }} />
            </div>
          )}
          <UploadButton
            onUpload={this.handleUpload}
            loading={loading} 
            success={success}
          >
            Upload Cat
          </UploadButton>
          <br />
          <br />
          <hr />
          <br />
          <h6>Recent cats:</h6>
          <br />
          {cats.map(cat => (
            <div key={cat.id}>
              <img src={cat.url} alt="cat" style={{ maxHeight: 300 }} />
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default App;
