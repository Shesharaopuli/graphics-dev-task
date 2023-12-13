import React, { useEffect, useState } from 'react';
import './App.css';
import BabylonScene from './BabylonScene';
import PlaneInput from './PlaneInput';

function App() {
  const [objectSelected, setObjectSelected] = useState(null)
  const getUIByObjectType = (object: any) => {
    let component = null
    switch (object.name) {
      case "IcoSphere":
        component = <PlaneInput />
        break;
      case "Plane":
        component = <PlaneInput />
        break;
      case "Cylinder":
        break;
    }
    return component
  }
  return (
    <div className="main">
      {objectSelected &&
        getUIByObjectType(objectSelected)
      }
      <BabylonScene setObjectSelected={setObjectSelected} />
    </div>
  );
}

export default App;
