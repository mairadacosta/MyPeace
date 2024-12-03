import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, SignIn } from "@phosphor-icons/react";
import { Toaster, toast } from "sonner";
import { http } from "../../App";
import Inputs from "../../components/Inputs";
import { Spinner } from "flowbite-react";
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

const handleErrorResponse = (error) => {
  const errorMsg = error.response?.data?.msg || "Erro ao processar a solicitação.";
  showNotification({
    name: "Erro!",
    description: errorMsg,
    type: "error",
  });
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
//Função para enviar os dados do login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await http.post("/auth/login", {
        email: email,
        password: senha,
      });

      const { id, token, type } = response.data;
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const nome = decodedToken.name;

      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('nome', nome);

      console.log("Dados salvos:", { token, id, nome });
      console.log("LocalStorage:", {
        token: localStorage.getItem('token'),
        id: localStorage.getItem('id'),
        nome: localStorage.getItem('nome'),
      });

      showNotification({
        name: "Sucesso!",
        description: `Bem-vindo(a) de volta, ${nome}!`,
        type: "success",
      });

      setTimeout(() => {
        if (type === "pacient") {
          navigate("/principalCliente", { state: { token, id, nome } });
        } else if (type === "psychologist") {
          navigate("/principalPsico", { state: { token, id, nome } });
        }
      }, 1000);

    } catch (e) {
      handleErrorResponse(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      <main className="w-full h-screen grid place-content-center bg-[#3c5454] space-y-6">
        <div className="flex flex-col items-center gap-y-6">
          <h1 className="font-semibold text-white text-2xl text-center">
            Faça o login na sua conta
          </h1>
        </div>
        <div className="bg-white shadow-3D sm:rounded-lg p-6 sm:p-10 sm:w-[480px] w-screen h-96 flex flex-col justify-center">
          <form className="grid grid-cols-6 space-y-12" onSubmit={handleSubmit}>
            <div className="col-span-6 relative z-0">
              <Inputs
                type="email"
                label="Email:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-span-6 relative z-0">
              <Inputs
                isSenha
                label="Senha:"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="col-span-6 flex flex-col items-center justify-center sm:gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`relative z-0 flex items-center justify-center gap-2 overflow-hidden rounded-lg border-[1px] 
                border-[#00bfa6] px-4 py-2 font-semibold uppercase text-[#00bfa6] transition-all duration-300 
                before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] 
                before:rounded-[100%] before:bg-[#00bfa6] before:transition-transform before:duration-1000 before:content-[''] 
                w-full hover:scale-105 hover:text-white hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <Spinner color="white" aria-label="Extra large spinner example" size="lg" />
                ) : (
                  <>
                    <SignIn />
                    <span>Entrar</span>
                  </>
                )}
              </button>
              <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                Não tem uma conta?{" "}
                <Link
                  to={"/cadastroPsicologo"}
                  className="text-gray-700 transition-colors hover:text-gray-800 hover:font-medium underline ml-2"
                >
                  {" "}
                  Cadastrar{" "}
                </Link>{" "}
              </p>
            </div>
          </form>
        </div>
        <div className="flex items-center flex-col justify-center pt-6">
          <Link
            className="cursor-pointer hover:opacity-95 relative w-fit block after:block after:content-[''] 
            after:absolute after:h-[2px] after:bg-white text-white after:w-full after:scale-x-0 
            after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
            to="/"
          >
            <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all">
              <ArrowLeft />
              Voltar
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
