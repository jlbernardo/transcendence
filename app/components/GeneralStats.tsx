type Stat = {
  label: string
  value: string | number
}

const stats: Stat[] = [
  { label: "Total Games", value: 320 },
  { label: "Total Players", value: 145 },
  { label: "Games Today", value: 27 },
  { label: "Most Wins (Player)", value: "beyoncé" },
]

export default function GeneralStats() {
  return (
    <div className="w-full h-full border-4 border-black bg-black/70">
      <p className="text-amber-200 text-4xl text-center mt-8 mb-6">General stats</p>
      <div className="flex flex-col items-center w-full">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-row justify-between items-center w-full max-w-md p-4 border-b border-white"
          >
            <span className="text-gray-300 text-lg font-semibold">{stat.label}</span>
            <span className="text-gray-300 text-1xl">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
