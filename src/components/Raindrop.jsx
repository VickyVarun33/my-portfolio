// Raindrop.jsx
export default function Raindrop() {
  return (
    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-10 h-10 z-20">
      <div className="animate-bounce rounded-full bg-blue-600 w-full h-full opacity-70 shadow-lg" />
    </div>
  );
}