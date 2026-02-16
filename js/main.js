/**
 * StudyHub Ireland - Main JavaScript
 * Handles gamification, user interaction, and dynamic content
 */

// ==========================================
// User Progress Management (Demo Data)
// ==========================================

const userProgress = {
    level: 12,
    xp: 2450,
    xpToNextLevel: 3000,
    streak: 5,
    questionsCompleted: 142,
    achievements: 8,
    studyTime: 24, // hours
    
    subjects: {
        maths: { progress: 45, completed: 48, accuracy: 82 },
        english: { progress: 60, completed: 62, accuracy: 75 },
        biology: { progress: 20, completed: 32, accuracy: 88 },
        irish: { progress: 30, completed: 38, accuracy: 70 },
        chemistry: { progress: 15, completed: 22, accuracy: 65 },
        physics: { progress: 10, completed: 18, accuracy: 78 }
    }
};

// ==========================================
// Local Storage Management
// ==========================================

function saveProgress() {
    localStorage.setItem('studyhub_progress', JSON.stringify(userProgress));
}

function loadProgress() {
    const saved = localStorage.getItem('studyhub_progress');
    if (saved) {
        Object.assign(userProgress, JSON.parse(saved));
    }
}

// ==========================================
// XP and Level System
// ==========================================

function addXP(points) {
    userProgress.xp += points;
    
    // Check for level up
    while (userProgress.xp >= userProgress.xpToNextLevel) {
        userProgress.xp -= userProgress.xpToNextLevel;
        userProgress.level++;
        userProgress.xpToNextLevel = Math.floor(userProgress.xpToNextLevel * 1.2);
        
        showNotification(`🎉 Level Up! You're now Level ${userProgress.level}!`, 'success');
    }
    
    saveProgress();
    updateProgressDisplay();
}

function updateProgressDisplay() {
    // Update XP progress bars if they exist on the page
    const xpBars = document.querySelectorAll('.progress-bar.bg-gradient');
    xpBars.forEach(bar => {
        const percentage = (userProgress.xp / userProgress.xpToNextLevel) * 100;
        bar.style.width = `${percentage}%`;
    });
}

// ==========================================
// Achievements System
// ==========================================

const achievements = [
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first question',
        icon: 'bi-star-fill',
        unlocked: false
    },
    {
        id: 'quick_learner',
        name: 'Quick Learner',
        description: 'Complete 10 questions in one day',
        icon: 'bi-lightning-fill',
        unlocked: false
    },
    {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain a 5-day study streak',
        icon: 'bi-fire',
        unlocked: false
    },
    {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Get 100% on a practice test',
        icon: 'bi-award',
        unlocked: false
    }
];

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked) {
            let shouldUnlock = false;
            
            switch(achievement.id) {
                case 'first_steps':
                    shouldUnlock = userProgress.questionsCompleted >= 1;
                    break;
                case 'streak_master':
                    shouldUnlock = userProgress.streak >= 5;
                    break;
            }
            
            if (shouldUnlock) {
                unlockAchievement(achievement);
            }
        }
    });
}

function unlockAchievement(achievement) {
    achievement.unlocked = true;
    showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`, 'warning');
    saveProgress();
}

// ==========================================
// Notifications
// ==========================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// Practice Question Handler
// ==========================================

function handleQuestionSubmission(isCorrect, points = 15) {
    if (isCorrect) {
        addXP(points);
        userProgress.questionsCompleted++;
        showNotification(`✅ Correct! +${points} XP`, 'success');
    } else {
        showNotification('❌ Not quite right. Keep trying!', 'danger');
    }
    
    checkAchievements();
    saveProgress();
}

// ==========================================
// Streak Management
// ==========================================

function updateStreak() {
    const lastStudyDate = localStorage.getItem('lastStudyDate');
    const today = new Date().toDateString();
    
    if (lastStudyDate === today) {
        // Already studied today
        return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastStudyDate === yesterday.toDateString()) {
        // Continue streak
        userProgress.streak++;
        showNotification(`🔥 ${userProgress.streak} day streak!`, 'warning');
    } else if (lastStudyDate !== today) {
        // Streak broken, reset
        if (userProgress.streak > 0) {
            showNotification('Streak reset. Start a new one today!', 'info');
        }
        userProgress.streak = 1;
    }
    
    localStorage.setItem('lastStudyDate', today);
    saveProgress();
}

// ==========================================
// Filter and Search Functions
// ==========================================

function filterSubjects(criteria) {
    // Implementation for filtering subjects based on exam type, level, etc.
    console.log('Filtering subjects:', criteria);
}

function searchContent(query) {
    // Implementation for searching questions and content
    console.log('Searching for:', query);
}

// ==========================================
// Animation Helpers
// ==========================================

// Add subtle animations to elements as they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Load saved progress
    loadProgress();
    
    // Update streak on page load
    updateStreak();
    
    // Initialize progress displays
    updateProgressDisplay();
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.feature-card, .subject-card, .exam-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search (future implementation)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            console.log('Search shortcut triggered');
        }
    });
    
    console.log('StudyHub Ireland initialized successfully! 📚');
});

// ==========================================
// Utility Functions
// ==========================================

function formatTime(hours) {
    if (hours < 1) {
        return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours}h`;
}

function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

function getSubjectProgress(subject) {
    return userProgress.subjects[subject] || { progress: 0, completed: 0, accuracy: 0 };
}

// ==========================================
// Export functions for use in HTML
// ==========================================

window.StudyHub = {
    addXP,
    handleQuestionSubmission,
    updateStreak,
    showNotification,
    filterSubjects,
    searchContent,
    userProgress
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
