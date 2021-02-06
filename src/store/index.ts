import {createStore,compose,applyMiddleware} from 'redux'
import {composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'
import reducer from './reducer'
const composeEnhancers = composeWithDevTools || compose;
const store = createStore(reducer,composeEnhancers(applyMiddleware(thunk)))
export default store