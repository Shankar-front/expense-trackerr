import { useEffect, useState } from "react";
import api from "../utils/api";

const Explorer = () => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/")
      .then(res => setStatus(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Explorer</h2>
      <p>{status}</p>
    </div>
  );
};

export default Explorer;
