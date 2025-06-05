import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// Function to load predefined terms from a config file
async function loadTerms() {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/config.json`);
    if (!response.ok) throw new Error('Failed to load config');
    const data = await response.json();
    return data.predefinedTerms;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Simple seeded PRNG (Mulberry32)
function createSeededRandom(seed) {
  let t = seed;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffle using provided random function
function shuffleArray(array, randomFn) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const BingoSheet = () => {
  const [bingoGrid, setBingoGrid] = useState([]);
  const [predefinedTerms, setPredefinedTerms] = useState([]);
  const bingoRef = useRef(null);

  // Load terms then generate sheet once per day
  useEffect(() => {
    loadTerms().then((terms) => {
      setPredefinedTerms(terms || []);
      if (terms && terms.length) {
                // seed based on today's UTC date (YYYYMMDD)
        const today = new Date();
        const seed = parseInt(
          today.getUTCFullYear().toString() +
          String(today.getUTCMonth() + 1).padStart(2, '0') +
          String(today.getUTCDate()).padStart(2, '0'),
          10
        );
        const randomFn = createSeededRandom(seed);
        const shuffled = shuffleArray(terms, randomFn);
        setBingoGrid(shuffled.slice(0, 25));(shuffled.slice(0, 25));
      }
    });
  }, []);

  const downloadBingo = async () => {
    if (!bingoRef.current) return;
    const el = bingoRef.current;
    const { width, height } = el.getBoundingClientRect();
    const canvas = await html2canvas(el, {
      width,
      height,
      scale: 1,
      useCORS: true,
      scrollX: 0,
      scrollY: 0
    });
    const link = document.createElement('a');
    link.download = 'bingo-sheet.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Daily Bingo Sheet</h1>
      <button
        onClick={downloadBingo}
        style={{
          padding: '10px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        Download as PNG
      </button>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          ref={bingoRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            width: '500px',
            height: '500px',
            border: '2px solid black',
            boxSizing: 'border-box',
            backgroundColor: 'white'
          }}
        >
          {bingoGrid.map((term, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: index % 5 !== 4 ? '1px solid black' : 'none',
                borderBottom: index < 20 ? '1px solid black' : 'none',
                boxSizing: 'border-box',
                padding: '10px'
              }}
            >
              {term}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BingoSheet;
