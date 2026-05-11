import { Loader2Icon } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex-center min-h-96 h-full w-full">
            <div className="flex flex-col items-center gap-3">
                <Loader2Icon className="animate-spin size-7 text-app-green" />
                <span className="text-sm text-app-text-lighter">Loading...</span>
            </div>
        </div>
    );
};

export default Loading;
