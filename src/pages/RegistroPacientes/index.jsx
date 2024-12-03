import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ArrowLeft, Eye, MagnifyingGlass, Notepad } from '@phosphor-icons/react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import CustomDropdown from '../../components/DropDowm';
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


export default function RegistroPacientes() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({ pacientes: true, emociones: false });

  useEffect(() => {
    if (!state?.token || !state?.id || !state?.nome) {
      navigate("/login");
    } else {
      setToken(state.token);
      setId(state.id);
      fetchPacientesAndEmotions(state.token, state.id);
    }
  }, [navigate, state]);

  async function fetchPacientesAndEmotions(token, idUser) {
    setLoading({ ...loading, pacientes: true });
    try {
      const response = await axios.get(
        `https://api-mypeace.vercel.app/getAll/pacients/${idUser}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const pacientesData = response.data.allPacients;

      setLoading({ ...loading, emociones: true });
      const updatedPacientes = await Promise.all(
        pacientesData.map(async (paciente) => {
          const emotions = await fetchEmociones(token, paciente._id);
          return { ...paciente, emotions };
        })
      );

      setPacientes(updatedPacientes);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        showNotification({
          name: "Avisp!",
          description: "Sessão expirada. Por favor, faça login novamente.",
          type: "warning",
        });
        navigate("/login");
      } else {
        showNotification({
          name: "Erro!",
          description: "Erro ao buscar pacientes. Por favor, tente novamente mais tarde.",
          type: "error",
        });
      }
    } finally {
      setLoading({ pacientes: false, emociones: false });
    }
  }

  async function fetchEmociones(token, idPaciente) {
    try {
      const response = await axios.get(
        `https://api-mypeace.vercel.app/getAll/reports/${idPaciente}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.reports; 
    } catch (error) {
      showNotification({
        name: "Erro!",
        description: "Erro ao buscar emoções. Por favor, tente novamente mais tarde.",
        type: "error",
      });
      return [];
    }
  }

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = pacientes.slice(indexOfFirstPatient, indexOfLastPatient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredPacientes = currentPatients.filter((paciente) => {
    return paciente.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleVerificarClick = (paciente) => {
    navigate("/principalPsico/registropaciente/detalhesPaciente", {
      state: { paciente, token, idUser: id, nome: state.nome },
    });
  };
 
  const handleRelatorioClick = (paciente) => {
    navigate('/principalPsico/registropaciente/relatorio', { 
      state: { paciente, token, idUser: id, nome: state.nome },
    });
  };
  
  const handleReturn = () => {
    navigate("/principalPsico", { state: { token, id, nome: state?.nome } });
  };

  return (
    <div className="bg-[#3c5454] h-screen p-6">
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
      <header className="flex flex-col md:flex-row items-center justify-between max-w-[1440px] mx-auto mb-6">
        <h1 className="text-4xl py-6 md:py-12 text-white text-center font-semibold">
          Lista de Registros
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

      <main className="max-w-[1440px] mx-auto bg-white shadow-3D rounded-xl p-6">
        {loading.pacientes ? (
          <div className="flex justify-center items-center h-64">
            <Spinner color="indigo" size="xl" />
          </div>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <MagnifyingGlass size={24} className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-700 border border-green-300 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-left text-sm md:text-base">
                <thead>
                  <tr className="text-left">
                    <th className="whitespace-nowrap px-4 py-2 ">Nome</th>
                    <th className="whitespace-nowrap px-4 py-2 ">Data</th>
                    <th className="whitespace-nowrap px-4 py-2 ">Horário</th>
                    <th className="whitespace-nowrap px-4 py-2 ">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPacientes.length > 0 ? (
                    filteredPacientes.map((paciente) => (
                      <tr key={paciente._id}>
                        <td className=" px-4 py-2">{paciente.name}</td>
                        <td className=" px-4 py-2">
                          {paciente.emotions.length > 0
                            ? new Date(paciente.emotions[paciente.emotions.length - 1].date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-4 py-2">
                          {paciente.emotions.length > 0 ? (
                            <span>
                               {paciente.emotions[paciente.emotions.length - 1].time}
                            </span>
                          ) : (
                            'Nenhuma emoção'
                          )}
                        </td>
                      
                        <td className="px-6 py-2 space-x-2 relative">
                          <CustomDropdown 
                            buttonText="Ações" 
                            menuItems={[
                              { key: "Verificar", label: "Verificar", icon : <Eye className="text-[#00bfa6]" /> , onClick: () => handleVerificarClick(paciente) },
                              { key: "Relatório", label: "Relatório", icon: <Notepad className="text-[#00bfa6]" />, onClick: () => handleRelatorioClick(paciente) }
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="border px-4 py-2 text-center">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pacientes.length > patientsPerPage && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(pacientes.length / patientsPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-4 py-2 border rounded-lg ${currentPage === i + 1 ? 'bg-[#00bfa6] text-white' : 'bg-gray-200'
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
          state={{ token, id, nome: state.nome }}
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
