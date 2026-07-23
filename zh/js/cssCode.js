// 全局数据
let layers = [
    {
        type: 'linear',
        angle: 45,
        radShape: 'circle',
        radSize: 'farthest-corner',
        radX:50, radY:50,
        conicFromAngle: 0,
        conicX: 50,
        conicY: 50,
        stops: [
            {hex:'#2600ff', alpha:100, pos:0},
            {hex:'#fe0055', alpha:100, pos:100}
        ]
    }
];
// 全局背景尺寸、位置
let bgSizeValue = '';
let bgPosValue = '';
let activeLayerIndex = 0;
let copyLayerData = null;
let copyStopData = null;
let dragLayerIdx = null;
let dragStopIdx = null;

// ===== 移动端触屏交互变量 =====
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let touchDragLayerIdx = null;
let isLayerTouchDragging = false;
let longPressTimer = null;
const LONG_PRESS_MS = 300;    // 长按触发拖拽的时间阈值
const TAP_MOVE_THRESHOLD = 20; // 点击允许的最大移动像素
const DOUBLE_TAP_MS = 350;     // 双击时间阈值
let ignoreNextClick = false;

// 各模块双击状态独立，避免互相干扰
let lastLayerTapTime = 0;
let lastLayerTapIndex = -1;
let lastStopItemTapTime = 0;
let lastStopItemTapIndex = -1;
let lastStopTapTime = 0;
let lastStopTapIndex = -1;

// DOM
const preview = document.getElementById('preview');
const cssCode = document.getElementById('cssCode');
const layerList = document.getElementById('layerList');
const addLayerBtn = document.getElementById('addLayerBtn');
const gradType = document.getElementById('gradType');
const linearConfig = document.getElementById('linearConfig');
const radialConfig = document.getElementById('radialConfig');
const angleRange = document.getElementById('angleRange');
const angleNum = document.getElementById('angleNum');
const radShape = document.getElementById('radShape');
const radSize = document.getElementById('radSize');
const radXRange = document.getElementById('radXRange');
const radXNum = document.getElementById('radXNum');
const radYRange = document.getElementById('radYRange');
const radYNum = document.getElementById('radYNum');
const stopTrack = document.getElementById('stopTrack');
const stopList = document.getElementById('stopList');
const addStopBtn = document.getElementById('addStopBtn');
const copyBtn = document.getElementById('copyBtn');
const presetBox = document.getElementById('presetBox');
const layerCtx = document.getElementById('layerCtx');
const stopCtx = document.getElementById('stopCtx');
const globalBgSizeInput = document.getElementById('globalBgSize');
const globalBgPosInput = document.getElementById('globalBgPos');
const globalBgSize = document.getElementById('globalBgSize');
const globalBgPos = document.getElementById('globalBgPos');
const conicConfig = document.getElementById('conicConfig');
const conicAngleRange = document.getElementById('conicAngleRange');
const conicAngleNum = document.getElementById('conicAngleNum');
const conicXRange = document.getElementById('conicXRange');
const conicXNum = document.getElementById('conicXNum');
const conicYRange = document.getElementById('conicYRange');
const conicYNum = document.getElementById('conicYNum');
const previewspan = document.getElementById('previewspan');
const globalBgRepeat = document.getElementById('globalBgRepeat');

// 仅更新滑块位置和选中状态
function updateStopThumbsPosition() {
  const stops = layers[activeLayerIndex].stops;
  const thumbs = stopTrack.querySelectorAll('.stop-drag-thumb');
  thumbs.forEach((thumb, idx) => {
    if (!stops[idx]) return;
    thumb.style.left = stops[idx].pos + '%';
    // 切换选中高亮
    thumb.classList.toggle('active-thumb', idx === dragStopIdx);
  });
}

// 按逗号分割字符串，忽略括号内部的逗号
function splitByCommaIgnoreBrackets(str) {
    const result = [];
    let stack = 0;
    let segmentStart = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '(') stack++;
        if (char === ')') stack--;
        // 仅在括号外的逗号处分割
        if (stack === 0 && char === ',') {
            const segment = str.slice(segmentStart, i).trim();
            if (segment) result.push(segment);
            segmentStart = i + 1;
        }
    }
    // 处理最后一段
    const lastSegment = str.slice(segmentStart).trim();
    if (lastSegment) result.push(lastSegment);
    return result;
}

// 关闭所有右键菜单
function hideAllCtx(){
    layerCtx.style.display = 'none';
    stopCtx.style.display = 'none';
}

// 调整右键菜单位置，避免超出屏幕边界
function adjustCtxPosition(ctxEl, x, y) {
    ctxEl.style.visibility = 'hidden';
    ctxEl.style.display = 'block';
    const rect = ctxEl.getBoundingClientRect();
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;
    let finalX = x;
    let finalY = y;
    if (x + rect.width > viewW) finalX = viewW - rect.width - 5;
    if (y + rect.height > viewH) finalY = viewH - rect.height - 5;
    ctxEl.style.left = finalX + 'px';
    ctxEl.style.top = finalY + 'px';
    ctxEl.style.visibility = 'visible';
}

document.addEventListener('click', function(e) {
    if (e.target.closest('#layerCtx') || e.target.closest('#stopCtx')) {
        return;
    }
    if (ignoreNextClick) {
        ignoreNextClick = false;
        return;
    }
    hideAllCtx();
});

// Hex转rgba
function hexToRgba(hex, aPct){
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    let a = (aPct/100);
    if(a === 1) a = 1;
    else if(a === 0) a = 0;
    else a = Number(a.toFixed(1));
    return `rgba(${r},${g},${b},${a})`;
}

// 深拷贝对象
function deepClone(obj){
    return JSON.parse(JSON.stringify(obj));
}

