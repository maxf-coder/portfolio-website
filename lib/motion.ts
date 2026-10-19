export const fadeUpHero = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
export const fadeUpHeading = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
export const fadeUpCard = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
export const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
export const slideFromLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } };
export const slideFromRight = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } };

export const revealSlow = { duration: 0.6, ease: "easeOut" } as const;
export const revealCard = { duration: 0.5, ease: "easeOut" } as const;
export const heroItem = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;

export const staggerHero = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } } };
export const staggerCards = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export const viewSection = { once: true, margin: "-100px" };
export const viewCard = { once: true, margin: "-50px" };
export const viewOnce = { once: true };

export const navIndicator = { type: "spring", stiffness: 400, damping: 30 } as const;
export const navPanel = { duration: 0.25, ease: [0.22, 1, 0.36, 1] } as const;
export const navItem = { duration: 0.3, ease: [0.22, 1, 0.36, 1] } as const;
export const navItemStart = 0.15;
export const navItemStep = 0.07;