import PropTypes from "prop-types";

export const WarpcastButton = ({ text, embeds }) => {
  const handleClick = () => {
    const items = [];
    if (embeds != null && Array.isArray(embeds)) {
      for (const embed of embeds) {
        items.push(`embeds[]=${encodeURIComponent(embed)}`);
      }
    } else if (embeds) {
      items.push(`embeds=${encodeURIComponent(embeds)}`);
    }

    items.push(`text=${encodeURIComponent(text)}`);
    // Construct the Warpcast compose URL
    const composeUrl = `https://warpcast.com/~/compose?${items.join("&")}`;

    // Redirect to the Warpcast compose URL
    window.open(composeUrl, "warpcast");
  };

  return (
    <button onClick={handleClick} title="Cast this idea">
      <img
        className="w-8 h-8 rounded-full inline-block"
        src="/white-purple.svg"
      />
    </button>
  );
};

WarpcastButton.propTypes = {
  text: PropTypes.string,
  embeds: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};
