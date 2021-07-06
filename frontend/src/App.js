import { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import axios from 'axios'
import { format } from 'timeago.js'
import "./app.css"
import Register from './components/Register';
import Login from './components/Login'


function App() {
  const myStorage = window.localStorage
  const [currentUser, setCurrentUser]= useState()
  const [currentId, setCurrentId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [pins, setPins] = useState([]);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46.7577,
    longitude: 17.4376,
    zoom: 4
  });
  
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pin");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleClick = (id, lat, long) =>{
    setCurrentId(id)
    setViewport({ ...viewport, latitude: lat, longitude: long})
  }

  const handleAddClick = (e) =>{
    console.log(e)
    const [long, lat] = e.lngLat
    setNewPlace({
      lat,
      long
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newPin = {
      username: currentUser,  
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try {
      const res = await axios.post("/pin", newPin)
      setPins([...pins, res.data])
      setNewPlace(null)
    } catch (error) {
      console.log(error)
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user")
    setCurrentUser(null)
  }
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle={'mapbox://styles/neuer/ckpcl5un71swb17nzqgrg9pw2'}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick = { handleAddClick }
        transitionDuration='100'
      >
        {pins.map((p) => (
          <>
            <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7}>
              <Room 
                style={{ fontSize: viewport.zoom * 7, color: p.username === currentUser ? "tomato" : 'slateblue' , cursor: 'pointer' }}
                onClick={() => handleClick(p._id, p.lat, p.long)}
              ></Room>
            </Marker>
            {p._id === currentId && 
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left" 
              onClose={()=> setCurrentId(null)}>
              <div className="card">
                <label>Place</label>
                <h4 className='place'>{p.title}</h4>
                <label>Review</label>
                <p className='desc'>{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<Star className="star"/>)}
                </div>
                <label>Information</label>
                <span className="username">Created by <b>{p.username}</b></span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
            }
          </>
        ))}
        {newPlace && (
          <Popup
                latitude={newPlace.lat}
                longitude={newPlace.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left" 
                onClose={()=> setNewPlace(null)}>
                  <div>
                    <form onSubmit={handleSubmit}>
                      <label>Title</label>
                      <input placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)}/>
                      <label>Review</label>
                      <input placeholder="Say something about this place" onChange={(e) => setDesc(e.target.value)}/>
                      <label>Rating</label>
                      <select onChange={(e) => setRating(e.target.value)} >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button className="submitButton" type="submit">Add Pin</button>
                    </form>
                  </div>
            </Popup>
          )}
          {currentUser ? (<button className="button logout" onClick={handleLogout}>Log out</button >
          ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>Login</button >
            <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister}/>}
          {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      </ReactMapGL>
    </div>
  );
}

export default App;
