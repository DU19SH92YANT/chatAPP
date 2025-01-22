
import './App.css'

import { Provider } from "react-redux";
import store from "./redux/store";
import Routers from './Router';
import { BrowserRouter  } from "react-router-dom";

import  AppBar  from './UIComponent/AppBar';



function App() {
  



  return (
    <>
   
       <Provider store={store}>
       <BrowserRouter>
       <AppBar />
      
      <Routers />
      </BrowserRouter>
    </Provider>
    </>
  )
}

export default App




