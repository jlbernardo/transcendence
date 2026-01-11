export default function FriendList() {
  return (
    <div className="w-full h-full border-2 rounded-2xl border-amber-400/70 bg-fuchsia-950/70">
      <p className="text-amber-100 text-4xl text-center mt-5 mb-1">friends</p>
      <p className="text-amber-100 mt-5 ml-3 mb-1">Online</p>
      <div className="flex">
        <div className="w-2 h-2 bg-green-500 rounded-full ml-3 mt-2"></div>
        <p className="text-gray-500 ml-3">Ma ~ (mgonzaga)</p>
      </div>
      <div className="flex">
        <div className="w-2 h-2 bg-amber-400 rounded-full ml-3 mt-2"></div>
        <p className="text-gray-500 ml-3">Sabriiiina (sabrferr)</p>
      </div>
      <div className="flex">
        <div className="w-2 h-2 bg-green-500 rounded-full ml-3 mt-2"></div>
        <p className="text-gray-500 ml-3">Natali Rocha (namoreir)</p>
      </div>

      <div className="w-3/4 mt-30 mx-auto border-t border-white opacity-60"></div>

      <p className="text-amber-100 mt-8 ml-3 mb-1">Offline</p>
      <div className="flex">
        <div className="w-2 h-2 bg-gray-500 rounded-full ml-3 mt-2"></div>
        <p className="text-gray-500 ml-3">Juba (julberna)</p>
      </div>

      <div className="w-3/4 mt-50 mx-auto border-t border-white opacity-60"></div>

      <p className="text-amber-100 mt-8 ml-3 mb-1">Requests</p>
      <div className="flex">
        <p className="text-gray-500 ml-3">0xEDU (etachott)</p>
        <div className="ml-auto flex gap-2 pr-3">
          <button className="w-5 h-5 mt-1 bg-green-500 rounded flex items-center justify-center text-white text-sm">✓</button>
          <button className="w-5 h-5 mt-1 bg-red-500 rounded flex items-center justify-center text-white text-sm">✕</button>
        </div>
      </div>
    </div>
  )
}
