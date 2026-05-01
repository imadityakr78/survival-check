"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Unlock, CheckCircle2, Flame, AlertTriangle, ScrollText, CalendarClock } from "lucide-react";
import { saveResponses } from "./actions"; // Import the server action

export default function SurvivalCheck() {
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState(false);

  // State to track all her answers
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

  // FAKE LOADING EFFECT (Step 6)
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

    if (normalizedName === "sam" || normalizedName.startsWith("samridhi")) {
      setError(false);
      setAnswers({ ...answers, name: nameInput }); // Save her name
      setStep(1);
    } else {
      setError(true);
    }
  };

  // WHATSAPP REDIRECT & DATABASE SAVE FUNCTION
  const handleWhatsAppRedirect = (timeChoice: string) => {
    const PHONE_NUMBER = "917857825881";
    const message = `*${timeChoice}*`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    // Prepare final data and fire it to the database silently
    const finalData = { ...answers, time: timeChoice };
    saveResponses(finalData);

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    setStep(10);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">

        {/* PROGRESS BAR */}
        {step > 0 && step < 10 && (
          <div className="w-full bg-zinc-800 h-2 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 9) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 0: SECURITY */}
          {step === 0 && (
            <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <Lock className="w-12 h-12 text-zinc-500" />
                <h1 className="text-2xl font-bold tracking-tight text-center">End of Semester Protocol</h1>
                <p className="text-zinc-400 text-center text-sm">Security clearance required. Proxy lagana mana hai.</p>
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
                    className={`w-full bg-zinc-900 border ${error ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:ring-emerald-500"} rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 transition-all`}
                  />
                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mt-2">
                      Access Denied: Galat naam daalat bani.
                    </motion.p>
                  )}
                </div>
                <button type="submit" className="w-full bg-zinc-100 text-zinc-900 font-medium py-3 rounded-lg hover:bg-zinc-300 transition-colors">
                  Authenticate
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 1: Q1 */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="text-emerald-500 text-sm font-mono mb-2 block">System Unlocked</span>
                <h2 className="text-2xl font-bold">Semester khatam hote hote dimag ka dahi kitna baar hua?</h2>
              </div>
              <div className="space-y-3">
                {["Ginti bhool gaye hain", "Bina sattu piye dimag chal hi nahi raha", "Ekdum bhaukal tight rakhe the"].map((option, idx) => (
                  <button key={idx} onClick={() => { setAnswers({ ...answers, q1: option }); setStep(2); }} className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-lg p-4 transition-all">
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Q2 */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="text-amber-500 flex items-center gap-2 text-sm font-mono mb-2">
                  <AlertTriangle className="w-4 h-4" /> Academic Check
                </span>
                <h2 className="text-2xl font-bold">Attendance aur endless assignments manage karte karte aatma kitni baar nikli?</h2>
              </div>
              <div className="space-y-3">
                {["Roz subah uthna ek saza thi", "Deadlines ne rula ke rakh diya", "Bas zinda bache hain, wahi bohot hai"].map((option, idx) => (
                  <button key={idx} onClick={() => { setAnswers({ ...answers, q2: option }); setStep(3); }} className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded-lg p-4 transition-all">
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Q3 */}
          {step === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="text-rose-500 flex items-center gap-2 text-sm font-mono mb-2">
                  <AlertTriangle className="w-4 h-4" /> Anxiety Module
                </span>
                <h2 className="text-2xl font-bold">Ticket 21 ka Motihari ka ban gaya hai, par exams 16-22 ke beech hain. Kitna dar lag raha hai?</h2>
              </div>
              <div className="space-y-3">
                {["Anxiety ekdum peak pe hai", "Bhagwan bharose chhod diye hain ab", "Exam shift hua toh yahin baith ke roungi"].map((option, idx) => (
                  <button key={idx} onClick={() => { setAnswers({ ...answers, q3: option }); setStep(4); }} className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-rose-500 rounded-lg p-4 transition-all">
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Q4 */}
          {step === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="text-emerald-500 text-sm font-mono mb-2 block">Weather Module...</span>
                <h2 className="text-2xl font-bold">Garmi itni hai ki relief ke liye kya karne ka mann kar raha hai?</h2>
              </div>
              <div className="space-y-3">
                {["Din bhar AC ke aage pade raho", "Thandi Ice Cream ya Shakes chahiye", "Bas jaldi se ghar pohoch jayein"].map((option, idx) => (
                  <button key={idx} onClick={() => { setAnswers({ ...answers, q4: option }); setStep(5); }} className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-lg p-4 transition-all">
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Q5 (Crush) */}
          {step === 5 && (
            <motion.div key="step5" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="text-rose-500 flex items-center gap-2 text-sm font-mono mb-2">
                  <Flame className="w-4 h-4" /> Gossip Protocol Initiated
                </span>
                <h2 className="text-2xl font-bold">Sach sach batana, is semester mein campus pe kisi pe crush aaya kya?</h2>
              </div>
              <div className="space-y-3">
                {["Haan, ek hai...", "Nahi mitarr, bas padhai (aur thoda rona)", "Top Secret hai, system ko nahi bataungi"].map((option, idx) => (
                  <button key={idx} onClick={() => { setAnswers({ ...answers, q5: option }); setStep(6); }} className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-rose-500 rounded-lg p-4 transition-all">
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 6: LOADING */}
          {step === 6 && (
            <motion.div key="step6" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Analyzing performance...</h2>
                <p className="text-zinc-400 font-mono text-sm">Calculating assignments, ticket anxiety & semester exhaustion</p>
              </div>
            </motion.div>
          )}

          {/* STEP 7: REWARD CHOICE */}
          {step === 7 && (
            <motion.div key="step7" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8 space-y-4">
                <div className="inline-flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-medium">
                  <Unlock className="w-4 h-4" />
                  <span>Diagnosis Complete</span>
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">Critical levels of academic exhaustion detected.</h2>
                <p className="text-zinc-400 leading-relaxed">
                  You have successfully survived the assignments, the attendance drops, and har mahine praticals. Ek aakhri off-screen campus meetup is highly recommended.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-zinc-300">Toh kya vichaar hai aapke 👀?</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => { setAnswers({ ...answers, reward: "Coffee/Shakes" }); setStep(9); }} className="w-full text-center bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-medium rounded-lg p-4 transition-all">
                    Thick Cold Coffee / Shakes / Barf-Gola
                  </button>
                  <button onClick={() => { setAnswers({ ...answers, reward: "Ice Cream" }); setStep(9); }} className="w-full text-center bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-lg p-4 transition-all">
                    Ice Cream to beat the heat
                  </button>
                  <button onClick={() => { setAnswers({ ...answers, reward: "Anything" }); setStep(9); }} className="w-full text-center bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-lg p-4 transition-all">
                    Jo tumhara mann kare! (Anything u want)
                  </button>

                  <button onClick={() => { setAnswers({ ...answers, reward: "Aditya Cooks" }); setStep(8); }} className="w-full text-center bg-zinc-900 border border-zinc-700 hover:border-amber-400 rounded-lg p-4 transition-all text-amber-400 font-medium mt-2">
                    Ya fir, mai kuch cook karu aapke liye? 👨‍🍳
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: TERMS AND CONDITIONS */}
          {step === 8 && (
            <motion.div key="step8" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <ScrollText className="w-12 h-12 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold text-center">Terms & Conditions Apply</h2>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 text-zinc-300 text-sm leading-relaxed">
                <p><strong className="text-zinc-100">1.1:</strong> The "Aditya Cooks" protocol has been requested.</p>
                <p><strong className="text-zinc-100">1.2:</strong> Food will only be prepared and delivered under the strict condition that we first meet up for a casual campus walk.</p>
                <p><strong className="text-zinc-100">Reasoning:</strong> Semester khatam ho raha hai, toh thoda fresh air aur walk toh banta hai before everyone leaves for home.</p>
              </div>

              <button onClick={() => setStep(9)} className="w-full bg-emerald-500 text-zinc-950 font-bold py-4 rounded-lg hover:bg-emerald-400 transition-colors">
                I Accept These Terms
              </button>
            </motion.div>
          )}

          {/* STEP 9: SCHEDULING */}
          {step === 9 && (
            <motion.div key="step9" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="mb-8">
                <span className="text-emerald-500 flex items-center gap-2 text-sm font-mono mb-2">
                  <CalendarClock className="w-4 h-4" /> Scheduling Protocol
                </span>
                <h2 className="text-2xl font-bold">yeaaaaahhhhhhh 🥳, Toh kab chaleke baa?</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleWhatsAppRedirect("Aaj chalte hain! ✈️")}
                  className="w-full text-center bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-medium rounded-lg p-4 transition-all"
                >
                  Aaj hi chalte hain!
                </button>
                <button
                  onClick={() => handleWhatsAppRedirect("Kal chalte hain! 🗓️")}
                  className="w-full text-center bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-lg p-4 transition-all"
                >
                  Kal chalte hain, thoda free hoke
                </button>
                <button
                  onClick={() => handleWhatsAppRedirect("Baad mein batati hu! ✨")}
                  className="w-full text-center bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-lg p-4 transition-all"
                >
                  Aaram se, mai baad mein batati hu
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 10: FINALE */}
          {step === 10 && (
            <motion.div key="step10" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center space-y-6 py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              </motion.div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-zinc-100">See you on WhatsApp!</h2>
                <p className="text-zinc-400 leading-relaxed">
                  Redirecting to chat... plan wahi banate hain!
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}