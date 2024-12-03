import {
ArrowLeft,
ArrowUpRight,
User,
Trash,
UserCirclePlus,
UserList,
AddressBook,
NotePencil,
UserPlus,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { Toaster, toast } from "sonner";
import React from "react";
import HoverForCards from "../../components/HoverForCards";
import axios from "axios";
import Inputs from "../../components/Inputs";
import Notification from "../../components/Notification";
import PhotoModal from "../../components/PhotoModal";

const HoverDevCards = ({ onVerPacientes, onAddPacientes, onClickDel, onClickEdt, onClickRegistro, onClickPhoto }) => (
<div className="grid justify-between gap-4 grid-cols-2 lg:grid-cols-4 py-11">
  <HoverForCards
    title="Adicionar Pacientes"
    subtitle={<ArrowUpRight />}
    Icon={UserCirclePlus}
    onClick={onAddPacientes}
  />
  <HoverForCards
    title="Registro dos Pacientes"
    subtitle={<ArrowUpRight />}
    Icon={AddressBook}
    onClick={onClickRegistro}
  />
  <HoverForCards
    title="Ver Pacientes"
    subtitle={<ArrowUpRight />}
    Icon={UserList}
    onClick={onVerPacientes}
  />
  <HoverForCards
    title="Adicionar Foto"
    subtitle={<ArrowUpRight />}
    Icon={UserPlus}
    onClick={onClickPhoto}
  />
  <HoverForCards
    title="Editar Dados"
    subtitle={<ArrowUpRight />}
    Icon={NotePencil}
    onClick={onClickEdt}
  />
  <HoverForCards
    title="Deletar Conta"
    subtitle={<ArrowUpRight />}
    Icon={Trash}
    onClick={onClickDel}
  />

</div>
);

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


const handleErrorResponse = (error) => {
const errorMsg =
  error.response?.data?.msg || "Erro ao processar a solicitação.";
if (error.response?.status === 401) {
  showNotification({
    name: "Info",
    description: "Sessão expirada. Redirecionando para login.",
    type: "info",
  });
  navigate("/login");
} else {
  showNotification({
    name: "Erro!",
    description: errorMsg,
    type: "error",
  });
}
};
export default function PrincipalPsico() {
const navigate = useNavigate();
const { state } = useLocation();
const [token, setToken] = useState("");
const [id, setId] = useState("");
const [psicologoNome, setPsicologoNome] = useState("");
const [modalPhoto, setModalPhoto] = useState(false);
const [modalEdt, setModalEdt] = useState(false);
const [modalDel, setModalDel] = useState(false);
const [modalAvisoDel, setModalAvisoDel] = useState(false);
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [cpf, setCpf] = useState("");
const [registerNumber, setRegisterNumber] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [photoSrc, setPhotoSrc] = useState("");
const [activeTab, setActiveTab] = useState('info'); // Pode ser 'info' ou 'password'


useEffect(() => {
  if (!state?.token || !state?.id || !state?.nome) {
    navigate("/login");
  } else {
    setToken(state.token);
    setId(state.id);
    setPsicologoNome(state.nome);
    localStorage.setItem('token', state.token);
    localStorage.setItem('id', state.id);
    localStorage.setItem('nome', state.nome);
    console.log("Dados armazenados no estado:", { token: state.token, id: state.id, nome: state.nome });
    console.log("Dados armazenados no localStorage:", {
      token: localStorage.getItem('token'),
      id: localStorage.getItem('id'),
      nome: localStorage.getItem('nome'),
    });
    fetchPsychologistInfo(state.id, state.token);
  }
}, [navigate, state]);



//Função para buscar as informações do psicologo
const fetchPsychologistInfo = async (id, token) => {
  try {
    const response = await axios.get(`https://api-mypeace.vercel.app/get/psychologistInfo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
  });
    if(response.data){ 
    const { name, email, cpf, registerNumber, photo_name } = response.data;
    setNome(name);
    setEmail(email);
    setCpf(cpf);
    setRegisterNumber(registerNumber);
    if (photo_name) {
      const photoUrl = await getPhoto(id, token, photo_name);
      setPhotoSrc(photoUrl);
      console.log("Photo URL set:", photoUrl);
    }
  } else {
    throw new Error("Dados do psicologo não encontrados.");
  }
} catch (error) {
  showNotification({
    name: "Erro!",
    description: "Erro ao buscar informações do psicologo.",
    type: "error",
  });
  console.error("Erro ao buscar psicologo:", error.response?.data || error.message);
}
};

//Função para buscar a foto do psicologo
const getPhoto = async (id, token, photoName) => {
  try {
    const response = await axios.get(
      `https://api-mypeace.vercel.app/get/photo/${id}/${photoName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', 
      }
    );
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    console.error("Error fetching photo:", error.response?.data || error.message);
    throw error;
  }
};

//Função para redirecionar para a página de lista de pacientes
const handleVerPacientes = () => {
  navigate("/principalPsico/listapaciente", { state: { token, id, nome: psicologoNome } });
};

//Função para abrir o modal de adição de pacientes
const handleAddPaciente = () => {
  navigate('/principalPsico/listapaciente', { state: { token, id, nome: psicologoNome, openModal: true } });
};

//Função para redirecionar para a página de registro de pacientes
const handleRegistroPacientes = () => {
  navigate('/principalPsico/registropaciente', { state: { token, id, nome: psicologoNome } });
};

//Função para formatar o CPF
const handleCpfChange = (e) => {
  const formattedCpf = e.target.value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  setCpf(formattedCpf);
};

//Função para formatar o número de registro
const handleCrpChange = (e) => {
  const formattedCrp = e.target.value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{4})(\d{1})/, "$1/$2-$3");
  setRegisterNumber(formattedCrp);
};