// 渲染预设面板
function renderPresets(){
    presetBox.innerHTML = '';
    presets.forEach(p=>{
        const wrap = document.createElement('div');
        wrap.className = 'preset-item';
        const inner = document.createElement('div');
        inner.className = 'preset-inner';
        let gradStr = '';
        let sSize = '';
        let sPos = '';
        const rules = p.grad.split(';').map(r=>r.trim()).filter(Boolean);
        for(const rule of rules){
            if(rule.startsWith('background:')) gradStr = rule.replace(/^background:\s*/,'').trim();
            if(rule.startsWith('background-size:')) sSize = rule.replace(/^background-size:\s*/,'').trim();
            if(rule.startsWith('background-position:')) sPos = rule.replace(/^background-position:\s*/,'').trim();
        }
        inner.style.background = gradStr;
        if(sSize) inner.style.backgroundSize = sSize;
        if(sPos) inner.style.backgroundPosition = sPos;
        wrap.appendChild(inner);
        wrap.onclick = ()=>loadPreset(p.grad);
        presetBox.appendChild(wrap);
    })
}

// 加载预设
function loadPreset(fullBgStr){
    let pureGradText = '';
    let sizeVal = '';
    let posVal = '';
    const rules = fullBgStr.split(';').map(r=>r.trim()).filter(Boolean);
    for(const rule of rules){
        if(rule.startsWith('background:')){
            pureGradText = rule.replace(/^background:\s*/,'').trim();
        }else if(rule.startsWith('background-size:')){
            sizeVal = rule.replace(/^background-size:\s*/,'').trim();
        }else if(rule.startsWith('background-position:')){
            posVal = rule.replace(/^background-position:\s*/,'').trim();
        }
    }
    bgSizeValue = sizeVal;
    bgPosValue = posVal;
    globalBgSizeInput.value = sizeVal;
    globalBgPosInput.value = posVal;
    const layerArr = splitMultiGrad(pureGradText);
    if(!Array.isArray(layerArr) || layerArr.length === 0){
        layers = [{
            type: 'linear',
            angle: 45,
            radShape: 'circle',
            radSize: 'farthest-corner',
            radX:50, radY:50,
            stops: [
                {hex:'#2600ff', alpha:100, pos:0},
                {hex:'#fe0055', alpha:100, pos:100}
            ]
        }];
    }else{
        layers = layerArr.reverse();
    }
    activeLayerIndex = 0;
    renderLayerList();
    syncLayerToControl();
    renderStopDragTrack();
    renderStopList();
    updatePreview();
}

// 栈分割多层渐变
function splitMultiGrad(str){
    const result = [];
    let stack = 0;
    let startIdx = -1;
    const s = str.trim();
    for(let i = 0; i < s.length; i++){
        const c = s[i];
        if(c === '(') stack++;
        if(c === ')') stack--;
        const substr25 = s.slice(i, i + 25);
        const substr24 = s.slice(i, i + 24); // 重复锥形长度
        const substr15 = s.slice(i, i + 15);
        const substr14 = s.slice(i, i + 14); // 锥形长度
        if(
            stack === 0 && startIdx === -1 &&
            (
                substr25 === 'repeating-linear-gradient' || 
                substr25 === 'repeating-radial-gradient' || 
                substr24 === 'repeating-conic-gradient' ||
                substr15 === 'linear-gradient' || 
                substr15 === 'radial-gradient' ||
                substr14 === 'conic-gradient'
            )
        ){
            startIdx = i;
        }
        if(stack === 0 && c === ',' && startIdx !== -1){
            const gradStr = s.slice(startIdx, i).trim();
            if(gradStr) result.push(gradStr);
            startIdx = -1;
        }
    }
    if(startIdx !== -1){
        const lastGrad = s.slice(startIdx).trim();
        if(lastGrad) result.push(lastGrad);
    }
    return result.map(g=>parseSingleGrad(g));
}

