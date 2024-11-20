import React, { useEffect } from 'react';
import { AnimationManager } from './utils';

export default function GoldenKokonut({username = "NAME"}:{username?: string}) {
    const animateRef = React.useRef<HTMLDivElement>(null)
    const animationManager = new AnimationManager(animateRef, {
        enter: ["animate__fadeIn", "animate__slower"],
        exit: ["animate__fadeOut", "animate__slower"],
    });

    useEffect(() => {
        setInterval(() => {
            animationManager.initializeAnimation();
        }, 3000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='h-12 bg-[#FFD00D] items-center relative flex justify-center'>
            <div ref={animateRef}  className='animate__animated  flex justify-between items-end #gap-x-12 w-full absolute'>
                <Background className='h-12' />
                <Background className='h-12' />
            </div>
            <div className='flex flex-col items-center  text-base py-2 font-made-tommy font-extrabold leading-3'>
                <div className='text-[#581D1D] text-xs leading-loose capitalize'>{username} HAS JUST FOUND A</div>
                <h2 className='golden-kokonut-title text-lg font-[900] leading-none'>GOLDEN KOKONUT!</h2>
            </div>
        </div>
    )
}

const Background = ({ ...props }: React.ComponentProps<"svg">) => {
    return (
        <svg {...props} width="106" height="38" viewBox="0 0 106 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56 47C69.8071 47 81 35.8071 81 22C81 8.19288 69.8071 -3 56 -3C42.1929 -3 31 8.19288 31 22C31 35.8071 42.1929 47 56 47Z" fill="url(#paint0_radial_0_1)" />
            <path d="M49.751 22L56.0001 28.2525V22H49.751Z" fill="#FFEA88" />
            <path d="M49.751 22.0001L56.0001 15.751V22.0001H49.751Z" fill="#FFEA88" />
            <path d="M62.2525 22L56 28.2525V22H62.2525Z" fill="#FFEA88" />
            <path d="M62.2525 22.0001L56 15.751V22.0001H62.2525Z" fill="#FFEA88" />
            <path d="M56.3682 15.9686L58.0167 18.9843C58.2479 19.4065 58.5931 19.7516 59.0153 19.9828L62.0309 21.6314C62.3225 21.7889 62.3225 22.2077 62.0309 22.3652L59.0153 24.0138C58.5931 24.245 58.2479 24.5901 58.0167 25.0123L56.3682 28.028C56.2107 28.3195 55.7918 28.3195 55.6343 28.028L53.9858 25.0123C53.7546 24.5901 53.4094 24.245 52.9872 24.0138L49.9716 22.3652C49.6801 22.2077 49.6801 21.7889 49.9716 21.6314L52.9872 19.9828C53.4094 19.7516 53.7546 19.4065 53.9858 18.9843L55.6343 15.9686C55.7918 15.6771 56.2107 15.6771 56.3682 15.9686Z" fill="white" />
            <path d="M38 40C43.5228 40 48 35.5228 48 30C48 24.4772 43.5228 20 38 20C32.4772 20 28 24.4772 28 30C28 35.5228 32.4772 40 38 40Z" fill="url(#paint1_radial_0_1)" />
            <path d="M35.5 30L37.9997 32.501V30H35.5Z" fill="#FFEA88" />
            <path d="M35.5 30.0002L37.9997 27.5005V30.0002H35.5Z" fill="#FFEA88" />
            <path d="M40.501 30L38 32.501V30H40.501Z" fill="#FFEA88" />
            <path d="M40.501 30.0002L38 27.5005V30.0002H40.501Z" fill="#FFEA88" />
            <path d="M38.1471 27.5875L38.8065 28.7937C38.899 28.9626 39.037 29.1007 39.2059 29.1931L40.4122 29.8526C40.5288 29.9156 40.5288 30.0831 40.4122 30.1461L39.2059 30.8055C39.037 30.898 38.899 31.0361 38.8065 31.2049L38.1471 32.4112C38.0841 32.5278 37.9165 32.5278 37.8535 32.4112L37.1941 31.2049C37.1016 31.0361 36.9636 30.898 36.7947 30.8055L35.5884 30.1461C35.4718 30.0831 35.4718 29.9156 35.5884 29.8526L36.7947 29.1931C36.9636 29.1007 37.1016 28.9626 37.1941 28.7937L37.8535 27.5875C37.9165 27.4708 38.0841 27.4708 38.1471 27.5875Z" fill="white" />
            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" fill="url(#paint2_radial_0_1)" />
            <path d="M8.5 11L10.9997 13.501V11H8.5Z" fill="#FFEA88" />
            <path d="M8.5 11.0002L10.9997 8.50049V11.0002H8.5Z" fill="#FFEA88" />
            <path d="M13.501 11L11 13.501V11H13.501Z" fill="#FFEA88" />
            <path d="M13.501 11.0002L11 8.50049V11.0002H13.501Z" fill="#FFEA88" />
            <path d="M11.1471 8.58745L11.8065 9.79373C11.899 9.96261 12.037 10.1007 12.2059 10.1931L13.4122 10.8526C13.5288 10.9156 13.5288 11.0831 13.4122 11.1461L12.2059 11.8055C12.037 11.898 11.899 12.0361 11.8065 12.2049L11.1471 13.4112C11.0841 13.5278 10.9165 13.5278 10.8535 13.4112L10.1941 12.2049C10.1016 12.0361 9.96358 11.898 9.7947 11.8055L8.58843 11.1461C8.47182 11.0831 8.47182 10.9156 8.58843 10.8526L9.7947 10.1931C9.96358 10.1007 10.1016 9.96261 10.1941 9.79373L10.8535 8.58745C10.9165 8.47085 11.0841 8.47085 11.1471 8.58745Z" fill="white" />
            <path d="M91 41C98.1797 41 104 35.1797 104 28C104 20.8203 98.1797 15 91 15C83.8203 15 78 20.8203 78 28C78 35.1797 83.8203 41 91 41Z" fill="url(#paint3_radial_0_1)" />
            <path d="M87.75 28L90.9996 31.2513V28H87.75Z" fill="#FFEA88" />
            <path d="M87.75 28.0001L90.9996 24.7505V28.0001H87.75Z" fill="#FFEA88" />
            <path d="M94.2513 28L91 31.2513V28H94.2513Z" fill="#FFEA88" />
            <path d="M94.2513 28.0001L91 24.7505V28.0001H94.2513Z" fill="#FFEA88" />
            <path d="M91.1919 24.8637L92.0491 26.4318C92.1694 26.6514 92.3488 26.8309 92.5684 26.9511L94.1365 27.8083C94.2881 27.8902 94.2881 28.108 94.1365 28.1899L92.5684 29.0472C92.3488 29.1674 92.1694 29.3469 92.0491 29.5664L91.1919 31.1346C91.11 31.2862 90.8922 31.2862 90.8103 31.1346L89.953 29.5664C89.8328 29.3469 89.6533 29.1674 89.4338 29.0472L87.8656 28.1899C87.7141 28.108 87.7141 27.8902 87.8656 27.8083L89.4338 26.9511C89.6533 26.8309 89.8328 26.6514 89.953 26.4318L90.8103 24.8637C90.8922 24.7121 91.11 24.7121 91.1919 24.8637Z" fill="white" />
            <path d="M36 26C44.2843 26 51 19.2843 51 11C51 2.71573 44.2843 -4 36 -4C27.7157 -4 21 2.71573 21 11C21 19.2843 27.7157 26 36 26Z" fill="url(#paint4_radial_0_1)" />
            <path d="M32.251 11L36.0005 14.7515V11H32.251Z" fill="#FFEA88" />
            <path d="M32.251 11L36.0005 7.25049V11H32.251Z" fill="#FFEA88" />
            <path d="M39.7515 11L36 14.7515V11H39.7515Z" fill="#FFEA88" />
            <path d="M39.7515 11L36 7.25049V11H39.7515Z" fill="#FFEA88" />
            <path d="M36.2211 7.38118L37.2102 9.19059C37.349 9.44391 37.556 9.65098 37.8094 9.78971L39.6188 10.7788C39.7937 10.8733 39.7937 11.1246 39.6188 11.2191L37.8094 12.2083C37.556 12.347 37.349 12.5541 37.2102 12.8074L36.2211 14.6168C36.1266 14.7917 35.8753 14.7917 35.7808 14.6168L34.7917 12.8074C34.6529 12.5541 34.4459 12.347 34.1925 12.2083L32.3831 11.2191C32.2082 11.1246 32.2082 10.8733 32.3831 10.7788L34.1925 9.78971C34.4459 9.65098 34.6529 9.44391 34.7917 9.19059L35.7808 7.38118C35.8753 7.20627 36.1266 7.20627 36.2211 7.38118Z" fill="white" />
            <path d="M76 26C83.1797 26 89 20.1797 89 13C89 5.8203 83.1797 0 76 0C68.8203 0 63 5.8203 63 13C63 20.1797 68.8203 26 76 26Z" fill="url(#paint5_radial_0_1)" />
            <path d="M72.75 13L75.9996 16.2513V13H72.75Z" fill="#FFEA88" />
            <path d="M72.75 13.0001L75.9996 9.75049V13.0001H72.75Z" fill="#FFEA88" />
            <path d="M79.2513 13L76 16.2513V13H79.2513Z" fill="#FFEA88" />
            <path d="M79.2513 13.0001L76 9.75049V13.0001H79.2513Z" fill="#FFEA88" />
            <path d="M76.1919 9.86369L77.0491 11.4318C77.1694 11.6514 77.3488 11.8309 77.5684 11.9511L79.1365 12.8083C79.2881 12.8902 79.2881 13.108 79.1365 13.1899L77.5684 14.0472C77.3488 14.1674 77.1694 14.3469 77.0491 14.5664L76.1919 16.1346C76.11 16.2862 75.8922 16.2862 75.8103 16.1346L74.953 14.5664C74.8328 14.3469 74.6533 14.1674 74.4338 14.0472L72.8656 13.1899C72.7141 13.108 72.7141 12.8902 72.8656 12.8083L74.4338 11.9511C74.6533 11.8309 74.8328 11.6514 74.953 11.4318L75.8103 9.86369C75.8922 9.7121 76.11 9.7121 76.1919 9.86369Z" fill="white" />
            <path d="M55 14C58.866 14 62 10.866 62 7C62 3.13401 58.866 0 55 0C51.134 0 48 3.13401 48 7C48 10.866 51.134 14 55 14Z" fill="url(#paint6_radial_0_1)" />
            <path d="M53.25 7L54.9998 8.7507V7H53.25Z" fill="#FFEA88" />
            <path d="M53.25 6.99977L54.9998 5.25V6.99977H53.25Z" fill="#FFEA88" />
            <path d="M56.7507 7L55 8.7507V7H56.7507Z" fill="#FFEA88" />
            <path d="M56.7507 6.99977L55 5.25V6.99977H56.7507Z" fill="#FFEA88" />
            <path d="M55.1032 5.31122L55.5648 6.15561C55.6296 6.27382 55.7262 6.37046 55.8444 6.4352L56.6888 6.8968C56.7704 6.94089 56.7704 7.05817 56.6888 7.10227L55.8444 7.56387C55.7262 7.6286 55.6296 7.72524 55.5648 7.84345L55.1032 8.68784C55.0591 8.76947 54.9419 8.76947 54.8978 8.68784L54.4362 7.84345C54.3714 7.72524 54.2748 7.6286 54.1566 7.56387L53.3122 7.10227C53.2306 7.05817 53.2306 6.94089 53.3122 6.8968L54.1566 6.4352C54.2748 6.37046 54.3714 6.27382 54.4362 6.15561L54.8978 5.31122C54.9419 5.22959 55.0591 5.22959 55.1032 5.31122Z" fill="white" />
            <path d="M73 39C76.866 39 80 35.866 80 32C80 28.134 76.866 25 73 25C69.134 25 66 28.134 66 32C66 35.866 69.134 39 73 39Z" fill="url(#paint7_radial_0_1)" />
            <path d="M71.25 32L72.9998 33.7507V32H71.25Z" fill="#FFEA88" />
            <path d="M71.25 31.9998L72.9998 30.25V31.9998H71.25Z" fill="#FFEA88" />
            <path d="M74.7507 32L73 33.7507V32H74.7507Z" fill="#FFEA88" />
            <path d="M74.7507 31.9998L73 30.25V31.9998H74.7507Z" fill="#FFEA88" />
            <path d="M73.1032 30.3112L73.5648 31.1556C73.6296 31.2738 73.7262 31.3705 73.8444 31.4352L74.6888 31.8968C74.7704 31.9409 74.7704 32.0582 74.6888 32.1023L73.8444 32.5639C73.7262 32.6286 73.6296 32.7252 73.5648 32.8435L73.1032 33.6878C73.0591 33.7695 72.9419 33.7695 72.8978 33.6878L72.4362 32.8435C72.3714 32.7252 72.2748 32.6286 72.1566 32.5639L71.3122 32.1023C71.2306 32.0582 71.2306 31.9409 71.3122 31.8968L72.1566 31.4352C72.2748 31.3705 72.3714 31.2738 72.4362 31.1556L72.8978 30.3112C72.9419 30.2296 73.0591 30.2296 73.1032 30.3112Z" fill="white" />
            <path d="M99 18C102.866 18 106 14.866 106 11C106 7.13401 102.866 4 99 4C95.134 4 92 7.13401 92 11C92 14.866 95.134 18 99 18Z" fill="url(#paint8_radial_0_1)" />
            <path d="M97.25 11L98.9998 12.7507V11H97.25Z" fill="#FFEA88" />
            <path d="M97.25 10.9998L98.9998 9.25V10.9998H97.25Z" fill="#FFEA88" />
            <path d="M100.751 11L99 12.7507V11H100.751Z" fill="#FFEA88" />
            <path d="M100.751 10.9998L99 9.25V10.9998H100.751Z" fill="#FFEA88" />
            <path d="M99.1032 9.31122L99.5648 10.1556C99.6296 10.2738 99.7262 10.3705 99.8444 10.4352L100.689 10.8968C100.77 10.9409 100.77 11.0582 100.689 11.1023L99.8444 11.5639C99.7262 11.6286 99.6296 11.7252 99.5648 11.8435L99.1032 12.6878C99.0591 12.7695 98.9419 12.7695 98.8978 12.6878L98.4362 11.8435C98.3714 11.7252 98.2748 11.6286 98.1566 11.5639L97.3122 11.1023C97.2306 11.0582 97.2306 10.9409 97.3122 10.8968L98.1566 10.4352C98.2748 10.3705 98.3714 10.2738 98.4362 10.1556L98.8978 9.31122C98.9419 9.22959 99.0591 9.22959 99.1032 9.31122Z" fill="white" />
            <path d="M18 48C27.9411 48 36 39.9411 36 30C36 20.0589 27.9411 12 18 12C8.05887 12 0 20.0589 0 30C0 39.9411 8.05887 48 18 48Z" fill="url(#paint9_radial_0_1)" />
            <path d="M13.501 30L18.0004 34.5018V30H13.501Z" fill="#FFEA88" />
            <path d="M13.501 29.9999L18.0004 25.5005V29.9999H13.501Z" fill="#FFEA88" />
            <path d="M22.5018 30L18 34.5018V30H22.5018Z" fill="#FFEA88" />
            <path d="M22.5018 29.9999L18 25.5005V29.9999H22.5018Z" fill="#FFEA88" />
            <path d="M18.2649 25.6574L19.4519 27.8287C19.6184 28.1327 19.8669 28.3812 20.1708 28.5476L22.3421 29.7346C22.552 29.848 22.552 30.1496 22.3421 30.263L20.1708 31.4499C19.8669 31.6164 19.6184 31.8649 19.4519 32.1689L18.2649 34.3402C18.1515 34.5501 17.85 34.5501 17.7366 34.3402L16.5496 32.1689C16.3831 31.8649 16.1346 31.6164 15.8307 31.4499L13.6594 30.263C13.4495 30.1496 13.4495 29.848 13.6594 29.7346L15.8307 28.5476C16.1346 28.3812 16.3831 28.1327 16.5496 27.8287L17.7366 25.6574C17.85 25.4475 18.1515 25.4475 18.2649 25.6574Z" fill="white" />
            <defs>
                <radialGradient id="paint0_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(56 22) scale(25)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint1_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(38 30) scale(10)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint2_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11 11) scale(10)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint3_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(91 28) scale(13)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint4_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(36 11) scale(15)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint5_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(76 13) scale(13)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint6_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55 7) scale(7)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint7_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(73 32) scale(7)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint8_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(99 11) scale(7)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="paint9_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 30) scale(18)">
                    <stop offset="0.18" stop-color="white" stop-opacity="0.3" />
                    <stop offset="0.54" stop-color="#FFF8A7" stop-opacity="0.09" />
                    <stop offset="0.69" stop-color="#FFF580" stop-opacity="0" />
                </radialGradient>
            </defs>
        </svg>

    )
}