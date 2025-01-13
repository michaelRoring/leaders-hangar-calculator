import React, { useRef, useState } from 'react';
import IconTooltip from './IconTooltip';

const Tooltip = ({ text, cards }) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null); 

  return (
    <div className="relative flex items-center align-middle">
      <span className="text-gray-700 z-0">{text}</span>
      <span
        className="ml-2 cursor-pointer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <IconTooltip />
      </span>
      {show && (
        <div
          ref={tooltipRef} 
          className="absolute z-10 bg-white shadow-md p-4 w-64 rounded-lg"
          style={{
            top: '90%',
            left: tooltipRef.current ? tooltipRef.current.offsetLeft : 0, 
          }}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {cards.map((card, index) => (
            <div key={index} className="mb-4 border-2 p-2 rounded-lg">
              <h5 className="text-[#030033] font-bold">{card.title}</h5>
              <p className="text-[#030033] font-normal">{card.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tooltip;