import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "4693cb83a16a49439b6c46c07108f551";
const CLIENT_SECRET = "28ed9034361a4f3a93e63b0c676e5bae";


function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API Access Token
    let authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))

  }, [])

  // Search
  async function search() {
    console.log("Search for " + searchInput);

    // Get request using search to get Artist ID 
    let searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'appliciation/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    let artistId = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json()) 
      .then(data => { return data.artists.items[0].id})

    // Get request with Artist ID grab all the albums from that artist
    let returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        setAlbums(data.items);
      });
    

    // Display those albums to the user

  }
  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl 
            placeholder='Search For Artist'
            type='input'
            onKeyDown={event => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={event => {setSearchInput(event.target.value)}}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map((album, index) => {
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>  
                </Card.Body> 
              </Card>
            )
          })}
          


        </Row>
        
      </Container>
    </div>
  );
}

export default App;
