import React, { useEffect, useState } from 'react';
import './App.css';
import BabylonScene from './BabylonScene';
import PlaneInput from './PlaneInput';
import IcoSphereInput from './IcoSphereInput';
import CylinderInput from './CylinderInput';

function App() {
  const [objectSelected, setObjectSelected] = useState(null)
  const getUIByObjectType = (object: any) => {
    let component = null
    switch (object.name) {
      case "IcoSphere":
        component = <IcoSphereInput />
        break;
      case "Plane":
        component = <PlaneInput />
        break;
      case "Cylinder":
        component = <CylinderInput />
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