function parseSingleGrad(gStr) {
    if (!gStr || typeof gStr !== 'string' || 
        (!gStr.includes('linear-gradient') && !gStr.includes('radial-gradient') && !gStr.includes('conic-gradient'))) {
        return {
            type: 'linear',
            angle: 45,
            radShape: 'circle',
            radSize: 'farthest-corner',
            radX: 50, radY: 50,
            conicFromAngle: 0,
            conicX: 50,
            conicY: 50,
            stops: [{ hex: '#2600ff', alpha: 100, pos: 0 }, { hex: '#fe0055', alpha: 100, pos: 100 }]
        };
    }
    const layer = {
        type: gStr.includes('repeating-radial') ? 'repeating-radial' :
            gStr.includes('repeating-linear') ? 'repeating-linear' :
            gStr.includes('repeating-conic') ? 'repeating-conic' :
            gStr.includes('radial') ? 'radial' :
            gStr.includes('conic') ? 'conic' : 'linear',
        angle: 45,
        radShape: 'circle',
        radSize: 'farthest-corner',
        radX: 50, radY: 50,
        conicFromAngle: 0,
        conicX: 50,
        conicY: 50,
        stops: []
    };
    const bracketMatch = gStr.match(/\((.+)\)/);
    if (!bracketMatch || !bracketMatch[1]) {
        layer.stops = [{ hex: '#2600ff', alpha: 100, pos: 0 }, { hex: '#fe0055', alpha: 100, pos: 100 }];
        return layer;
    }
    const rawParts = splitByCommaIgnoreBrackets(bracketMatch[1]);
    let colorStartIdx = 0;
    // 线性渐变解析
    if (layer.type === 'linear' || layer.type === 'repeating-linear') {
        const degMatch = rawParts[0].match(/^\s*(\d+)\s*deg\s*$/);
        if (degMatch) {
            layer.angle = Number(degMatch[1]);
            colorStartIdx = 1;
        }
    } 
    // 径向渐变解析
    else if (layer.type === 'radial' || layer.type === 'repeating-radial') {
        const firstItem = rawParts[0] || '';
        const shapeList = ['circle', 'ellipse'];
        const sizeList = ['closest-side', 'farthest-side', 'closest-corner', 'farthest-corner'];
        let hasConfig = false;
        const configParts = firstItem.split(/\s+/).filter(Boolean);
        let ptr = 0;
        if (ptr < configParts.length && shapeList.includes(configParts[ptr])) {
            layer.radShape = configParts[ptr];
            ptr++;
            hasConfig = true;
        }
        if (ptr < configParts.length && sizeList.includes(configParts[ptr])) {
            layer.radSize = configParts[ptr];
            ptr++;
            hasConfig = true;
        }
        if (ptr < configParts.length && configParts[ptr] === 'at') {
            ptr++;
            hasConfig = true;
            if (ptr < configParts.length) {
                const xVal = parseFloat(configParts[ptr].replace('%', ''));
                layer.radX = isNaN(xVal) ? 50 : xVal;
                ptr++;
            }
            if (ptr < configParts.length) {
                const yVal = parseFloat(configParts[ptr].replace('%', ''));
                layer.radY = isNaN(yVal) ? 50 : yVal;
                ptr++;
            }
        }
        colorStartIdx = hasConfig ? 1 : 0;
    }
    // 锥形渐变解析
    else {
        const firstItem = rawParts[0] || '';
        let hasConfig = false;
        const configParts = firstItem.split(/\s+/).filter(Boolean);
        let ptr = 0;
        // 解析 from 起始角度
        if (ptr < configParts.length && configParts[ptr] === 'from') {
            ptr++;
            hasConfig = true;
            if (ptr < configParts.length) {
                const degVal = parseFloat(configParts[ptr].replace('deg', ''));
                layer.conicFromAngle = isNaN(degVal) ? 0 : degVal;
                ptr++;
            }
        }
        // 解析 at 中心位置
        if (ptr < configParts.length && configParts[ptr] === 'at') {
            ptr++;
            hasConfig = true;
            if (ptr < configParts.length) {
                const xVal = parseFloat(configParts[ptr].replace('%', ''));
                layer.conicX = isNaN(xVal) ? 50 : xVal;
                ptr++;
            }
            if (ptr < configParts.length) {
                const yVal = parseFloat(configParts[ptr].replace('%', ''));
                layer.conicY = isNaN(yVal) ? 50 : yVal;
                ptr++;
            }
        }
        colorStartIdx = hasConfig ? 1 : 0;
    }
    // 色标解析
    const colorItems = rawParts.slice(colorStartIdx);
    for (const seg of colorItems) {
        let hex = '#ffffff', alpha = 100, pos = 50;
        let matched = false;
        if (seg === 'transparent') {
            hex = '#000000';
            alpha = 0;
            matched = true;
        }
        const rgbaReg = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)\s*(\d+)%?\s*$/i;
        const rgbaRes = seg.match(rgbaReg);
        const rgbReg = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*(\d+)%?\s*$/i;
        const rgbRes = seg.match(rgbReg);
        const hexReg = /#([0-9a-fA-F]{6})\s*(\d+)%?\s*$/;
        const hexRes = seg.match(hexReg);
        if (rgbaRes) {
            const r = Number(rgbaRes[1]), g = Number(rgbaRes[2]), b = Number(rgbaRes[3]);
            hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
            alpha = Math.round(parseFloat(rgbaRes[4]) * 100);
            pos = rgbaRes[5] ? Number(rgbaRes[5]) : 50;
            matched = true;
        } else if (rgbRes) {
            const r = Number(rgbRes[1]), g = Number(rgbRes[2]), b = Number(rgbRes[3]);
            hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
            alpha = 100;
            pos = rgbRes[4] ? Number(rgbRes[4]) : 50;
            matched = true;
        } else if (hexRes) {
            hex = '#' + hexRes[1];
            pos = hexRes[2] ? Number(hexRes[2]) : 50;
            matched = true;
        }
        if (matched) {
            layer.stops.push({ hex, alpha, pos });
        }
    }
    if (layer.stops.length < 2) {
        layer.stops = [{ hex: '#2600ff', alpha: 100, pos: 0 }, { hex: '#fe0055', alpha: 100, pos: 100 }];
    }
    return layer;
}

