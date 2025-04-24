import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import App from "./App"; 
import Marcacoes from './Marcacoes'; 
import Mensagens from './Mensagens'; 

import "bootstrap/dist/css/bootstrap.min.css"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode> 
    <BrowserRouter> 
        <Routes> 
            <Route path="/" element={<App />} /> 
            <Route path="/marcacoes" element={<Marcacoes />} /> 
            <Route path="/mensagens" element={<Mensagens />} /> 
            
        </Routes> 
    </BrowserRouter> 
</React.StrictMode>); 