import { useRef, useEffect } from 'react';
import { gsap, Back, SteppedEase } from 'gsap';
import './NotFound.css';

const NotFound = () => {
    const copyContainerRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useRef<HTMLSpanElement | null>(null);
    const textRef = useRef<HTMLParagraphElement | null>(null);
    const splitTextTimeline = useRef(gsap.timeline({ paused: true }));
    const handleTL = useRef(gsap.timeline());

    useEffect(() => {
        const copyWidth = textRef.current ? textRef.current.offsetWidth : 0;

        // Text animation
        splitTextTimeline.current.fromTo(
            textRef.current,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                ease: Back.easeInOut.config(1.7),
                onComplete: () => animateHandle(copyWidth),
                duration: 1,
            }
        );

        // Handle blink animation
        handleTL.current.fromTo(
            handleRef.current,
            0.4,
            { autoAlpha: 0 },
            { autoAlpha: 1, repeat: -1, yoyo: true }
        );

        splitTextTimeline.current.play();

        return () => {
            splitTextTimeline.current.clear();
            handleTL.current.clear();
        };
    }, []);

    const animateHandle = (width: number) => {
        handleTL.current.to(handleRef.current, 0.7, {
            x: width,
            ease: SteppedEase.config(12),
        });
    };

    const handleReplay = () => {
        splitTextTimeline.current.restart();
        handleTL.current.restart();
    };

    return (
        <div className="container">
            <div className="copy-container center-xy" ref={copyContainerRef}>
                <p ref={textRef}>404, page not found.</p>
                <span className="handle" ref={handleRef} />
            </div>

            <svg
                id="cb-replay"
                onClick={handleReplay}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 279.9 297.3"
            >
                <g>
                    <path d="M269.4,162.6c-2.7,66.5-55.6,120.1-121.8,123.9c-77,4.4-141.3-60-136.8-136.9C14.7,81.7,71,27.8,140,27.8
            c1.8,0,3.5,0,5.3,0.1c0.3,0,0.5,0.2,0.5,0.5v15c0,1.5,1.6,2.4,2.9,1.7l35.9-20.7c1.3-0.7,1.3-2.6,0-3.3L148.6,0.3
            c-1.3-0.7-2.9,0.2-2.9,1.7v15c0,0.3-0.2,0.5-0.5,0.5c-1.7-0.1-3.5-0.1-5.2-0.1C63.3,17.3,1,78.9,0,155.4
            C-1,233.8,63.4,298.3,141.9,297.3c74.6-1,135.1-60.2,138-134.3c0.1-3-2.3-5.4-5.3-5.4l0,0C271.8,157.6,269.5,159.8,269.4,162.6z"/>
                </g>
            </svg>
        </div>
    );
};

export default NotFound;