// 渲染图层列表
function renderLayerList(){
    layerList.innerHTML = '';
    layers.forEach((ly,idx)=>{
        if(!ly || typeof ly.type === 'undefined') return;
        const item = document.createElement('div');
        item.className = 'layer-item ' + (idx === activeLayerIndex ? 'active-edit' : '');
        item.dataset.idx = idx;
        item.draggable = true;
        item.innerHTML = `
                <div class="layer-head">
                    <span class="layer-name">图层${idx+1} ${
                        ly.type === 'linear' ? '线性' : 
                        ly.type === 'repeating-linear' ? '重复线性' : 
                        ly.type === 'radial' ? '径向' : 
                        ly.type === 'repeating-radial' ? '重复径向' :
                        ly.type === 'conic' ? '锥形' :
                        '重复锥形'
                    }</span>
                    <button class="del-layer" data-idx="${idx}"><i class="ri-close-large-line"></i></button>
                </div>
                <p style="font-size:12px;">${ly.stops.length} 个色标 | 右键复制/粘贴</p>
            `;
        item.onclick = function(e){
            if(e.target.classList.contains('del-layer')) return;
            activeLayerIndex = idx;
            renderLayerList();
            syncLayerToControl();
            renderStopDragTrack();
            renderStopList();
            updatePreview();
        }
        item.oncontextmenu = function(e){
            e.preventDefault();
            hideAllCtx();
            dragLayerIdx = idx;
            layerCtx.style.left = e.clientX + 'px';
            layerCtx.style.top = e.clientY + 'px';
            adjustCtxPosition(layerCtx, e.clientX, e.clientY);
        }
        item.ondragstart = function(){ dragLayerIdx = idx; }
        item.ondragover = function(e){
            e.preventDefault();
            this.classList.add('drag-over');
        }
        item.ondragleave = function(){ this.classList.remove('drag-over'); }
        item.ondrop = function(e){
            e.preventDefault();
            this.classList.remove('drag-over');
            const targetIdx = Number(this.dataset.idx);
            if(dragLayerIdx === null || dragLayerIdx === targetIdx) return;
            const temp = layers[dragLayerIdx];
            layers.splice(dragLayerIdx,1);
            layers.splice(targetIdx,0,temp);
            if(activeLayerIndex === dragLayerIdx) activeLayerIndex = targetIdx;
            else if(dragLayerIdx < activeLayerIndex && targetIdx >= activeLayerIndex) activeLayerIndex--;
            else if(dragLayerIdx > activeLayerIndex && targetIdx <= activeLayerIndex) activeLayerIndex++;
            dragLayerIdx = null;
            renderLayerList();
            syncLayerToControl();
            renderStopDragTrack();
            renderStopList();
            updatePreview();
        }

        // ===== 移动端图层触屏交互：单击选中、双击弹菜单、长按拖拽 =====
        item.addEventListener('touchstart', function(e) {
            if (e.target.closest('.del-layer')) return;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            touchDragLayerIdx = idx;
            // 长按定时器：超时后进入拖拽模式
            longPressTimer = setTimeout(() => {
                isLayerTouchDragging = true;
                item.classList.add('dragging-source');// 拖拽源元素脱离效果
                if (navigator.vibrate) navigator.vibrate(50); // 震动反馈
            }, LONG_PRESS_MS);
        }, { passive: true });

        item.addEventListener('touchmove', function(e) {
            if (touchDragLayerIdx === null) return;
            const touch = e.touches[0];
            const moveX = Math.abs(touch.clientX - touchStartX);
            const moveY = Math.abs(touch.clientY - touchStartY);
            // 移动超过阈值则取消长按判定
            if (!isLayerTouchDragging && (moveX > TAP_MOVE_THRESHOLD || moveY > TAP_MOVE_THRESHOLD)) {
                clearTimeout(longPressTimer);
            }
            // 拖拽模式：实时高亮目标图层
            if (isLayerTouchDragging) {
                e.preventDefault();
                const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const targetItem = elemBelow?.closest('.layer-item');
                document.querySelectorAll('.layer-item').forEach(el => el.classList.remove('drag-over'));
                if (targetItem && targetItem.dataset.idx != idx) {
                    targetItem.classList.add('drag-over');
                }
            }
        }, { passive: false });

        item.addEventListener('touchend', function(e) {
            clearTimeout(longPressTimer);
            const touch = e.changedTouches[0];
            const moveX = Math.abs(touch.clientX - touchStartX);
            const moveY = Math.abs(touch.clientY - touchStartY);
            const duration = Date.now() - touchStartTime;

            // 长按拖拽结束 → 执行排序
            if (isLayerTouchDragging) {
                const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const targetItem = elemBelow?.closest('.layer-item');
                if (targetItem) {
                    const targetIdx = Number(targetItem.dataset.idx);
                    if (touchDragLayerIdx !== null && touchDragLayerIdx !== targetIdx) {
                        const temp = layers[touchDragLayerIdx];
                        layers.splice(touchDragLayerIdx, 1);
                        layers.splice(targetIdx, 0, temp);
                        // 同步激活图层索引
                        if (activeLayerIndex === touchDragLayerIdx) {
                            activeLayerIndex = targetIdx;
                        } else if (touchDragLayerIdx < activeLayerIndex && targetIdx >= activeLayerIndex) {
                            activeLayerIndex--;
                        } else if (touchDragLayerIdx > activeLayerIndex && targetIdx <= activeLayerIndex) {
                            activeLayerIndex++;
                        }
                    }
                }
                // 重置状态
                isLayerTouchDragging = false;
                touchDragLayerIdx = null;
                document.querySelectorAll('.layer-item').forEach(el => {
                    el.classList.remove('drag-over');
                    el.classList.remove('dragging-source');
                });
                renderLayerList();
                syncLayerToControl();
                renderStopDragTrack();
                renderStopList();
                updatePreview();
                return;
            }

            // 短按点击判定
            if (duration < LONG_PRESS_MS && moveX < TAP_MOVE_THRESHOLD && moveY < TAP_MOVE_THRESHOLD) {
                if (e.target.closest('.del-layer')) return;
                const now = Date.now();
                const timeDiff = now - lastLayerTapTime;

                // 双击同一个图层 → 弹出操作菜单
                if (timeDiff < DOUBLE_TAP_MS && lastLayerTapIndex === idx) {
                    activeLayerIndex = idx;
                    dragLayerIdx = idx;
                    renderLayerList();
                    syncLayerToControl();
                    renderStopDragTrack();
                    renderStopList();
                    updatePreview();
                    hideAllCtx();
                    ignoreNextClick = true;
                    layerCtx.style.left = touch.clientX + 'px';
                    layerCtx.style.top = touch.clientY + 'px';
                    adjustCtxPosition(layerCtx, touch.clientX, touch.clientY);
                    lastLayerTapTime = 0;
                    lastLayerTapIndex = -1;
                } else {
                    // 单击 → 仅选中图层
                    activeLayerIndex = idx;
                    renderLayerList();
                    syncLayerToControl();
                    renderStopDragTrack();
                    renderStopList();
                    updatePreview();
                    // 记录单击状态，等待第二次点击
                    lastLayerTapTime = now;
                    lastLayerTapIndex = idx;
                }
            }

            touchDragLayerIdx = null;
        });

        item.addEventListener('touchcancel', function() {
            clearTimeout(longPressTimer);
            isLayerTouchDragging = false;
            touchDragLayerIdx = null;
            document.querySelectorAll('.layer-item').forEach(el => {
                el.classList.remove('drag-over');
                el.classList.remove('dragging-source');
            });
        });

        layerList.appendChild(item);
    })
    document.querySelectorAll('.del-layer').forEach(btn=>{
        btn.onclick = function(e){
            e.stopPropagation();
            const i = Number(this.dataset.idx);
            if(layers.length <= 1) return showMessage('至少保留1层渐变','warning');
            layers.splice(i,1);
            if(activeLayerIndex >= layers.length) activeLayerIndex = layers.length - 1;
            renderLayerList();
            syncLayerToControl();
            renderStopDragTrack();
            renderStopList();
            updatePreview();
        }
    })
}
// 图层右键菜单
layerCtx.querySelectorAll('div[data-action]').forEach(el=>{
    el.onclick = function(){
        const act = this.dataset.action;
        const idx = dragLayerIdx;
        if(act === 'copy'){
            copyLayerData = deepClone(layers[idx]);
            showMessage('图层复制成功！','success');
        }else if(act === 'paste'){
            if(!copyLayerData) return showMessage('请先复制图层','info');
            layers.splice(idx+1,0,deepClone(copyLayerData));
            renderLayerList();
            updatePreview();
        }else if(act === 'del'){
            if(layers.length <= 1) return showMessage('至少保留1层渐变','warning');
            layers.splice(idx,1);
            if(activeLayerIndex >= layers.length) activeLayerIndex = layers.length - 1;
            renderLayerList();
            syncLayerToControl();
            renderStopDragTrack();
            renderStopList();
            updatePreview();
        }
        hideAllCtx();
    }
})
// 同步图层到面板
function syncLayerToControl(){
    const ly = layers[activeLayerIndex];
    gradType.value = ly.type;
    angleRange.value = ly.angle;
    angleNum.value = ly.angle;
    radShape.value = ly.radShape;
    radSize.value = ly.radSize;
    radXRange.value = ly.radX;
    radXNum.value = ly.radX;
    radYRange.value = ly.radY;
    radYNum.value = ly.radY;
    conicAngleRange.value = ly.conicFromAngle;
    conicAngleNum.value = ly.conicFromAngle;
    conicXRange.value = ly.conicX;
    conicXNum.value = ly.conicX;
    conicYRange.value = ly.conicY;
    conicYNum.value = ly.conicY;
    toggleGradPanel();
}

