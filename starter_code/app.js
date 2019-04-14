const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
// Spotify credentials

const clientId = "792ed61137d24fe584aa8e310238c95a",
  clientSecret = "a43132432d3940e191f5ef2f7bed3fe4";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    // console.log(data)
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

//when user search for an artist
app.get("/artists", (req, res) => {
  const query = req.query.name; //get the query from the form name="name"
  spotifyApi
    .searchArtists(query)
    .then(data => {
      // console.log(data)
      //console.log(data.body.artists.items[0].images[0])
      const artists = data.body.artists.items;

      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

//when user serach for an artist's albumns
app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId, { limit: 10, offset: 20 }).then(
    function(data) {
      //   console.log("Album information", data.body);
      const albums = data.body.items;

      res.render("albums", { albums });
    },
    function(err) {
      console.error(err);
    }
  );
});

//view album tracks
app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId).then(
    tracks => {
      const albumTracks = tracks.body.items;
      res.render("tracks", { albumTracks });
    },
    err => {
      console.log("Somthing went wrong", err);
    }
  );
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
