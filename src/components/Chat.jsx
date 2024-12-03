import { X, ArrowsOut, ArrowsIn, Warning } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Chat({ titulo = "Ajuda", onClose, initialMessages = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white border-2 border-red-500 p-4 rounded-lg shadow-xl cursor-default relative w-80 h-96 md:w-96 md:h-[28rem] fixed bottom-0 right-0 z-50 overflow-hidden"
          >
            <Warning className="text-red-500/10 rotate-12 text-[250px] absolute z-0 -top-20 -left-20" />
            <div className="flex justify-between items-center mb-2 relative z-10">
              <h3 className="text-3xl font-bold text-center text-red-500 mb-2">{titulo}</h3>
              <div className="flex items-center space-x-2">
                <button onClick={toggleExpand} className="text-gray-500">
                  {isExpanded ? <ArrowsIn size={24} /> : <ArrowsOut size={24} />}
                </button>
                <button onClick={onClose} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between h-full relative z-10">
              <div className="overflow-y-auto flex-grow p-2 space-y-2">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg max-w-[70%] ${
                        msg.sent ? "bg-red-500 text-white self-end" : "bg-gray-100 text-gray-900 self-start"
                      } shadow-sm`}
                    >
                      {msg.text}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma mensagem ainda...</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-red-500 rounded-full p-4 cursor-pointer fixed bottom-4 right-4"
            onClick={toggleExpand}
          >
            <Warning className="text-white" size={32} />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full text-xs font-bold px-2 py-1 shadow-sm">
                {messages.length}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
