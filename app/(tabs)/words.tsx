import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import { MOCK_WORD_SETS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';

export default function WordsScreen() {
    const allWords = MOCK_WORD_SETS.flatMap(s => s.words);
    const wordStates = useAppStore(state => state.wordStates);

    const renderItem = ({ item }: { item: any }) => {
        const state = wordStates[item.id];
        const isMastered = state?.mastered;
        const isLearning = !!state;

        return (
            <View style={styles.item}>
                <View style={styles.info}>
                    <Text style={styles.word}>{item.word}</Text>
                    <Text style={styles.meaning}>{item.meaning}</Text>
                </View>
                <View style={styles.status}>
                    {isMastered ? (
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                    ) : isLearning ? (
                        <Text style={styles.learningTag}>In Progress</Text>
                    ) : (
                        <Text style={styles.newTag}>New</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>All Words ({allWords.length})</Text>
            <FlatList
                data={allWords}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'web' ? SPACING.lg : 60,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    list: {
        padding: SPACING.lg,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.md,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    word: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    meaning: {
        fontSize: 14,
        color: COLORS.textDim,
    },
    status: {
        marginLeft: SPACING.md,
    },
    learningTag: {
        fontSize: 12,
        color: COLORS.warning,
        fontWeight: '600',
    },
    newTag: {
        fontSize: 12,
        color: COLORS.textDim,
    },
});
