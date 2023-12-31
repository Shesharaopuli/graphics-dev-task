import { TransformNode, Vector3 } from "babylonjs";
import { useReducer } from "react";

// Define the state type
interface IcoSphereState {
    radius: number;
    subdivisions: number;
}
type IcoSphereAction =
    | { type: 'UPDATE_RADIUS'; payload: number }
    | { type: 'UPDATE_SUBDIVISIONS'; payload: number }

const reducer = (state: IcoSphereState, action: IcoSphereAction): IcoSphereState => {
    switch (action.type) {
        case 'UPDATE_RADIUS':
            return { ...state, radius: action.payload };
        case 'UPDATE_SUBDIVISIONS':
            return { ...state, subdivisions: action.payload };
        default:
            return state;
    }
};
export const ICO_SPHERE_DEFAULTS = { radius: 1, subdivisions: 5 };
interface BabylonSceneProps {
    model: TransformNode | null;
    animate: () => void
}
const IcoSphereInput: React.FC<BabylonSceneProps> = ({ model, animate }) => {
    const [state, dispatch] = useReducer(reducer, ICO_SPHERE_DEFAULTS);
    // Action creators to dispatch actions for each input
    const updateRadius = (value: any) => dispatch({ type: 'UPDATE_RADIUS', payload: value });
    const updateSubDivisions = (value: any) => dispatch({ type: 'UPDATE_SUBDIVISIONS', payload: value });

    const updateObject = () => {
        const { radius } = state
        if (model) {
            model.scaling = new Vector3(radius, radius, radius); // Adjust scaling based on radius
        }
    }
    return (
        <div className="controls-container">
            <div className="control">
                <label>Selected: <strong>{model?.name}</strong>
                </label>
            </div>
            <div className="control">
                <label htmlFor="ico-sphere-radius">
                    Radius:
                    <input type="number" value={state.radius} step="0.1" min="0.1" max="2.0" onChange={(e) => updateRadius(parseFloat(e.target.value))} name="ico-sphere-radius" id="ico-sphere-radius" placeholder="Radius" />
                </label>
            </div>
            <div className="control">
                <label htmlFor="ico-sphere-subdivisions">
                    Sub Divisions:
                    <input type="number" value={state.subdivisions} step="1" min="1" max="10" onChange={(e) => updateSubDivisions(parseFloat(e.target.value))} name="ico-sphere-subdivisions" id="ico-sphere-subdivisions" placeholder="Sub Divisions" />
                </label>
            </div>
            <div className="control">
                <button type="submit" className="btn-default btn-primary" onClick={updateObject}>Apply</button>
                <button type="submit" className="btn-default btn-secondary" onClick={animate}>Animate</button>
            </div>
        </div>
    )
};

export default IcoSphereInput;
