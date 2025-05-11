import React, { useState } from 'react';
import { Button, Input } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const BingoSheet = () => {
    const [terms, setTerms] = useState('');
    const [bingoGrid, setBingoGrid] = useState([]);

    const generateBingo = () => {
        const termArray = terms.split(',').map(term => term.trim()).filter(term => term);
        const randomizedTerms = shuffleArray([...termArray]);
        setBingoGrid(randomizedTerms.slice(0, 25));
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-2">Bingo Sheet Generator</h1>
            <Input
                placeholder="Enter terms separated by commas"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="mb-2 w-full"
            />
            <Button onClick={generateBingo} className="mb-4">Generate Bingo Sheet</Button>
            <div className="grid grid-cols-5 gap-2">
                {bingoGrid.map((term, index) => (
                    <Card key={index} className="p-2 text-center">
                        <CardContent>{term}</CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BingoSheet;
