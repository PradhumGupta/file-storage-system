

function GridResults(items) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                <img
                  src={item.src}
                  alt={item.name}
                  className="w-full h-auto object-cover rounded-lg mb-2"
                />

                <p className="text-sm text-gray-700 font-medium">{item.name}</p>
              </div>
            ))}
          </div>
  )
}

export default GridResults