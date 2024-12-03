import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner';  
import { ArrowLeft } from "@phosphor-icons/react";
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



export default function Relatorio() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { paciente, token, idUser, nome } = state || {};
  const id = idUser;

  const idPsicologo = idUser; 
  const idPacient = paciente?._id; 

  const [isLoading, setIsLoading] = useState(true);
  const [topics, setTopics] = useState("");
  const [observations, setObservations] = useState("");
  const [progress, setProgress] = useState("");
  const [challenges, setChallenges] = useState("");
  const [tasks, setTasks] = useState("");

  useEffect(() => {
    console.log("Estado recebido em DetalhesPaciente:", { paciente, token, idUser, nome });

    if (!paciente || !token || !idUser || !nome) {
      const storedToken = localStorage.getItem('token');
      const storedIdUser = localStorage.getItem('idUser');
      const storedNome = localStorage.getItem('nome');

      if (storedToken && storedIdUser && storedNome) {
        setToken(storedToken);
        setId(storedIdUser);
        setPacienteNome(storedNome);
      } else {
        showNotification({
          name: "Aviso!",
          description: "Dados insuficientes. Redirecionando para a página principal.",
          type: "warning",
        });
        navigate("/principalPsico/registropaciente");
      }
    } else {
      localStorage.setItem('token', token);
      localStorage.setItem('idUser', idUser);
      localStorage.setItem('nome', nome);

      console.log("Dados armazenados no estado:", { token, idUser, nome });
      console.log("Dados armazenados no localStorage:", {
        token: localStorage.getItem('token'),
        idUser: localStorage.getItem('idUser'),
        nome: localStorage.getItem('nome'),
      });

      setIsLoading(false);
    }
  }, [token, idUser, nome, paciente, navigate]);

//Voltar para a página anterior
  const handleReturn = () => {
    localStorage.setItem('token', token);
    localStorage.setItem('idUser', idUser);
    localStorage.setItem('nome', nome);

    if (!nome) {
      showNotification({
        name: "Aviso!",
        description: "Erro: Nome não encontrado. Redirecionando para a página principal.",
        type: "warning",
      });
      navigate("/principalPsico/registropaciente");
    } else {
      navigate("/principalPsico/registropaciente", { state: { token, idUser: idUser, id, nome: nome } });
    }
  };
  
//Envia o relátorio 
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
  
      // Verifique se o idPacient está definido
      if (!idPacient) {
        showNotification({
          name: "Erro!",
          description: "ID do paciente não está definido.",
          type: "error",
        });
        return;
      }
      
      console.log("Dados enviados:", {
        topics,
        observations,
        progress,
        challenges,
        tasks,
      });

      const response = await http.post(
        `https://api-mypeace.vercel.app/register/report/psychologist/${idPsicologo}/${idPacient}`, 
        {
          topics,
          observations,
          progress,
          challenges,
          tasks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showNotification({
        name: "Sucesso!",
        description: "Relatório enviado com sucesso.",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao enviar relatório:", error); 
      handleErroResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#3c5454] min-h-screen p-4 sm:p-6">
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

      <header className="flex flex-col sm:flex-row items-center justify-between max-w-[1440px] mx-auto mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-4xl py-4 text-white text-center font-semibold">
          Relatório
        </h1>
        <span
          onClick={handleReturn}
          className="cursor-pointer hover:opacity-95 relative w-fit hidden sm:block after:block after:content-[''] after:absolute after:h-[2px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
        >
          <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all text-white font-light">
            <ArrowLeft weight="bold" />
            Voltar
          </div>
        </span>
      </header>

      <main className="max-w-[1440px] mx-auto bg-white shadow-3D rounded-lg p-4 sm:p-6">
        <div className="mb-6 p-4 rounded-lg shadow-sm overflow-x-auto mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner color="indigo" size="xl" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Registro do paciente</h2>
              <p className="text-gray-600 mb-6">Nome do paciente: {paciente?.name || "Paciente não identificado"}</p> 
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tópicos Abordados:</label>
                  <textarea
                    className="w-full h-24 p-3 mt-1 bg-gray-100 text-gray-700 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-shadow"
                    placeholder="Escreva sobre os tópicos abordados..."
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Observações:</label>
                  <textarea
                    className="w-full h-24 p-3 mt-1 bg-gray-100 text-gray-700 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-shadow"
                    placeholder="Escreva suas observações..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Progressos Notáveis:</label>
                  <textarea
                    className="w-full h-24 p-3 mt-1 bg-gray-100 text-gray-700 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-shadow"
                    placeholder="Escreva sobre os progressos notáveis..."
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Desafios e Dificuldades:</label>
                  <textarea
                    className="w-full h-24 p-3 mt-1 bg-gray-100 text-gray-700 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-shadow"
                    placeholder="Escreva sobre os desafios e dificuldades..."
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tarefas para o Cliente:</label>
                  <textarea
                    className="w-full h-24 p-3 mt-1 bg-gray-100 text-gray-700 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-shadow"
                    placeholder="Escreva sobre as tarefas para o cliente..."
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSubmit}
                  className="bg-[#00bfa6] rounded-lg hover:opacity-90 transition-opacity text-white font-semibold py-2 px-4"
                >
                  Enviar Relatório
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="flex justify-center sm:hidden py-6">
        <span
          onClick={handleReturn}
          className="cursor-pointer hover:opacity-95 relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
        >
          <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all text-white font-light">
            <ArrowLeft weight="bold" />
            Voltar
          </div>
        </span>
      </div>
    </div>
  );
}
