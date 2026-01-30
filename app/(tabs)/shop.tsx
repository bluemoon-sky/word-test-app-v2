import React from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import { MOCK_REWARDS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';

export default function ShopScreen() {
    const profile = useAppStore(state => state.profile);
    const requestReward = useAppStore(state => state.requestReward);
    const rewardRequests = useAppStore(state => state.rewardRequests);

    const handleBuy = (reward: any) => {
        if (profile.tokens < reward.cost) {
            alert("Not enough tokens!");
            return;
        }

        // Check if already pending (optional logic)

        requestReward(reward.id, reward.cost);

        if (reward.requiresApproval) {
            alert("Request sent to parent!");
        } else {
            alert("Reward claimed!");
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.item}>
            <View style={styles.iconBox}>
                <Text style={{ fontSize: 30 }}>{item.icon}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                {item.requiresApproval && <Text style={styles.approvalTag}>Needs Approval</Text>}
            </View>
            <TouchableOpacity
                style={[styles.buyBtn, { opacity: profile.tokens >= item.cost ? 1 : 0.5 }]}
                onPress={() => handleBuy(item)}
                disabled={profile.tokens < item.cost}
            >
                <Text style={styles.costText}>{item.cost} 💎</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Rewards</Text>
                <View style={styles.balance}>
                    <Text style={styles.balanceText}>{profile.tokens} 💎</Text>
                </View>
            </View>

            <FlatList
                data={MOCK_REWARDS}
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    balance: {
        backgroundColor: COLORS.surfaceHighlight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    balanceText: {
        color: COLORS.warning,
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        padding: SPACING.lg,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: 16,
        marginBottom: SPACING.md,
        alignItems: 'center',
    },
    iconBox: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.surfaceHighlight,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    desc: {
        fontSize: 12,
        color: COLORS.textDim,
    },
    approvalTag: {
        fontSize: 10,
        color: COLORS.secondary,
        marginTop: 4,
    },
    buyBtn: {
        backgroundColor: COLORS.surfaceHighlight,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    costText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
});
