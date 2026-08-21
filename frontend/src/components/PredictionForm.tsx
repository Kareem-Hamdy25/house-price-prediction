import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictPrice, fetchLocations, PredictionApiError } from "../api/predictionClient";
import type { PredictionRequest, Furnishing, Transaction } from "../types/prediction";

export default function PredictionForm() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [carpetAreaSqft, setCarpetAreaSqft] = useState("");
  const [floorNum, setFloorNum] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [balcony, setBalcony] = useState("");
  const [carParking, setCarParking] = useState("");
  const [furnishing, setFurnishing] = useState<Furnishing>("Unfurnished");
  const [transaction, setTransaction] = useState<Transaction>("Resale");
  const [ownership, setOwnership] = useState("");
  const [facing, setFacing] = useState("");

  const [locations, setLocations] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLocations()
      .then((data) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (location.trim() === "") {
      setErrorMessage("Please select a location.");
      return;
    }

    if (Number(carpetAreaSqft) <= 0) {
      setErrorMessage("Carpet area must be greater than 0.");
      return;
    }

    const payload: PredictionRequest = {
      location: location,
      carpet_area_sqft: Number(carpetAreaSqft),
      floor_num: Number(floorNum),
      bathroom: Number(bathroom),
      balcony: Number(balcony),
      car_parking: Number(carParking),
      furnishing: furnishing,
      transaction: transaction,
      ownership: ownership,
      facing: facing,
    };

    setIsLoading(true);

    predictPrice(payload)
      .then((result) => {
        setIsLoading(false);
        navigate("/result", { state: { predictedPrice: result.predicted_price } });
      })
      .catch((error) => {
        setIsLoading(false);
        if (error instanceof PredictionApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      });
  }

  return (
    <div>
      <h2>Predict Property Price</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Location</label>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            <option value="">-- Select a location --</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Carpet Area (sqft)</label>
          <input
            type="number"
            value={carpetAreaSqft}
            onChange={(event) => setCarpetAreaSqft(event.target.value)}
          />
        </div>

        <div>
          <label>Floor Number</label>
          <input
            type="number"
            value={floorNum}
            onChange={(event) => setFloorNum(event.target.value)}
          />
        </div>

        <div>
          <label>Bathrooms</label>
          <input
            type="number"
            value={bathroom}
            onChange={(event) => setBathroom(event.target.value)}
          />
        </div>

        <div>
          <label>Balconies</label>
          <input
            type="number"
            value={balcony}
            onChange={(event) => setBalcony(event.target.value)}
          />
        </div>

        <div>
          <label>Car Parking</label>
          <input
            type="number"
            value={carParking}
            onChange={(event) => setCarParking(event.target.value)}
          />
        </div>

        <div>
          <label>Furnishing</label>
          <select
            value={furnishing}
            onChange={(event) => setFurnishing(event.target.value as Furnishing)}
          >
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        <div>
          <label>Transaction</label>
          <select
            value={transaction}
            onChange={(event) => setTransaction(event.target.value as Transaction)}
          >
            <option value="New Property">New Property</option>
            <option value="Resale">Resale</option>
          </select>
        </div>

        <div>
          <label>Ownership</label>
          <input
            type="text"
            value={ownership}
            onChange={(event) => setOwnership(event.target.value)}
          />
        </div>

        <div>
          <label>Facing</label>
          <input
            type="text"
            value={facing}
            onChange={(event) => setFacing(event.target.value)}
          />
        </div>

        {errorMessage !== "" && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Predicting..." : "Predict Price"}
        </button>
      </form>
    </div>
  );
}