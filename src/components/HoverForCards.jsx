import { Link } from "react-router-dom";

export default function HoverForCards({
  title,
  subtitle,
  Icon,
  link,
  onClick,
  isLink,
}) {
  return (
    <>
      {isLink ? (
        <Link
          to={link}
          className="w-full p-4 rounded relative overflow-hidden group bg-white shadow-3D"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

          <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-green-400 group-hover:rotate-12 transition-transform duration-300" />
          <Icon className="mb-2 text-2xl text-green-600 group-hover:text-white transition-colors relative z-10 duration-300" />
          <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
            {title}
          </h3>
          <p className="text-slate-400 group-hover:text-green-200 relative z-10 duration-300 mt-2 group-hover:rotate-1">
            {subtitle}
          </p>
        </Link>
      ) : (
        <div
          onClick={onClick}
          className="cursor-pointer w-full p-4 rounded relative overflow-hidden group bg-white shadow-3D"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

          <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-green-400 group-hover:rotate-12 transition-transform duration-300" />
          <Icon className="mb-2 text-2xl text-green-600 group-hover:text-white transition-colors relative z-10 duration-300" />
          <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
            {title}
          </h3>
          <p className="text-slate-400 group-hover:text-green-200 relative z-10 duration-300 mt-2 group-hover:rotate-1">
            {subtitle}
          </p>
        </div>
      )}
    </>
  );
}
