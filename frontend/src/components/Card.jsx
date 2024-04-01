function Card({ title, description }) {
    return (
        <div className="flex flex-col bg-white rounded-lg shadow-md p-8 h-32">
            <h2 className="text-2xl font-semibold mb-2 flex-grow text-center">
                {title}
            </h2>
            <p className="text-lg text-gray-600 mt-auto text-center">
                {description}
            </p>
        </div>
    );
}

export default Card;