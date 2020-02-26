import React, { Component } from "react";
import * as $ from "jquery";
//import hash from "./hash";
import Player from "./Player";
import "./App.css";

export const authEndpoint = 'https://accounts.spotify.com/authorize';
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "36b862dd37654a75a30667cc5317f766";
const redirectUri = "http://localhost:3000/";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];
// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      some: '' ,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0
      },
      is_playing: "Paused",
      progress_ms: 0
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this)
  }
  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token,
        some: 'new state'
      });
    }
  }

  getCurrentlyPlaying(token) {
    // Make a call using the token
    console.log(token)
    var that = this;
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/currently-playing",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data,status, xhr) =>{
        
        if ( xhr.status === 200){
          console.log(data)
          console.log(this.state)
          that.setState({
            item: data.item,
            is_playing: data.is_playing,
            progress_ms: data.progress_ms 
          });
        }
        console.log(this.state)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status)
        console.log(thrownError);
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.getCurrentlyPlaying(this.state.token)}
          {
          this.state.token && (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.progress_ms}
            />
          )
          }
        </header>
      </div>
    );
  }
}

export default App;