//Função para enviar os dados de edição
const saveInfo = async (e) => {
e.preventDefault();
try {
  await axios.post(
    `https://api-mypeace.vercel.app/update/psychologists/${id}`,
    { name: nome, email: email, cpf: cpf, registerNumber: registerNumber },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  showNotification({ name: "Sucesso!", description: "Informações atualizadas.", type: "success" });
  setPsicologoNome(nome);
  setModalEdt(false);
} catch (error) {
  handleErrorResponse(error);
}
};


//Função para atualizar a senha
const updatePassword = async (e) => {
e.preventDefault();
if (newPassword !== confirmPassword) {
  toast.error("As senhas não coincidem!");
  return;
}
try {
  await axios.post(
    `https://api-mypeace.vercel.app/update/password/psychologist/${id}`,
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  showNotification({ name: "Sucesso!", description: "Senha atualizada.", type: "success" });
  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");
  setModalEdt(false);
} catch (error) {
  handleErrorResponse(error);
}
};


//Função para abrir o modal de aviso de deletar a conta
const openAvisoModal = () => {
  setModalAvisoDel(true);
};

//Função para confirmar a deleção da conta
const confirmaDelete = () => {
  setModalAvisoDel(false);
  setModalDel(true);
};

//Função para abrir o modal de edição de dados
const openEditModal = () => {
  setModalEdt(true);
  fetchPsychologistInfo(id, token);
};

//Função para deletar a conta
const deletar = async () => {
  try {
    const response = await axios.post(
      `https://api-mypeace.vercel.app/delete/psychologists/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    showNotification({
      name: "Sucesso!",
      description: "Psicologo deletado com sucesso!",
      type: "success",
    });
    setModalDel(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  } catch (error) {
    handleErrorResponse(error);
  }
};

//Função para salvar a foto do psicologo
const handleSavePhoto = async (newPhoto) => {
  try {
    const formData = new FormData();
    formData.append("photo", newPhoto);
    formData.append("userType", "psychologist");

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.post(`https://api-mypeace.vercel.app/upload/photo/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Photo upload response:", response.data);
    if (response.status === 201) {
      showNotification({
        name: "Sucesso!",
        description: "Foto atualizada com sucesso!",
        type: "success",
      });
      const photoUrl = await getPhoto(id, token, response.data.fileName);
      setPhotoSrc(photoUrl);
      console.log("Photo URL set:", photoUrl);
      setModalPhoto(false);
    }
  } catch (error) {
    console.error("Error uploading photo:", error.response?.data || error.message);
    handleErrorResponse(error);
  }
};

//Função para deletar a foto do psicologo
const handleDeletePhoto = async (photoName) => {
  try {
    const response = await axios.post(
      `https://api-mypeace.vercel.app/delete/photo/${id}/${photoName}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      showNotification({
        name: "Sucesso!",
        description: "Foto deletada com sucesso!",
        type: "success",
      });
      setPhotoSrc("");
    }
  } catch (error) {
    console.error("Erro ao deletar foto:", error.response?.data || error.message);
    handleErrorResponse(error);
  }
};

//Função para abrir o modal de adição de foto
const openPhotoModel = () => {
  setModalPhoto(true);
};



return (
  <>
    {modalPhoto && (
      <PhotoModal
        isOpen={modalPhoto}
        setIsOpen={setModalPhoto}
        titulo="Adicionar Foto"
        photoSrc={photoSrc}
        onPhotoUpload={handleSavePhoto}
        onDeletePhoto={(photoName) => handleDeletePhoto(photoName)}
      />
    )}
    {modalEdt && (
      <Modal
        isOpen={modalEdt}
        setIsOpen={setModalEdt}
        titulo="Editar Dados"
        form
      >
        <div className="flex justify-around border-b mb-4">
    <button
      className={`py-2 px-4 ${activeTab === 'info' ? 'border-b-2 border-green-500' : 'text-gray-400'}`}
      onClick={() => setActiveTab('info')}
    >
      Informações Pessoais
    </button>
    <button
      className={`py-2 px-4 ${activeTab === 'password' ? 'border-b-2 border-green-500' : 'text-gray-400'}`}
      onClick={() => setActiveTab('password')}
    >
      Alterar Senha
    </button>
  </div>
  {activeTab === 'info' && (
        <form className="mt-5 space-y-8" onSubmit={saveInfo}>
          <div className="relative  z-0">
            <Inputs
              label="Nome:"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="relative z-0">
            <Inputs
              label="Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative z-0">
            <Inputs
              label="CPF:"
              value={cpf}
              onChange={handleCpfChange}
            />
          </div>
          <div className="relative z-0">
            <Inputs
              label="Número de Registro:"
              value={registerNumber}
              onChange={handleCrpChange}
            />
          </div>
          <button className="bg-[#00bfa6] rounded-lg hover:opacity-90 transition-opacity text-white font-semibold w-full py-2">
            Salvar
          </button>
          </form>
        )}
        {activeTab === 'password' && (
          <form  className="mt-5 space-y-8" onSubmit={updatePassword}>
          <div className="relative z-0">
            <Inputs
              label="Senha Atual:"
              isSenha
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="relative z-0">
            <Inputs
              label="Nova Senha:"
              isSenha
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="relative z-0">
            <Inputs
              label="Confirmar Nova Senha:"
              isSenha
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="bg-[#00bfa6] rounded-lg hover:opacity-90 transition-opacity text-white font-semibold w-full py-2">
            Salvar
          </button>
        </form>
      )}
      </Modal>
    )}

    {modalAvisoDel && (
      <Modal
        isOpen={modalAvisoDel}
        setIsOpen={setModalAvisoDel}
        titulo="Aviso Importante"
        conteudo={`${psicologoNome} deseja deletar sua conta ?`}
        redWarning
        onContinue={confirmaDelete}
        onExit={() => setModalAvisoDel(false)}
      />
    )}

    {modalDel && (
      <Modal
        isOpen={modalDel}
        setIsOpen={setModalDel}
        titulo="Excluir Conta"
        del
        delOnClick={deletar}
      />
    )}

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

    <header className="p-3 z-50 w-full text-white">
      <div className=" bg-green-900 rounded-2xl px-6 py-4 shadow-xl flex items-center justify-center md:justify-between md:flex-row flex-col border-b-4 border-green-400">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="rounded-full border-2 border-green-500 w-16 h-16 flex items-center justify-center">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt="Foto de Perfil"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User fill="white" size={24} />
            )}
          </div>
          <div className="md:text-start text-center text-lg">
            <h1 className="font-bold">Olá, </h1>
            <h2 className="italic">{psicologoNome}</h2>
          </div>
        </div>
        <div className="h-px w-full bg-white md:hidden block my-3" />
        <Link to="/" className="md:m-6 group relative w-max">
          <div className="flex items-center transition-all gap-1 hover:gap-2">
            <ArrowLeft size={20} />
            <h1 className="font-medium">Sair</h1>
          </div>
          <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-white group-hover:w-3/6"></span>
          <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-white group-hover:w-3/6"></span>
        </Link>
      </div>
    </header>

    <main className="max-w-[1440px] mx-auto 2xl:p-0 py-3 px-6">
      <h1 className="py-7 text-2xl font-bold">Acesso Rápido</h1>
      <HoverDevCards
        onClickDel={openAvisoModal}
        onVerPacientes={handleVerPacientes}
        onAddPacientes={handleAddPaciente}
        onClickEdt={openEditModal}
        onClickPhoto={openPhotoModel}
        onClickRegistro={handleRegistroPacientes}
      />
      <section className="flex flex-col gap-10">
        <h1 className="text-2xl font-bold">Adicionar Pacientes</h1>
        <div className="w-full h-72 sm:h-56 md:h-40 bg-green-800 rounded-2xl transition-all shadow-xl hover:shadow-2xl text-white p-6 text-2xl relative">
          <h1 className="font-light leading-9">
            Adicione pacientes para ter melhores resultados em suas consultas!
          </h1>
          <button onClick={handleAddPaciente} className="absolute bottom-0 right-0 p-5 bg-pink-500 shadow-3D rounded-tl-2xl rounded-br-xl hover:pb-6 transition-all flex items-center gap-2">
            <h6 className="text-sm">Acessar</h6>
            <ArrowUpRight weight="bold" />
          </button>
        </div>
        <h1 className="text-2xl font-bold">Registro dos Pacientes</h1>
        <div className="w-full h-72 sm:h-56 md:h-40 bg-green-800 rounded-2xl transition-all shadow-xl hover:shadow-2xl text-white p-6 text-2xl relative">
          <h1 className="font-light leading-9">
            Veja como seu paciente anda se sentindo durante a semana
          </h1>
          <button onClick={handleRegistroPacientes} className="absolute bottom-0 right-0 p-5 bg-pink-500 shadow-3D rounded-tl-2xl rounded-br-xl hover:pb-6 transition-all flex items-center gap-2">
            <h6 className="text-sm">Acessar</h6>
            <ArrowUpRight weight="bold" />
          </button>
        </div>
      </section>
    </main>
  </>
);
}