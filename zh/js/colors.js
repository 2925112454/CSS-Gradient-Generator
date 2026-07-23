// colors.js
document.addEventListener('DOMContentLoaded', function () {
    // 全局状态
    let allGradients = [];
    let currentCategory = 'all';
    const previewWrap = document.querySelector('.preview-box-wrap');

    // 初始化入口
    init();
    async function init() {
        try {
            allGradients = await loadGradientData();
            renderCategoryFilter();
            renderGradientList();
        } catch (error) {
            previewWrap.innerHTML = '<p class="color_error-tip">渐变数据加载失败</p>';
        }
    }
        function loadGradientData() {
            const data = window.GRADIENT_PRESETS || [];
            return Promise.resolve(data);
        }
    // 渲染分类筛选栏
    function renderCategoryFilter() {
        const categoryList = [...new Set(allGradients.map(item => item.type))];
        const filterBox = document.createElement('div');
        filterBox.className = 'color_category-filter-box';

        filterBox.appendChild(createCategoryBtn('全部分类', 'all'));
        categoryList.forEach(category => {
            filterBox.appendChild(createCategoryBtn(category, category));
        });

        previewWrap.parentNode.insertBefore(filterBox, previewWrap);
    }
    // 创建分类按钮
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

    // 渲染渐变预览列表
    function renderGradientList() {
        const renderList = currentCategory === 'all'
            ? allGradients
            : allGradients.filter(item => item.type === currentCategory);

        previewWrap.innerHTML = '';
        previewWrap.classList.add('color_preview-grid');

        if (renderList.length === 0) {
            previewWrap.innerHTML = '<p class="color_empty-tip">该分类下暂无渐变预设</p>';
            return;
        }

        renderList.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'color_gradient-card';

            // 渐变预览区
            const preview = document.createElement('div');
            preview.className = 'color_gradient-preview';
            // 动态渐变背景保留（业务数据）
            preview.style.cssText = item.bgcolor;

            // 信息与按钮区
            const infoBox = document.createElement('div');
            infoBox.className = 'color_gradient-info';

            // 分类+名称
            const nameLine = document.createElement('div');
            nameLine.className = 'color_gradient-name';
            nameLine.innerHTML = `<span class="color_gradient-type">[${item.type}]</span> ${item.name}`;

            // 按钮组
            const btnGroup = document.createElement('div');
            btnGroup.className = 'color_btn-group';

            // 复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '复制';
            copyBtn.className = 'color_copy-btn';
            copyBtn.addEventListener('click', () => copyGradientCSS(item.bgcolor));

            // 编辑按钮
            const editBtn = document.createElement('button');
            editBtn.textContent = '编辑';
            editBtn.className = 'color_edit-btn';
            editBtn.dataset.index = index;
            // 绑定编辑逻辑
            editBtn.addEventListener('click', () => {
                // 打开或切换到编辑器窗口
                const win = window.open('index.html', 'gradient-editor');
                if (!win) {
                    // 弹窗被拦截，降级走 localStorage
                    localStorage.setItem('gradient_edit_preset', item.bgcolor);
                    localStorage.setItem('gradient_edit_version', Date.now().toString());
                    return;
                }
                
                try {
                    if (typeof win.loadPreset === 'function') {
                        win.loadPreset(item.bgcolor);
                        win.focus();
                        return;
                    }
                } catch (err) {
                    // 跨域或访问受限，继续走下一个策略
                }
                try {
                    win.postMessage({
                        type: 'load-gradient',
                        data: item.bgcolor
                    }, location.origin);
                } catch (err) {
                    // 继续降级
                }
                localStorage.setItem('gradient_edit_preset', item.bgcolor);
                localStorage.setItem('gradient_edit_version', Date.now().toString());
                
                win.focus();
            });
            // 组装DOM
            btnGroup.appendChild(copyBtn);
            btnGroup.appendChild(editBtn);
            infoBox.appendChild(nameLine);
            infoBox.appendChild(btnGroup);
            card.appendChild(preview);
            card.appendChild(infoBox);
            previewWrap.appendChild(card);
        });
    }

    // 复制CSS到剪贴板
    function copyGradientCSS(cssCode) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(cssCode)
                .then(() => showMessage('CSS代码复制成功！','success'))
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
            showMessage('CSS代码复制成功！','success');
        }
    }
});