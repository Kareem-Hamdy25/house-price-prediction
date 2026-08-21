import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to home</Link>
    </div>
  );
}