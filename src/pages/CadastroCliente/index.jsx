 import { useEffect, useState } from "react";
import { http } from "../../App";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Logo from "../../assets/images/logo.svg";
import FloatingPhone from "../../components/FloatingPhone";
import { ArrowLeft } from "@phosphor-icons/react";
import Inputs from "../../components/Inputs";

export default function CadastroPaciente() {
  const { state } = useLocation();
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!state?.token || !state?.id) {
      navigate("/login");
    } else {
      setToken(state.token);
      setId(state.id);
    }
  }, [setToken, setId, navigate, state]);

  function cadastrar(event) {
    event.preventDefault();

    http
      .post(
        `/register/pacient/${id}`,
        {
          name,
          email,
          idPsychologist: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        alert(resp.data.password);
        navigate("/principalPsico", { state: { token, id } });
      })
      .catch((error) => {
        if (error.response) {
          if (error.request.status === 401) {
            alert("Sessão expirada");
            navigate("/login");
          } else {
            toast.error(`${error.response.data.msg}`);
          }
        } else {
          toast.error(
            "Erro ao cadastrar paciente. Por favor, tente novamente mais tarde."
          );
        }
      });
  }

  return (
    <section className="bg-white">
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
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative w-full h-16 lg:order-first lg:col-span-5 lg:h-full xl:col-span-6 bg-green-900 shadow-xl rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl flex items-center justify-center">
          <FloatingPhone className={"lg:block hidden"} />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 lg:order-last">
          <div className="max-w-xl lg:max-w-3xl">
            <header className="w-full flex justify-between items-center">
              <img src={Logo} className="w-12" />
              <Link
                className="cursor-pointer hover:opacity-95 relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                to="/"
              >
                <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all">
                  <ArrowLeft />
                  Voltar
                </div>
              </Link>
            </header>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl flex items-center">
              Cadastro
              <span className="font-light px-2">|</span>
              Paciente
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Bem-Vindo ao MyPeace!
              <br />
              Preencha os campos abaixo para criar sua conta como paciente e ter
              acesso à nossa plataforma.
            </p>

            <form onSubmit={cadastrar} className="mt-8 grid grid-cols-6 gap-5">
              <div className="col-span-6 relative z-0">
                <Inputs
                  type="text"
                  label="Nome Completo:"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-span-6 relative z-0">
                <Inputs
                  type="email"
                  label="Email:"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border-2 border-[#00bfa6] bg-[#00bfa6] px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-[#00bfa6] focus:outline-none focus:ring active:text-[#00bfa6]"
                >
                  Cadastrar
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Já tem uma conta?
                  <Link to={"/login"} className="text-gray-700 underline ml-2">
                    Login
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
