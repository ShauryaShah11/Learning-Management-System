import { Bar } from 'react-chartjs-2';

function ChartCard({ title, data, options }) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-8 h-auto">
      <h2 className="text-2xl font-semibold mb-2 flex-grow text-center">{title}</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ChartCard;