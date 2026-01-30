import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/useAppStore';

export default function ProfileScreen() {
    const profile = useAppStore(state => state.profile);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={60} color={COLORS.text} />
                </View>
                <Text style={styles.name}>{profile.userId}</Text>
                <Text style={styles.grade}>{profile.grade}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <TouchableOpacity style={styles.row}>
                    <Text style={styles.rowLabel}>Daily Goal</Text>
                    <Text style={styles.rowValue}>{profile.dailyGoalMinutes} min / {profile.dailyGoalWords} words</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <Text style={styles.rowLabel}>Parent Link</Text>
                    <Text style={styles.rowValue}>{profile.linkedParentId ? 'Active' : 'Not Linked'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
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
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    grade: {
        fontSize: 16,
        color: COLORS.textDim,
    },
    section: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginHorizontal: SPACING.lg,
        padding: SPACING.md,
    },
    sectionTitle: {
        color: COLORS.textDim,
        fontSize: 14,
        marginBottom: SPACING.md,
        marginLeft: SPACING.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceHighlight,
    },
    rowLabel: {
        color: COLORS.text,
        fontSize: 16,
    },
    rowValue: {
        color: COLORS.textDim,
        fontSize: 16,
    },
    logoutBtn: {
        margin: SPACING.lg,
        alignItems: 'center',
        padding: SPACING.md,
    },
    logoutText: {
        color: COLORS.error,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
