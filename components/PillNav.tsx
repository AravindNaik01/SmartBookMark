'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { SearchBar } from './SearchBar';
import { Bookmark } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"

export type PillNavItem = {
    label: string;
    href: string;
    ariaLabel?: string;
    onClick?: () => void;
};

export interface PillNavProps {
    items?: PillNavItem[];
    user: User | null;
}

const PillNav: React.FC<PillNavProps> = ({
    items = [],
    user
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
    const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
    const hamburgerRef = useRef<HTMLButtonElement | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);
    const navItemsRef = useRef<HTMLDivElement | null>(null);
    const logoRef = useRef<HTMLAnchorElement | null>(null);

    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()

    // Default color settings
    const baseColor = '#000';
    const pillColor = '#fff';
    const hoveredPillTextColor = '#fff';
    const pillTextColor = '#000';
    const ease = 'power3.easeOut';

    const showSearchBar = user && pathname !== '/';

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    };

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    };

    // Combine items with Auth item, memoized to prevent re-renders
    const navItems = React.useMemo(() => {
        const baseItems = [
            ...items,
            user
                ? { label: 'Sign Out', onClick: handleLogout, href: '#' }
                : { label: 'Sign In', onClick: handleLogin, href: '#' }
        ];

        // Filter out the item if its href matches the current pathname
        // Except for logout/login which have href='#'
        return baseItems.filter(item => item.href !== pathname || item.href === '#');
    }, [items, user, pathname]);

    useEffect(() => {
        const layout = () => {
            navItems.forEach((item, index) => {
                const circle = circleRefs.current[index];
                if (!circle?.parentElement) return;

                const pill = circle.parentElement as HTMLElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                const label = pill.querySelector<HTMLElement>('.pill-label');
                const white = pill.querySelector<HTMLElement>('.pill-label-hover');

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        layout();

        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if (document.fonts) {
            document.fonts.ready.then(layout).catch(() => { });
        }

        // Initial Load Animation
        const logo = logoRef.current;
        if (logo) {
            gsap.set(logo, { scale: 0 });
            gsap.to(logo, { scale: 1, duration: 0.6, ease });
        }

        return () => window.removeEventListener('resize', onResize);
    }, [navItems]); // Changed dependency to navItems

    const handleEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const cssVars = {
        ['--base']: baseColor,
        ['--pill-bg']: pillColor,
        ['--hover-text']: hoveredPillTextColor,
        ['--pill-text']: pillTextColor,
        ['--nav-h']: '48px', // Increased slightly for better click area
        ['--pill-pad-x']: '20px',
        ['--pill-gap']: '4px'
    } as React.CSSProperties;

    return (
        <div className="relative w-full z-50">
            <nav
                className="flex items-center justify-between w-full"
                style={cssVars}
            >
                {/* Left: Logo */}
                <div className="flex-1 flex items-center">
                    <Link
                        href="/"
                        ref={logoRef}
                        className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden shrink-0 group hover:scale-105 transition-transform"
                        style={{
                            width: 'var(--nav-h)',
                            height: 'var(--nav-h)',
                            background: 'var(--base, #000)'
                        }}
                    >
                        <Bookmark className="w-5 h-5 text-white fill-current" />
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <div className="w-full max-w-sm">
                        {showSearchBar && <SearchBar />}
                    </div>
                </div>

                {/* Right: User Auth & Menu */}
                <div className="flex-1 flex items-center justify-end">
                    <div
                        ref={navItemsRef}
                        className="relative items-center rounded-full flex max-w-full"
                        style={{
                            height: 'var(--nav-h)',
                            background: 'var(--base, #000)'
                        }}
                    >
                        <ul className="list-none flex items-stretch m-0 p-[3px] h-full overflow-x-auto no-scrollbar mask-image-linear-to-r" style={{ gap: 'var(--pill-gap)' }}>
                            {navItems.map((item, i) => (
                                <li key={i} className="flex h-full">
                                    {/* Use button if onClick is present, Link otherwise */}
                                    {item.onClick ? (
                                        <button
                                            onClick={item.onClick}
                                            className="relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full font-semibold text-sm uppercase tracking-wide whitespace-nowrap px-0 cursor-pointer border-none"
                                            style={{
                                                background: 'var(--pill-bg, #fff)',
                                                color: 'var(--pill-text, #000)',
                                                paddingLeft: 'var(--pill-pad-x)',
                                                paddingRight: 'var(--pill-pad-x)'
                                            }}
                                            onMouseEnter={() => handleEnter(i)}
                                            onMouseLeave={() => handleLeave(i)}
                                        >
                                            <span
                                                ref={el => { circleRefs.current[i] = el }}
                                                className="absolute left-1/2 bottom-0 rounded-full z-[1] pointer-events-none"
                                                style={{ background: 'var(--base, #000)' }}
                                            />
                                            <span className="relative z-[2] block overflow-hidden">
                                                <span className="pill-label block">{item.label}</span>
                                                <span className="pill-label-hover absolute top-0 left-0 block w-full text-center" style={{ color: 'var(--hover-text, #fff)' }}>{item.label}</span>
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full font-semibold text-sm uppercase tracking-wide whitespace-nowrap px-0"
                                            style={{
                                                background: 'var(--pill-bg, #fff)',
                                                color: 'var(--pill-text, #000)',
                                                paddingLeft: 'var(--pill-pad-x)',
                                                paddingRight: 'var(--pill-pad-x)'
                                            }}
                                            onMouseEnter={() => handleEnter(i)}
                                            onMouseLeave={() => handleLeave(i)}
                                        >
                                            {/* Circle animation */}
                                            <span
                                                ref={el => { circleRefs.current[i] = el }}
                                                className="absolute left-1/2 bottom-0 rounded-full z-[1] pointer-events-none"
                                                style={{ background: 'var(--base, #000)' }}
                                            />
                                            {/* Text */}
                                            <span className="relative z-[2] block overflow-hidden">
                                                <span className="pill-label block">{item.label}</span>
                                                <span className="pill-label-hover absolute top-0 left-0 block w-full text-center" style={{ color: 'var(--hover-text, #fff)' }}>{item.label}</span>
                                            </span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Auth Button - This component is now redundant as its functionality is integrated into the pills */}
                    {/* <div className="flex items-center gap-2">
                        <AuthButton user={user} className="font-medium" variant="ghost" />
                    </div> */}
                </div>

            </nav>
        </div>
    );
};

export default PillNav;
