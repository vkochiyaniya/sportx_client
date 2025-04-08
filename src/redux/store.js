// src/redux/store.js
import {
  legacy_createStore,
  combineReducers,
  compose,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import dataReducer from "./DataReducer/reducer";
import authReducer from "./AuthReducer/reducer";
import cartReducer from "./CartReducer/reducer";
import pagesReducer from "./PagesReducer/reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  data: dataReducer,
  cart: cartReducer,
  auth: authReducer,
  pages: pagesReducer
});

const store = legacy_createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export { store };