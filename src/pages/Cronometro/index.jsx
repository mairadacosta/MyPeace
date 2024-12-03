import { useState, useEffect, useRef } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Container from "../../components/Container";
import { ArrowLeft } from "@phosphor-icons/react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Notification from "../../components/Notification"; 
import { toast } from "sonner"; 


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


export default function Cronometro() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("Clique em iniciar para começarmos");
  const [pacienteNome, setPacienteNome] = useState("");
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const navigate = useNavigate();
  const { state } = useLocation();
  const phaseRef = useRef("");
  const audioRef = useRef(null);
  
  
  useEffect(() => {
    try {
      if (!state?.token || !state?.id || !state?.nome) {
        throw new Error("Parâmetros inválidos. Redirecionando para login.");
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
    } catch (error) {
      showNotification({
        name: "Erro de Autenticação",
        description: error.message,
        type: "error",
      });
      navigate("/login");
    }
  }, [navigate, state]);
//Função para converter texto para fala
  const falarTexto = async (texto) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause(); 
        audioRef.current = null;
      }
  
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/oWAxZDx7w5VEj9dCyTzz`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": "sk_d0b2fb07653645b9d69b6a170dc87be58e3a5df5b36f337e",
        },
        body: JSON.stringify({
          text: texto,
          model_id: "eleven_multilingual_v1",  
          voice_settings: {
            stability: 0.7, 
            similarity_boost: 0.85,  
          },
        }),
      });
  
      if (!response.ok) throw new Error("Falha na conversão de texto para fala.");
  
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
    } catch (error) {
      showNotification({
        name: "Erro!",
        description: `Erro no text-to-speech: ${error.message}`,
        type: "error",
      });
    }
  };
//Função para atualizar a fase
  const updatePhase = (newPhase) => {
    try {
      if (phaseRef.current !== newPhase) {
        phaseRef.current = newPhase;
        setPhase(newPhase);
        falarTexto(newPhase); 
      }
    } catch (error) {
      console.log('${error.message}');
    }
  };

//Função para iniciar o cronômetro
  useEffect(() => {
    let timer;
    try {
      if (running) {
        if (time < 4) {
          updatePhase("Puxe o Ar");
        } else if (time < 11) {
          updatePhase("Segure o Ar");
        } else if (time < 19) {
          updatePhase("Solte o Ar");
        } else {
          updatePhase("Concluído");
          setRunning(false);
        }

        timer = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      } else {
        clearInterval(timer);
      }
    } catch (error) {
      showNotification({
        name: "Erro no Timer",
        description: `Erro no funcionamento do cronômetro: ${error.message}`,
        type: "error",
      });
    }

    return () => clearInterval(timer);
  }, [running, time]);

//Função para iniciar o cronômetro
  const startTimer = () => {
    setTime(0);
    setRunning(true);
    phaseRef.current = "";
  };

//Função para pausar o cronômetro
  const pauseTimer = () => {
    setRunning(false);
  };

//Função para reiniciar o cronômetro
  const resetTimer = () => {
    setTime(0);
    setRunning(false);
    setPhase("Clique em iniciar para começarmos");
    phaseRef.current = "";
  };

//Função para calcular o progresso do cronômetro
  const progress = (time / 19) * 100;
  const strokeWidth = 20;
  const radius = 90;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col min-h-screen">
      
      <Header />
      <Container>
        <div className="flex-grow flex items-center justify-center my-12">
          <div className="flex flex-col items-center shadow-3D p-8 rounded-lg rounded-tl-none relative sm:w-[300px] sm:h-[400px]">
            <div className="w-full bg-green-950 absolute left-0 -translate-x-[154px] sm:-translate-x-[162px] -translate-y-1 top-[34%] -rotate-90 rounded-t-lg text-end text-white uppercase font-medium pr-4">
              Respiração Guiada
            </div>
            <svg className="progress-ring" height="220" width="220">
              <circle
                className="progress-ring-circle"
                stroke="#00bfa6"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx="110"
                cy="110"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                  transition: "stroke-dashoffset 0.5s",
                }}
              />
              <text
                x="110"
                y="120"
                textAnchor="middle"
                className="text-4xl text-[#00bfa6] font-bold"
              >
                {time}
              </text>
            </svg>
            <div className="mt-4 text-center font-medium">{phase}</div>
            <div className="flex space-x-4 mt-6">
              {!running ? (
                <button
                  onClick={startTimer}
                  className="bg-[#00bfa6] hover:bg-[#008f7a] text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Iniciar
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-[#e74c3c] hover:bg-[#c0392b] text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Pausar
                </button>
              )}
              <button
                onClick={resetTimer}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Reiniciar
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
    </div>
  );
}
