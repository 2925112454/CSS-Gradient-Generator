// colors.js
document.addEventListener('DOMContentLoaded', function () {
    // Global state
    let allGradients = [];
    let currentCategory = 'all';
    const previewWrap = document.querySelector('.preview-box-wrap');
    // Initialization entry
    init();
    async function init() {
        try {
            allGradients = await loadGradientData();
            renderCategoryFilter();
            renderGradientList();
        } catch (error) {
            previewWrap.innerHTML = '<p class="color_error-tip">Failed to load gradient data</p>';
        }
    }
        function loadGradientData() {
            const data = window.GRADIENT_PRESETS || [];
            return Promise.resolve(data);
        }
    // Render category filter bar
    function renderCategoryFilter() {
        const categoryList = [...new Set(allGradients.map(item => item.type))];
        const filterBox = document.createElement('div');
        filterBox.className = 'color_category-filter-box';
        filterBox.appendChild(createCategoryBtn('All Categories', 'all'));
        categoryList.forEach(category => {
            filterBox.appendChild(createCategoryBtn(category, category));
        });
        previewWrap.parentNode.insertBefore(filterBox, previewWrap);
    }
    // Create category button
    function createCategoryBtn(text, value) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.dataset.category = value;
        btn.className = 'color_category-btn';
        if (value === currentCategory) {
            btn.classList.add('color_active');
        }
        btn.addEventListener('click', function () {
            currentCategory = value;
            document.querySelectorAll('.color_category-btn').forEach(b => {
                b.classList.remove('color_active');
            });
            this.classList.add('color_active');
            renderGradientList();
        });
        return btn;
    }
    // Render gradient preview list
    function renderGradientList() {
        const renderList = currentCategory === 'all'
            ? allGradients
            : allGradients.filter(item => item.type === currentCategory);
        previewWrap.innerHTML = '';
        previewWrap.classList.add('color_preview-grid');
        if (renderList.length === 0) {
            previewWrap.innerHTML = '<p class="color_empty-tip">No gradient presets available in this category</p>';
            return;
        }
        renderList.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'color_gradient-card';
            // Gradient preview area
            const preview = document.createElement('div');
            preview.className = 'color_gradient-preview';
            // Keep dynamic gradient background (business data)
            preview.style.cssText = item.bgcolor;
            // Info and button area
            const infoBox = document.createElement('div');
            infoBox.className = 'color_gradient-info';
            // Category + name
            const nameLine = document.createElement('div');
            nameLine.className = 'color_gradient-name';
            nameLine.innerHTML = `<span class="color_gradient-type">[${item.type}]</span> ${item.name}`;
            // Button group
            const btnGroup = document.createElement('div');
            btnGroup.className = 'color_btn-group';
            // Copy button
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.className = 'color_copy-btn';
            copyBtn.addEventListener('click', () => copyGradientCSS(item.bgcolor));
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'color_edit-btn';
            editBtn.dataset.index = index;
            // Bind edit logic
            editBtn.addEventListener('click', async () => {
                const gradientCode = item.bgcolor;
                // 1. Store data first; remove auto-clear on blur, clear after page loads instead
                localStorage.setItem('gradient_edit_preset', gradientCode);
                localStorage.setItem('gradient_edit_version', Date.now().toString());
                // 2. Open new tab
                const win = window.open('index.html', 'gradient-editor');
                if (!win) {
                    // Popup blocked, prompt user to manually refresh the editor page
                    showMessage('Popup blocked by browser. Please open the editor page manually and refresh.', 'warn');
                    return;
                }
                // 3. Poll until page loads before sending data, fixes server script loading delay
                let pollTimer = setInterval(() => {
                    try {
                        // Prefer global method call
                        if (typeof win.loadPreset === 'function') {
                            win.loadPreset(gradientCode);
                            win.focus();
                            clearInterval(pollTimer);
                            return;
                        }
                        // Fallback to postMessage
                        win.postMessage({
                            type: 'load-gradient',
                            data: gradientCode
                        }, location.origin);
                    } catch (err) {
                        // Page not loaded yet, wait for next poll
                    }
                }, 300);
                // Destroy poll on timeout to prevent memory leaks
                setTimeout(() => clearInterval(pollTimer), 3000);
                win.focus();
            });
            // Assemble DOM elements
            btnGroup.appendChild(copyBtn);
            btnGroup.appendChild(editBtn);
            infoBox.appendChild(nameLine);
            infoBox.appendChild(btnGroup);
            card.appendChild(preview);
            card.appendChild(infoBox);
            previewWrap.appendChild(card);
        });
    }
    // Copy CSS to clipboard
    function copyGradientCSS(cssCode) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(cssCode)
                .then(() => showMessage('CSS code copied successfully!','success'))
                .catch(() => fallbackCopy(cssCode));
        } else {
            fallbackCopy(cssCode);
        }
        function fallbackCopy(code) {
            const textarea = document.createElement('textarea');
            textarea.className = 'color_fallback-textarea';
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showMessage('CSS code copied successfully!','success');
        }
    }
});
