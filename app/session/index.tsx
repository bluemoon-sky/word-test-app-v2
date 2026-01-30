import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import { MOCK_WORD_SETS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { Word } from '../../src/types';

export default function SessionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mode = params.type as 'flashcard' | 'test' || 'flashcard';

    const { wordStates, reviewWord } = useAppStore();
    const [queue, setQueue] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [results, setResults] = useState({ correct: 0, wrong: 0 });

    // Initialize Session
    useEffect(() => {
        // 1. Flatten all words
        const allWords = MOCK_WORD_SETS.flatMap(set => set.words);

        // 2. Filter for Review (Due) or New (Not in state)
        const now = Date.now();
        const dueWords = allWords.filter(w => {
            const state = wordStates[w.id];
            // If no state, it's new. If state exists, check if due.
            if (!state) return true;
            return state.nextReviewDate <= now;
        });

        // 3. Take max 10 for this session
        const sessionWords = dueWords.slice(0, 10);

        // Fallback if no due words: Take 5 random words to practice
        if (sessionWords.length === 0) {
            setQueue(allWords.sort(() => 0.5 - Math.random()).slice(0, 5));
        } else {
            setQueue(sessionWords);
        }
    }, []);

    const handleRate = (quality: number) => {
        const currentWord = queue[currentIndex];

        // Save to Store
        reviewWord(currentWord.id, quality);

        // Track local session stats
        if (quality >= 3) {
            setResults(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setResults(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }

        // Next card
        if (currentIndex < queue.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev + 1);
        } else {
            setSessionComplete(true);
        }
    };

    if (queue.length === 0 && !sessionComplete) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.text}>Loading words...</Text>
            </View>
        );
    }

    // --- Session Complete View ---
    if (sessionComplete) {
        return (
            <View style={[styles.container, styles.center]}>
                <Ionicons name="trophy" size={80} color={COLORS.warning} />
                <Text style={styles.title}>Session Complete!</Text>
                <Text style={styles.subtext}>
                    You reviewed {queue.length} words.
                </Text>

                <View style={styles.resultBox}>
                    <Text style={[styles.resultText, { color: COLORS.success }]}>Correct: {results.correct}</Text>
                    <Text style={[styles.resultText, { color: COLORS.error }]}>Needs Work: {results.wrong}</Text>
                </View>

                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.btnText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- Active Card View ---
    const word = queue[currentIndex];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={COLORS.textDim} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{currentIndex + 1} / {queue.length}</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.cardContainer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.flashcard}
                    onPress={() => setIsFlipped(!isFlipped)}
                >
                    <View style={styles.cardContent}>
                        <Text style={styles.wordText}>{word.word}</Text>
                        {isFlipped && (
                            <View style={styles.backContent}>
                                <View style={styles.divider} />
                                <Text style={styles.meaningText}>{word.meaning}</Text>
                                <Text style={styles.exampleText}>"{word.exampleSentence}"</Text>
                                {word.tags.map(t => (
                                    <Text key={t} style={styles.tag}>#{t}</Text>
                                ))}
                            </View>
                        )}
                        {!isFlipped && <Text style={styles.tapHint}>Tap to flip</Text>}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                {!isFlipped ? (
                    <TouchableOpacity
                        style={[styles.mainButton, { width: '100%' }]}
                        onPress={() => setIsFlipped(true)}
                    >
                        <Text style={styles.btnText}>Show Answer</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.ratingRow}>
                        <TouchableOpacity style={[styles.rateBtn, { backgroundColor: COLORS.error }]} onPress={() => handleRate(1)}>
                            <Text style={styles.rateText}>Again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.rateBtn, { backgroundColor: COLORS.warning }]} onPress={() => handleRate(3)}>
                            <Text style={styles.rateText}>Hard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.rateBtn, { backgroundColor: COLORS.success }]} onPress={() => handleRate(4)}>
                            <Text style={styles.rateText}>Good</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.rateBtn, { backgroundColor: COLORS.primary }]} onPress={() => handleRate(5)}>
                            <Text style={styles.rateText}>Easy</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        marginTop: Platform.OS === 'android' ? 30 : 0,
    },
    headerTitle: {
        color: COLORS.textDim,
        fontSize: 16,
    },
    cardContainer: {
        flex: 1,
        padding: SPACING.lg,
        justifyContent: 'center',
    },
    flashcard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        minHeight: 400,
        padding: SPACING.xl,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.surfaceHighlight,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardContent: {
        alignItems: 'center',
        width: '100%',
    },
    wordText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    backContent: {
        width: '100%',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.surfaceHighlight,
        width: '50%',
        marginBottom: SPACING.lg,
    },
    meaningText: {
        fontSize: 24,
        color: COLORS.secondary,
        fontWeight: '600',
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    exampleText: {
        fontSize: 18,
        color: COLORS.textDim,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    tag: {
        color: COLORS.accent,
        fontSize: 14,
    },
    tapHint: {
        marginTop: SPACING.xl,
        color: COLORS.textDim,
        fontSize: 14,
    },
    controls: {
        padding: SPACING.lg,
        paddingBottom: Platform.OS === 'ios' ? 0 : SPACING.lg,
    },
    mainButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    rateBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    rateText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Result styles
    title: {
        fontSize: 32,
        color: COLORS.text,
        fontWeight: 'bold',
        marginTop: SPACING.lg,
    },
    subtext: {
        fontSize: 18,
        color: COLORS.textDim,
        marginVertical: SPACING.md,
    },
    resultBox: {
        flexDirection: 'row',
        gap: SPACING.xl,
        backgroundColor: COLORS.surface,
        padding: SPACING.lg,
        borderRadius: 16,
        marginVertical: SPACING.xl,
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        color: COLORS.text,
    }
});
