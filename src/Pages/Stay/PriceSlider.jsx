import React, { useState } from "react";
import "./PriceSlider.css";

const PriceSlider = ({ onPriceChange }) => {
  const [sliderValues, setSliderValues] = useState({ min: 500, max: 20000 });

  const handleSliderChange = (event) => {
    const { name, value } = event.target;
    const newValues = { ...sliderValues, [name]: parseInt(value, 10) || 0 };
    setSliderValues(newValues);

    if (onPriceChange) {
      onPriceChange(newValues.min, newValues.max);
    }
  };

  const formatSliderValue = (value) => `₹${value.toLocaleString()}`;

  return (
    <div className="price-range-slider">
      <div
        className="range-bar"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="slider" style={{ marginBottom: "14%" }}>
          <p>Minimum Price</p>
          <input
            type="range"
            min={100}
            max={10000}
            step={200}
            name="min"
            value={sliderValues.min}
            onChange={handleSliderChange}
            className="slider-input"
          />
          <span className="slider-value">
            {formatSliderValue(sliderValues.min)}
          </span>
        </div>
        <div className="slider">
          <p>Maximum Price</p>
          <input
            type="range"
            min={sliderValues.min}
            max={30000}
            step={500}
            name="max"
            value={sliderValues.max}
            onChange={handleSliderChange}
            className="slider-input"
          />
          <span className="slider-value">
            {formatSliderValue(sliderValues.max)}
          </span>
        </div>
      </div>
      <p className="range-text">
        <input
          type="text"
          value={`${formatSliderValue(sliderValues.min)} - ${formatSliderValue(
            sliderValues.max
          )}`}
          style={{
            backgroundColor: `rgb(240, 230, ${Math.min(
              255,
              Math.round((sliderValues.max / 30000) * 255)
            )})`,
            width: "50%",
          }}
          readOnly
          className="range-text-input"
        />
      </p>
    </div>
  );
};

export default PriceSlider;