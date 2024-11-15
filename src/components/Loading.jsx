import React from "react";

const Loading = () => {
  return (
    <>
      <style>
        {`
          .loader {
            position: relative;
            width: 54px;
            height: 54px;
            border-radius: 10px;
          }

          .loader div {
            width: 8%;
            height: 24%;
            background: rgb(128, 128, 128);
            position: absolute;
            left: 50%;
            top: 30%;
            opacity: 0;
            border-radius: 50px;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
            animation: fade458 1s linear infinite;
          }

          @keyframes fade458 {
            from {
              opacity: 1;
            }
            to {
              opacity: 0.25;
            }
          }

          ${Array.from({ length: 12 }, (_, index) => `
            .loader .bar${index + 1} {
              transform: rotate(${index * 30}deg) translate(0, -130%);
              animation-delay: ${-1.2 + (index * 0.1)}s;
            }
          `).join('')}
        `}
      </style>
      <div className="loader">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className={`bar${index + 1}`}></div>
        ))}
      </div>
    </>
  );
};

export default Loading;
