import { combineReducers } from 'redux';
export  { ActiveTaskListener } from './ActiveTaskListener';

import { reduce as activeTasksReducer } from './ActiveTaskState';


// Register your redux store under a unique namespace
export const namespace = 'queuesStatsCustomizations';

// Combine the reducers
export default combineReducers({
  activeTasksSummary: activeTasksReducer,
});