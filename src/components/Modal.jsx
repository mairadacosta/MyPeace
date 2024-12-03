import { EnvelopeSimple, User, UserPlus, Warning, X, ChatCircle, Chats } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";


export default function Modal({
  isOpen,
  setIsOpen,
  titulo,
  form,
  del,
  delOnClick,
  conteudo,
  emailVerification,
  email,
  valueEmailV,
  onChangeEmailV,
  onClickEmailV,
  redWarning,
  onContinue,
  onExit,
  children,
  photo,
  addpacient,
  aviso,
}) {
  return (
    <AnimatePresence>
      {form ? (
        <>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="bg-slate-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-2 border-[#00bfa6] p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
              >
                
                <div className="relative z-10">
                  <header className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-center">{titulo}</h3>
                    <X
                      className="cursor-pointer"
                      size={30}
                      onClick={() => setIsOpen(false)}
                    />
                  </header>
                  {children}
                </div>{" "}
              </motion.div>{" "}
            </motion.div>
          )}
        </>
      ) : del ? (
        <>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="bg-slate-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-2 border-[#00bfa6] p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
              >
                <Warning className="text-slate-200 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                <div className="relative z-10">
                  <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-[#00bfa6] grid place-items-center mx-auto shadow-xl">
                    <Warning />
                  </div>
                  <h3 className="text-3xl font-bold text-center mb-2">
                    {titulo}
                  </h3>
                  <p className="text-center mb-6">{conteudo}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-[#00bfa6] hover:bg-transparent text-white transition-colors border-2 border-[#00bfa6] hover:text-[#00bfa6] font-semibold w-full py-2 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={delOnClick}
                      className="bg-[#bf0047] hover:bg-transparent text-white transition-colors border-2 border-[#bf0047] hover:text-[#bf0047] font-semibold w-full py-2 rounded"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      ) : emailVerification ? (
        <>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
            >
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
              >
                <EnvelopeSimple className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                <div className="relative z-10">
                  <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-[#00bfa6] grid place-items-center mx-auto shadow-xl">
                    <EnvelopeSimple />
                  </div>
                  <h3 className="text-3xl font-bold text-center mb-2 py-3">
                    Verificação de Email
                  </h3>
                  <p className="text-center mb-6">
                    Esta ação requer um email de verificação. Por favor,
                    verifique sua caixa de entrada e a caixa de Spam e siga as
                    instruções.
                  </p>
                  <h2 className="text-center mb-6">
                    Email cadastrado:{" "}
                    <span className="font-medium ml-2 text-sm">{email}</span>
                  </h2>

                  <form className="max-w-md mx-auto mb-6">
                    <div className="relative">
                      <input
                        type="email"
                        className="block w-full p-[17px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#00bfa6] focus:border-[#00bfa6] "
                        placeholder="Inserir Código"
                        value={valueEmailV}
                        onChange={onChangeEmailV}
                        required
                      />
                      <button
                        onClick={onClickEmailV}
                        className="text-white absolute end-2.5 bottom-2.5 bg-[#00bfa6] transition-all border border-[#00bfa6] hover:bg-white hover:text-[#00bfa6] shadow-2xl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                      >
                        Verificar
                      </button>
                    </div>
                  </form>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      ) : redWarning ? (
        <>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="bg-red-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-red-500 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
              >
                <Warning className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                <div className="relative z-10">
                  <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-red-500 grid place-items-center mx-auto">
                    <Warning />
                  </div>
                  <h3 className="text-3xl font-bold text-center mb-2">
                    {titulo}
                  </h3>
                  <p className="text-center mb-6">{conteudo}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={onExit}
                      className="bg-red-700 text-white transition-colors border-2 border-red-700  font-semibold w-full py-2 rounded"
                    >
                      Sair
                    </button>
                    <button
                      onClick={onContinue}
                      className="bg-[#00bfa6] text-white transition-colors border-2 border-[#00bfa6] hover:text-white font-semibold w-full py-2 rounded"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      ) : photo ? (
        <>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="bg-green-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-green-500 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
              >
                <UserPlus className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                <div className="relative z-10">
                  <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-green-500 grid place-items-center mx-auto">
                    <UserPlus />
                  </div>
                  <h3 className="text-3xl font-bold text-center mb-2">
                    {titulo}
                  </h3>
                  <p className="text-center mb-6">{conteudo}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={onExit}
                      className="bg-green-700 text-white transition-colors border-2 border-green-700 font-semibold w-full py-2 rounded"
                    >
                      Sair
                    </button>
                    <button
                      onClick={onContinue}
                      className="bg-[#00bfa6] text-white transition-colors border-2 border-[#00bfa6] hover:text-white font-semibold w-full py-2 rounded"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          )}
        </>
      ) :  addpacient ? (
        <>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
            >
             <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-2 border-[#00bfa6] p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
              >
                <UserPlus className="text-slate-200 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                <div className="relative z-10">
                  <header className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-center">{titulo}</h3>
                    <X
                      className="cursor-pointer"
                      size={30}
                      onClick={() => setIsOpen(false)}
                    />
                  </header>
                  {children}
                </div>{" "}
              </motion.div>
            </motion.div>
          )}
        </>
      ) : aviso ? (
        <>
          {
            isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="bg-slate-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0, rotate: "12.5deg" }}
                  animate={{ scale: 1, rotate: "0deg" }}
                  exit={{ scale: 0, rotate: "0deg" }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-green-500 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                >
                  <Chats className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                  <div className="relative z-10">
                    <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-green-500 grid place-items-center mx-auto">
                      <ChatCircle />
                    </div>
                    <h3 className="text-3xl font-bold text-center mb-2">
                      {titulo}
                    </h3>
                    <p className="text-center mb-6">{conteudo}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="bg-red-700 text-white transition-colors border-2 border-red-700  font-semibold w-full py-2 rounded"
                      >
                        Sair
                      </button>
                      <button
                        onClick={onContinue}
                        className="bg-[#00bfa6] text-white transition-colors border-2 border-[#00bfa6] hover:text-white font-semibold w-full py-2 rounded"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          }
        </>
      ) : (
        <>
        </>
      )}
    </AnimatePresence>
  );
}