function toggleGradPanel(){
    const t = gradType.value;
    linearConfig.style.display = (t === 'linear' || t === 'repeating-linear') ? 'block' : 'none';
    radialConfig.style.display = (t === 'radial' || t === 'repeating-radial') ? 'block' : 'none';
    conicConfig.style.display = (t === 'conic' || t === 'repeating-conic') ? 'block' : 'none';
}
// 统一获取鼠标/触摸横坐标
function getEventClientX(e) {
  if (e.touches && e.touches.length > 0) {
    return e.touches[0].clientX;
  }
  return e.clientX;
}
// 色标拖拽轨道
function renderStopDragTrack() {
  stopTrack.innerHTML = '';
  const stops = layers[activeLayerIndex].stops;
  stops.forEach((st, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'stop-drag-thumb ' + (idx === dragStopIdx ? 'active-thumb' : '');
    thumb.dataset.sidx = idx;
    thumb.style.left = st.pos + '%';
    let dragging = false;
    let unbindMove = null;
    let unbindEnd = null;
    let unbindCancel = null;
    // 拖拽移动统一处理
    function handleMove(e) {
      if (!dragging) return;
      e.preventDefault();
      const rect = stopTrack.getBoundingClientRect();
      const x = getEventClientX(e) - rect.left;
      let pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      layers[activeLayerIndex].stops[idx].pos = Math.round(pct);
      updateStopThumbsPosition();
      renderStopList();
      updatePreview();
    }
    // 拖拽结束统一清理
    function handleEnd() {
      dragging = false;
      if (unbindMove) unbindMove();
      if (unbindEnd) unbindEnd();
      if (unbindCancel) unbindCancel();
      unbindMove = null;
      unbindEnd = null;
      unbindCancel = null;
    }
    // 拖拽开始
    function handleStart(e) {
      e.preventDefault();
      dragging = true;
      dragStopIdx = idx;
      updateStopThumbsPosition();
      renderStopList();
      
      const moveFn = handleMove;
      const endFn = handleEnd;
      document.addEventListener('mousemove', moveFn, { passive: false });
      document.addEventListener('mouseup', endFn);
      document.addEventListener('touchmove', moveFn, { passive: false });
      document.addEventListener('touchend', endFn);
      document.addEventListener('touchcancel', endFn);
      unbindMove = () => {
        document.removeEventListener('mousemove', moveFn);
        document.removeEventListener('touchmove', moveFn);
      };
      unbindEnd = () => {
        document.removeEventListener('mouseup', endFn);
        document.removeEventListener('touchend', endFn);
      };
      unbindCancel = () => {
        document.removeEventListener('touchcancel', endFn);
      };
    }
    // PC鼠标按下
    thumb.addEventListener('mousedown', handleStart, { passive: false });
    // 移动端触摸：双击均分 + 单击拖拽
    thumb.addEventListener('touchstart', function(e) {
        const now = Date.now();
        const timeDiff = now - lastStopTapTime;
        // 双击同一个滑块 → 触发均分
        if (timeDiff < DOUBLE_TAP_MS && lastStopTapIndex === idx) {
            e.preventDefault();
            distributeStopsEvenly();
            lastStopTapTime = 0;
            lastStopTapIndex = -1;
            return;
        }
        // 单击 → 记录状态，正常进入拖拽
        lastStopTapTime = now;
        lastStopTapIndex = idx;
        handleStart.call(this, e);
    }, { passive: false });
    // PC右键均分
    thumb.oncontextmenu = function (e) {
      e.preventDefault();
      distributeStopsEvenly();
    };
    stopTrack.appendChild(thumb);
  });
}
// 渲染色标列表
function renderStopList(){
    const ly = layers[activeLayerIndex];
    stopList.innerHTML = '';
    ly.stops.forEach((st,idx)=>{
        const item = document.createElement('div');
        item.className = 'color-stop-item ' + (idx === dragStopIdx ? 'active-stop' : '');
        item.dataset.sidx = idx;
        item.innerHTML = `
            <div class="stop-top">
                <input type="color" data-sidx="${idx}" value="${st.hex}">
                <span>位置:</span>
                <input type="number" data-type="pos" data-sidx="${idx}" value="${st.pos}" min="0" max="100">
                <button class="del-stop" data-sidx="${idx}"><i class="ri-close-large-line"></i></button>
            </div>
            <div class="alpha-row">
                <span>透明度:</span>
                <input type="range" data-type="alpha" data-sidx="${idx}" min="0" max="100" value="${st.alpha}">
                <input type="number" data-type="alphaNum" data-sidx="${idx}" min="0" max="100" value="${st.alpha}" style="width:60px">
                <span>%</span>
            </div>
        `;
        item.onclick = function(e){
            if (e.target.closest('input') || e.target.closest('button')) return;
            dragStopIdx = idx;
            renderStopDragTrack();
            renderStopList();
        }
        item.oncontextmenu = function(e){
            e.preventDefault();
            hideAllCtx();
            dragStopIdx = idx;
            renderStopDragTrack();
            renderStopList();
            stopCtx.style.left = e.clientX + 'px';
            stopCtx.style.top = e.clientY + 'px';
            adjustCtxPosition(stopCtx, e.clientX, e.clientY);
        }

        // ===== 移动端色标项触屏交互：单击选中、双击弹菜单 =====
        item.addEventListener('touchstart', function(e) {
            if (e.target.closest('input') || e.target.closest('button')) return;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        item.addEventListener('touchend', function(e) {
            if (e.target.closest('input') || e.target.closest('button')) return;
            const touch = e.changedTouches[0];
            const moveX = Math.abs(touch.clientX - touchStartX);
            const moveY = Math.abs(touch.clientY - touchStartY);
            const duration = Date.now() - touchStartTime;

            if (duration < LONG_PRESS_MS && moveX < TAP_MOVE_THRESHOLD && moveY < TAP_MOVE_THRESHOLD) {
                const now = Date.now();
                const timeDiff = now - lastStopItemTapTime;
                // 双击同一个色标项 → 弹出操作菜单
                if (timeDiff < DOUBLE_TAP_MS && lastStopItemTapIndex === idx) {
                    dragStopIdx = idx;
                    renderStopDragTrack();
                    renderStopList();
                    hideAllCtx();
                    ignoreNextClick = true;
                    stopCtx.style.left = touch.clientX + 'px';
                    stopCtx.style.top = touch.clientY + 'px';
                    adjustCtxPosition(stopCtx, touch.clientX, touch.clientY);
                    lastStopItemTapTime = 0;
                    lastStopItemTapIndex = -1;
                } else {
                    dragStopIdx = idx;
                    renderStopDragTrack();
                    renderStopList();
                    lastStopItemTapTime = now;
                    lastStopItemTapIndex = idx;
                }
            }
        });

        stopList.appendChild(item);
    })
    document.querySelectorAll('input[type="color"]').forEach(inp=>{
        inp.addEventListener('click', function(e){
            e.stopPropagation();
        });
        inp.addEventListener('touchstart', function(e){
            e.stopPropagation();
            this.focus();
        }, {passive: true});
    
        inp.oninput = function(){
            const sidx = Number(this.dataset.sidx);
            layers[activeLayerIndex].stops[sidx].hex = this.value;
            renderStopDragTrack();
            updatePreview();
        }
    })
    document.querySelectorAll('[data-type="pos"]').forEach(inp=>{
        inp.oninput = function(){
            const sidx = Number(this.dataset.sidx);
            let val = Math.max(0, Math.min(100, Number(this.value)));
            this.value = val;
            layers[activeLayerIndex].stops[sidx].pos = val;
            renderStopDragTrack();
            updatePreview();
        }
    })
    document.querySelectorAll('[data-type="alpha"]').forEach(range=>{
        range.oninput = function(){
            const sidx = Number(this.dataset.sidx);
            const num = document.querySelector(`[data-type="alphaNum"][data-sidx="${sidx}"]`);
            num.value = this.value;
            layers[activeLayerIndex].stops[sidx].alpha = Number(this.value);
            updatePreview();
        }
    })
    document.querySelectorAll('[data-type="alphaNum"]').forEach(num=>{
        num.oninput = function(){
            const sidx = Number(this.dataset.sidx);
            let val = Math.max(0, Math.min(100, Number(this.value)));
            this.value = val;
            const range = document.querySelector(`[data-type="alpha"][data-sidx="${sidx}"]`);
            range.value = val;
            layers[activeLayerIndex].stops[sidx].alpha = val;
            updatePreview();
        }
    })
    document.querySelectorAll('.del-stop').forEach(btn=>{
        btn.onclick = function(){
            const sidx = Number(this.dataset.sidx);
            const stops = layers[activeLayerIndex].stops;
            if(stops.length <= 2) return showMessage('至少保留2个色标','warning');
            stops.splice(sidx,1);
            if(dragStopIdx >= stops.length) dragStopIdx = stops.length - 1;
            renderStopDragTrack();
            renderStopList();
            updatePreview();
        }
    })
}

// 均分当前图层的所有色标位置
function distributeStopsEvenly() {
    const stops = layers[activeLayerIndex].stops;
    const total = stops.length;
    if (total < 2) return;
    const startPos = stops[0].pos;
    const endPos = stops[total - 1].pos;
    for (let i = 0; i < total; i++) {
        const ratio = i / (total - 1);
        stops[i].pos = Math.round(startPos + (endPos - startPos) * ratio);
    }
    renderStopDragTrack();
    renderStopList();
    updatePreview();
    showMessage('滑块已均分！', 'success');
}

// 色标右键菜单
stopCtx.querySelectorAll('div[data-action]').forEach(el=>{
    el.onclick = function(){
        const act = this.dataset.action;
        const idx = dragStopIdx;
        const stops = layers[activeLayerIndex].stops;
        if(act === 'copy'){
            copyStopData = deepClone(stops[idx]);
            showMessage('色标复制成功！','success');
        }else if(act === 'paste'){
            if(!copyStopData) return showMessage('请先复制色标！','info');
            stops.splice(idx+1,0,deepClone(copyStopData));
            renderStopDragTrack();
            renderStopList();
            updatePreview();
        }else if(act === 'del'){
            if(stops.length <= 2) return showMessage('单层至少2个色标','warning');
            stops.splice(idx,1);
            if(dragStopIdx >= stops.length) dragStopIdx = stops.length - 1;
            renderStopDragTrack();
            renderStopList();
            updatePreview();
        }
        hideAllCtx();
    }
})

// 生成单层渐变CSS
function buildSingleGradient(layer){
    const stopText = layer.stops.map(s=>`${hexToRgba(s.hex,s.alpha)} ${s.pos}%`).join(', ');
    if(layer.type === 'linear'){
        return `linear-gradient(${layer.angle}deg, ${stopText})`;
    }else if(layer.type === 'repeating-linear'){
        return `repeating-linear-gradient(${layer.angle}deg, ${stopText})`;
    }else if(layer.type === 'repeating-radial'){
        return `repeating-radial-gradient(${layer.radShape} ${layer.radSize} at ${layer.radX}% ${layer.radY}%, ${stopText})`;
    }else if(layer.type === 'radial'){
        return `radial-gradient(${layer.radShape} ${layer.radSize} at ${layer.radX}% ${layer.radY}%, ${stopText})`;
    }else if(layer.type === 'conic'){
        return `conic-gradient(from ${layer.conicFromAngle}deg at ${layer.conicX}% ${layer.conicY}%, ${stopText})`;
    }else{
        return `repeating-conic-gradient(from ${layer.conicFromAngle}deg at ${layer.conicX}% ${layer.conicY}%, ${stopText})`;
    }
}

// 拼接完整背景
function generateFullBackground(){
    const reversedLayers = [...layers].reverse();
    const allGrads = reversedLayers.map(l=>buildSingleGradient(l)).join(', ');
    const mode = globalBgRepeat.value;
    let css = `background: ${allGrads};`;
    // 全局尺寸、位置
    const sizeTxt = bgSizeValue.trim();
    const posTxt = bgPosValue.trim();
    if(sizeTxt){
        css += `\nbackground-size: ${sizeTxt};`;
    }
    if(posTxt){
        css += `\nbackground-position: ${posTxt};`;
    }
    if (mode === 'text') {
        css += `\n-webkit-background-clip: text;`;
        css += `\nbackground-clip: text;`;
        css += `\n-webkit-text-fill-color: transparent;`;
    }
    return css;
}

// 更新预览
function updatePreview(){
    const fullCode = generateFullBackground();
    const gradOnly = fullCode.replace('background: ','').replace(/;[\s\S]*$/,'');
    const mode = globalBgRepeat.value;
    if (mode === 'box') {
        // 盒子渐变模式
        previewspan.style.display = 'none';
        preview.style.background = '';
        void preview.offsetWidth;
        preview.style.background = gradOnly;
        preview.style.backgroundSize = bgSizeValue || '';
        preview.style.backgroundPosition = bgPosValue || '';
    } else {
        // 文字渐变模式
        preview.style.background = 'transparent';
        previewspan.style.display = 'block';
        previewspan.style.background = gradOnly;
        previewspan.style.backgroundSize = bgSizeValue || '';
        previewspan.style.backgroundPosition = bgPosValue || '';
        previewspan.style.webkitBackgroundClip = 'text';
        previewspan.style.backgroundClip = 'text';
        previewspan.style.webkitTextFillColor = 'transparent';
    }
    cssCode.innerText = fullCode;
}

// 新增图层
addLayerBtn.onclick = function(){
    layers.push({
        type:'linear',
        angle:45,
        radShape:'circle',
        radSize:'farthest-corner',
        radX:50,radY:50,
        conicFromAngle: 0,
        conicX: 50,
        conicY: 50,
        stops:[{hex:'#ffffff',alpha:0,pos:0},{hex:'#000000',alpha:30,pos:100}]
    });
    activeLayerIndex = layers.length - 1;
    renderLayerList();
    syncLayerToControl();
    renderStopDragTrack();
    renderStopList();
    updatePreview();
}

// 新增色标
addStopBtn.onclick = function(){
    layers[activeLayerIndex].stops.push({hex:'#ffffff',alpha:100,pos:50});
    renderStopDragTrack();
    renderStopList();
    updatePreview();
}

// 复制代码
async function copyText(text) {
    // 现代Clipboard API优先
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // 现代API失败，走降级方案
           //console.log('Clipboard API失效，降级复制', err);
        }
    }
    return new Promise((resolve) => {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        tempInput.style.top = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, text.length);
        const copyResult = document.execCommand('copy');
        document.body.removeChild(tempInput);
        resolve(copyResult);
    });
}
async function handleCopy() {
    const success = await copyText(cssCode.innerText);
    if (success) {
        showMessage('CSS代码复制成功！', 'success');
    }
}
copyBtn.onclick = handleCopy;
preview.onclick = handleCopy;
// 角度双向同步
angleRange.oninput = function(){
    angleNum.value = this.value;
    layers[activeLayerIndex].angle = Number(this.value);
    updatePreview();
}
angleNum.oninput = function(){
    let val = Math.max(0, Math.min(360, Number(this.value)));
    this.value = val;
    angleRange.value = val;
    layers[activeLayerIndex].angle = val;
    updatePreview();
}
// 径向中心X/Y同步
radXRange.oninput = function(){
    radXNum.value = this.value;
    layers[activeLayerIndex].radX = Number(this.value);
    updatePreview();
}
radXNum.oninput = function(){
    let val = Math.max(0, Math.min(100, Number(this.value)));
    this.value = val;
    radXRange.value = val;
    layers[activeLayerIndex].radX = val;
    updatePreview();
}
radYRange.oninput = function(){
    radYNum.value = this.value;
    layers[activeLayerIndex].radY = Number(this.value);
    updatePreview();
}
radYNum.oninput = function(){
    let val = Math.max(0, Math.min(100, Number(this.value)));
    this.value = val;
    radYRange.value = val;
    layers[activeLayerIndex].radY = val;
    updatePreview();
}
radShape.onchange = function(){
    layers[activeLayerIndex].radShape = this.value;
    updatePreview();
}
radSize.onchange = function(){
    layers[activeLayerIndex].radSize = this.value;
    updatePreview();
}
gradType.onchange = function(){
    layers[activeLayerIndex].type = this.value;
    toggleGradPanel();
    updatePreview();
}
// 渐变显示模式切换
globalBgRepeat.onchange = function(){
    updatePreview();
}
// 全局background-size输入监听
globalBgSizeInput.oninput = function(){
    bgSizeValue = this.value.trim();
    updatePreview();
}
// 全局background-position输入监听
globalBgPosInput.oninput = function(){
    bgPosValue = this.value.trim();
    updatePreview();
}
// 锥形起始角度双向同步
conicAngleRange.oninput = function(){
    conicAngleNum.value = this.value;
    layers[activeLayerIndex].conicFromAngle = Number(this.value);
    updatePreview();
}
conicAngleNum.oninput = function(){
    let val = Math.max(0, Math.min(360, Number(this.value)));
    this.value = val;
    conicAngleRange.value = val;
    layers[activeLayerIndex].conicFromAngle = val;
    updatePreview();
}
// 锥形中心X双向同步
conicXRange.oninput = function(){
    conicXNum.value = this.value;
    layers[activeLayerIndex].conicX = Number(this.value);
    updatePreview();
}
conicXNum.oninput = function(){
    let val = Math.max(0, Math.min(100, Number(this.value)));
    this.value = val;
    conicXRange.value = val;
    layers[activeLayerIndex].conicX = val;
    updatePreview();
}
// 锥形中心Y双向同步
conicYRange.oninput = function(){
    conicYNum.value = this.value;
    layers[activeLayerIndex].conicY = Number(this.value);
    updatePreview();
}
conicYNum.oninput = function(){
    let val = Math.max(0, Math.min(100, Number(this.value)));
    this.value = val;
    conicYRange.value = val;
    layers[activeLayerIndex].conicY = val;
    updatePreview();
}
// 初始化
renderPresets();
renderLayerList();
syncLayerToControl();
renderStopDragTrack();
renderStopList();
toggleGradPanel();
updatePreview();

