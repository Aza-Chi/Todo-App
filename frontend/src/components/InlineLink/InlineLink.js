import { Link } from "react-router-dom";
import globalStyles from "../../App.module.css";

export default function InlineLink({ path, anchor }) {
  return <Link to={path} className={globalStyles.link}>{anchor}</Link>
}
