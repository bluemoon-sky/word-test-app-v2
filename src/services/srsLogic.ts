import { UserWordState } from '../types';

export const SRS_DEFAULTS = {
    easiness: 2.5,
    interval: 0,
    repetitions: 0,
};

/**
 * Calculates the next state for a word based on the user's rating quality.
 * Quality: 0-5 (5 = perfect, <3 = fail)
 */
export function calculateNextState(
    currentState: UserWordState | null | undefined,
    quality: number,
    nowTimestamp: number = Date.now()
): Partial<UserWordState> {
    // Initialize if new
    let easiness = currentState?.easiness ?? SRS_DEFAULTS.easiness;
    let repetitions = currentState?.repetitions ?? SRS_DEFAULTS.repetitions;
    let interval = currentState?.interval ?? SRS_DEFAULTS.interval;

    // Correctness threshold (usually >= 3 is 'pass')
    if (quality >= 3) {
        // Correct
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easiness);
        }
        repetitions += 1;
    } else {
        // Incorrect
        repetitions = 0;
        interval = 1;
    }

    // Update Easiness
    // Formula: easiness += 0.1 - (5 - quality) * 0.08
    // easiness = max(1.3, easiness)
    easiness = easiness + 0.1 - (5 - quality) * 0.08;
    if (easiness < 1.3) easiness = 1.3;

    // Calculate Next Review Date
    // interval is in days
    const DAY_MS = 24 * 60 * 60 * 1000;
    const nextReviewDate = nowTimestamp + (interval * DAY_MS);

    return {
        easiness,
        repetitions,
        interval,
        nextReviewDate,
        lastReviewedAt: nowTimestamp,
        mastered: interval > 365 // Example mastery condition
    };
}
