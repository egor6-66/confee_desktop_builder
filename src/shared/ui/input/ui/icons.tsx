import React from 'react';

type Props = {
    color?: string;
    variants: 'hiddenPass' | 'visiblePass' | 'search' | 'clear';
};

function Icons(props: Props) {
    const { variants, color } = props;

    switch (variants) {
        case 'hiddenPass': {
            return (
                <svg style={{ cursor: 'pointer' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.8874 9.12922C18.202 7.68531 17.3864 6.50772 16.4406 5.59645L15.4486 6.58844C16.2575 7.36147 16.9621 8.37276 17.5714 9.63223C15.9493 12.9895 13.6467 14.5844 10.5 14.5844C9.55545 14.5844 8.68545 14.4389 7.88999 14.148L6.81515 15.2229C7.91995 15.733 9.14823 15.9881 10.5 15.9881C14.2472 15.9881 17.043 14.0365 18.8874 10.1333C18.9615 9.97632 19 9.80487 19 9.63126C19 9.45765 18.9615 9.2862 18.8874 9.12922ZM17.648 2.87786L16.8169 2.04574C16.8024 2.03124 16.7852 2.01974 16.7662 2.01189C16.7473 2.00404 16.727 2 16.7065 2C16.686 2 16.6657 2.00404 16.6468 2.01189C16.6279 2.01974 16.6107 2.03124 16.5962 2.04574L14.4638 4.1771C13.2882 3.57661 11.9669 3.27637 10.5 3.27637C6.75276 3.27637 3.95695 5.22797 2.11258 9.13117C2.03845 9.28815 2 9.4596 2 9.63321C2 9.80681 2.03845 9.97826 2.11258 10.1352C2.84942 11.6872 3.73651 12.9311 4.77386 13.8671L2.71074 15.9296C2.68151 15.9589 2.66509 15.9985 2.66509 16.0399C2.66509 16.0812 2.68151 16.1209 2.71074 16.1501L3.54304 16.9824C3.57229 17.0117 3.61195 17.0281 3.6533 17.0281C3.69465 17.0281 3.7343 17.0117 3.76355 16.9824L17.648 3.09856C17.6625 3.08407 17.674 3.06687 17.6819 3.04793C17.6897 3.029 17.6937 3.0087 17.6937 2.98821C17.6937 2.96771 17.6897 2.94741 17.6819 2.92848C17.674 2.90954 17.6625 2.89234 17.648 2.87786ZM3.4286 9.63223C5.05266 6.27493 7.3552 4.68012 10.5 4.68012C11.5633 4.68012 12.5302 4.8626 13.4073 5.23362L12.0367 6.60423C11.3876 6.2579 10.6444 6.12936 9.91666 6.23759C9.18895 6.34581 8.51529 6.68506 7.99506 7.20529C7.47483 7.72552 7.13558 8.39918 7.02736 9.12689C6.91913 9.85461 7.04767 10.5978 7.394 11.2469L5.7676 12.8733C4.86744 12.0789 4.09148 11.0024 3.4286 9.63223ZM8.23839 9.63223C8.23873 9.28844 8.32017 8.94958 8.47608 8.64317C8.63199 8.33676 8.85797 8.07145 9.13568 7.86879C9.41339 7.66613 9.73499 7.53184 10.0744 7.47682C10.4137 7.4218 10.7613 7.44761 11.0888 7.55215L8.34192 10.299C8.27307 10.0835 8.23814 9.85852 8.23839 9.63223Z"
                        fill="#717394"
                    />
                    <path
                        d="M10.422 11.819C10.3546 11.819 10.2881 11.8159 10.2222 11.8099L9.19238 12.8397C9.81177 13.0769 10.4866 13.1296 11.1353 12.9914C11.784 12.8533 12.3788 12.5302 12.8478 12.0612C13.3168 11.5922 13.6399 10.9974 13.778 10.3487C13.9162 9.69998 13.8635 9.02515 13.6263 8.40576L12.5965 9.43557C12.6025 9.50147 12.6056 9.56795 12.6056 9.63541C12.6058 9.92221 12.5494 10.2062 12.4397 10.4712C12.3301 10.7362 12.1692 10.977 11.9664 11.1798C11.7636 11.3826 11.5228 11.5434 11.2578 11.6531C10.9928 11.7628 10.7088 11.8192 10.422 11.819Z"
                        fill="#717394"
                    />
                </svg>
            );
        }
        case 'visiblePass': {
            return (
                <svg style={{ cursor: 'pointer' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.8874 8.98558C17.0391 5.00383 14.2453 3 10.5 3C6.75276 3 3.96086 5.00383 2.11258 8.98758C2.03845 9.14812 2 9.32346 2 9.501C2 9.67854 2.03845 9.85388 2.11258 10.0144C3.96086 13.9962 6.75471 16 10.5 16C14.2472 16 17.0391 13.9962 18.8874 10.0124C19.0375 9.68942 19.0375 9.31457 18.8874 8.98558ZM10.5 14.5644C7.3552 14.5644 5.05266 12.9334 3.4286 9.5C5.05266 6.06656 7.3552 4.43558 10.5 4.43558C13.6448 4.43558 15.9473 6.06656 17.5714 9.5C15.9493 12.9334 13.6467 14.5644 10.5 14.5644Z"
                        fill="#7B57C8"
                    />
                    <path
                        d="M10.422 5.9908C8.5269 5.9908 6.99057 7.56196 6.99057 9.5C6.99057 11.438 8.5269 13.0092 10.422 13.0092C12.317 13.0092 13.8534 11.438 13.8534 9.5C13.8534 7.56196 12.317 5.9908 10.422 5.9908ZM10.422 11.7331C9.21513 11.7331 8.23835 10.7342 8.23835 9.5C8.23835 8.2658 9.21513 7.26687 10.422 7.26687C11.6288 7.26687 12.6056 8.2658 12.6056 9.5C12.6056 10.7342 11.6288 11.7331 10.422 11.7331Z"
                        fill="#7B57C8"
                    />
                </svg>
            );
        }
        case 'search': {
            return (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_0_151)">
                        <path
                            d="M16.9878 15.8809L11.7706 10.6637C12.5802 9.61705 13.0182 8.33737 13.0182 6.99139C13.0182 5.38022 12.3894 3.86951 11.2523 2.73045C10.1153 1.59139 8.60054 0.9646 6.99139 0.9646C5.38223 0.9646 3.8675 1.59339 2.73045 2.73045C1.59139 3.8675 0.9646 5.38022 0.9646 6.99139C0.9646 8.60054 1.59339 10.1153 2.73045 11.2523C3.8675 12.3914 5.38022 13.0182 6.99139 13.0182C8.33737 13.0182 9.61505 12.5802 10.6617 11.7726L15.8789 16.9878C15.8942 17.0031 15.9123 17.0153 15.9323 17.0235C15.9523 17.0318 15.9738 17.0361 15.9954 17.0361C16.017 17.0361 16.0385 17.0318 16.0585 17.0235C16.0785 17.0153 16.0966 17.0031 16.1119 16.9878L16.9878 16.1139C17.0031 16.0986 17.0153 16.0805 17.0235 16.0605C17.0318 16.0405 17.0361 16.0191 17.0361 15.9974C17.0361 15.9758 17.0318 15.9543 17.0235 15.9343C17.0153 15.9144 17.0031 15.8962 16.9878 15.8809ZM10.1735 10.1735C9.32174 11.0233 8.19272 11.4914 6.99139 11.4914C5.79005 11.4914 4.66103 11.0233 3.80924 10.1735C2.95947 9.32174 2.49139 8.19272 2.49139 6.99139C2.49139 5.79005 2.95947 4.65902 3.80924 3.80924C4.66103 2.95947 5.79005 2.49139 6.99139 2.49139C8.19272 2.49139 9.32375 2.95746 10.1735 3.80924C11.0233 4.66103 11.4914 5.79005 11.4914 6.99139C11.4914 8.19272 11.0233 9.32375 10.1735 10.1735Z"
                            fill={color || '#CFCFCF'}
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_0_151">
                            <rect width="18" height="18" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            );
        }
        case 'clear': {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.6434 11.9951L18.6552 6.99422C18.8747 6.77471 18.998 6.477 18.998 6.16657C18.998 5.85614 18.8747 5.55842 18.6552 5.33892C18.4358 5.11941 18.1381 4.99609 17.8277 4.99609C17.5173 4.99609 17.2196 5.11941 17.0002 5.33892L12 10.3515L6.99983 5.33892C6.78036 5.11941 6.48268 4.99609 6.1723 4.99609C5.86191 4.99609 5.56424 5.11941 5.34476 5.33892C5.12529 5.55842 5.00199 5.85614 5.00199 6.16657C5.00199 6.477 5.12529 6.77471 5.34476 6.99422L10.3566 11.9951L5.34476 16.996C5.23552 17.1043 5.14881 17.2333 5.08964 17.3753C5.03047 17.5174 5 17.6697 5 17.8236C5 17.9775 5.03047 18.1299 5.08964 18.2719C5.14881 18.414 5.23552 18.5429 5.34476 18.6513C5.45312 18.7605 5.58203 18.8473 5.72406 18.9064C5.86609 18.9656 6.01843 18.9961 6.1723 18.9961C6.32616 18.9961 6.47851 18.9656 6.62054 18.9064C6.76257 18.8473 6.89148 18.7605 6.99983 18.6513L12 13.6387L17.0002 18.6513C17.1085 18.7605 17.2374 18.8473 17.3795 18.9064C17.5215 18.9656 17.6738 18.9961 17.8277 18.9961C17.9816 18.9961 18.1339 18.9656 18.2759 18.9064C18.418 18.8473 18.5469 18.7605 18.6552 18.6513C18.7645 18.5429 18.8512 18.414 18.9104 18.2719C18.9695 18.1299 19 17.9775 19 17.8236C19 17.6697 18.9695 17.5174 18.9104 17.3753C18.8512 17.2333 18.7645 17.1043 18.6552 16.996L13.6434 11.9951Z"
                        fill="white"
                    />
                </svg>
            );
        }
        default:
            return null;
    }
}

export default Icons;
