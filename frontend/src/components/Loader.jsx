import { SyncLoader } from "react-spinners";

function Loader({color, size, loading=true}){
    return (
        <div className="flex justify-center mx-auto">
            <SyncLoader color={color} loading={loading} size={size}/>
        </div>
    );
}

export default Loader;
