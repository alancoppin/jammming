const clientID = '2c663c13181a46d39a812e5c5c62a3b8';
const redirectURI = "http://spotifyapp.surge.sh";

let userAccessToken;

const Spotify = {
  getAccessToken(){
    if(userAccessToken){
      return userAccessToken;
    }else{
      let url = window.location.href;
      let accessToken = url.match(/access_token=([^&]*)/);
      let expireToken = url.match(/expires_in=([^&]*)/);

      //console.log(url);
      //console.log(accessToken);
      //console.log(expireToken);

      if(accessToken!==null && expireToken!==null){
        userAccessToken = accessToken[1];
        return userAccessToken;
      }else{
        window.setTimeout(() => userAccessToken = '', expireToken * 1000);
        window.history.pushState('Access Token', null, '/');
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      }
    };
  },

  search(searchTerm){
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,{
      headers: {
        Authorization: `Bearer ${userAccessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
        if(jsonResponse.tracks.items){
          return jsonResponse.tracks.items.map(track => ({
            id : track.id,
            name : track.name,
            artist : track.artists[0].name,
            album : track.album.name,
            uri : track.uri
          }));
        }else{
          return [];
        }
    });
  },

  savePlaylist(playlistName,playlistURIs){
    if(playlistName && playlistURIs){
      let headers =  {
          Authorization: `Bearer ${userAccessToken}`
        };
      let userId = '';
      fetch('https://api.spotify.com/v1/me',{
        headers : headers
      }).then(response =>{
        return response.json();
      }).then(jsonResponse =>{
        userId = jsonResponse.id;

        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
          headers : headers,
          method : 'POST',
          body : JSON.stringify({name : playlistName})
        }).then(response=>{
          return response.json();
        }).then(jsonResponse => {
          let playlistId = jsonResponse.id;

          fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
            headers : headers,
            method : 'POST',
            body : JSON.stringify({
              uris : playlistURIs
            })
          }).then(response => {
            return response.json();
          }).then(jsonResponse => {
            console.log(jsonResponse.snapshot_id);
            playlistId = jsonResponse.snapshot_id;
          })

        });

      });


    }else{
      return 'not defined';
    }
  }

};

export default Spotify;
