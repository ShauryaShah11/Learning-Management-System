import Modal from "react-modal";

Modal.setAppElement("#root");

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmation Modal"
            className="flex items-center justify-center fixed inset-0 z-50 outline-none focus:outline-none"
            overlayClassName="fixed inset-0 bg-black opacity-95"
        >
            <div className="relative w-auto my-6 mx-auto max-w-md">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-center justify-center p-5 border-b border-solid border-gray-300 rounded-t">
                        <h3 className="text-3xl font-semibold">
                            Confirm Action
                        </h3>
                    </div>
                    <div className="relative p-6 flex-auto">
                        <p className="my-4 text-gray-600 text-lg leading-relaxed text-center font-mono">
                            Are you sure you want to proceed?
                        </p>
                    </div>
                    <div className="flex items-center justify-evenly p-6 border-t border-solid border-gray-300 rounded-b space-x-4">
                        <button
                            className="bg-red-500 text-white font-bold uppercase px-6 py-2 text-sm rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 transition-all duration-200 ease-in-out"
                            type="button"
                            onClick={onRequestClose}
                        >
                            No
                        </button>
                        <button
                            className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 transition-all duration-200 ease-in-out"
                            type="button"
                            onClick={onConfirm}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;