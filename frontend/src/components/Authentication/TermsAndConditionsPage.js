import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const TermsAndConditionsPage = () => {
  const history = useHistory();
  const [accepted, setAccepted] = useState(false); // State to manage visibility

  const handleAccept = () => {
    // Redirect to the signup page after accepting terms
    history.push("/");
  };

  // Dummy data representing conditions
  const conditions = [
    "Sharing inappropriate content such as explicit images or hate speech.",
    "Engaging in harassment or bullying of other users.",
    "Attempting to hack or exploit the system.",
    "Providing false information during registration.",
    "Violating the community guidelines or terms of service.",
  ];

  if (accepted) {
    return null; // If terms are accepted, hide the component
  }

  return (
    <div>
      <h2>Terms and Conditions</h2>
      <p>
        By using our service, you agree to abide by the following terms and
        conditions:
      </p>
      <ul>
        {conditions.map((condition, index) => (
          <li key={index}>{condition}</li>
        ))}
      </ul>
      <p>
        Violation of any of these terms may result in the deactivation of your
        account and further legal actions.
      </p>
      <button
        onClick={() => {
          handleAccept();
          setAccepted(true); // Set accepted to true when the button is clicked
        }}
        style={styles.acceptButton}
      >
        Accept
      </button>
    </div>
  );
};

// Styles object for the button
const styles = {
  acceptButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
  },
};

export default TermsAndConditionsPage;
