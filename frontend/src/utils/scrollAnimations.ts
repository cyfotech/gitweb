import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useBidirectionalScrollReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal sections with depth perspective
      const revealElements = document.querySelectorAll('.scroll-reveal-depth');
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 60,
            z: -200,
            rotationX: 8,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotationX: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 30%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);
}
