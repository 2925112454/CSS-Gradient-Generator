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
            editBtn.addEventListener('click', async () => {
                const gradientCode = item.bgcolor;
                // 1. 先存储数据，移除blur自动清除逻辑，改用页面加载完成后清理
                localStorage.setItem('gradient_edit_preset', gradientCode);
                localStorage.setItem('gradient_edit_version', Date.now().toString());

                // 2. 打开新标签
                const win = window.open('index.html', 'gradient-editor');
                if (!win) {
                    // 弹窗拦截提示用户手动刷新编辑器页面
                    showMessage('浏览器拦截弹窗，请手动打开编辑器页面刷新', 'warn');
                    return;
                }
                // 3. 轮询等待页面加载完成再传数据，解决服务器脚本加载延迟问题
                let pollTimer = setInterval(() => {
                    try {
                        // 优先全局方法调用
                        if (typeof win.loadPreset === 'function') {
                            win.loadPreset(gradientCode);
                            win.focus();
                            clearInterval(pollTimer);
                            return;
                        }
                        // 兜底postMessage
                        win.postMessage({
                            type: 'load-gradient',
                            data: gradientCode
                        }, location.origin);
                    } catch (err) {
                        // 页面未加载完成，等待下一轮
                    }
                }, 300);
                // 超时销毁轮询，防止内存泄漏
                setTimeout(() => clearInterval(pollTimer), 3000);
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