import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Container from "../../components/Container";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import Chat from "../../components/Chat";
import { http } from "../../App";
import { Toaster, toast } from "sonner";  
import Notification from "../../components/Notification"; 

// Função para mostrar uma notificação na tela
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

const emojis = {
  feliz: '😊',
  contente: '🙂',
  neutro: '😐',
  triste: '🙁',
  raiva: '😠',
};

// Função que recebe uma descrição e um objeto de categorias e retorna a categoria correspondente
const getCategoryFromDescription = (description, categories) => {
  for (const [category, words] of Object.entries(categories)) {
    if (words.some((word) => description.toLowerCase().includes(word))) {
      return category;
    }
  }
  return null; 
};

// Função que retorna uma mensagem específica para a categoria fornecida
const getMessageForCategory = (category) => {
  switch (category) {
    case "suicidio":
      return (
        <>
          Notamos que você mencionou temas relacionados ao suicídio. Lembre-se, há sempre alguém para te ajudar. Por favor, entre em contato com o CVV: 188.{' '}
          <a href="https://cvv.org.br/chat/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            https://cvv.org.br/chat/
          </a>
        </>
      );
    case "depressao":
      return (
        <>
          Parece que você está enfrentando um momento difícil de tristeza ou depressão. O CVV está disponível para conversar, ligue para 188.{' '}
          <a href="https://cvv.org.br/chat/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            https://cvv.org.br/chat/
          </a>
        </>
      );
    case "ansiedade":
      return (
        <>
          Sabemos que a ansiedade pode ser avassaladora. Tente conversar com alguém de confiança ou use nossa respiração guiada{' '}
        </>
      );
    case "autoagressao":
      return (
        <>
          Você mencionou temas delicados como autoagressão. Por favor, busque ajuda entrando em contato com o CVV: 188.{' '}
          <a href="https://cvv.org.br/chat/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            https://cvv.org.br/chat/
          </a>
        </>
      );
    default:
      return null; 
  }
};

// Função assíncrona para buscar palavras sensíveis de um arquivo JSON
const fetchSensitiveWords = async () => {
  const response = await fetch('/sensitiveWords.json'); 
  const data = await response.json();
  return data; // Retorna os dados das palavras sensíveis
};

