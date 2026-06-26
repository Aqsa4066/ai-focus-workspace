document.addEventListener('DOMContentLoaded', () => {
    const routineItems = document.querySelectorAll('.routine-item');
    const checkboxes = document.querySelectorAll('.routine-checkbox');
    const modal = document.getElementById('routineModal');
    const resetRoutineBtn = document.getElementById('resetRoutineBtn');
    const closeBtn = document.querySelector('.close-btn');
    
    const modalActivity = document.getElementById('modalActivity');
    const modalTime = document.getElementById('modalTime');
    const modalQuote = document.getElementById('modalQuote');
    const modalImage = document.getElementById('modalImage');

    function loadRoutineState() {
        routineItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            const isCompleted = localStorage.getItem(itemId) === 'true';
            const checkbox = item.querySelector('.routine-checkbox');

            if (isCompleted) {
                item.classList.add('completed');
                checkbox.checked = true;
                checkbox.disabled = true; 
            } else {
                item.classList.remove('completed');
                checkbox.checked = false;
                checkbox.disabled = false;
            }
        });
        
        // Optional: Trigger AI recommendation on load if there's enough data
        checkForOptimizationRecommendations();
    }
    
    function handleCheckboxChange(event) {
        event.stopPropagation(); 
        
        const checkbox = event.target;
        const routineItem = checkbox.closest('.routine-item');
        const itemId = routineItem.getAttribute('data-id');
        const activityName = routineItem.getAttribute('data-activity');

        // Fetch or initialize structural tracking history
        let history = JSON.parse(localStorage.getItem(`${itemId}_history`)) || { completed: 0, skipped: 0 };

        if (checkbox.checked) {
            routineItem.classList.add('completed');
            checkbox.disabled = true;
            localStorage.setItem(itemId, 'true');
            
            // Increment completion history
            history.completed += 1;
        }
        
        localStorage.setItem(`${itemId}_history`, JSON.stringify(history));
    }

    function resetRoutine() {
        if (!confirm("Are you sure you want to reset all tasks for today?")) {
            
            return; 
        }
        
        // Before clearing daily status, log uncompleted items as skipped
        routineItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            const isCompleted = localStorage.getItem(itemId) === 'true';
            
            let history = JSON.parse(localStorage.getItem(`${itemId}_history`)) || { completed: 0, skipped: 0 };
            
            if (!isCompleted) {
                history.skipped += 1;
                localStorage.setItem(`${itemId}_history`, JSON.stringify(history));
            }
            
            // Clear out today's status flag
            localStorage.removeItem(itemId);
        });

        loadRoutineState();
        alert("Routine reset! Unfinished items have been logged to analyze your peak focus windows.");
    }

    // --- NEW: AI ANALYSIS & FRONTEND COMPONENT ---
    function checkForOptimizationRecommendations() {
        let analyticsData = [];
        
        routineItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            const activity = item.getAttribute('data-activity');
            const time = item.getAttribute('data-time');
            const history = JSON.parse(localStorage.getItem(`${itemId}_history`)) || { completed: 0, skipped: 0 };
            
            const totalAttempts = history.completed + history.skipped;
            if (totalAttempts >= 3) { // Run insights once we have a mini baseline
                analyticsData.push({
                    id: itemId,
                    activity: activity,
                    time: time,
                    completed: history.completed,
                    skipped: history.skipped
                });
            }
        });

        if (analyticsData.length === 0) return;

        // POST data to Python ML Backend for cluster/optimization recommendation
        fetch('http://127.0.0.1:8000/api/optimize-schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ routine_history: analyticsData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.recommendation) {
                injectAiNotification(data.recommendation);
            }
        })
        .catch(err => console.log("Backend offline. Run Python server to enable ML suggestions."));
    }

    function injectAiNotification(message) {
        // Prevent duplicate notices
        if (document.getElementById('ai-notice')) return;

        const container = document.querySelector('.child-routine');
        const noticeDiv = document.createElement('div');
        noticeDiv.id = 'ai-notice';
        noticeDiv.style.cssText = `
            background: #fff9e6;
            border-left: 5px solid var(--secondary-color);
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 10px;
            font-size: 0.95rem;
            color: #555;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        noticeDiv.innerHTML = `<i class="fa-solid fa-brain" style="color: var(--primary-color); font-size: 1.3em;"></i> <span><strong>AI Optimizer:</strong> ${message}</span>`;
        
        // Insert right beneath routine header
        const header = document.querySelector('.routine-header');
        header.parentNode.insertBefore(noticeDiv, header.nextSibling);
    }

    // --- Rest of your original event listeners remain exactly the same ---
    loadRoutineState();
    checkboxes.forEach(checkbox => { checkbox.addEventListener('change', handleCheckboxChange); });
    resetRoutineBtn.addEventListener('click', resetRoutine);

    routineItems.forEach(item => {
        item.addEventListener('click', (event) => {
            if(event.target.classList.contains('routine-checkbox')) return;
            if (item.classList.contains('completed')) { event.preventDefault(); return; }
            event.preventDefault(); 
            
            const activity = item.getAttribute('data-activity');
            const time = item.getAttribute('data-time');
            const quote = item.getAttribute('data-quote');
            const imageSrc = item.getAttribute('data-image-src');

            modalActivity.textContent = activity;
            modalTime.textContent = time;
            modalQuote.textContent = quote;
            modalImage.src = imageSrc;
            modalImage.alt = activity + " image";
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (event) => { if (event.target === modal) { modal.style.display = 'none'; } });

    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const tableCells = document.querySelectorAll('.container table td:not(.lunch)');

    editBtn.addEventListener('click', () => {
        tableCells.forEach(cell => {
            cell.setAttribute('contenteditable', 'true');
            cell.style.backgroundColor = '#fff0f0';
            cell.style.border = '1px dashed #ff6f61';
        });
        editBtn.disabled = true;
        saveBtn.disabled = false;
    });

    saveBtn.addEventListener('click', () => {
        tableCells.forEach(cell => {
            cell.setAttribute('contenteditable', 'false');
            cell.style.backgroundColor = '';
            cell.style.border = '1px solid var(--border-color)';
        });
        editBtn.disabled = false;
        saveBtn.disabled = true;
    });
});
