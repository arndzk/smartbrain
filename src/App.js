import React, { Component } from 'react';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/signin';
import Register from './components/Register/register';
import Navigation from './components/Navigation/navigation';
import Logo from './components/Logo/logo';
import Rank from './components/Rank/rank';
import ImageLinkForm from './components/ImageLinkForm/imagelinkform';
import FaceRecognition from './components/FaceRecognition/facerecognition';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '8a3167cf476440d4943f81df76da6731'
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render() {
    return (
      <div className='App'>
        <Particles className='particles'
          params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home'
          ? <div>
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange = {this.onInputChange} 
            onButtonSubmit = {this.onButtonSubmit}
          />
          <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
          </div>
          : (
              this.state.route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
      
    );
  }
}

export default App;
