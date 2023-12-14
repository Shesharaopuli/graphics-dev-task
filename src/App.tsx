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
        component = <IcoSphereInput model={objectSelected} />
        break;
      case "Plane":
        component = <PlaneInput model={objectSelected} />
        break;
      case "Cylinder":
        component = <CylinderInput model={objectSelected} />
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
