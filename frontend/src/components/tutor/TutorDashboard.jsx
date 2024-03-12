const TutorDashboard = () => {
    return (
        <div className="p-8">
            <div className="grid grid-cols-3 gap-4">
                <Card title="Card 1" description="This is card 1" />
                <Card title="Card 2" description="This is card 2" />
                <Card title="Card 3" description="This is card 3" />
            </div>
        </div>
    );
};

export default TutorDashboard;

function Card({ title, description }) {
  return (
      <div className="flex flex-col bg-white rounded-lg shadow-md p-8 h-32">
          <h2 className="text-2xl font-semibold mb-2 flex-grow text-center">{title}</h2>
          <p className="text-lg text-gray-600 mt-auto text-center">{description}</p>
      </div>
  );
}