import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from 'axios';
import Home from "./pages/Home";
import Pagina404 from "./pages/404";
import CadastroPsicologo from "./pages/Cadastro";
import PrincipalCliente from "./pages/PrincipalCliente";
import Login from "./pages/Login";
import PrincipalPsico from "./pages/PrincipalPsico";
import ListaPaciente from "./pages/ListaPaciente";
import CadastroPaciente from "./pages/CadastroCliente";
import Cronometro from "./pages/Cronometro";
import RegistroEmocoes from "./pages/RegistroEmocoes";
import Diario from "./pages/Diario";
import RegistroPacientes from "./pages/RegistroPacientes";
import DetalhesPaciente from "./pages/DetalhesPaciente";
import BordoPaciente from "./pages/BordoPaciente";
import Relatorio from "./pages/Relatorio";

export const http = axios.create({
  baseURL: 'https://api-mypeace.vercel.app/'
});

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        {/* Rotas da Home */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Pagina404 />} />

        {/* Rotas do Psicólogo */}
        <Route path="/principalPsico" element={<PrincipalPsico />} />
        <Route path="/principalPsico/listapaciente" element={<ListaPaciente />} />
        <Route path="/principalPsico/registropaciente" element={<RegistroPacientes />} />
        <Route path="/principalPsico/registropaciente/detalhesPaciente" element={<DetalhesPaciente />} />
        <Route path="/principalPsico/registropaciente/relatorio" element={<Relatorio/>} />  
        <Route path="/cadastroPsicologo" element={<CadastroPsicologo />} />

        {/* Rotas do Cliente */}
        <Route path="/principalCliente" element={<PrincipalCliente />} />
        <Route path="/principalCliente/cronometro" element={<Cronometro />} />
        <Route path="/principalCliente/registroemocoes" element={<RegistroEmocoes />} />
        <Route path="/principalCliente/diario" element={<Diario />} />
        <Route path="/principalCliente/diariobordo" element={<BordoPaciente/>} /> 
        <Route path="/cadastroCliente" element={<CadastroPaciente />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
