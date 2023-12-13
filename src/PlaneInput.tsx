import { useReducer } from "react";

// Define the state type
interface PlaneState {
    width: number;
    height: number;
    depth: number;
}
type PlaneAction =
    | { type: 'UPDATE_WIDTH'; payload: number }
    | { type: 'UPDATE_HEIGHT'; payload: number }
    | { type: 'UPDATE_DEPTH'; payload: number };

const reducer = (state: PlaneState, action: PlaneAction): PlaneState => {
    switch (action.type) {
        case 'UPDATE_WIDTH':
            return { ...state, width: action.payload };
        case 'UPDATE_HEIGHT':
            return { ...state, height: action.payload };
        case 'UPDATE_DEPTH':
            return { ...state, depth: action.payload };
        default:
            return state;
    }
};
const PlaneInput = () => {
    const initialState = { width: 0.5, height: 0.5, depth: 0.5 };
    const [state, dispatch] = useReducer(reducer, initialState);
    // Action creators to dispatch actions for each input
    const updateWidth = (value: any) => dispatch({ type: 'UPDATE_WIDTH', payload: value });
    const updateHeight = (value: any) => dispatch({ type: 'UPDATE_HEIGHT', payload: value });
    const updateDepth = (value: any) => dispatch({ type: 'UPDATE_DEPTH', payload: value });

    const updateObject = () => {
        console.log(state)
    }
    return (
        <div className="controls-container">
            <div className="control">
                <label htmlFor="plane-width">
                    Width:
                    <input type="number" value={state.width} step="0.1" min="0.1" max="5.0" onChange={(e) => updateWidth(parseFloat(e.target.value))} name="plane-width" id="plane-width" placeholder="Width" />
                </label>
            </div>
            <div className="control">
                <label htmlFor="plane-height">
                    Height:
                    <input type="number" value={state.height} step="0.1" min="0.1" max="5.0" onChange={(e) => updateHeight(parseFloat(e.target.value))} name="plane-height" id="plane-height" placeholder="Height" />
                </label>
            </div>
            <div className="control">
                <label htmlFor="plane-depth">
                    Depth:
                    <input type="range" value={state.depth} onChange={(e) => updateDepth(parseFloat(e.target.value))} step="0.1" min="0.1" max="2.0" name="plane-depth" id="plane-depth" placeholder="Depth" />
                </label>
            </div>
            <div className="control">
                <button type="submit" onClick={updateObject}>Apply</button>
            </div>
        </div>
    )
};

export default PlaneInput;
