import { Reward, WordSet } from '../types';

export const MOCK_WORD_SETS: WordSet[] = [
    {
        id: 'set-1',
        title: 'Middle School Essential 1',
        source: 'Textbook A',
        words: [
            { id: 'w1', word: 'abandon', meaning: '버리다, 포기하다', exampleSentence: 'He decided to abandon the project.', tags: ['verb'] },
            { id: 'w2', word: 'ability', meaning: '능력', exampleSentence: 'She has the ability to learn quickly.', tags: ['noun'] },
            { id: 'w3', word: 'abroad', meaning: '해외로', exampleSentence: 'They traveled abroad last summer.', tags: ['adverb'] },
            { id: 'w4', word: 'absence', meaning: '부재, 결석', exampleSentence: 'His absence was noticed by everyone.', tags: ['noun'] },
            { id: 'w5', word: 'absolute', meaning: '절대적인', exampleSentence: 'I have absolute confidence in you.', tags: ['adj'] },
        ]
    },
    {
        id: 'set-2',
        title: 'TOEIC Basic',
        source: 'Exam Prep',
        words: [
            { id: 'w6', word: 'contract', meaning: '계약', exampleSentence: 'Sign the contract below.', tags: ['noun'] },
            { id: 'w7', word: 'negotiate', meaning: '협상하다', exampleSentence: 'We need to negotiate the terms.', tags: ['verb'] },
            { id: 'w8', word: 'proposal', meaning: '제안', exampleSentence: 'The proposal was rejected.', tags: ['noun'] },
        ]
    }
];

export const MOCK_REWARDS: Reward[] = [
    { id: 'r1', name: '10 min Screen Time', cost: 30, description: 'Get 10 minutes of extra phone time.', icon: '📱', requiresApproval: false },
    { id: 'r2', name: 'Snack Break', cost: 50, description: 'One chocolate bar or snack.', icon: '🍫', requiresApproval: false },
    { id: 'r3', name: 'Go Out with Friends', cost: 500, description: 'Permission to go to the mall.', icon: '🏃', requiresApproval: true },
];
