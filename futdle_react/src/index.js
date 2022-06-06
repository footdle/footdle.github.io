import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import AppClone from './App/AppClone';
import IconApp from './App/IconApp';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-oldschool-dark'

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: false,
  offset: '30px',
  containerStyle:{
    'width':'90%'
  },
  // you can also just use 'scale'
  transition: transitions.SCALE
}

// const AlertTemplate = ({ style, options, message, close }) => (
//   <div style={{width:"90%", fontSize:"small", backgroundColor:"darkgray", borderRadius:"20px", padding: "10px"}} >
//     {message}
//     <center>
//     <button onClick={close}>Close</button>

//     </center>
//   </div>
// )

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
      <IconApp />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);