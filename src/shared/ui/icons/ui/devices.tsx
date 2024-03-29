import React from 'react';

import { DevicesIconsProps } from '../types';

function Devices(props: DevicesIconsProps) {
    const { variant } = props;

    switch (variant) {
        case 'phone': {
            return (
                <svg
                    width="24.000000"
                    height="24.000000"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <desc>Created with Pixso.</desc>
                    <defs />
                    <path
                        id="smartphone"
                        d="M7 23C6.4502 23 5.979 22.8042 5.5874 22.4125C5.1958 22.0209 5 21.55 5 21L5 3C5 2.44995 5.1958 1.97913 5.5874 1.58752C5.979 1.1958 6.4502 1 7 1L17 1C17.5498 1 18.021 1.1958 18.4126 1.58752C18.8042 1.97913 19 2.44995 19 3L19 21C19 21.55 18.8042 22.0209 18.4126 22.4125C18.021 22.8042 17.5498 23 17 23L7 23ZM7 20L7 21L17 21L17 20L7 20ZM7 18L17 18L17 6L7 6L7 18ZM7 4L17 4L17 3L7 3L7 4Z"
                        fillOpacity="1.000000"
                        fillRule="nonzero"
                    />
                </svg>
            );
        }
        case 'desktop': {
            return (
                <svg
                    width="24.000000"
                    height="24.000000"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <desc>Created with Pixso.</desc>
                    <defs />
                    <path
                        id="computer"
                        d="M1 21L1 19L23 19L23 21L1 21ZM4 18C3.4502 18 2.979 17.8042 2.5874 17.4126C2.1958 17.0208 2 16.55 2 16L2 5C2 4.44995 2.1958 3.97925 2.5874 3.5874C2.979 3.1958 3.4502 3 4 3L20 3C20.5498 3 21.021 3.1958 21.4126 3.5874C21.8042 3.97925 22 4.44995 22 5L22 16C22 16.55 21.8042 17.0208 21.4126 17.4126C21.021 17.8042 20.5498 18 20 18L4 18ZM4 16L20 16L20 5L4 5L4 16Z"
                        fillOpacity="1.000000"
                        fillRule="nonzero"
                    />
                </svg>
            );
        }
        case 'unknown': {
            return (
                <svg
                    width="24.000000"
                    height="24.000000"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <desc>Created with Pixso.</desc>
                    <defs />
                    <path
                        id="devices"
                        d="M2 20L2 17L4 17L4 6C4 5.44995 4.1958 4.97925 4.5874 4.5874C4.979 4.1958 5.4502 4 6 4L21 4L21 6L6 6L6 17L12 17L12 20L2 20ZM15 20C14.7168 20 14.479 19.9041 14.2876 19.7124C14.0957 19.5208 14 19.2834 14 19L14 9C14 8.71655 14.0957 8.47925 14.2876 8.2876C14.479 8.09595 14.7168 8 15 8L21 8C21.2832 8 21.521 8.09595 21.7124 8.2876C21.9043 8.47925 22 8.71655 22 9L22 19C22 19.2834 21.9043 19.5208 21.7124 19.7124C21.521 19.9041 21.2832 20 21 20L15 20ZM16 17L20 17L20 10L16 10L16 17Z"
                        fillOpacity="1.000000"
                        fillRule="nonzero"
                    />
                    <path
                        id="device_unknown"
                        d="M9.83008 12.1799Q9.68018 12.52 9.68018 13.4399L10.8799 13.4399Q10.8799 12.8 11 12.5601C11.0801 12.3999 11.3198 12.1201 11.7202 11.72Q12.0801 11.3601 12.3198 10.9399C12.48 10.6599 12.5601 10.3601 12.5601 10.04Q12.5601 9.2915 12.1992 8.81787Q12.0684 8.64575 11.8901 8.51001Q11.7305 8.38867 11.5562 8.29614Q10.9966 8 10.2798 8Q9.57617 8 9.06445 8.31348Q8.93604 8.39185 8.81982 8.48999Q8.47754 8.7793 8.25342 9.14185Q8.09814 9.39331 8 9.67993L9.08008 10.1201C9.14648 9.89331 9.27344 9.67676 9.45996 9.46997Q9.5 9.42578 9.54492 9.38794Q9.81689 9.15991 10.2798 9.15991Q10.8003 9.15991 11.0698 9.41992Q11.0801 9.42993 11.0898 9.43994C11.27 9.62671 11.3599 9.84009 11.3599 10.0801Q11.3599 10.2603 11.3037 10.4209Q11.2539 10.5632 11.1602 10.6899C11.0269 10.8701 10.8667 11.0532 10.6802 11.24Q9.97998 11.8401 9.83008 12.1799ZM10.002 15.9531Q10.1328 16 10.2798 16Q10.4272 16 10.5576 15.9531Q10.7285 15.8916 10.8701 15.75Q11.0117 15.6084 11.0732 15.4377Q11.1201 15.3074 11.1201 15.1599Q11.1201 15.0127 11.0732 14.8821Q11.0117 14.7117 10.8701 14.5701Q10.7285 14.4285 10.5576 14.3669Q10.4272 14.3201 10.2798 14.3201Q10.1328 14.3201 10.002 14.3669Q9.83154 14.4285 9.68994 14.5701C9.52344 14.7366 9.43994 14.9333 9.43994 15.1599Q9.43994 15.3074 9.48682 15.4377Q9.54834 15.6084 9.68994 15.75Q9.83154 15.8916 10.002 15.9531Z"
                        fillOpacity="1.000000"
                        fillRule="evenodd"
                    />
                </svg>
            );
        }
        default:
            return null;
    }
}

export default Devices;
