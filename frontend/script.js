/**
 * Title Similarity & Compliance Validation System
 * Frontend Logic - Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const proposedTitleInput = document.getElementById('proposed-title');
    const verifyBtn = document.getElementById('verify-btn');
    const resetBtn = document.getElementById('reset-btn');
    const errorMessage = document.getElementById('error-message');
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    
    // Result DOM Elements
    const circularProgress = document.getElementById('circular-progress');
    const progressValue = document.getElementById('progress-value');
    const statusBadge = document.getElementById('status-badge');
    const probabilityDesc = document.getElementById('probability-desc');
    const feedbackGrid = document.getElementById('feedback-grid');
    const similarTitlesTableBody = document.querySelector('#similar-titles-table tbody');

    // Event Listeners
    verifyBtn.addEventListener('click', handleVerify);
    resetBtn.addEventListener('click', handleReset);
    proposedTitleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleVerify();
    });

    /**
     * Handle the verification process
     */
    async function handleVerify() {
        const title = proposedTitleInput.value.trim();

        // 1. Validate Input
        if (!validateInput(title)) {
            showError("Please enter a valid title (no special characters except spaces/hyphens).");
            return;
        }

        hideError();
        setLoading(true);

        try {
            // 2. Simulate Backend Call
            const response = await simulateBackendRequest(title);
            
            // 3. Render Results
            renderResults(response);
            
            setLoading(false);
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error("Verification failed:", error);
            showError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    }

    /**
     * Handle resetting the form
     */
    function handleReset() {
        proposedTitleInput.value = '';
        hideError();
        resultSection.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Validate input title
     */
    function validateInput(title) {
        if (!title || title.length < 3) return false;
        // Allow letters, numbers, spaces, and hyphens
        const regex = /^[a-zA-Z0-9\s\-]+$/;
        return regex.test(title);
    }

    /**
     * Set loading state UI
     */
    function setLoading(isLoading) {
        if (isLoading) {
            verifyBtn.disabled = true;
            btnText.classList.add('hidden');
            btnSpinner.classList.remove('hidden');
            loadingSection.classList.remove('hidden');
            resultSection.classList.add('hidden');
        } else {
            verifyBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
            loadingSection.classList.add('hidden');
        }
    }

    /**
     * Show/Hide error messages
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        proposedTitleInput.classList.add('border-danger');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
        proposedTitleInput.classList.remove('border-danger');
    }

    /**
     * Simulate a backend request with a delay
     */
    function simulateBackendRequest(title) {
        return new Promise((resolve) => {
            // Generate some random logic based on input for variety
            const isRejected = title.toLowerCase().includes('morning') || title.length > 20;
            const probValue = isRejected ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30);
            
            setTimeout(() => {
                resolve({
                    probability: probValue,
                    status: probValue > 70 ? "Rejected" : (probValue > 40 ? "Risky" : "Approved"),
                    similarities: {
                        exactMatch: title.toLowerCase() === "morning chronicle",
                        spelling: Math.random().toFixed(2),
                        phonetic: Math.random().toFixed(2),
                        semantic: Math.random().toFixed(2),
                        blacklist: title.toLowerCase().includes('badword'),
                        prefixSuffix: Math.random() > 0.8,
                        combination: Math.random() > 0.9,
                        periodicity: title.toLowerCase().match(/(daily|weekly|monthly)/i) !== null
                    },
                    similarTitles: [
                        {title: "The Morning Herald", score: 88},
                        {title: "Sunrise Chronicle", score: 82},
                        {title: "National Daily News", score: 45},
                        {title: "Metro Times", score: 32},
                        {title: "The Evening Post", score: 28}
                    ]
                });
            }, 1500);
        });
    }

    /**
     * Render the verification results to the DOM
     */
    function renderResults(data) {
        // Update Circular Progress
        const colorMap = {
            'Approved': '#10b981',
            'Risky': '#f59e0b',
            'Rejected': '#ef4444'
        };
        
        const color = colorMap[data.status];
        const degree = (data.probability / 100) * 360;
        
        circularProgress.style.background = `conic-gradient(${color} ${degree}deg, #e2e8f0 0deg)`;
        progressValue.textContent = `${data.probability}%`;
        progressValue.style.color = color;

        // Update Badge
        statusBadge.textContent = data.status;
        statusBadge.className = `badge ${data.status}`;

        // Update Description
        probabilityDesc.textContent = getProbabilityDescription(data.status, data.probability);

        // Render Feedback Grid
        renderFeedbackItems(data.similarities);

        // Render Similar Titles Table
        renderSimilarTitles(data.similarTitles);
    }

    function getProbabilityDescription(status, prob) {
        if (status === 'Approved') return `Low similarity detected (${prob}%). This title is likely compliant with regulations.`;
        if (status === 'Risky') return `Moderate similarity detected (${prob}%). Review is recommended to avoid potential conflicts.`;
        return `High similarity detected (${prob}%). This title is highly likely to be rejected due to non-compliance.`;
    }

    function renderFeedbackItems(sim) {
        const feedbackItems = [
            { id: 'exactMatch', label: 'Exact Match', val: sim.exactMatch, inverse: true, desc: sim.exactMatch ? "Found identical title." : "No identical match found." },
            { id: 'spelling', label: 'Spelling Similarity', val: sim.spelling > 0.5, score: sim.spelling, inverse: true, desc: `Spelling similarity is ${(sim.spelling*100).toFixed(0)}%.` },
            { id: 'phonetic', label: 'Phonetic Similarity', val: sim.phonetic > 0.5, score: sim.phonetic, inverse: true, desc: `Sounds ${(sim.phonetic*100).toFixed(0)}% like existing titles.` },
            { id: 'semantic', label: 'Semantic Similarity', val: sim.semantic > 0.5, score: sim.semantic, inverse: true, desc: `Meaning is ${(sim.semantic*100).toFixed(0)}% similar.` },
            { id: 'blacklist', label: 'Blacklist Check', val: sim.blacklist, inverse: true, desc: sim.blacklist ? "Contains prohibited words." : "No prohibited words detected." },
            { id: 'prefixSuffix', label: 'Prefix/Suffix', val: sim.prefixSuffix, inverse: true, desc: sim.prefixSuffix ? "Common prefix/suffix detected." : "Unique structure." },
            { id: 'combination', label: 'Combination Check', val: sim.combination, inverse: true, desc: sim.combination ? "Possible title combination." : "Original phrasing." },
            { id: 'periodicity', label: 'Periodicity Check', val: sim.periodicity, inverse: true, desc: sim.periodicity ? "Contains periodicity suffix." : "No common suffix added." }
        ];

        feedbackGrid.innerHTML = '';

        feedbackItems.forEach(item => {
            // "Inverse" means if true, it's a "Fail/Warning" (Red/Yellow)
            const isPositive = !item.val;
            const icon = isPositive ? 'fa-circle-check text-success' : (item.score > 0.8 || item.val === true ? 'fa-circle-xmark text-danger' : 'fa-circle-exclamation text-warning');
            
            const html = `
                <div class="feedback-item">
                    <div class="feedback-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="feedback-content">
                        <h4>${item.label}</h4>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `;
            feedbackGrid.innerHTML += html;
        });
    }

    function renderSimilarTitles(titles) {
        similarTitlesTableBody.innerHTML = '';
        
        titles.forEach(t => {
            const riskLevel = t.score > 75 ? 'High' : (t.score > 40 ? 'Medium' : 'Low');
            const row = `
                <tr>
                    <td><strong>${t.title}</strong></td>
                    <td>${t.score}%</td>
                    <td><span class="risk-level ${riskLevel}">${riskLevel}</span></td>
                </tr>
            `;
            similarTitlesTableBody.innerHTML += row;
        });
    }
});
