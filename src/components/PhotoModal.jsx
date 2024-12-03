import React, { useState, useEffect } from 'react';
import { UserCirclePlus, Trash, UploadSimple } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

export default function PhotoModal({
  isOpen,
  setIsOpen,
  titulo,
  photoSrc,
  onPhotoUpload,
  onDeletePhoto
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(photoSrc);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    console.log("Photo URL:", photoSrc);
    setPreview(photoSrc); // Atualiza a pré-visualização com a foto atual
  }, [photoSrc]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Define a pré-visualização da imagem
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
      console.log("File selected:", file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      onPhotoUpload(selectedFile);
    } else {
      console.error("No file selected for upload.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Define a pré-visualização da imagem
    };
    reader.readAsDataURL(file);
    console.log("File dropped:", file);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)} 
          className="bg-slate-900/30 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()} 
            className="bg-white border-2 border-[#00bfa6] text-gray-800 p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <UserCirclePlus className="text-slate-200  rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-center mb-2 py-3">{titulo}</h3>

              {preview ? (
                <img
                  src={preview}
                  alt="Foto de Perfil"
                  className="w-full h-56 object-cover rounded-lg mb-4 shadow-inner"
                  onError={(e) => { e.target.onerror = null; e.target.src = "fallback-image-url"; }}
                />
              ) : (
                <div
                  className={`w-full h-56 bg-gray-200 flex items-center justify-center mb-4 rounded-lg transition-all ${
                    isDragging ? "bg-blue-100" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragLeave}
                >
                  {isDragging ? (
                    <p className="absolute text-gray-500">Solte a imagem aqui</p>
                  ) : (
                    <UserCirclePlus size={80} className="text-gray-500" />
                  )}
                </div>
              )}

              <div className="flex justify-center space-x-2 mb-4">
                <label
                  htmlFor="photo-upload"
                  className="flex-1 py-2 px-4 bg-[#00bfa6] text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#009b8a] transition"
                >
                  <UploadSimple size={20} />
                  {preview ? "Alterar Foto" : "Adicionar Foto"}
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {preview && (
                  <button
                    onClick={() => onDeletePhoto(preview.split('/').pop())} // Passa apenas o nome do arquivo
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-500 transition"
                  >
                    <Trash size={20} />
                    Deletar
                  </button>
                )}
              </div>

              {preview && ( // Mover o botão Enviar para baixo
                <button
                  onClick={handleUpload}
                  className="w-full py-2 px-4 bg-[#00bfa6] text-white rounded-lg flex items-center justify-center hover:bg-[#009b8a] transition"
                >
                  Enviar
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}