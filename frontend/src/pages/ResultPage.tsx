import { useLocation, Link } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const state = location.state as { predictedPrice?: number } | null;

  if (!state || state.predictedPrice === undefined) {
    return (
      <div>
        <p>No prediction found.</p>
        <Link to="/">Go back and try again</Link>
      </div>
    );
  }

  const price = state.predictedPrice;
  let formattedPrice = "";

  if (price >= 10000000) {
    const crValue = price / 10000000;
    formattedPrice = crValue.toFixed(2) + " Cr";
  } else {
    const lacValue = price / 100000;
    formattedPrice = lacValue.toFixed(2) + " Lac";
  }

  return (
    <div>
      <h2>Predicted Price</h2>
      <p>₹ {formattedPrice}</p>
      <Link to="/">Predict another property</Link>
    </div>
  );
}