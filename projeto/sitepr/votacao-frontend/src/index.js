import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import App from "./App"; 
import EsqueceuSenha from './EsqueceuSenha';
import CriarConta from './CriarConta';
import PaginaPrincipal from './PaginaPrincipal';
import Perfil from './Perfil';
import Marcacoes from './Marcacoes'; 
import MinhasMarcacoes from './MinhasMarcacoes'; 
import Mensagens from './Mensagens'; 
import CriarAula from './CriarAula'; // ou o caminho correto


import "bootstrap/dist/css/bootstrap.min.css"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode> 
    <BrowserRouter> 
        <Routes> 
            <Route path="/" element={<App />} />
            <Route path="/criarConta" element={<CriarConta />} />
            <Route path="/esqueceuSenha" element={<EsqueceuSenha />} /> 
            <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/marcacoes" element={<Marcacoes />} /> 
            <Route path="/minhasmarcacoes" element={<MinhasMarcacoes />} /> 
            <Route path="/mensagens" element={<Mensagens />} /> 
            <Route path="/criarAula" element={<CriarAula />} />
            
        </Routes> 
    </BrowserRouter> 
</React.StrictMode>); 