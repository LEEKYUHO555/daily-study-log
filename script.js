// Study Log Application
class StudyLogApp {
    constructor() {
        this.studies = [];
        this.filteredStudies = [];
        this.currentView = 'grid';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.loadStudies();
        this.setupEventListeners();
        this.setupTheme();
        this.renderStudies();
        this.updateStats();
        this.populateTagFilter();
        this.setCurrentDate();
    }

    // Data Management
    loadStudies() {
        const savedStudies = localStorage.getItem('dailyStudies');
        if (savedStudies) {
            this.studies = JSON.parse(savedStudies);
        } else {
            // Load sample data if no saved studies
            this.studies = this.getSampleData();
            this.saveStudies();
        }
        this.filteredStudies = [...this.studies];
    }

    saveStudies() {
        localStorage.setItem('dailyStudies', JSON.stringify(this.studies));
    }

    getSampleData() {
        return [
            {
                id: 1,
                date: '2025-01-20',
                title: 'JavaScript ES6+ 기초',
                description: 'Arrow Functions, Destructuring, Template Literals 등 ES6의 주요 기능들을 학습했습니다.',
                tags: ['JavaScript', 'ES6', 'Frontend'],
                filename: '2025-01-20.html'
            },
            {
                id: 2,
                date: '2025-01-19',
                title: 'React Hooks 심화',
                description: 'useState, useEffect, useContext 등 React Hooks의 고급 사용법을 익혔습니다.',
                tags: ['React', 'Hooks', 'Frontend'],
                filename: '2025-01-19.html'
            },
            {
                id: 3,
                date: '2025-01-18',
                title: 'CSS Grid Layout',
                description: 'CSS Grid를 활용한 복잡한 레이아웃 구성 방법을 학습했습니다.',
                tags: ['CSS', 'Layout', 'Frontend'],
                filename: '2025-01-18.html'
            }
        ];
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add study button
        document.getElementById('addStudyBtn').addEventListener('click', () => {
            this.openAddStudyModal();
        });

        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeAddStudyModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeAddStudyModal();
        });

        // Form submission
        document.getElementById('addStudyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewStudy();
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Clear search
        document.getElementById('clearSearch').addEventListener('click', () => {
            searchInput.value = '';
            this.handleSearch('');
        });

        // Filter controls
        document.getElementById('tagFilter').addEventListener('change', (e) => {
            this.handleTagFilter(e.target.value);
        });

        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.handleSort(e.target.value);
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleViewChange(e.target.closest('.view-btn').dataset.view);
            });
        });

        // Modal backdrop click
        document.getElementById('addStudyModal').addEventListener('click', (e) => {
            if (e.target.id === 'addStudyModal') {
                this.closeAddStudyModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAddStudyModal();
            }
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openAddStudyModal();
            }
        });
    }

    // Theme Management
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Modal Management
    openAddStudyModal() {
        document.getElementById('addStudyModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('studyTitle').focus();
    }

    closeAddStudyModal() {
        document.getElementById('addStudyModal').classList.remove('active');
        document.body.style.overflow = '';
        this.resetForm();
    }

    resetForm() {
        document.getElementById('addStudyForm').reset();
        this.setCurrentDate();
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('studyDate').value = today;
    }

    // Study Management
    addNewStudy() {
        const formData = new FormData(document.getElementById('addStudyForm'));
        const date = document.getElementById('studyDate').value;
        const title = document.getElementById('studyTitle').value.trim();
        const description = document.getElementById('studyDescription').value.trim();
        const tagsInput = document.getElementById('studyTags').value.trim();

        if (!title) {
            alert('제목을 입력해주세요.');
            return;
        }

        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        const newStudy = {
            id: Date.now(),
            date,
            title,
            description,
            tags,
            filename: `${date}.html`
        };

        this.studies.unshift(newStudy);
        this.saveStudies();
        this.closeAddStudyModal();
        this.renderStudies();
        this.updateStats();
        this.populateTagFilter();
        
        // Show success message
        this.showNotification('새로운 스터디가 추가되었습니다!', 'success');
    }

    deleteStudy(id) {
        if (confirm('이 스터디를 삭제하시겠습니까?')) {
            this.studies = this.studies.filter(study => study.id !== id);
            this.saveStudies();
            this.renderStudies();
            this.updateStats();
            this.populateTagFilter();
            this.showNotification('스터디가 삭제되었습니다.', 'info');
        }
    }

    // Search and Filter
    handleSearch(query) {
        const searchTerm = query.toLowerCase();
        this.filteredStudies = this.studies.filter(study => {
            return study.title.toLowerCase().includes(searchTerm) ||
                   study.description.toLowerCase().includes(searchTerm) ||
                   study.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
        this.renderStudies();
    }

    handleTagFilter(selectedTag) {
        if (selectedTag === '') {
            this.filteredStudies = [...this.studies];
        } else {
            this.filteredStudies = this.studies.filter(study => 
                study.tags.includes(selectedTag)
            );
        }
        this.renderStudies();
    }

    handleSort(sortBy) {
        switch (sortBy) {
            case 'date-desc':
                this.filteredStudies.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                this.filteredStudies.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                this.filteredStudies.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        this.renderStudies();
    }

    handleViewChange(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        const grid = document.getElementById('studiesGrid');
        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    }

    // Rendering
    renderStudies() {
        const grid = document.getElementById('studiesGrid');
        const emptyState = document.getElementById('emptyState');
        const noResults = document.getElementById('noResults');

        if (this.studies.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            noResults.style.display = 'none';
            return;
        }

        if (this.filteredStudies.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        noResults.style.display = 'none';

        grid.innerHTML = this.filteredStudies.map(study => this.createStudyCard(study)).join('');
        
        // Add event listeners to action buttons
        this.setupCardEventListeners();
    }

    createStudyCard(study) {
        const formattedDate = this.formatDate(study.date);
        const tagsHtml = study.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        return `
            <div class="study-card" data-id="${study.id}">
                <div class="study-header">
                    <span class="study-date">${formattedDate}</span>
                    <div class="study-actions">
                        <button class="action-btn edit-btn" title="편집">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" title="삭제" onclick="app.deleteStudy(${study.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h3 class="study-title">${study.title}</h3>
                <p class="study-description">${study.description}</p>
                <div class="study-tags">
                    ${tagsHtml}
                </div>
            </div>
        `;
    }

    setupCardEventListeners() {
        // Add click handlers for study cards
        document.querySelectorAll('.study-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.study-actions')) {
                    const studyId = parseInt(card.dataset.id);
                    this.openStudyDetail(studyId);
                }
            });
        });

        // Add click handlers for tags
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                const tagText = tag.textContent;
                document.getElementById('tagFilter').value = tagText;
                this.handleTagFilter(tagText);
            });
        });
    }

    openStudyDetail(studyId) {
        const study = this.studies.find(s => s.id === studyId);
        if (study) {
            // For now, just show an alert. In a real implementation, 
            // this would navigate to the study detail page
            alert(`스터디 상세 페이지로 이동: ${study.title}\n(${study.filename})`);
        }
    }

    // Statistics
    updateStats() {
        const totalStudies = this.studies.length;
        const uniqueTags = [...new Set(this.studies.flatMap(study => study.tags))].length;
        const currentStreak = this.calculateStreak();

        document.getElementById('totalStudies').textContent = totalStudies;
        document.getElementById('totalTags').textContent = uniqueTags;
        document.getElementById('currentStreak').textContent = currentStreak;

        // Animate numbers
        this.animateNumbers();
    }

    calculateStreak() {
        if (this.studies.length === 0) return 0;
        
        const sortedDates = this.studies
            .map(study => new Date(study.date))
            .sort((a, b) => b - a);
        
        let streak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const latestDate = new Date(sortedDates[0]);
        latestDate.setHours(0, 0, 0, 0);
        
        // Check if latest study is today or yesterday
        const daysDiff = Math.floor((today - latestDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) return 0;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = new Date(sortedDates[i]);
            const prevDate = new Date(sortedDates[i - 1]);
            
            const diffTime = prevDate - currentDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    animateNumbers() {
        document.querySelectorAll('.stat-number').forEach(element => {
            const target = parseInt(element.textContent);
            let current = 0;
            const increment = target / 20;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 50);
        });
    }

    // Utility Functions
    populateTagFilter() {
        const tagFilter = document.getElementById('tagFilter');
        const allTags = [...new Set(this.studies.flatMap(study => study.tags))].sort();
        
        // Clear existing options except the first one
        tagFilter.innerHTML = '<option value="">모든 태그</option>';
        
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'short'
        };
        return date.toLocaleDateString('ko-KR', options);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-primary);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add notification animations to CSS
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

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new StudyLogApp();
});

// Export for global access
window.app = app;

