import React, { useState } from 'react';
import './App.css';
import BabylonScene from './BabylonScene';
import PlaneInput from './PlaneInput';
import IcoSphereInput from './IcoSphereInput';
import CylinderInput from './CylinderInput';

function App() {
  const [objectSelected, setObjectSelected] = useState(null)
  const amplitude = 4
  const duration = 200

  const animateSelected = () => {
    document.dispatchEvent(new CustomEvent("animateObjectSelected"));
  }
  const getUIByObjectType = (object: any) => {
    let component = null
    switch (object.name) {
      case "IcoSphere":
        component = <IcoSphereInput model={objectSelected} animate={animateSelected} />
        break;
      case "Plane":
        component = <PlaneInput model={objectSelected} animate={animateSelected} />
        break;
      case "Cylinder":
        component = <CylinderInput model={objectSelected} animate={animateSelected} />
        break;
    }
    return component
  }

  return (
    <div className="main">
      {objectSelected &&
        getUIByObjectType(objectSelected)
      }
      <BabylonScene setObjectSelected={setObjectSelected} animationAmplitude={amplitude} animationDuration={duration} />
    </div>
  );
}

export default App;
