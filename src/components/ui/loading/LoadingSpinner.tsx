import "./styles/loadingSpinner.scss";

const LoadingSpinner = () => {
  const rings = 5;
  return (
    <div className="loading-spinner">
    {[...Array(rings)].map((e, i) => (
      <div className="ring" key={i}>
        <div className="inner"/>
      </div>
    ))}
    </div>
  );
}
export default LoadingSpinner;
