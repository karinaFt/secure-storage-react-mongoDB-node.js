export const SkeletonCard = () => {
    return (
        <div className="border rounded p-3 animate-pulse w-72">
            <div className="h-48 bg-gray-300 rounded mb-2"/>
            <div className="h-4 bg-gray-300 rounded mb-2"/>
            <div className="h-4 bg-gray-300 rounded mb-2  w-1/2"/>
            <div className="h-4 bg-gray-300 rounded w-1/3"/>
        </div>
    );
};