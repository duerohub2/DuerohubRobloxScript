interface StatsStripProps {
  totalScripts: number;
  totalGames: number;
  totalUsers: number;
}

export default function StatsStrip({ totalScripts, totalGames, totalUsers }: StatsStripProps) {
  const stats = [
    { label: 'Scripts', value: totalScripts },
    { label: 'Games', value: totalGames },
    { label: 'Users', value: totalUsers },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border-[3px] border-dark shadow-brutal p-6 text-center"
        >
          <p className="font-display text-4xl sm:text-5xl">{stat.value.toLocaleString()}</p>
          <p className="font-mono uppercase text-xs tracking-wider text-textdim mt-2">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
