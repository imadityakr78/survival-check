"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Unlock, CheckCircle2, Flame, AlertTriangle, ScrollText, CalendarClock } from "lucide-react";
import { saveResponses } from "./actions";

// --- HIGH-DENSITY SWAYING EMOJIS BACKGROUND (Including Cats!) ---
const FloatingEmojis = () => {
  // Added cat emojis to the mix! 🐱🐈😻🐾
  const emojiSourceList = ["🌸", "✨", "🦋", "💖", "☕", "🐱", "🐈", "🍦", "💫", "😻", "🌈", "🐾"];

  // High number for "dense" feel.
  const emojiCount = 70;

  // useMemo ensures these random values are only generated once on mount
  const generatedEmojiData = useMemo(() => {
    return Array.from({ length: emojiCount }).map((_, i) => {
      // Base horizontal position (0% to 100% of screen width)
      const baseLeft = Math.random() * 100;
      // How far it will sway left and right during ascent (5vw to 15vw)
      const swayAmplitude = 5 + Math.random() * 10;

      return {
        emoji: emojiSourceList[Math.floor(Math.random() * emojiSourceList.length)],
        // Random sizes for depth
        size: ["text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl"][Math.floor(Math.random() * 5)],

        // Base positioning
        initialLeft: `${baseLeft}vw`,

        // Vertical movement (rise) config
        riseDuration: 12 + Math.random() * 18, // 12s to 30s climb (slightly faster)
        delay: Math.random() * -20, // Negative delay makes them start at different heights immediately on load

        // Horizontal sway (moving left and right) config
        swayDuration: 3 + Math.random() * 4, // 3s to 7s per sway cycle
        animateX: [`-${swayAmplitude}vw`, `${swayAmplitude}vw`], // sway path relative to base position
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {generatedEmojiData.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.size} z-0 opacity-0`}
          style={{ left: item.initialLeft }} // base horizontal anchor
          initial={{ y: "110vh", opacity: 0, rotate: 0 }}

          // Applying multiple concurrent animations (Rise, Fade, Rotate)
          animate={{
            y: "-15vh", // Rise to above screen
            opacity: [0, 0.6, 0.6, 0], // Quick fade in, hold, fade out at top
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1) // Spin randomly
          }}
          transition={{
            y: { duration: item.riseDuration, repeat: Infinity, delay: item.delay, ease: "linear" },
            opacity: { duration: item.riseDuration, repeat: Infinity, delay: item.delay, ease: "linear" },
            rotate: { duration: item.riseDuration, repeat: Infinity, delay: item.delay, ease: "linear" }
          }}
        >
          {/* Internal motion div handles the horizontal left/right sway independent of rising */}
          <motion.div
            animate={{ x: item.animateX }}
            transition={{
              duration: item.swayDuration,
              repeat: Infinity,
              repeatType: "mirror", // Wobble back and forth
              ease: "easeInOut", // Smooth turn at ends
              delay: Math.random() * 5 // random phase start for sway
            }}
          >
            {item.emoji}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// --- FRAMER MOTION COMPONENT VARIANTS ---
const pageVariants: import("framer-motion").Variants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function SurvivalCheck() {
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [answers, setAnswers] = useState({
    name: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    reward: "",
    time: ""
  });

  // Animation mounting safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (step === 6) {
      const timer = setTimeout(() => {
        setStep(7);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedName = nameInput.toLowerCase().trim();

    // Accepting "sam" or anything starting with "samridhi"
    if (normalizedName === "sam" || normalizedName.startsWith("samridhi")) {
      setError(false);
      setAnswers({ ...answers, name: nameInput });
      setStep(1);
    } else {
      setError(true);
    }
  };

  const handleWhatsAppRedirect = (timeChoice: string) => {
    const PHONE_NUMBER = "917857825881"; // Restored original number
    const message = `*${timeChoice}*`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    // Save to Neon DB silently
    const finalData = { ...answers, time: timeChoice };
    saveResponses(finalData);

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    setStep(10);
  };

  // Prevent hydration errors by not rendering until mounted on client
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200"></main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 text-slate-800 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">

      {/* Background Floating/Swaying Animations (Starts immediately on load) */}
      <FloatingEmojis />

      {/* Main Content Card (Z-index ensures it sits above emojis) */}
      <motion.div
        className="max-w-md w-full bg-white/70 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-lg p-6 sm:p-8 z-10 relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >

        {/* PROGRESS BAR */}
        {step > 0 && step < 10 && (
          <div className="w-full bg-pink-100 h-2.5 rounded-full mb-8 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 9) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 0: SECURITY (First Page - Emojis float behind this now) */}
          {step === 0 && (
            <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <motion.div
                  className="bg-pink-100 p-4 rounded-full shadow-sm"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Lock className="w-10 h-10 text-pink-500" />
                </motion.div>
                <h1 className="text-2xl font-bold tracking-tight text-center text-slate-800">End of Semester Protocol</h1>
                <p className="text-slate-500 text-center text-sm font-medium bg-white/50 px-3 py-1 rounded-full border border-pink-50">Security clearance required. Proxy lagana mana hai.</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter first name to unlock..."
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setError(false);
                    }}
                    className={`w-full bg-white border-2 ${error ? "border-red-400 focus:ring-red-400" : "border-pink-200 focus:ring-pink-400"} rounded-2xl px-5 py-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all placeholder:text-slate-400 shadow-sm`}
                  />
                  {error && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-sm mt-2 font-medium px-2">
                      Access Denied: Galat naam daal rahe ho.
                    </motion.p>
                  )}
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Authenticate
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 1: Q1 */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-pink-200">System Unlocked</span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">Semester khatam hote hote dimag ka dahi kitna baar hua?</h2>
              </div>
              <div className="space-y-3">
                {["Ginti bhool gaye hain", "Bina sattu piye dimag chal hi nahi raha", "Ekdum bhaukal tight rakhe the"].map((option, idx) => (
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 207, 232, 0.3)" }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => { setAnswers({ ...answers, q1: option }); setStep(2); }} className="w-full text-left bg-white border-2 border-pink-100 text-slate-700 font-medium rounded-2xl p-4 transition-colors shadow-sm">
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Q2 */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
                  <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </motion.div>
                  Academic Check
                </span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">Attendance aur endless assignments manage karte karte aatma kitni baar nikli?</h2>
              </div>
              <div className="space-y-3">
                {["Roz subah uthna ek saza thi", "Deadlines ne rula ke rakh diya", "Bas zinda bache hain, wahi bohot hai"].map((option, idx) => (
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(254, 243, 199, 0.5)" }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => { setAnswers({ ...answers, q2: option }); setStep(3); }} className="w-full text-left bg-white border-2 border-pink-100 text-slate-700 font-medium rounded-2xl p-4 transition-colors shadow-sm">
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Q3 */}
          {step === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-rose-200">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </motion.div>
                  Anxiety Module
                </span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">Ticket 21 ka Motihari ka ban gaya hai, par exams 16-22 ke beech hain. Kitna dar lag raha hai?</h2>
              </div>
              <div className="space-y-3">
                {["Anxiety ekdum peak pe hai", "Bhagwan bharose chhod diye hain ab", "Exam shift hua toh yahin baith ke roungi"].map((option, idx) => (
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(ffe4e6, 0.5)" }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => { setAnswers({ ...answers, q3: option }); setStep(4); }} className="w-full text-left bg-white border-2 border-pink-100 text-slate-700 font-medium rounded-2xl p-4 transition-colors shadow-sm">
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Q4 */}
          {step === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="inline-block bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-sky-200">Weather Module...</span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">Garmi itni hai ki relief ke liye kya karne ka mann kar raha hai?</h2>
              </div>
              <div className="space-y-3">
                {["Din bhar AC ke aage pade raho", "Thandi Ice Cream ya Shakes chahiye", "Bas jaldi se ghar pohoch jayein"].map((option, idx) => (
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(224, 242, 254, 0.5)" }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => { setAnswers({ ...answers, q4: option }); setStep(5); }} className="w-full text-left bg-white border-2 border-pink-100 text-slate-700 font-medium rounded-2xl p-4 transition-colors shadow-sm">
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Q5 (Crush) */}
          {step === 5 && (
            <motion.div key="step5" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 bg-fuchsia-100 text-fuchsia-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-fuchsia-200">
                  <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 0.5, repeat: Infinity }}>
                    <Flame className="w-4 h-4" />
                  </motion.div>
                  Gossip Protocol Initiated
                </span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">Sach sach batana, is semester mein campus pe kisi pe crush aaya kya?</h2>
              </div>
              <div className="space-y-3">
                {["Haan, ek hai...", "Nahi mitarr, bas padhai (aur thoda rona)", "Top Secret hai, system ko nahi bataungi"].map((option, idx) => (
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(fae8ff, 0.5)" }} whileTap={{ scale: 0.98 }} key={idx} onClick={() => { setAnswers({ ...answers, q5: option }); setStep(6); }} className="w-full text-left bg-white border-2 border-pink-100 text-slate-700 font-medium rounded-2xl p-4 transition-colors shadow-sm">
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 6: LOADING */}
          {step === 6 && (
            <motion.div key="step6" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
              <Loader2 className="w-14 h-14 text-pink-500 animate-spin" />
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Analyzing performance...</h2>
                <p className="text-slate-500 font-mono text-sm bg-slate-100 px-4 py-2 rounded-lg inline-block border border-slate-200 shadow-inner">Calculating assignments, ticket anxiety & semester exhaustion</p>
              </div>
            </motion.div>
          )}

          {/* STEP 7: REWARD CHOICE */}
          {step === 7 && (
            <motion.div key="step7" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8 space-y-5">
                <div className="inline-flex items-center space-x-2 text-emerald-600 bg-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 shadow-sm">
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Unlock className="w-4 h-4" />
                  </motion.div>
                  <span>Diagnosis Complete</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">Critical levels of academic exhaustion detected.</h2>
                <p className="text-slate-600 leading-relaxed font-medium bg-white/50 p-4 rounded-xl border border-pink-50">
                  You have successfully survived the assignments, the attendance drops, and har mahine praticals. Ek aakhri off-screen campus meetup is highly recommended.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-700 pl-1">Claim your survival reward:</h3>
                <div className="grid grid-cols-1 gap-3">
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 207, 232, 0.3)" }} whileTap={{ scale: 0.98 }} onClick={() => { setAnswers({ ...answers, reward: "Coffee/Shakes" }); setStep(9); }} className="w-full text-center bg-white border-2 border-pink-100 text-slate-700 font-bold rounded-2xl p-4 transition-colors shadow-sm">
                    Thick Cold Coffee / Shakes / Barf-Gola
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 207, 232, 0.3)" }} whileTap={{ scale: 0.98 }} onClick={() => { setAnswers({ ...answers, reward: "Ice Cream" }); setStep(9); }} className="w-full text-center bg-white border-2 border-pink-100 text-slate-700 font-bold rounded-2xl p-4 transition-colors shadow-sm">
                    Ice Cream to beat the heat
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 207, 232, 0.3)" }} whileTap={{ scale: 0.98 }} onClick={() => { setAnswers({ ...answers, reward: "Anything" }); setStep(9); }} className="w-full text-center bg-white border-2 border-pink-100 text-slate-700 font-bold rounded-2xl p-4 transition-colors shadow-sm">
                    Jo tumhara mann kare! (Anything u want)
                  </motion.button>

                  {/* COOKING OPTION */}
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(ffe4e6, 0.8)" }} whileTap={{ scale: 0.98 }} onClick={() => { setAnswers({ ...answers, reward: "Aditya Cooks" }); setStep(8); }} className="w-full text-center bg-rose-50 border-2 border-rose-200 text-rose-600 font-bold rounded-2xl p-4 transition-colors mt-2 shadow-sm order- rose-200 hover:border-rose-400 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl p-4 transition-colors mt-2 shadow-sm">
                    Ya fir, mai kuch cook karu aapke liye? 👨‍🍳
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: TERMS AND CONDITIONS */}
          {step === 8 && (
            <motion.div key="step8" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }} className="bg-rose-100 p-4 rounded-full mb-4 shadow-inner border border-rose-200">
                  <ScrollText className="w-10 h-10 text-rose-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-center text-slate-800">Terms & Conditions Apply</h2>
              </div>

              <div className="bg-pink-50 border-2 border-pink-100 rounded-2xl p-6 space-y-4 text-slate-600 text-sm leading-relaxed font-medium shadow-inner">
                <p><strong className="text-slate-800">1.1:</strong> The "Aditya Cooks" protocol has been requested.</p>
                <p><strong className="text-slate-800">1.2:</strong> Food will only be prepared and delivered under the strict condition that we first meet up for a casual campus walk.</p>
                <p><strong className="text-slate-800">Reasoning:</strong> Semester khatam ho raha hai, toh thoda fresh air aur walk toh banta hai before everyone leaves for home.</p>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(9)} className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 rounded-2xl shadow-lg transition-all">
                I Accept These Terms
              </motion.button>
            </motion.div>
          )}

          {/* STEP 9: SCHEDULING */}
          {step === 9 && (
            <motion.div key="step9" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-inner border border-pink-200">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <CalendarClock className="w-3.5 h-3.5" />
                  </motion.div>
                  Scheduling Protocol
                </span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">yeaaaaahhhhhhh 🥳, Toh kab chaleke baa?</h2>
              </div>
              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 207, 232, 0.3)" }} whileTap={{ scale: 0.98 }} onClick={() => handleWhatsAppRedirect("Aaj chalte hain! ✈️")} className="w-full text-center bg-white border-2 border-pink-100 text-slate-700 font-bold rounded-2xl p-4 transition-colors shadow-sm">
                  Aaj hi chalte hain!
                </motion.button>
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 207, 232, 0.3)" }} whileTap={{ scale: 0.98 }} onClick={() => handleWhatsAppRedirect("Kal chalte hain! 🗓️")} className="w-full text-center bg-white border-2 border-pink-100 text-slate-700 font-bold rounded-2xl p-4 transition-colors shadow-sm">
                  Kal chalte hain, thoda free hoke
                </motion.button>
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 207, 232, 0.3)" }} whileTap={{ scale: 0.98 }} onClick={() => handleWhatsAppRedirect("Baad mein batati hu! ✨")} className="w-full text-center bg-white border-2 border-pink-100 text-slate-700 font-bold rounded-2xl p-4 transition-colors shadow-sm">
                  Aaram se, mai baad mein batati hu
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 10: FINALE */}
          {step === 10 && (
            <motion.div key="step10" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center space-y-6 py-12">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-2 border-pink-200"
                >
                  <CheckCircle2 className="w-12 h-12 text-pink-500" />
                </motion.div>
              </motion.div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-800">See you on WhatsApp!</h2>
                <p className="text-slate-500 font-medium leading-relaxed bg-white/50 px-4 py-2 rounded-full inline-block border border-pink-50">
                  Redirecting to chat... plan wahi banate hain!
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </main>
  );
}