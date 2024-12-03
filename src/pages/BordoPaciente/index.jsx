import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from 'sonner';
import { ArrowLeft, ExclamationMark } from "@phosphor-icons/react";
import { Spinner } from "flowbite-react";
import { http } from "../../App";
import Notification from "../../components/Notification";

const showNotification = ({ name, description, type, time = "Agora" }) => {
  toast(
    <Notification
      name={name}
      description={description}
      time={time}
      type={type}
    />
  );
};

const handleErroResponse = (error) => {
  const errorMsg = error.response?.data?.msg || "Erro ao processar a solicitação.";
  if(error.response?.status){
    showNotification({
      name: `Erro ${error.response?.status}`,
      description: errorMsg,
      type: "error",
    });
  } else {
    showNotification({
      name: "Erro de conexão",
      description: "Não foi possível se conectar ao servidor.",
      type: "error",
    });
  }
};

export default function BordoPaciente() {
  const { state } = useLocation();
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const [pacienteNome, setPacienteNome] = useState("");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Estado recebido:", state); 
    if (!state?.token || !state?.id || !state?.nome) {
      const storedToken = localStorage.getItem('token');
      const storedId = localStorage.getItem('id');
      const storedNome = localStorage.getItem('nome');

      if (!storedToken || !storedId || !storedNome) {
        showNotification({
          name: "Aviso!",
          description: "Dados insuficientes. Redirecionando para a página principal.",
          type: "warning",
        });
        navigate("/principalCliente");
      } else {
        setToken(storedToken);
        setId(storedId);
        setPacienteNome(storedNome);
        fetchReports(storedId, storedToken);
      }
    } else {
      setToken(state.token);
      setId(state.id);
      setPacienteNome(state.nome);
      localStorage.setItem('token', state.token);
      localStorage.setItem('id', state.id);
      localStorage.setItem('nome', state.nome);
      fetchReports(state.id, state.token);
    }
  }, [navigate, state]);

  const fetchReports = async (id, token) => {
    console.log("ID do Paciente:", id); 
    console.log("Token:", token); 
    try {
        const response = await http.get(`https://api-mypeace.vercel.app/getAll/reports/psychologist/pacient/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Resposta da API:", response); 
        setReports(response.data.reports); 
        
    } catch (error) {
        console.error("Erro ao buscar relatórios:", error.response ? error.response.data : error.message);
        handleErroResponse(error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReturn = () => {
    const returnToken = token || localStorage.getItem('token');
    const returnId = id || localStorage.getItem('id');
    const returnNome = pacienteNome || localStorage.getItem('nome');

    if (!token) setToken(returnToken);
    if (!id) setId(returnId);
    if (!pacienteNome) setPacienteNome(returnNome);

    navigate("/principalCliente", { state: { token: returnToken, id: returnId, nome: returnNome } });
  };

  return (
    <div className="bg-[#3c5454] min-h-screen p-6">
      <Toaster
        expand
        position="top-center"
        richColors
        toastOptions={{
          style: {
            margin: "10px",
            padding: "15px",
            maxWidth: "500px",
            borderRadius: "8px",
            gap: "10px",
            boxShadow: "none",
            background: "transparent",
            border: "none",
          },
        }}
      />

      <header className="flex flex-col md:flex-row items-center justify-between max-w-[1440px] mx-auto mb-4 md:mb-6">
        <h1 className="text-2xl md:text-4xl py-4 text-white text-center font-semibold">
          Diario de Bordo
        </h1>
        <span onClick={handleReturn} className="cursor-pointer hover:opacity-95 relative w-fit hidden md:block">
          <Link
            className="cursor-pointer relative w-fit block after:block after:content-[''] 
            after:absolute after:h-[2px] after:bg-white text-white after:w-full after:scale-x-0 
            after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
            to="/principalCliente"
            state={{ token, id, nome: pacienteNome }}
          >
            <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all text-white font-light">
              <ArrowLeft weight="bold" />
              Voltar
            </div>
          </Link>
        </span>
      </header>

      <main className="max-w-[1440px] mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner color="indigo" size="xl" />
            </div>
          ) : reports.length > 0 ? (
            reports.map((report, index) => (
              <div key={index} className="mb-4 p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-2 text-gray-700">Relatório da sua última consulta</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 font-medium">Tópicos Abordados:</p>
                    <p className="text-gray-600">{report.topics}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Desafios e Dificuldades:</p>
                    <p className="text-gray-600">{report.challenges}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Tarefas para o Cliente:</p>
                    <p className="text-gray-600">{report.tasks}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Observações:</p>
                    <p className="text-gray-600">{report.observations}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Progressos Notáveis:</p>
                    <p className="text-gray-600">{report.progress}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-lg">
              <div className="cursor-pointer w-full p-4 rounded relative overflow-hidden group bg-white shadow-3D" onClick={handleReturn}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
                <ExclamationMark className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                <ArrowLeft className="mb-2 text-2xl text-green-600 group-hover:text-white transition-colors relative z-10 duration-300" />
                <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300 text-center sm:text-left">
                  O psicólogo ainda não enviou nenhum relatório.
                </h3>
                <p className="text-slate-400 group-hover:text-green-200 relative z-10 duration-300 mt-2  text-center sm:text-left">
                  Continue praticando as tarefas discutidas e nos veremos na próxima consulta.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="flex justify-center md:hidden py-6">
        <span onClick={handleReturn} className="cursor-pointer hover:opacity-95 relative w-fit block">
          <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all text-white">
            <ArrowLeft />
            Voltar
          </div>
        </span>
      </div>
    </div>
  );
}