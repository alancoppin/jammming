import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults : [],
      playlistName : 'New playlist',
      playlistTracks : []
    }

    this.addTrack = this.addTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(!this.state.playlistTracks.find(t => (track.id === t.id))) {
      tracks.push(track);
      this.setState({
        playlistTracks: tracks
      });
    }
}

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks.filter(item => {
      if(item.id===track.id){
        let indexTrack = tracks.indexOf(track.id);
        tracks.splice(indexTrack,1);
      }
    })
    this.setState({playlistTracks:tracks});
  }


  updatePlaylistName(name){
    this.setState({playlistName:name});
  }


  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(item => {
      return "spotify:track:"+item.id+"";
    });
    Spotify.savePlaylist(this.state.playlistName,trackURIs);
    this.setState({
      playlistName : "New playlist",
      playlistTracks : []
    });
  }

  search(searchTerm){
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults : searchResults})
    })
  }


  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} spotify={Spotify.getAccessToken}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
