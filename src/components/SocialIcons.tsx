type IconProps = {
  className?: string;
};

export function TwitterIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#twitter-clip)">
        <path
          d="M19.4654 4.49824C19.4785 4.68855 19.4785 4.87887 19.4785 5.07093C19.4785 10.9233 15.0233 17.6728 6.87669 17.6728V17.6693C4.47016 17.6728 2.11361 16.9834 0.0877075 15.6837C0.437637 15.7258 0.78932 15.7468 1.14188 15.7477C3.13622 15.7495 5.07354 15.0803 6.64253 13.8481C4.74729 13.8122 3.08535 12.5764 2.50476 10.7724C3.16867 10.9005 3.85274 10.8741 4.50436 10.6961C2.43811 10.2787 0.951568 8.46323 0.951568 6.35488V6.29876C1.56723 6.64167 2.25657 6.83198 2.96169 6.85303C1.01559 5.55241 0.415712 2.96346 1.59091 0.93931C3.83958 3.7063 7.15733 5.38841 10.7189 5.56645C10.362 4.02816 10.8496 2.4162 12.0002 1.33484C13.7841 -0.342011 16.5896 -0.256063 18.2665 1.52691C19.2584 1.33134 20.2091 0.967374 21.0791 0.451689C20.7485 1.47692 20.0565 2.3478 19.1321 2.90119C20.01 2.79771 20.8677 2.56267 21.6755 2.20397C21.0808 3.09502 20.3319 3.87117 19.4654 4.49824Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="twitter-clip">
          <rect width="21.75" height="17.8911" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function GithubIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#github-clip)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 0C4.0275 0 0 4.0275 0 9C0 12.9825 2.57625 16.3463 6.15375 17.5388C6.60375 17.6175 6.7725 17.3475 6.7725 17.1113C6.7725 16.8975 6.76125 16.1888 6.76125 15.435C4.5 15.8513 3.915 14.8837 3.735 14.3775C3.63375 14.1187 3.195 13.32 2.8125 13.1062C2.4975 12.9375 2.0475 12.5212 2.80125 12.51C3.51 12.4987 4.01625 13.1625 4.185 13.4325C4.995 14.7937 6.28875 14.4113 6.80625 14.175C6.885 13.59 7.12125 13.1962 7.38 12.9712C5.3775 12.7462 3.285 11.97 3.285 8.5275C3.285 7.54875 3.63375 6.73875 4.2075 6.10875C4.1175 5.88375 3.8025 4.96125 4.2975 3.72375C4.2975 3.72375 5.05125 3.4875 6.7725 4.64625C7.4925 4.44375 8.2575 4.3425 9.0225 4.3425C9.7875 4.3425 10.5525 4.44375 11.2725 4.64625C12.9938 3.47625 13.7475 3.72375 13.7475 3.72375C14.2425 4.96125 13.9275 5.88375 13.8375 6.10875C14.4113 6.73875 14.76 7.5375 14.76 8.5275C14.76 11.9812 12.6563 12.7462 10.6538 12.9712C10.98 13.2525 11.2613 13.7925 11.2613 14.6363C11.2613 15.84 11.25 16.8075 11.25 17.1113C11.25 17.3475 11.4188 17.6288 11.8688 17.5388C15.4238 16.3463 18 12.9712 18 9C18 4.0275 13.9725 0 9 0Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="github-clip">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function CopyIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#copy-clip)">
        <path
          d="M13.125 13.125H16.875V3.125H6.875V6.875"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.125 6.875H3.125V16.875H13.125V6.875Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="copy-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function LinkedinIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#linkedin-clip)">
        <path
          d="M16 0C17.1046 0 18 0.89543 18 2V16C18 17.1046 17.1046 18 16 18H2C0.89543 18 0 17.1046 0 16V2C0 0.89543 0.89543 0 2 0H16ZM2.75781 15.5H5.44238V6.83301H2.75781V15.5ZM12.3457 6.56836C10.5066 6.56836 9.73242 8.00098 9.73242 8.00098V6.83301H7.1582V15.5H9.73242V10.9502C9.73254 9.73142 10.2943 9.00586 11.3682 9.00586C12.355 9.00608 12.829 9.7033 12.8291 10.9502V15.5H15.5V10.0127C15.4999 7.69114 14.1839 6.56838 12.3457 6.56836Z"
          fill="currentColor"
        />
        <path
          d="M4.08691 2.5C3.21029 2.50024 2.5 3.21659 2.5 4.09961C2.50017 4.98248 3.21039 5.69801 4.08691 5.69824C4.96363 5.69824 5.67366 4.98263 5.67383 4.09961C5.67383 3.21645 4.96374 2.5 4.08691 2.5Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="linkedin-clip">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
