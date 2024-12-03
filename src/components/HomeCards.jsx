export default function HomeCards({titulo, icone}){
    return(
        <div className="bg-green-400 w-60 h-60 relative rounded-xl rounded-tr-none p-4 flex flex-col justify-between z-50 shadow-xl hover:shadow-2xl transition-all">
            <div className="absolute rounded-t-[10px] top-0 right-0 bg-green-400 w-24 h-5 -translate-y-4 z-40" />
            <h1 className="uppercase text-lg font-semibold tracking-wide">{titulo}</h1>
            {icone}
        </div>
    )
}