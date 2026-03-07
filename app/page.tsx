"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import DailyChallenge from "../components/DailyChallenge";

const variants: Variants = {
    hidden: { opacity: 0 },
    showing: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const animationItem: Variants = {
    hidden: {
        opacity: 0,
        scale: 0
    },
    showing: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            type: "spring", 
            bounce: 0.4
        }
    }
}

export default function Page() {
    const [highScore, setHighScore] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const parsedHighScore = parseInt(localStorage.getItem("highestScoreSuddenDeath") ?? "0");
        setHighScore(parsedHighScore > 0 ? parsedHighScore : null);
    }, []);

    return (
        <div className="min-h-screen min-w-screen relative overflow-x-hidden">
            <motion.div
                animate={{ y: [-800, 0]} } 
                transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
            >
                <img src="/images/smileys/smiley_cry.png" className="absolute top-0 left-0 corner-smiley hover:scale-125 ease-in-out duration-100" alt="" />
            </motion.div>
            <motion.div
                animate={{ y: [-800, 0]} } 
                transition={{ type: "spring", bounce: 0.4, duration: 1.8 }}
            >
                <img src="/images/smileys/smiley_clown.png" className="absolute top-0 right-0 corner-smiley hover:scale-125 ease-in-out duration-100" alt="" />
            </motion.div>
            <div className="intro-page bg-blue-500">
                <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-36 h-72 bg-white/90 border-4 border-black rounded-lg flex items-center justify-center text-xs text-slate-500 text-center p-2">
                        Advertisement
                    </div>
                </div>
                <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-36 h-72 bg-white/90 border-4 border-black rounded-lg flex items-center justify-center text-xs text-slate-500 text-center p-2">
                        Advertisement
                    </div>
                </div>
                <div className="container mx-auto px-4">
                    <motion.div 
                        animate={{ y: [-800, 0]} } 
                        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                        className="w-full lg:w-1/2 mx-auto pt-4 lg:pt-6 mb-4 lg:mb-6"
                    >
                        <div className="text-center">
                            <div>
                                <img alt="Triviamoji Logo" src="/images/horizontalLogo.png" className="main-logo h-auto w-[300px] lg:w-[460px] mx-auto relative z-20" />
                            </div>
                            <h2 className="text-base lg:text-xl mb-2 lg:mb-4 text-white">🧠 The emoji trivia game! 🤓</h2>
                        </div>
                    </motion.div>

                    <DailyChallenge />

                    <div className="grid grid-cols-3 mb-6">
                        <div className="col-span-full lg:col-start-2 lg:col-span-1">
                            <Link href={{ pathname: "/game", query: {isSuddenDeath: "true"}}}  
                            className="text-xl lg:text-xl flex justify-center items-center flex-col border-4 border-white ease-in-out duration-100 bg-black rounded-full py-3 lg:py-5 w-100 text-white whitespace-nowrap w-full cursor-pointer animate-bounce shadow-lift">
                                ☠️ Play Sudden Death Mode ☠️
                                <div className="text-xs lg:text-sm text-gray-400">thousands of questions!</div>
                            </Link>
                            {highScore !== null && (
                                <div className="text-center text-white text-sm lg:text-base mt-5">
                                    your high score is {highScore}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1">
                        <motion.div className="mb-4 lg:mb-6"
                            animate={{ y: [-800, 0]} } 
                            transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
                        >
                            <div>
                                <div className="flex justify-center flex-wrap mb-4">
                                    <div className="text-sm mb-4 px-10 py-2 text-center border-4 border-black relative z-10 bg-white text-black rounded-full inline-block lift">
                                        <div>
                                            <h3 className="text-sm lg:text-xl text-center">How to play</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center flex-wrap">
                                    <div>
                                        <h3 className="text-4xl text-center animate-bounce">👇</h3>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <div>
                <div style={{ marginBottom: "-15%" }}>
                    <img src="/images/blue_wave.svg" alt="" />
                </div>
            </div>
            <div className="container w-full lg:w-3/4 xl:w-2/3 mx-auto px-4">
                <motion.div 
                    initial="hidden"
                    whileInView="showing"
                    variants={variants}
                    viewport={{ once: true }}
                    className="grid grid-cols-12 gap-4 mb-10">
                    <motion.div variants={animationItem} className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="grid grid-cols-12 gap-4 lg:gap-0 bg-white border-black border-4 rounded-md p-4 lg:text-center h-full">
                            <div className="col-span-6 sm:col-span-12">
                                <img src="/images/landing/red.jpg" className="w-full rounded-md lg:mb-4" alt="" />
                            </div>
                            <div className="col-span-6 sm:col-span-12 flex items-center justify-start lg:justify-center">
                                <div className="text-left sm:text-center">
                                    <h3 className="text-md sm:text-lg lg:text-xl mb-2 lg:mb-4">🤯 tons of emoji combos!</h3>
                                    <p className="text-xs sm:text-md leading-relaxed">More questions added all the time!</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={animationItem} className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="grid grid-cols-12 gap-4 lg:gap-0 bg-white border-black border-4 rounded-md p-4 lg:text-center h-full">
                            <div className="col-span-6 sm:col-span-12">
                                <img src="/images/landing/yellow.jpg" className="w-full rounded-md lg:mb-4" alt="" />
                            </div>
                            <div className="col-span-6 sm:col-span-12 flex items-center justify-start lg:justify-center">
                                <div className="text-left sm:text-center">
                                    <h3 className="text-md sm:text-lg lg:text-xl mb-2 lg:mb-4">🛍️ Loads of categories!</h3>
                                    <p className="text-xs sm:text-md leading-relaxed">TV Shows, Disney Movies, Historical Events - and <strong>many, many more!</strong></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={animationItem} className="col-span-12 sm:col-start-4 sm:col-end-10 lg:col-span-4">
                        <div className="grid grid-cols-12 gap-4 lg:gap-0 bg-white border-black border-4 rounded-md p-4 lg:text-center h-full">
                            <div className="col-span-6 sm:col-span-12">
                                <img src="/images/landing/green.jpg" className="w-full rounded-md lg:mb-4" alt="" />
                            </div>
                            <div className="col-span-6 sm:col-span-12 flex items-center justify-start lg:justify-center">
                                <div className="text-left sm:text-center">
                                    <h3 className="text-md sm:text-lg lg:text-xl mb-2 lg:mb-4">🤷🏻‍♂️ How do I play?</h3>
                                    <p className="text-xs sm:text-md leading-relaxed">Look at the emoji puzzle, type your answer into the box and hit Enter! <strong>Simple as!</strong></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                
                <div>
                    <Link href={"https://x.com/eliothectorson"} target="_blank" className="flex items-center justify-center ease-in-out duration-100 hover:scale-105 py-6 cursor-pointer">
                        <div>
                            <img src="/images/x-logo.svg" className="mr-4 h-7 w-7" alt="X logo" />
                        </div>
                        <div>
                            <div className="text-xs text-black">Follow me on X</div>
                        </div>
                    </Link>
                </div>
                <div className="flex justify-center gap-6 text-xs pb-10">
                    <Link href="/privacy-policy" className="underline hover:text-blue-500">Privacy Policy</Link>
                    <Link href="/terms" className="underline hover:text-blue-500">Terms</Link>
                    <Link href="/contact" className="underline hover:text-blue-500">Contact</Link>
                </div>
            </div>
        </div>
    )
}
