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
    }
    
    function handleCheckboxChange(event) {
        event.stopPropagation(); 
        
        const checkbox = event.target;
        const routineItem = checkbox.closest('.routine-item');
        const itemId = routineItem.getAttribute('data-id');

        if (checkbox.checked) {
            routineItem.classList.add('completed');
            checkbox.disabled = true;
            localStorage.setItem(itemId, 'true');
        } else {
            routineItem.classList.remove('completed');
            checkbox.disabled = false;
            localStorage.setItem(itemId, 'false');
        }
    }
    function resetRoutine() {
        if (!confirm("Are you sure you want to reset all tasks for today?")) {
            return; 
        }
        
        routineItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            localStorage.removeItem(itemId);
        });

        loadRoutineState();
        
        alert("Routine has been successfully reset!");
    }

    loadRoutineState();
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    resetRoutineBtn.addEventListener('click', resetRoutine);

    routineItems.forEach(item => {
        item.addEventListener('click', (event) => {
            if(event.target.classList.contains('routine-checkbox')){
              return;
            }
            if (item.classList.contains('completed')) {
                event.preventDefault(); 
                return; 
            }
            
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

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

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