// ========== 跨标签编辑兼容逻辑 ==========
window.loadPreset = loadPreset;// 暴露全局方法，供 color.html 直接调用
let editLoaded = false;

// 从 localStorage 加载预设
function checkAndLoadPreset() {
    const preset = localStorage.getItem('gradient_edit_preset');
    if (preset) {
        loadPreset(preset);
        editLoaded = true;
        // 加载完成后再清除存储，避免切换丢失
        setTimeout(() => {
            localStorage.removeItem('gradient_edit_preset');
            localStorage.removeItem('gradient_edit_version');
        }, 500);
    }
}

// 监听 postMessage，color.html 直接发数据过来
window.addEventListener('message', function(e) {
    // 校验来源，确保安全
    if (e.origin !== location.origin) return;
    if (e.data && e.data.type === 'load-gradient' && e.data.data) {
        loadPreset(e.data.data);
    }
});

// 页面首次打开时加载
document.addEventListener('DOMContentLoaded', checkAndLoadPreset);

// 多标签同步storage更新
window.addEventListener('storage', function(e) {
    if (e.key === 'gradient_edit_version' && e.newValue && !editLoaded) {
        const preset = localStorage.getItem('gradient_edit_preset');
        if (preset) {
            loadPreset(preset);
            setTimeout(() => {
                localStorage.removeItem('gradient_edit_preset');
                localStorage.removeItem('gradient_edit_version');
            }, 500);
        }
    }
});


