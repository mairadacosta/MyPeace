export default function Container({children}){
    return(
        <main className="mx-auto max-w-[1440px] p-6 shadow-inner rounded-xl">
            {children}
        </main>
    )
}