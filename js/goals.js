/**
 * CAO Points Goal System for StudyHub Ireland
 * Automatic difficulty adjustment based on target points
 */

// ==========================================
// CAO Points Configuration
// ==========================================

const CAO_MAX_POINTS = 625;

const GRADE_POINTS = {
    // Higher Level
    'H1': 100, 'H2': 88, 'H3': 77, 'H4': 66, 'H5': 56, 'H6': 46, 'H7': 37, 'H8': 0,
    // Ordinary Level
    'O1': 56, 'O2': 46, 'O3': 37, 'O4': 28, 'O5': 20, 'O6': 12, 'O7': 0, 'O8': 0
};

// Difficulty thresholds based on points needed
const DIFFICULTY_THRESHOLDS = {
    easy: { min: 0, max: 350 },      // Foundation/Basic level
    medium: { min: 300, max: 500 },  // Standard competitive level
    hard: { min: 450, max: 625 }     // High achiever level
};

// ==========================================
// Goal Data Management
// ==========================================

let goalData = {
    targetPoints: 500,
    currentPoints: 350,
    targetCourse: '',
    manualDifficulty: 'auto',
    recommendedDifficulty: 'medium',
    subjects: []
};

// Load saved goal data
function loadGoalData() {
    const saved = localStorage.getItem('studyhub_goal');
    if (saved) {
        goalData = { ...goalData, ...JSON.parse(saved) };
    }
    return goalData;
}

// Save goal data
function saveGoalData() {
    localStorage.setItem('studyhub_goal', JSON.stringify(goalData));
}

// ==========================================
// Difficulty Calculation
// ==========================================

function calculateRecommendedDifficulty(targetPoints, currentPoints) {
    const pointsNeeded = targetPoints - currentPoints;
    const targetLevel = targetPoints;
    
    // High targets need hard difficulty
    if (targetLevel >= 550) {
        return {
            level: 'hard',
            reason: 'You need to practice at Higher Level to achieve this competitive points target',
            color: 'danger'
        };
    }
    
    // Very high targets (500-549) need hard/medium
    if (targetLevel >= 500) {
        return {
            level: 'hard',
            reason: 'Practice at Higher Level to reach this strong points target',
            color: 'warning'
        };
    }
    
    // Medium-high targets (400-499)
    if (targetLevel >= 400) {
        // If far from target, start medium
        if (pointsNeeded > 100) {
            return {
                level: 'medium',
                reason: 'Build foundation at Standard Level, then progress to Higher',
                color: 'info'
            };
        }
        return {
            level: 'hard',
            reason: 'You\'re close! Practice at Higher Level to reach your goal',
            color: 'warning'
        };
    }
    
    // Medium targets (300-399)
    if (targetLevel >= 300) {
        return {
            level: 'medium',
            reason: 'Standard Level practice is perfect for your target',
            color: 'info'
        };
    }
    
    // Lower targets
    return {
        level: 'easy',
        reason: 'Focus on building strong foundations at this level',
        color: 'success'
    };
}

// ==========================================
// Progress Calculations
// ==========================================

function calculateProgress(current, target) {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
}

function getMotivationalMessage(percentage, remaining) {
    if (percentage >= 100) {
        return {
            icon: 'trophy-fill',
            class: 'success',
            message: '<strong>Congratulations!</strong> You\'ve reached your target points! 🎉'
        };
    }
    
    if (percentage >= 90) {
        return {
            icon: 'fire',
            class: 'warning',
            message: `<strong>Almost there!</strong> Just ${remaining} more points to your goal!`
        };
    }
    
    if (percentage >= 75) {
        return {
            icon: 'emoji-smile',
            class: 'success',
            message: `<strong>Great progress!</strong> You're ${percentage}% of the way there!`
        };
    }
    
    if (percentage >= 50) {
        return {
            icon: 'graph-up',
            class: 'info',
            message: `<strong>Halfway there!</strong> Keep up the excellent work!`
        };
    }
    
    if (percentage >= 25) {
        return {
            icon: 'hand-thumbs-up',
            class: 'info',
            message: `<strong>Good start!</strong> You're ${percentage}% toward your goal.`
        };
    }
    
    return {
        icon: 'rocket',
        class: 'primary',
        message: `<strong>Let's do this!</strong> ${remaining} points to go - you've got this!`
    };
}

// ==========================================
// UI Updates
// ==========================================

