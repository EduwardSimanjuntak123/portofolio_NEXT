type StatCardProps = {
  title: string;
  value: string;
  color: string;
};

export default function StatCard({
  title,
  value,
  color,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">

      <div>

        <p className="text-gray-500">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-2">
          {value}
        </h2>

      </div>

      <div className={`${color} w-14 h-14 rounded-xl`} />

    </div>
  );
}