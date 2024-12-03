export default function Table({children}) {
  return (
    <>
      <div className="rounded-xl">
        <div className="overflow-x-auto rounded-t-lg">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr className="text-left">
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                  Nome
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                  Registro
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
