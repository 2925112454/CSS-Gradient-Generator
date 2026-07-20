// 全局数据
let layers = [
    {
        type: 'linear',
        angle: 45,
        radShape: 'circle',
        radSize: 'farthest-corner',
        radX:50, radY:50,
        stops: [
            {hex:'#2600ff', alpha:100, pos:0},
            {hex:'#fe0055', alpha:100, pos:100}
        ]
    }
];
// 全局背景尺寸、位置（存储文本值，改名区分DOM）
let bgSizeValue = '';
let bgPosValue = '';
let activeLayerIndex = 0;
let copyLayerData = null;
let copyStopData = null;
let dragLayerIdx = null;
let dragStopIdx = null;

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
// 全局平铺输入框DOM（保留原名，不再冲突）
const globalBgSizeInput = document.getElementById('globalBgSize');
const globalBgPosInput = document.getElementById('globalBgPos');
// 全局平铺输入框DOM
const globalBgSize = document.getElementById('globalBgSize');
const globalBgPos = document.getElementById('globalBgPos');
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
document.addEventListener('click',hideAllCtx);
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

        // 拆分预设完整样式，分离渐变、size、position
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
    // 只更新存储变量+输入框，删除window全局挂载
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
                {hex:'#4facfe', alpha:100, pos:0},
                {hex:'#00f2fe', alpha:100, pos:100}
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
        const substr15 = s.slice(i, i + 15);
        if(
            stack === 0 && startIdx === -1 &&
            (substr25 === 'repeating-linear-gradient' || substr25 === 'repeating-radial-gradient' || substr15 === 'linear-gradient' || substr15 === 'radial-gradient')
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
    if (!gStr || typeof gStr !== 'string' || (!gStr.includes('linear-gradient') && !gStr.includes('radial-gradient'))) {
        return {
            type: 'linear',
            angle: 45,
            radShape: 'circle',
            radSize: 'farthest-corner',
            radX: 50, radY: 50,
            stops: [{ hex: '#4facfe', alpha: 100, pos: 0 }, { hex: '#00f2fe', alpha: 100, pos: 100 }]
        };
    }
    const layer = {
        type: gStr.includes('repeating-radial') ? 'repeating-radial' :
            gStr.includes('repeating-linear') ? 'repeating-linear' :
            gStr.includes('radial') ? 'radial' : 'linear',
        angle: 45,
        radShape: 'circle',
        radSize: 'farthest-corner',
        radX: 50, radY: 50,
        stops: []
    };
    const bracketMatch = gStr.match(/\((.+)\)/);
    if (!bracketMatch || !bracketMatch[1]) {
        layer.stops = [{ hex: '#4facfe', alpha: 100, pos: 0 }, { hex: '#00f2fe', alpha: 100, pos: 100 }];
        return layer;
    }

    // 使用括号感知的逗号分割，替代直接split(',')
    const rawParts = splitByCommaIgnoreBrackets(bracketMatch[1]);
    let colorStartIdx = 0;

    if (layer.type === 'linear' || layer.type === 'repeating-linear') {
        // 解析线性角度，兼容带空格的deg格式
        const degMatch = rawParts[0].match(/^\s*(\d+)\s*deg\s*$/);
        if (degMatch) {
            layer.angle = Number(degMatch[1]);
            colorStartIdx = 1;
        }
    } else {
        // 径向参数解析：从第一个配置项中提取shape、size、at位置
        const firstItem = rawParts[0] || '';
        const shapeList = ['circle', 'ellipse'];
        const sizeList = ['closest-side', 'farthest-side', 'closest-corner', 'farthest-corner'];
        
        let hasConfig = false;
        const configParts = firstItem.split(/\s+/).filter(Boolean);
        let ptr = 0;

        // 匹配形状
        if (ptr < configParts.length && shapeList.includes(configParts[ptr])) {
            layer.radShape = configParts[ptr];
            ptr++;
            hasConfig = true;
        }
        // 匹配尺寸
        if (ptr < configParts.length && sizeList.includes(configParts[ptr])) {
            layer.radSize = configParts[ptr];
            ptr++;
            hasConfig = true;
        }
        // 匹配 at X% Y%
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

    // 解析色标
    const colorItems = rawParts.slice(colorStartIdx);
    for (const seg of colorItems) {
        let hex = '#ffffff', alpha = 100, pos = 50;
        let matched = false;

        if (seg === 'transparent') {
            hex = '#000000';
            alpha = 0;
            matched = true;
        }

        // 兼容rgba及位置百分号
        const rgbaReg = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)\s*(\d+)%?\s*$/i;
        const rgbaRes = seg.match(rgbaReg);
        // 兼容rgb及位置百分号
        const rgbReg = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*(\d+)%?\s*$/i;
        const rgbRes = seg.match(rgbReg);
        // 兼容6位十六进制及位置百分号
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

    // 兜底最少2个色标
    if (layer.stops.length < 2) {
        layer.stops = [{ hex: '#4facfe', alpha: 100, pos: 0 }, { hex: '#00f2fe', alpha: 100, pos: 100 }];
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
                    <span class="layer-name">图层${idx+1} ${ly.type === 'linear' ? '线性' : ly.type === 'repeating-linear' ? '重复线性' : ly.type === 'radial' ? '径向' : '重复径向'}</span>
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
            layerCtx.style.display = 'block';
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
    toggleGradPanel();
}
function toggleGradPanel(){
    const t = gradType.value;
    linearConfig.style.display = (t === 'linear' || t === 'repeating-linear') ? 'block' : 'none';
    radialConfig.style.display = (t === 'radial' || t === 'repeating-radial') ? 'block' : 'none';
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
    // 存储移除函数，拖拽结束销毁监听
    let unbindMove = null;
    let unbindEnd = null;

    // 拖拽移动统一处理
    function handleMove(e) {
      if (!dragging) return;
      e.preventDefault();
      const rect = stopTrack.getBoundingClientRect();
      const x = getEventClientX(e) - rect.left;
      let pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      layers[activeLayerIndex].stops[idx].pos = Math.round(pct);
      renderStopDragTrack();
      renderStopList();
      updatePreview();
    }

    // 拖拽结束统一清理
    function handleEnd() {
      dragging = false;
      if (unbindMove) unbindMove();
      if (unbindEnd) unbindEnd();
      unbindMove = null;
      unbindEnd = null;
    }

    // 拖拽开始
    function handleStart(e) {
      e.preventDefault();
      dragging = true;
      dragStopIdx = idx;
      renderStopDragTrack();
      renderStopList();

      // 绑定移动、结束监听，保存销毁函数
      const moveFn = handleMove;
      const endFn = handleEnd;
      document.addEventListener('mousemove', moveFn, { passive: false });
      document.addEventListener('mouseup', endFn);
      document.addEventListener('touchmove', moveFn, { passive: false });
      document.addEventListener('touchend', endFn);

      unbindMove = () => {
        document.removeEventListener('mousemove', moveFn);
        document.removeEventListener('touchmove', moveFn);
      };
      unbindEnd = () => {
        document.removeEventListener('mouseup', endFn);
        document.removeEventListener('touchend', endFn);
      };
    }

    // PC鼠标按下
    thumb.addEventListener('mousedown', handleStart, { passive: false });
    // 移动端触摸按下
    thumb.addEventListener('touchstart', handleStart, { passive: false });

    // 右键菜单
    thumb.oncontextmenu = function (e) {
      e.preventDefault();
      hideAllCtx();
      dragStopIdx = idx;
      renderStopDragTrack();
      renderStopList();
      stopCtx.style.left = e.clientX + 'px';
      stopCtx.style.top = e.clientY + 'px';
      stopCtx.style.display = 'block';
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
        item.onclick = function(){
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
            stopCtx.style.display = 'block';
        }
        stopList.appendChild(item);
    })
    document.querySelectorAll('input[type="color"]').forEach(inp=>{
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
// 生成单层渐变CSS（完整还原径向参数）
function buildSingleGradient(layer){
    const stopText = layer.stops.map(s=>`${hexToRgba(s.hex,s.alpha)} ${s.pos}%`).join(', ');
    if(layer.type === 'linear'){
        return `linear-gradient(${layer.angle}deg, ${stopText})`;
    }else if(layer.type === 'repeating-linear'){
        return `repeating-linear-gradient(${layer.angle}deg, ${stopText})`;
    }else if(layer.type === 'repeating-radial'){
        return `repeating-radial-gradient(${layer.radShape} ${layer.radSize} at ${layer.radX}% ${layer.radY}%, ${stopText})`;
    }else{
        return `radial-gradient(${layer.radShape} ${layer.radSize} at ${layer.radX}% ${layer.radY}%, ${stopText})`;
    }
}
// 拼接完整背景
function generateFullBackground(){
    const reversedLayers = [...layers].reverse();
    const allGrads = reversedLayers.map(l=>buildSingleGradient(l)).join(', ');
    let css = `background: ${allGrads};`;
    // 全局尺寸、位置，统一一行，不按图层拆分
    const sizeTxt = bgSizeValue.trim();
    const posTxt = bgPosValue.trim();
    if(sizeTxt){
        css += `\nbackground-size: ${sizeTxt};`;
    }
    if(posTxt){
        css += `\nbackground-position: ${posTxt};`;
    }
    return css;
}
// 更新预览
function updatePreview(){
    const fullCode = generateFullBackground();
    const gradOnly = fullCode.replace('background: ','').replace(/;[\s\S]*$/,'');
    preview.style.background = '';
    void preview.offsetWidth;
    preview.style.background = gradOnly;
    // 全局平铺样式同步到预览盒子
    preview.style.backgroundSize = bgSizeValue || '';
    preview.style.backgroundPosition = bgPosValue || '';
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
copyBtn.onclick = async function(){
    await navigator.clipboard.writeText(cssCode.innerText);
    showMessage('CSS代码复制成功！','success');
}
preview.onclick = async function(){
    await navigator.clipboard.writeText(cssCode.innerText);
    showMessage('CSS代码复制成功！','success');
}
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
// 初始化
renderPresets();
renderLayerList();
syncLayerToControl();
renderStopDragTrack();
renderStopList();
toggleGradPanel();
updatePreview();