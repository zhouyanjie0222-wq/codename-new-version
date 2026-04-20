/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef, type RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Shield, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  History, 
  BookOpen, 
  Timer,
  Plus,
  Trash2,
  ChevronRight,
  Trophy,
  AlertTriangle,
  Info as InfoIcon,
  Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---

type CardType = 'red' | 'blue' | 'neutral' | 'assassin';

interface Card {
  id: number;
  word: string;
  type: CardType;
  revealed: boolean;
  definition?: string;
}

interface Clue {
  word: string;
  count: number;
  team: 'red' | 'blue';
}

const COMMON_WORDS = [
  "AFRICA", "AGENT", "AIR", "ALIEN", "ALPS", "AMAZON", "AMBULANCE", "AMERICA", "ANGEL", "ANTARCTICA", "APPLE", "ARM", "ATLANTIS", "AUSTRALIA", "AZTEC", "BACK", "BALL", "BAND", "BANK", "BAR", "BARK", "BAT", "BATTERY", "BEACH", "BEAR", "BEAT", "BED", "BEIJING", "BELL", "BELT", "BERLIN", "BERMUDA", "BERRY", "BILL", "BLOCK", "BOARD", "BOLT", "BOMB", "BOND", "BOOM", "BOOT", "BOTTLE", "BOW", "BOX", "BRIDGE", "BRUSH", "BUCK", "BUFFALO", "BUG", "BUGLE", "BUTTON", "CALF", "CANADA", "CAP", "CAPITAL", "CAR", "CARD", "CARROT", "CASINO", "CAST", "CAT", "CELL", "CENTAUR", "CENTER", "CHAIR", "CHANGE", "CHARITY", "CHART", "CHECK", "CHEST", "CHICAGO", "CHICK", "CHINA", "CHOCOLATE", "CHURCH", "CIRCLE", "CLIFF", "CLOAK", "CLUB", "CODE", "COLD", "COMIC", "COMPOUND", "CONCERT", "CONDUCTOR", "COOK", "COPPER", "COTTON", "COURT", "COVER", "CRANE", "CRASH", "CRICKET", "CROSS", "CROWN", "CYCLE", "CZECH", "DANCE", "DATE", "DAY", "DEATH", "DECK", "DEGREE", "DIAMOND", "DICE", "DINOSAUR", "DISEASE", "DOCTOR", "DOG", "DRAFT", "DRAGON", "DRESS", "DRILL", "DRINK", "DRUM", "DUCK", "DUST", "EAGLE", "EGYPT", "EMBASSY", "ENGINE", "ENGLAND", "EUROPE", "EYE", "FACE", "FAIR", "FALL", "FAN", "FENCE", "FIELD", "FIGHTER", "FIGURE", "FILE", "FILM", "FIRE", "FISH", "FLUTE", "FLY", "FOOT", "FORCE", "FOREST", "FORK", "FRANCE", "GAME", "GAS", "GENIUS", "GERMANY", "GHOST", "GIANT", "GLASS", "GLOVE", "GOLD", "GRACE", "GRASS", "GREECE", "GREEN", "GROUND", "HAM", "HAND", "HAWK", "HEAD", "HEART", "HELICOPTER", "HIMALAYAS", "HOLE", "HOLLYWOOD", "HONEY", "HOOD", "HOOK", "HORN", "HORSE", "HORSESHOE", "HOSPITAL", "HOTEL", "ICE", "ICE CREAM", "INDIA", "IRON", "IVORY", "JACK", "JAM", "JET", "JUPITER", "KANGAROO", "KETCHUP", "KEY", "KID", "KING", "KIWI", "KNIFE", "KNIGHT", "LAB", "LAP", "LASER", "LAWYER", "LEAD", "LEMON", "LEPRECHAUN", "LIFE", "LIGHT", "LIMOUSINE", "LINE", "LINK", "LION", "LITTER", "LOCH NESS", "LOCK", "LOG", "LONDON", "LUCK", "MAIL", "MAMMOTH", "MAPLE", "MARBLE", "MARCH", "MARS", "MASTER", "MATCH", "MERCURY", "MEXICO", "MICROSCOPE", "MILLIONAIRE", "MINE", "MINT", "MISSILE", "MODEL", "MOLE", "MOON", "MOSCOW", "MOUNT", "MOUSE", "MOUTH", "MUG", "MUMMY", "NAIL", "NEEDLE", "NET", "NEW YORK", "NIGHT", "NINJA", "NOTE", "NOVEL", "NURSE", "NUT", "OCTOPUS", "OIL", "OLIVE", "OLYMPUS", "OPERA", "ORANGE", "ORGAN", "PALM", "PAN", "PANTS", "PAPER", "PARACHUTE", "PARK", "PART", "PASS", "PASTE", "PENGUIN", "PHOENIX", "PIANO", "PIE", "PILOT", "PIN", "PIPE", "PIRATE", "PISTOL", "PIT", "PLANET", "PLASTIC", "PLATE", "PLATYPUS", "PLAY", "PLOT", "POINT", "POISON", "POLE", "POLICE", "POOL", "PORT", "POST", "POUND", "PRESS", "PRINCESS", "PUMPKIN", "PUPIL", "PYRAMID", "QUACK", "QUARTZ", "QUEEN", "RABBIT", "RACKET", "RAY", "REVOLUTION", "RING", "ROBIN", "ROBOT", "ROCK", "ROME", "ROOT", "ROSE", "ROULETTE", "ROUND", "ROW", "RULER", "SATELLITE", "SATURN", "SCALE", "SCHOOL", "SCIENTIST", "SCORPION", "SCREEN", "SCUBA DIVER", "SEAL", "SERVER", "SHADOW", "SHAKESPEARE", "SHARK", "SHELL", "SHIP", "SHOE", "SHOP", "SHOT", "SHOULDER", "SIGN", "SILK", "SINK", "SKYSCRAPER", "SLIP", "SLUG", "SMUGGLER", "SNOW", "SNOWMAN", "SOCK", "SOLDIER", "SOUL", "SOUND", "SPACE", "SPELL", "SPIDER", "SPIKE", "SPINE", "SPOT", "SPRING", "SPY", "SQUARE", "STADIUM", "STAFF", "STAR", "STATE", "STICK", "STOCK", "STRAW", "STREAM", "STRIKE", "STRING", "SUB", "SUIT", "SUPERHERO", "SWING", "SWITCH", "TABLE", "TABLET", "TAG", "TAIL", "TAP", "TEACHER", "TELESCOPE", "TEMPLE", "THEATER", "THIEF", "THUMB", "TICK", "TIE", "TIME", "TOKYO", "TOOTH", "TORCH", "TOWER", "TRACK", "TRAIN", "TRIANGLE", "TRICK", "TRIP", "TRUNK", "TUBE", "TURKEY", "UNDERTAKER", "UNICORN", "VACUUM", "VAN", "VENUS", "WAKE", "WALL", "WAR", "WASHER", "WASHINGTON", "WATCH", "WATER", "WAVE", "WEB", "WELL", "WHALE", "WHIP", "WIND", "WITCH", "WORM", "YARD"
];

