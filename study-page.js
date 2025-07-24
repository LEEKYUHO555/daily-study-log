// Study Page JavaScript
class StudyPageApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupNavigation();
        this.enhanceContent();
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
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToPrevious();
            }
            if (e.key === 'ArrowRight' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToNext();
            }
            if (e.key === 'Escape') {
                window.location.href = '../index.html';
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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
    }

    // Navigation
    setupNavigation() {
        const prevBtn = document.getElementById('prevStudy');
        const nextBtn = document.getElementById('nextStudy');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateToPrevious());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateToNext());
        }

        // Load navigation data
        this.loadNavigationData();
    }

    async loadNavigationData() {
        try {
            // In a real implementation, this would load from data.json
            // For now, we'll use sample data
            const studies = [
                { date: '2025-01-16', filename: '2025-01-16.html' },
                { date: '2025-01-17', filename: '2025-01-17.html' },
                { date: '2025-01-18', filename: '2025-01-18.html' },
                { date: '2025-01-19', filename: '2025-01-19.html' },
                { date: '2025-01-20', filename: '2025-01-20.html' }
            ];

            const currentFilename = window.location.pathname.split('/').pop();
            const currentIndex = studies.findIndex(study => study.filename === currentFilename);

            const prevBtn = document.getElementById('prevStudy');
            const nextBtn = document.getElementById('nextStudy');

            if (currentIndex > 0) {
                prevBtn.disabled = false;
                prevBtn.dataset.href = studies[currentIndex - 1].filename;
            } else {
                prevBtn.disabled = true;
            }

            if (currentIndex < studies.length - 1 && currentIndex !== -1) {
                nextBtn.disabled = false;
                nextBtn.dataset.href = studies[currentIndex + 1].filename;
            } else {
                nextBtn.disabled = true;
            }
        } catch (error) {
            console.error('Failed to load navigation data:', error);
        }
    }

    navigateToPrevious() {
        const prevBtn = document.getElementById('prevStudy');
        if (prevBtn && !prevBtn.disabled && prevBtn.dataset.href) {
            window.location.href = prevBtn.dataset.href;
        }
    }

    navigateToNext() {
        const nextBtn = document.getElementById('nextStudy');
        if (nextBtn && !nextBtn.disabled && nextBtn.dataset.href) {
            window.location.href = nextBtn.dataset.href;
        }
    }

    // Content Enhancement
    enhanceContent() {
        this.addCopyButtonsToCodeBlocks();
        this.addTableOfContents();
        this.addReadingProgress();
        this.addImageZoom();
    }

    addCopyButtonsToCodeBlocks() {
        document.querySelectorAll('pre code').forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            const button = document.createElement('button');
            button.className = 'copy-btn';
            button.innerHTML = '<i class="fas fa-copy"></i>';
            button.title = '코드 복사';
            
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(codeBlock.textContent);
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.style.color = 'var(--success-color)';
                    
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i>';
                        button.style.color = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            });

            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }

    addTableOfContents() {
        const headings = document.querySelectorAll('.content-section h3');
        if (headings.length < 2) return;

        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>목차</h4>';

        const list = document.createElement('ul');
        headings.forEach((heading, index) => {
            const id = `section-${index}`;
            heading.id = id;

            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            listItem.appendChild(link);
            list.appendChild(listItem);
        });

        toc.appendChild(list);
        
        const firstSection = document.querySelector('.content-section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(toc, firstSection);
        }
    }

    addReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            const fill = document.querySelector('.reading-progress-fill');
            if (fill) {
                fill.style.width = `${Math.min(scrollPercent, 100)}%`;
            }
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    addImageZoom() {
        document.querySelectorAll('.content-section img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                this.openImageModal(img.src, img.alt);
            });
        });
    }

    openImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <button class="image-modal-close">&times;</button>
                <img src="${src}" alt="${alt}">
                <p class="image-modal-caption">${alt}</p>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'image-modal-close') {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }
        });

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }
}

// Add enhanced styles
const style = document.createElement('style');
style.textContent = `
    .copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 0.5rem;
        color: var(--text-muted);
        cursor: pointer;
        transition: var(--transition);
        opacity: 0;
    }

    pre:hover .copy-btn {
        opacity: 1;
    }

    .copy-btn:hover {
        background: var(--bg-secondary);
        color: var(--text-secondary);
    }

    .table-of-contents {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        margin: 2rem 0;
    }

    .table-of-contents h4 {
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 600;
    }

    .table-of-contents ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .table-of-contents li {
        margin: 0.5rem 0;
    }

    .table-of-contents a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.875rem;
        transition: var(--transition);
    }

    .table-of-contents a:hover {
        color: var(--primary-color);
    }

    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--bg-secondary);
        z-index: 1000;
    }

    .reading-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        width: 0%;
        transition: width 0.1s ease;
    }

    .image-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(4px);
    }

    .image-modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    }

    .image-modal-content img {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: var(--border-radius);
    }

    .image-modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    .image-modal-caption {
        color: white;
        margin-top: 1rem;
        font-size: 0.875rem;
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new StudyPageApp();
});

