import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// Function to load predefined terms from a config file
async function loadTerms() {
    try {
        const response = await fetch('/config.json');
        if (!response.ok) throw new Error('Failed to load config');
        const data = await response.json();
        return data.predefinedTerms;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const BingoSheet = () => {
    const [bingoGrid, setBingoGrid] = useState([]);
    const [predefinedTerms, setPredefinedTerms] = useState([]);
    const bingoRef = useRef(null);

    useEffect(() => {
        loadTerms().then(setPredefinedTerms);
    }, []);

    const generateBingo = () => {
        const randomizedTerms = shuffleArray([...predefinedTerms]);
        setBingoGrid(randomizedTerms.slice(0, 25));
    };

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
            scrollY: 0,
        });
        const link = document.createElement('a');
        link.download = 'bingo-sheet.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Verdy Bingo Sheet Generator</h1>
            <button
                onClick={generateBingo}
                style={{
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    cursor: 'pointer'
                }}
            >
                Generate Bingo Sheet
            </button>
            <button
                onClick={downloadBingo}
                style={{
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    marginLeft: '10px',
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