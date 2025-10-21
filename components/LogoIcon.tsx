import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm4.186 15.113a6.012 6.012 0 0 1-8.372 0 6.012 6.012 0 0 1 0-8.226 6.012 6.012 0 0 1 8.372 0 6.012 6.012 0 0 1 0 8.226z" />
    <path d="M12 16a4 4 0 0 0 0-8c-3.159 0-4 2.583-4 4s.841 4 4 4z" />
  </svg>
);
