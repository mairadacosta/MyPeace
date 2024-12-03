import { Warning, XCircle, Info, Check } from "@phosphor-icons/react";

const Notification = ({ name, description, time, type }) => {
  const typeStyles = {
    success: {
      backgroundColor: "#00C9A7",
      icon: <Check size={34} weight="bold" className="text-white" />, 
    },
    error: {
      backgroundColor: "#FF3D71",
      icon: <XCircle size={34} weight="bold" className="text-white" />,
    },
    warning: {
      backgroundColor: "#FFB800",
      icon: <Warning size={34} weight="bold" className="text-white" />,
    },
    info: {
      backgroundColor: "#1E86FF",
      icon: <Info size={34} weight="bold" className="text-white" />,
    },
  };

  const { backgroundColor, icon: typeIcon } = typeStyles[type] || {
    backgroundColor: "#333", 
    icon: null,
  };

  return (
    <div
      className="relative z-10 flex items-center gap-4 p-4 rounded-xl shadow-lg"
      style={{ backgroundColor }}
      role="alert" 
      aria-live="assertive"  
    >
      {typeIcon && (
        <div className="flex items-center">
          {typeIcon}
        </div>
      )}
      <div className="flex flex-col">
        <figcaption className="flex items-center text-lg font-bold text-white">
          <span className="text-base sm:text-lg">{name}</span>
          <span className="mx-2">·</span>
          <span className="text-xs sm:text-sm text-white/80">{time}</span>
        </figcaption>
        <p className="text-sm sm:text-base text-white">{description}</p>
      </div>
    </div>
  );
};

export default Notification;
