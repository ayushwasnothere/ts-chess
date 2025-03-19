const glassStyle: React.CSSProperties = {
  width: "350px",
  height: "250px",
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(15px)",
  WebkitBackdropFilter: "blur(15px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  padding: "20px",
  textAlign: "center",
  color: "white",
  transition: "transform 0.3s ease-in-out",
};

const GlassCard = () => {
  return (
    <div style={glassStyle}>
      <h2>Glassmorphism</h2>
      <p>Tinted glass effect using CSS in React.</p>
    </div>
  );
};

export default GlassCard;