const COLORS = {
  red: '#d9534f',
  blue: '#0275d8',
  neutral: '#f5f5dc', // beige
  assassin: '#1a1a1a', // black
};

// --- App Component ---

export default function App() {
  // Game State
  const [cards, setCards] = useState<Card[]>([]);
  const [currentTeam, setCurrentTeam] = useState<'red' | 'blue'>('red');
  const [isSpymasterView, setIsSpymasterView] = useState(false);
  const [clueHistory, setClueHistory] = useState<Clue[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won_red' | 'won_blue' | 'lost_assassin'>('playing');
  const [startingTeam, setStartingTeam] = useState<'red' | 'blue'>('red');
  
  // Teacher Input State
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');
  const [isTeacherMode, setIsTeacherMode] = useState(true);
  
  // Clue Input State
  const [clueWord, setClueWord] = useState('');
  const [clueCount, setClueCount] = useState(1);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Vocabulary/Definition State
  const [selectedWord, setSelectedWord] = useState<Card | null>(null);
  const [isFetchingDefinition, setIsFetchingDefinition] = useState(false);

  // Gemini Setup
  const ai = useRef<GoogleGenAI | null>(null);
  useEffect(() => {
    if (process.env.GEMINI_API_KEY) {
      ai.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }, []);

  // --- Logic Functions ---

  const generateBoard = useCallback(() => {
    // 1. Prepare Words
    let boardWords = [...customWords];
    const needed = 25 - boardWords.length;
    if (needed > 0) {
      const available = COMMON_WORDS.filter(w => !boardWords.includes(w));
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      boardWords = [...boardWords, ...shuffled.slice(0, needed)];
    }
    boardWords = boardWords.slice(0, 25).sort(() => Math.random() - 0.5);

    // 2. Prepare Roles
    // Standard: Starting team gets 9, second team gets 8, neutral 7, assassin 1.
    const start = Math.random() > 0.5 ? 'red' : 'blue';
    setStartingTeam(start);
    setCurrentTeam(start);

    const roles: CardType[] = [
      ...Array(start === 'red' ? 9 : 8).fill('red'),
      ...Array(start === 'blue' ? 9 : 8).fill('blue'),
      ...Array(7).fill('neutral'),
      'assassin'
    ];
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

    // 3. Create Cards
    const newCards: Card[] = boardWords.map((word, i) => ({
      id: i,
      word,
      type: shuffledRoles[i],
      revealed: false
    }));

    setCards(newCards);
    setGameState('playing');
    setClueHistory([]);
    setIsTeacherMode(false);
    setIsTimerActive(false);
    setTimeLeft(60);
    setSelectedWord(null);
  }, [customWords]);

  const handleCardClick = (card: Card) => {
    if (card.revealed || gameState !== 'playing') return;

    const newCards = cards.map(c => 
      c.id === card.id ? { ...c, revealed: true } : c
    );
    setCards(newCards);

    // Check Win/Loss
    if (card.type === 'assassin') {
      setGameState('lost_assassin');
      return;
    }

    // Update Scores
    const redLeft = newCards.filter(c => c.type === 'red' && !c.revealed).length;
    const blueLeft = newCards.filter(c => c.type === 'blue' && !c.revealed).length;

    if (redLeft === 0) setGameState('won_red');
    if (blueLeft === 0) setGameState('won_blue');

    // Turn Logic
    if (card.type !== currentTeam) {
      setCurrentTeam(prev => prev === 'red' ? 'blue' : 'red');
      setIsTimerActive(false);
    }
  };

  const submitClue = () => {
    if (!clueWord || clueCount < 0) return;
    setClueHistory(prev => [{ word: clueWord, count: clueCount, team: currentTeam }, ...prev]);
    setClueWord('');
    setClueCount(1);
    setIsTimerActive(true);
    setTimeLeft(60);
  };

  const endTurn = () => {
    setCurrentTeam(prev => prev === 'red' ? 'blue' : 'red');
    setIsTimerActive(false);
  };

  const fetchDefinition = async (card: Card) => {
    if (!ai.current) return;
    setSelectedWord(card);
    setIsFetchingDefinition(true);
    try {
      const prompt = `Provide a simple, classroom-friendly English definition and one example sentence for the word: "${card.word}". Format the response as "Definition: ... Example: ..."`;
      const response = await ai.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      const text = response.text || "Definition not found.";
      
      setCards(prev => prev.map(c => 
        c.id === card.id ? { ...c, definition: text } : c
      ));
    } catch (error) {
      console.error("Def fetch error:", error);
    } finally {
      setIsFetchingDefinition(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0 && gameState === 'playing') {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      endTurn();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, gameState]);

  // --- Render Helpers ---

  const redScore = cards.filter(c => c.type === 'red' && !c.revealed).length;
  const blueScore = cards.filter(c => c.type === 'blue' && !c.revealed).length;

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#333333] font-sans flex flex-col">
      <header className="h-[60px] bg-white border-b-2 border-[#dddddd] flex items-center justify-between px-5 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="logo font-extrabold text-2xl tracking-tighter uppercase">
            CODE<span className="text-[#d9534f]">NAMES</span>
          </div>
          <span className="hidden md:inline text-[10px] font-normal opacity-60 uppercase mt-1">English Classroom Edition</span>
        </div>

        <div className="flex items-center gap-5">
          <div className={`
            px-4 py-1.5 rounded-full font-bold uppercase text-xs text-white transition-colors
            ${currentTeam === 'red' ? 'bg-[#d9534f]' : 'bg-[#0275d8]'}
          `}>
            {currentTeam} team's turn
          </div>
          
          <div className="flex items-center gap-2 font-mono text-xl font-bold">
            <Timer className={`w-5 h-5 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}`} />
            <span className={timeLeft < 10 ? 'text-red-500' : ''}>
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setIsSpymasterView(!isSpymasterView)}
              className="px-3 py-1.5 text-[11px] font-semibold uppercase bg-[#eeeeee] text-[#333333] border border-[#cccccc] rounded hover:opacity-80 transition-all"
            >
              View: {isSpymasterView ? 'Spymaster' : 'Player'}
            </button>
            <button 
              onClick={() => setIsTeacherMode(true)}
              className="px-3 py-1.5 text-[11px] font-semibold uppercase bg-[#444444] text-white rounded hover:opacity-80 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-[15px] grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-[15px]">
        {/* Left Sidebar: Stats & Game Info */}
        <div className="space-y-[15px]">
          <section className="bg-white p-3 rounded-lg border border-[#dddddd] shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-3 pb-1 border-b border-[#eeeeee] text-[#666]">Teacher Input</h3>
            <p className="text-[10px] text-[#888] mb-2">Enter custom words (one per line) or use default list.</p>
            <button 
              onClick={() => setIsTeacherMode(true)}
              className="w-full py-2 bg-[#444444] text-white text-[11px] font-bold uppercase rounded hover:opacity-90 transition-all"
            >
              Update Board
            </button>
          </section>

          <section className="bg-white p-3 rounded-lg border border-[#dddddd] shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-3 pb-1 border-b border-[#eeeeee] text-[#666]">Scoreboard</h3>
            <div className="flex justify-between items-center px-2 py-1">
              <span className="text-xl font-black text-[#d9534f]">RED: {redScore}</span>
              <span className="text-xl font-black text-[#0275d8]">BLUE: {blueScore}</span>
            </div>
            <p className="text-[10px] text-center text-[#888] mt-2">First to 0 wins!</p>
          </section>
        </div>

        {/* Center: Game Board */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-5 gap-2 justify-items-center">
            {cards.map(card => (
              <GameCard 
                key={card.id}
                card={card}
                isSpymaster={isSpymasterView}
                onClick={() => handleCardClick(card)}
                onInfo={() => { fetchDefinition(card); }}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar: Context & Info */}
        <div className="space-y-[15px] flex flex-col h-full">
          <section className="bg-white p-3 rounded-lg border border-[#dddddd] shadow-sm flex flex-col h-[60%]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b border-[#eeeeee] text-[#666]">Spymaster Input</h3>
            <div className="flex gap-1 mb-2">
              <input 
                type="text" 
                value={clueWord}
                onChange={(e) => setClueWord(e.target.value)}
                placeholder="Clue word..."
                className="flex-1 px-2 py-1.5 text-xs bg-white border border-[#cccccc] rounded focus:outline-none focus:border-[#444]"
              />
              <input 
                type="number" 
                min={0}
                max={25}
                value={clueCount}
                onChange={(e) => setClueCount(parseInt(e.target.value))}
                className="w-12 px-1 py-1.5 text-xs bg-white border border-[#cccccc] rounded focus:outline-none focus:border-[#444]"
              />
            </div>
            <button 
              onClick={submitClue}
              disabled={!clueWord}
              className="w-full py-2 bg-[#0275d8] text-white text-[11px] font-bold uppercase rounded hover:opacity-90 disabled:opacity-50 transition-all mb-4"
            >
              Send Clue
            </button>

            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b border-[#eeeeee] text-[#666]">Clue History</h3>
            <div className="flex-1 overflow-y-auto bg-[#f9f9f9] border border-[#eeeeee] rounded p-2 custom-scrollbar">
              {clueHistory.length === 0 ? (
                <p className="text-[10px] text-center py-4 opacity-30 italic">No clues yet...</p>
              ) : (
                clueHistory.map((clue, idx) => (
                  <div key={idx} className="text-[11px] py-1 border-b border-[#eeeeee] last:border-0">
                    <span className={`font-bold uppercase ${clue.team === 'red' ? 'text-[#d9534f]' : 'text-[#0275d8]'}`}>{clue.team}</span>: <strong>{clue.word}</strong> ({clue.count})
                  </div>
                ))
              )}
            </div>
          </section>

          <AnimatePresence>
            {selectedWord && (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-[#fffde7] p-3 rounded-lg border border-[#fbc02d] shadow-sm relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#666]">Vocabulary: {selectedWord.word}</h4>
                  <button onClick={() => setSelectedWord(null)}>
                    <Plus className="w-3 h-3 rotate-45" />
                  </button>
                </div>
                {isFetchingDefinition ? (
                  <p className="text-[10px] animate-pulse">Fetching meaning...</p>
                ) : (
                  <p className="text-[11px] text-[#333] leading-tight">{selectedWord.definition || "Definition not loaded."}</p>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {isTeacherMode && (
          <TeacherModal 
            customWords={customWords} 
            setCustomWords={setCustomWords} 
            generateBoard={generateBoard}
            onClose={() => cards.length > 0 && setIsTeacherMode(false)}
            ai={ai}
          />
        )}

        {gameState !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/85 flex flex-col items-center justify-center text-center p-6"
          >
            <h2 className={`text-6xl font-black mb-8 tracking-tighter uppercase ${
              gameState === 'won_red' ? 'text-[#d9534f]' : 
              gameState === 'won_blue' ? 'text-[#0275d8]' : 'text-white'
            }`}>
              {gameState === 'won_red' ? 'Red Team Wins!' : 
               gameState === 'won_blue' ? 'Blue Team Wins!' : 
               gameState === 'lost_assassin' ? 'Game Over' : ''}
            </h2>
            <button 
              onClick={() => setIsTeacherMode(true)}
              className="px-12 py-4 bg-[#0275d8] text-white rounded font-bold uppercase text-lg tracking-widest hover:opacity-90 transition-all shadow-xl"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

interface GameCardProps {
  card: Card;
  isSpymaster: boolean;
  onClick: () => void;
  onInfo: () => void;
  key?: number;
}

function GameCard({ card, isSpymaster, onClick, onInfo }: GameCardProps) {
  const isRevealed = card.revealed;
  const showType = isRevealed; // Only show full color if revealed

  const getBgColor = () => {
    if (!isRevealed) return 'bg-white';
    switch (card.type) {
      case 'red': return 'bg-[#d9534f] text-white';
      case 'blue': return 'bg-[#0275d8] text-white';
      case 'neutral': return 'bg-[#dfd3c3] text-[#776d5a]';
      case 'assassin': return 'bg-[#222222] text-white';
    }
  };

  const getBorderColor = () => {
    if (isRevealed) return 'border-transparent';
    if (isSpymaster) {
      switch (card.type) {
        case 'red': return 'border-[#d9534f]';
        case 'blue': return 'border-[#0275d8]';
        case 'neutral': return 'border-[#dfd3c3]';
        case 'assassin': return 'border-[#222222]';
      }
    }
    return 'border-transparent';
  };

  return (
    <motion.div 
      whileHover={!isRevealed ? { y: -2, transition: { duration: 0.1 } } : {}}
      onClick={onClick}
      className={`
        relative w-[120px] h-[85px] rounded-md flex items-center justify-center p-2 cursor-pointer
        border-3 transition-all duration-200 shadow-[0_4px_6px_rgba(0,0,0,0.1)] overflow-hidden
        ${getBgColor()} ${getBorderColor()}
      `}
    >
      {/* Spymaster Overlay */}
      {isSpymaster && !isRevealed && (
        <div className="absolute inset-0 bg-white/70 z-10 pointer-events-none" />
      )}

      <span className={`
        text-sm font-bold uppercase text-center break-all z-20
        ${isRevealed ? 'opacity-100' : 'opacity-80'}
      `}>
        {card.word}
      </span>

      {isRevealed && (
        <button 
          onClick={(e) => { e.stopPropagation(); onInfo(); }}
          className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/10 transition-colors z-30"
        >
          <InfoIcon className="w-3 h-3 opacity-60" />
        </button>
      )}
    </motion.div>
  );
}

function TeacherModal({ customWords, setCustomWords, generateBoard, onClose, ai }: {
  customWords: string[];
  setCustomWords: (w: string[]) => void;
  generateBoard: () => void;
  onClose: () => void;
  ai: RefObject<GoogleGenAI | null>;
}) {
  const [inputText, setInputText] = useState(customWords.join(', '));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = () => {
    const words = inputText.split(/[\n,]/)
      .map(w => w.trim())
      .filter(w => w.length > 0);
    setCustomWords(words);
    generateBoard();
  };

  const generateRandomFromClassic = () => {
    const shuffled = [...COMMON_WORDS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 25);
    setInputText(selected.join(', '));
  };

  const generateWordsWithAI = async (theme: string) => {
    if (!ai.current) return;
    setIsGenerating(true);
    try {
      const prompt = `Generate exactly 25 unique ${theme ? theme : 'random common'} English nouns suitable for a classroom game. The words should be simple and clear. Return as a comma-separated list only.`;
      const response = await ai.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      const text = response.text || "";
      const cleaned = text.split(/[\n,]/).map(w => w.trim()).filter(w => w.length > 3).slice(0, 25).join(', ');
      setInputText(cleaned);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white max-w-lg w-full rounded-lg border border-[#dddddd] shadow-2xl"
      >
        <div className="p-4 border-b border-[#eeeeee] flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-sm font-bold tracking-wider uppercase text-[#666]">Teacher Control Panel</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-2 mb-2">
            <button 
              onClick={generateRandomFromClassic}
              className="px-3 py-1.5 bg-[#eeeeee] border border-[#cccccc] text-[10px] font-bold uppercase rounded hover:bg-gray-200 transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Use Classic Words
            </button>
            <button 
              onClick={() => generateWordsWithAI('educational')}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-[#fff8e1] border border-[#ffecb3] text-[10px] font-bold uppercase rounded hover:bg-[#fffde7] transition-all flex items-center gap-1 text-[#ff8f00]"
            >
              <Zap className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} /> Random AI Model
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#888]">Vocabulary List</label>
              <span className="text-[10px] font-mono text-[#333]">
                {inputText.split(/[\n,]/).filter(w => w.trim()).length} cards
              </span>
            </div>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Apple, Banana, Table..."
              className="w-full h-40 p-3 bg-white border border-[#cccccc] rounded text-sm focus:outline-none focus:border-[#444] shadow-inner"
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => { setInputText(''); setCustomWords([]); }}
              className="flex-1 py-2 bg-[#eee] text-[#333] border border-[#ccc] rounded text-xs font-bold uppercase hover:bg-gray-200"
            >
              Clear
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-2 bg-[#0275d8] text-white rounded text-xs font-bold uppercase hover:opacity-90 shadow-md"
            >
              Update Board
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

