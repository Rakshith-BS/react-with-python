import React from "react";

const ContributionCard = ({ contribution }) => {
  const currentTime = new Date();
  const startTime = new Date(contribution.startTime);
  const endTime = new Date(contribution.endTime);

  let status;
  if (currentTime < startTime) {
    status = "Scheduled";
  } else if (currentTime >= startTime && currentTime <= endTime) {
    status = "Active";
  } else {
    status = "Complete";
  }
  return (
    <div className="contribution-card">
      <h3>{contribution.title}</h3>
      <p>{contribution.description}</p>
      <p>
        <strong>Owner:</strong> {contribution.owner}
      </p>
      <p>
        <strong>Start Time:</strong>{" "}
        {new Date(contribution.startTime).toLocaleString()}
      </p>
      <p>
        <strong>End Time:</strong>{" "}
        {new Date(contribution.endTime).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
};

export default ContributionCard;
