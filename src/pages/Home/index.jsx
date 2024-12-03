import Container from "../../components/Container";
import Header from "../../components/Header";
import * as Icon from "@phosphor-icons/react";
import HomeCards from "../../components/HomeCards";
import { Carousel } from "flowbite-react";
import { AuroraHero } from "../../components/AuroraHero";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Container>
        <section className="w-full h-[500px] rounded-2xl bg-green-500 relative">
          <h1 className="absolute z-50 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 text-white text-6xl">
            MyPeace.
          </h1>
          <Carousel>
            <img
              src="https://images.pexels.com/photos/725255/pexels-photo-725255.jpeg"
              className="opacity-50 h-full md:h-auto"
              alt="Imagem 1"
            />
            <img
              src="https://images.pexels.com/photos/1261459/pexels-photo-1261459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="opacity-50 h-full md:h-auto"
              alt="Imagem 2"
            />
            <img
              src="https://images.pexels.com/photos/1624565/pexels-photo-1624565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="opacity-50 h-full md:h-auto"
              alt="Imagem 3"
            />
          </Carousel>
        </section>
        <div className="lg:h-12 h-6" />
        <section className="w-full bg-[#3C5454] rounded-xl p-8 md:py-8 space-y-12 shadow-3D">
          <div className="flex flex-col justify-center items-center gap-y-3 text-white">
            <h5 className="uppercase tracking-[0.2em] text-xs font-light">
              serviços
            </h5>
            <h1 className="text-center text-2xl">
              Descubra quais ferramentas o MyPeace disponibiliza!
            </h1>
          </div>
          <div className="flex items-center flex-wrap justify-around gap-y-12">
            <HomeCards
              titulo={"Interação entre psicólogo e paciente"}
              icone={<Icon.Chats size={64} weight="duotone" />}
            />
            <HomeCards
              titulo={"Diário de emoções"}
              icone={<Icon.BookBookmark size={64} weight="duotone" />}
            />
            <HomeCards
              titulo={"Respiração guiada"}
              icone={<Icon.Timer size={64} weight="duotone" />}
            />
          </div>
        </section>
        <div className="lg:h-12 h-6" />
        <section>
          <div className="flex flex-wrap gap-4 lg:grid lg:grid-cols-2 lg:gap-10">
            <div className="rounded-2xl shadow-3D w-full h-full hidden lg:block">
              <div className="hidden lg:flex justify-center items-center bg-green-400 rounded-2xl w-full h-full">
                <Icon.HandHeart weight="fill" size={192} />
              </div>
            </div>
            <article className="bg-green-900 rounded-2xl shadow-3D flex flex-col lg:justify-end order-last">
              <div className="w-full h-[350px] rounded-t-2xl bg-green-400 flex justify-center items-center lg:hidden">
                <Icon.HandHeart weight="fill" size={96} />
              </div>
              <div className="gap-y-10 flex flex-col px-12 py-10 lg:py-0 lg:px-12 justify-center lg:h-[600px]">
                <h1 className="text-white  uppercase font-black text-3xl">
                  Benefícios da terapia
                </h1>
                <p className="text-white leading-7 text-lg">
                  Fazer terapia traz inúmeros benefícios. Sendo um espaço seguro
                  para demonstração de emoções e o desenvolvimento de
                  habilidades de enfrentamento.
                  <br />A terapia vem promovendo diversos bens como:
                </p>
                <div className="text-white space-y-3">
                  <span className="flex items-center gap-3">
                    <Icon.CheckSquareOffset size={24} />
                    Relacionamento saudáveis
                  </span>
                  <span className="flex items-center gap-3">
                    <Icon.CheckSquareOffset size={24} />
                    Autoconhecimento
                  </span>
                  <span className="flex items-center gap-3">
                    <Icon.CheckSquareOffset size={24} />
                    Crescimento pessoal
                  </span>
                </div>
              </div>
            </article>
          </div>
          <div className="lg:h-12 h-6"></div>
          <div className="flex flex-wrap gap-4 lg:grid lg:grid-cols-2 lg:gap-10">
            <div className="rounded-2xl shadow-3D w-full h-full hidden lg:block">
              <div className="hidden lg:flex justify-center items-center bg-green-400 rounded-2xl w-full h-full">
                <Icon.Heartbeat weight="fill" size={192} />
              </div>
            </div>
            <article className="bg-green-900 rounded-2xl shadow-3D flex flex-col lg:justify-end order-first">
              <div className="w-full h-[350px] rounded-t-2xl bg-green-400 flex justify-center items-center lg:hidden">
                <Icon.Heartbeat weight="fill" size={96} />
              </div>
              <div className="gap-y-10 flex flex-col px-12 py-10 lg:py-0 lg:px-12 justify-center lg:h-[600px]">
                <h1 className="text-white  uppercase font-black text-3xl">
                  Mudando vidas
                </h1>
                <p className="text-white leading-7 text-lg">
                  A psicologia oferece orientação e suporte, ajudando a enxergar
                  novas perspectivas e possibilidades de enfrentar seus
                  problemas. Buscando sempre uma maneira clara e objetiva de
                  enfrentar os desafios, levando o paciente a enxergar a vida
                  com outra perspectiva.
                </p>
              </div>
            </article>
          </div>
        </section>
        <div className="lg:h-12 h-6" />
        <AuroraHero />
      </Container>
      <div className="lg:h-12 h-6" />
      <Footer />
    </>
  );
}
