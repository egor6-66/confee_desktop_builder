import React from 'react';

import styles from './styles.module.scss';
import { NetworkIndicatorProps } from '../types';

function NetworkIndicator(props: NetworkIndicatorProps) {
    const { speed, size, online } = props;

    const getColor = () => {
        if (!online) return '#FF0000';
        if (speed > 0.3) return '#FF8800';
        if (speed > 1.4) return '#00FF00';
    };

    const color = getColor();

    return (
        // <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 512 512">
        //     <path
        //         fill={color}
        //         d="M223.421 360.59a46.203 46.203 0 007.081 71.033 46.207 46.207 0 0051.298 0 46.193 46.193 0 0017.017-20.706 46.195 46.195 0 00-9.936-50.327 45.993 45.993 0 00-50.466-10.121 45.997 45.997 0 00-14.994 10.121zM256.141 250.93a142.062 142.062 0 00-101 41.67 27.042 27.042 0 00.07 38.24 27.039 27.039 0 0038.24-.07 88.81 88.81 0 01125.29 0 27.1 27.1 0 008.765 5.895 27.076 27.076 0 0037.507-24.899 27.08 27.08 0 00-7.872-19.166 142.063 142.063 0 00-101-41.67z"
        //     />
        //     <path
        //         fill={color}
        //         d="M256.141 162.06a230.997 230.997 0 00-164 67.7 27.046 27.046 0 00-5.808 29.478 27.029 27.029 0 0014.661 14.607 27.05 27.05 0 0020.695-.037 27.024 27.024 0 008.762-5.878 178.271 178.271 0 01251.46 0 27.013 27.013 0 0044.079-29.402 27.02 27.02 0 00-5.849-8.768 230.867 230.867 0 00-164-67.7z"
        //     />
        //     <path
        //         fill={color}
        //         d="M483.411 166.79c-60.69-60.5-141.4-93.79-227.27-93.79s-166.56 33.29-227.26 93.79a27.037 27.037 0 0038.31 38.16 267.91 267.91 0 01377.9 0 27.039 27.039 0 1038.32-38.16z"
        //     />
        // </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path
                fill="#FF0000"
                fillRule="evenodd"
                d="M8.245 9.66L6.77 8.184a11.982 11.982 0 00-3.356 2.406L2 9.176l.075-.075a14.004 14.004 0 013.209-2.403l-3.991-3.99 1.414-1.415 20 20-1.414 1.414-6.588-6.588-.053.053a4 4 0 00-5.656 0L7.58 14.757a5.979 5.979 0 014.01-1.752L9.835 11.25a7.963 7.963 0 00-3.669 2.093L4.753 11.93a9.965 9.965 0 013.492-2.27zm5.082-.547a9.955 9.955 0 015.568 2.816l-1.376 1.376-4.192-4.192zM9.444 5.229c4.339-.793 8.98.472 12.354 3.797l-1.414 1.414a11.97 11.97 0 00-9.147-3.417L9.444 5.229zm.966 12.357a2 2 0 012.828 0L11.824 19l-1.414-1.414z"
            />
        </svg>
    );
}
export default NetworkIndicator;
