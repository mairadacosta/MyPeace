import WavesFooter from "./WavesFooter";
import Logo from "../assets/images/logo.svg";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center">
      <WavesFooter />
    <div className="bg-[#4DB6AC] w-full text-center flex flex-col justify-center items-center py-10 space-y-6">
      <img src={Logo} alt="Logo" width={40} height={40}/>
      <div className="flex items-center justify-center gap-x-3">
        <h6 className="text-xs font-semibold">mypeace@contato.com.br</h6>
        <span>|</span>
        <h6 className="text-xs font-semibold">(31) 9 8383-6232</h6>
      </div>
        <h1>Copyright © 2024 - Todos os direitos reservados</h1>
    </div>
    </footer>
  );
}
