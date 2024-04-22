import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { HandleData, MainHandler, Get_To_Save, Handle_Render_Points, Handle_Render_Offline } from './Data';
import { GenerateFakeList } from './Constants';
import Place from './Place';
import { Calculate } from './Calculate';
import Form from './Form';

function App() {
  const [places, setPlaces] = useState(null);
  const [list, setList] = useState(null)

  useEffect(() => {
    if (list == null) {
    }
  })

  const Run = () => {
    //Handle_Render_Points();
    Handle_Render_Offline();
  }

  const RenderPlaces = () => {
    return (
      <div className='loading' id='loading_container'>
        <button onClick={() => Run()}> Run </button>
        {/* <h1 className='loadingTxt' id='loading'>Loading Places...</h1> */}
      </div>
    )
  }

  return (
    <div className="App">
      <Form />
      <ul className="App-header" id='container'>
        <RenderPlaces />
      </ul>
    </div>
  );
}

export default App;