//移动端可拖动预览区位置
let isDrag = false;
let offsetX = 0;
let offsetY = 0;
// 缓存DOM
const previewWrapdom = document.querySelector('.preview-wrap');
// 抽离touchstart处理函数
function handleTouchStart(e) {
  isDrag = true;
  previewWrapdom.style.zIndex = 1;
  const touch = e.touches[0];
  offsetX = touch.clientX - previewWrapdom.offsetLeft;
  offsetY = touch.clientY - previewWrapdom.offsetTop;
  e.preventDefault();
}
// 抽离touchmove处理函数
function handleTouchMove(e) {
  if (!isDrag) return;
  const touch = e.touches[0];
  const x = touch.clientX - offsetX;
  const y = touch.clientY - offsetY;
  previewWrapdom.style.left = x + 'px';
  previewWrapdom.style.top = y + 'px';
  e.preventDefault();
}
// 抽离touchend处理函数
function handleTouchEnd() {
  isDrag = false;
  previewWrapdom.style.zIndex = 1;
}
// 绑定拖拽事件
function bindTouchDrag() {
  previewWrapdom.addEventListener('touchstart', handleTouchStart, { passive: false });
}
// 解绑拖拽事件
function unbindTouchDrag() {
  previewWrapdom.removeEventListener('touchstart', handleTouchStart);
  previewWrapdom.style.zIndex = '';
  previewWrapdom.style.left = '';
  previewWrapdom.style.top = '';
}
previewWrapdom.addEventListener('touchstart', function(){
  function tempMove(e){
    if(!isDrag) return;
    handleTouchMove(e);
  }
  function tempEnd(){
    handleTouchEnd();
    document.removeEventListener('touchmove', tempMove);
    document.removeEventListener('touchend', tempEnd);
  }
  document.addEventListener('touchmove', tempMove, {passive:false});
  document.addEventListener('touchend', tempEnd);
});
// 判断宽度并执行绑定逻辑
function checkScreenWidth() {
  if (window.innerWidth < 921) {
    bindTouchDrag();
  } else {
    unbindTouchDrag();
  }
}
// 页面初始化执行一次
checkScreenWidth();
// 窗口大小变化时重新判断
window.addEventListener('resize', checkScreenWidth);