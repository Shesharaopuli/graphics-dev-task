import { TransformNode } from "babylonjs";
import { useReducer } from "react";

// Define the state type
interface CylinderState {
    diameter: number;
    height: number;
}
type CylinderAction =
    | { type: 'UPDATE_DIAMETER'; payload: number }
    | { type: 'UPDATE_HEIGHT'; payload: number }

const reducer = (state: CylinderState, action: CylinderAction): CylinderState => {
    switch (action.type) {
        case 'UPDATE_DIAMETER':
            return { ...state, diameter: action.payload };
        case 'UPDATE_HEIGHT':
            return { ...state, height: action.payload };
        default:
            return state;
    }
};
export const CYLINDER_DEFAULTS = { diameter: 0.5, height: 1 };
interface BabylonSceneProps {
    model: TransformNode | null;
}
const CylinderInput: React.FC<BabylonSceneProps> = ({ model }) => {
    const [state, dispatch] = useReducer(reducer, CYLINDER_DEFAULTS);
    // Action creators to dispatch actions for each input
    const updateDiameter = (value: any) => dispatch({ type: 'UPDATE_DIAMETER', payload: value });
    const updateHeight = (value: any) => dispatch({ type: 'UPDATE_HEIGHT', payload: value });

    const updateObject = () => {
        console.log(state)
    }
    return (
        <div className="controls-container">
            <div className="control">
                <label>Selected: <strong>{model?.name}</strong>
                </label>
            </div>
            <div className="control">
                <label htmlFor="cylinder-diameter">
                    Diameter:
                    <input type="number" value={state.diameter} step="0.1" min="0.1" max="2.0" onChange={(e) => updateDiameter(parseFloat(e.target.value))} name="cylinder-diameter" id="cylinder-diameter" placeholder="Diameter" />
                </label>
            </div>
            <div className="control">
                <label htmlFor="ico-sphere-subdivisions">
                    Height:
                    <input type="number" value={state.height} step="0.1" min="0.1" max="2" onChange={(e) => updateHeight(parseFloat(e.target.value))} name="cylinder-height" id="cylinder-height" placeholder="Height" />
                </label>
            </div>
            <div className="control">
                <button type="submit" onClick={updateObject}>Apply</button>
            </div>
        </div>
    )
};

export default CylinderInput;