function updateProgressDisplay() {
    const target = goalData.targetPoints;
    const current = goalData.currentPoints;
    const remaining = Math.max(0, target - current);
    const percentage = calculateProgress(current, target);
    
    // Update numbers
    document.getElementById('displayCurrent').textContent = current;
    document.getElementById('displayTarget').textContent = target;
    document.getElementById('displayRemaining').textContent = remaining;
    document.getElementById('progressPercentage').textContent = percentage + '%';
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage + '%';
    progressBar.innerHTML = `<span class="fw-bold">${current} / ${target}</span>`;
    
    // Update motivation message
    const motivation = getMotivationalMessage(percentage, remaining);
    const motivationDiv = document.getElementById('motivationMessage');
    motivationDiv.className = `alert alert-${motivation.class}`;
    motivationDiv.innerHTML = `<i class="bi bi-${motivation.icon}"></i> ${motivation.message}`;
}

function updateDifficultyRecommendation() {
    const recommendation = calculateRecommendedDifficulty(
        goalData.targetPoints, 
        goalData.currentPoints
    );
    
    goalData.recommendedDifficulty = recommendation.level;
    
    const difficultyDiv = document.getElementById('difficultyRecommendation');
    difficultyDiv.className = `alert alert-${recommendation.color} mb-4`;
    
    const levelText = recommendation.level.charAt(0).toUpperCase() + recommendation.level.slice(1);
    document.getElementById('recommendedDifficulty').textContent = `${levelText} Level`;
    document.getElementById('difficultyReason').textContent = recommendation.reason;
}

function updateAllDisplays() {
    updateProgressDisplay();
    updateDifficultyRecommendation();
}

// ==========================================
// Event Handlers
// ==========================================

function handleTargetPointsChange(value) {
    const points = Math.min(Math.max(parseInt(value) || 0, 0), CAO_MAX_POINTS);
    goalData.targetPoints = points;
    document.getElementById('targetPoints').value = points;
    updateAllDisplays();
}

function handleCurrentPointsChange(value) {
    const points = Math.min(Math.max(parseInt(value) || 0, 0), CAO_MAX_POINTS);
    goalData.currentPoints = points;
    document.getElementById('currentPoints').value = points;
    updateAllDisplays();
}

function handleCourseSelection(value) {
    goalData.targetCourse = value;
    if (value && !isNaN(parseInt(value))) {
        goalData.targetPoints = parseInt(value);
        document.getElementById('targetPoints').value = goalData.targetPoints;
        updateAllDisplays();
    }
}

function handleManualDifficultyChange(value) {
    goalData.manualDifficulty = value;
}

function handleSaveGoal() {
    saveGoalData();
    
    // Show success notification
    if (window.StudyHub && window.StudyHub.showNotification) {
        window.StudyHub.showNotification(
            `✅ Goal saved! Target: ${goalData.targetPoints} points`, 
            'success'
        );
    }
    
    // Update practice page difficulty if on auto mode
    if (goalData.manualDifficulty === 'auto') {
        localStorage.setItem('studyhub_auto_difficulty', goalData.recommendedDifficulty);
    }
}

// ==========================================
// Get Current Difficulty (for use in practice pages)
// ==========================================

function getCurrentDifficulty() {
    loadGoalData();
    
    if (goalData.manualDifficulty !== 'auto') {
        return goalData.manualDifficulty;
    }
    
    return goalData.recommendedDifficulty || 'medium';
}

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadGoalData();
    
    // Set initial values
    document.getElementById('targetPoints').value = goalData.targetPoints;
    document.getElementById('currentPoints').value = goalData.currentPoints;
    document.getElementById('targetCourse').value = goalData.targetCourse;
    document.getElementById('manualDifficulty').value = goalData.manualDifficulty;
    
    // Update displays
    updateAllDisplays();
    
    // Add event listeners
    document.getElementById('targetPoints').addEventListener('input', function(e) {
        handleTargetPointsChange(e.target.value);
    });
    
    document.getElementById('currentPoints').addEventListener('input', function(e) {
        handleCurrentPointsChange(e.target.value);
    });
    
    document.getElementById('targetCourse').addEventListener('change', function(e) {
        handleCourseSelection(e.target.value);
    });
    
    document.getElementById('manualDifficulty').addEventListener('change', function(e) {
        handleManualDifficultyChange(e.target.value);
    });
    
    document.getElementById('saveGoalBtn').addEventListener('click', handleSaveGoal);
    
    console.log('CAO Goals system initialized! 🎯');
});

// ==========================================
// Export for use in other modules
// ==========================================

window.CAOGoals = {
    getCurrentDifficulty,
    calculateRecommendedDifficulty,
    loadGoalData,
    saveGoalData,
    GRADE_POINTS
};