export default function RegistroEmocao() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState("Insira suas emoções do dia!");
  const [mensagem, setMensagem] = useState("");
  const [mensagemTipo, setMensagemTipo] = useState("");
  const [savedFeelings, setSavedFeelings] = useState([]);
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const [pacienteNome, setPacienteNome] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [sensitiveCategories, setSensitiveCategories] = useState({});

  useEffect(() => {
    if (!state?.token || !state?.id || !state?.nome) {
      navigate("/login");
    } else {
      setToken(state.token);
      setId(state.id);
      setPacienteNome(state.nome);
      
      localStorage.setItem('token', state.token);
      localStorage.setItem('id', state.id);
      localStorage.setItem('nome', state.nome);

      console.log("Dados armazenados no estado:", { token: state.token, id: state.id, nome: state.nome });
      console.log("Dados armazenados no localStorage:", {
        token: localStorage.getItem('token'),
        id: localStorage.getItem('id'),
        nome: localStorage.getItem('nome'),
      });
    }

    // Busca palavras sensíveis ao montar o componente
    fetchSensitiveWords().then(data => setSensitiveCategories(data));
  }, [navigate, state]);

  const handleCronometro = () => {
    navigate("/principalCliente/cronometro", {
      state: { token, id, nome: pacienteNome },
    });
  };

  // Função para salvar a emoção registrada
  const handleSave = async () => {
    // Verifica se o token e o id estão presentes
    if (!token || !id) {
      showNotification({
        name: "Aviso!",
        description: "Token ou ID ausente. Por favor, faça login novamente.",
        type: "warning",
      });
      clearMessage();
      return;
    }

    // Verifica se a descrição e o sentimento foram preenchidos
    if (description === "" || selectedFeeling === "") {
      showNotification({
        name: "Aviso!",
        description: "Por favor, preencha a descrição e selecione uma emoção.",
        type: "warning",
      });
      clearMessage();
      return;
    }

    // Obtém a categoria da descrição
    const category = getCategoryFromDescription(description, sensitiveCategories);

    // Cria uma nova entrada para sentimentos salvos
    const newEntry = {
      id: Date.now(),
      feeling: selectedFeeling,
      description: description,
      dataAtual: new Date().toLocaleDateString("pt-BR"),
    };
    setSavedFeelings([...savedFeelings, newEntry]); // Atualiza o estado com a nova entrada

    try {
      // Envia a emoção registrada para a API
      const response = await http.post(`/register/report/${id}`, {
        feeling: selectedFeeling,
        description: description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const msg = response?.data?.msg || "Salvo com sucesso!"; 
      showNotification({
        name: "Sucesso!",
        description: msg,
        type: "success",
      });
      setDescription(""); // Limpa a descrição
      setSelectedFeeling(""); // Limpa o sentimento selecionado
      clearMessage();

      // Se a categoria for "ansiedade", redireciona para respiração guiada
      if (category === "ansiedade") {
        showNotification({
          name: "Respiração",
          description: "Você será direcionado para a respiração em 2 segundos.",
          type: "info",
        });
        setTimeout(() => {
          handleCronometro(); 
        }, 2000);
      } else if (category) {
        // Se houver uma categoria sensível, abre o chat com a mensagem correspondente
        const message = getMessageForCategory(category);
        setIsChatOpen(true);
        setChatMessages([{ text: message, sent: false }]);
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || "Erro ao salvar os dados."; 
      showNotification({
        name: "Erro!",
        description: errorMsg,
        type: "error",
      });
      clearMessage();
    }
  };

  // Função para limpar a mensagem exibida após um certo tempo
  const clearMessage = () => {
    setTimeout(() => {
      setMensagem("");
      setMensagemTipo("");
    }, 1000);
  };

  // Função para lidar com o envio ao pressionar Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Verifica se a tecla Enter foi pressionada sem Shift
      event.preventDefault(); // Previne a quebra de linha
      handleSave(); // Chama a função de salvar
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
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
      <Header />
      <Container>
        <div className="flex-grow flex items-center justify-center my-12">
          <div className="flex flex-col items-center shadow-3D p-8 rounded-lg rounded-tl-none relative w-[90%] max-w-[400px] sm:w-[350px]">
            <div className="w-full bg-green-950 absolute left-0 -translate-x-[154px] sm:-translate-x-[162px] -translate-y-1 top-[34%] -rotate-90 rounded-t-lg text-end text-white uppercase font-medium pr-4">
              Registro de Emoção
            </div>

            <div className="mt-4 text-lg text-center font-medium">{phase}</div>

            {mensagem && (
              <div className={`font-bold mt-2 ${mensagemTipo === "success" ? "text-[#00bfa6]" : "text-red-500"}`}>
                {mensagem}
              </div>
            )}

            <div className="mt-4 flex flex-nowrap justify-center space-x-0">
              {Object.entries(emojis).map(([feeling, emoji], index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFeeling(feeling)}
                  className={`text-3xl p-2 transition-all ${selectedFeeling === feeling ? "border-2 bg-[#00bfa6] rounded-full" : ""}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <textarea
              className="mt-4 p-2 w-full border border-[#00bfa6]-300 focus:border-[#008f7a] focus:ring-[#00bfa6] rounded-lg resize-none"
              rows="4"
              placeholder="Escreva sobre como você está se sentindo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown} // Adiciona o manipulador de eventos para o Enter
            />

            <div className="mt-6">
              <button
                onClick={handleSave}
                className="bg-[#00bfa6] hover:bg-[#008f7a] text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Salvar
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <Link
                className="cursor-pointer hover:opacity-95 relative w-fit block after:block after:content-[''] 
                after:absolute after:h-[2px] after:bg-black text-black after:w-full after:scale-x-0 
                after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                to="/principalCliente"
                state={{ token, id, nome: pacienteNome }}
              >
                <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all">
                  <ArrowLeft />
                  Voltar
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <Footer />

      {isChatOpen && (
        <Chat
          titulo="Ajuda"
          onClose={() => setIsChatOpen(false)}
          initialMessages={chatMessages}
        />
      )}
    </div>
  );
}