import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Results({ element, artwork }) {
  const { name } = useContext(UserContext);

  return (
    <div>
      <p>
        <strong>{name}</strong>, your element is: {element}
      </p>

      {artwork ? (
        <div>
          <h2>{artwork.title}</h2>
          <img src={artwork.primaryImage} alt={artwork.title} />
        </div>
      ) : (
        <p>No artwork found</p>
      )}
    </div>
  );
}
