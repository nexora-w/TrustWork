import { combineReducers } from 'redux';
import TracksSliceReducer from './tracks';

const rootReducer = combineReducers({
  tracks: TracksSliceReducer,
});

export default rootReducer;
