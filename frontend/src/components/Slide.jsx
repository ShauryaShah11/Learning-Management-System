function Slide({ title, image }) {
    return (
        <div className="relative bg-gray-200 p-4 rounded-md ml-9 mr-9">
            <div className="relative">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-70 object-cover rounded-md mx-auto" 
                />
                <div className="absolute inset-0 flex items-center ml-20 ">
                    <div className="bg-white bg-opacity-75 px-4 py-2 rounded-md w-40">
                        <h3 className="text-xl font-bold text-black">{title}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Slide;
