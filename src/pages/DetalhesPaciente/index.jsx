import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ArrowLeft } from '@phosphor-icons/react';
import { Spinner } from 'flowbite-react';
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

export default function DetalhesPaciente() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { paciente, token, idUser, nome } = state || {};
  const id = idUser;

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const emotionsPerPage = 5;
  const totalPages = Math.ceil((paciente?.emotions?.length || 0) / emotionsPerPage) || 1;
  const startIndex = (currentPage - 1) * emotionsPerPage;
  const selectedEmotions = (paciente?.emotions || [])
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(startIndex, startIndex + emotionsPerPage);

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  return (
    <div className="bg-[#3c5454] h-screen p-4 md:p-6">
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
          Detalhes do Paciente
        </h1>
        <span
          onClick={handleReturn}
          className="cursor-pointer hover:opacity-95 relative w-fit hidden md:block after:block after:content-[''] after:absolute after:h-[2px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
        >
          <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all text-white font-light">
            <ArrowLeft weight="bold" />
            Voltar
          </div>
        </span>
      </header>

      <main className="max-w-[1440px] mx-auto bg-white shadow-3D rounded-lg md:rounded-xl p-4 md:p-6 overflow-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-4 md:pb-6">
          <h2 className="text-xl md:text-2xl font-semibold">
            Registros de Emoções
          </h2>
          <h2 className="text-gray-400 text-sm sm:text-lg font-bold">
            {paciente?.name || "Paciente não identificado"}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner color="indigo" size="xl" />
          </div>
        ) : (
          <>
            {selectedEmotions.length > 0 ? (
              <ul className="space-y-4">
                {selectedEmotions.map((emotion) => (
                  <li key={emotion._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <p>
                      <strong>Data:</strong> {new Date(emotion.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Horário:</strong> {emotion.time || 'Horário não disponível'}
                    </p>
                    <p><strong>Emoção:</strong> {typeof emotion.feeling === 'function' ? emotion.feeling() : emotion.feeling}</p>
                    <p><strong>Descrição:</strong> {typeof emotion.description === 'function' ? emotion.description() : emotion.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Nenhum registro de emoção disponível.</p>
            )}

            
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
               
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`mx-1 px-4 py-2 border rounded-lg ${
                      currentPage === i + 1
                        ? "bg-[#00bfa6] text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
      
              </div>
            )}
          </>
        )}
      </main>

      <div className="flex justify-center md:hidden py-6">
        <Link
          className="mb-6 cursor-pointer hover:opacity-95 relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
          to="/principalPsico"
          state={{ token, id, nome: nome }}
        >
          <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all text-white font-light">
            <ArrowLeft weight="bold" />
            Voltar
          </div>
        </Link>
      </div>
    </div>
  );
}