import "./LoadingSpinner.css";

export default function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="loading-spinner_container">
      <div>
        <span className="loader"></span>
      </div>
      <p className="text-gray-900 text-lg ml-4">{label}</p>
    </div>
  );
}
