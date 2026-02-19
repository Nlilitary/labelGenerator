// ===== ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ =====

// ===== СОСТОЯНИЕ =====
window.productType = 'cheese';
window.formData = {
    productName: '', cheeseType: '', manufacturer: '', weightOrVolume: '',
    dateManufacture: '', timeManufacture: '', expiryDate: '', expiryHours: 0,
    storageConditions: '', batchNumber: '',
    ingredients: [],
    milkType: '', fatContent: '', protein: '', carbohydrate: '', energyValue: '',
    brineWeight: '',
    beerComposition: '', alcoholPercent: '', volume: '', sugar: ''
};
window.selectedTemplateId = null;
window.myTemplates = [];
window.isDonated = false;
window.selectedDonateAmount = 199;

// Константы
window.allergenList = [
    'пшениц', 'молок', 'соя', 'арахис', 'орех', 'ячмень', 'рожь', 'овёс',
    'клейковин', 'глютен', 'лактоз', 'яйц', 'сельдерей', 'горчиц', 'кунжут',
    'рыб', 'ракообраз', 'моллюск', 'сульфит', 'люпин', 'креточн', 'солод'
];

window.cheeseTypes = {
    'hard': 'Твёрдый (Пармезан, Чеддер)',
    'semi-hard': 'Полутвёрдый (Гауда, Эдам)',
    'soft': 'Мягкий (без плесени)',
    'soft-mold': 'Мягкий с плесенью (Камамбер, Бри)',
    'brined': 'Рассольный (Фета, Моцарелла)',
    'fresh': 'Свежий (Рикотта, фермерский)',
    'processed': 'Плавленый'
};

window.checklistRules = {
    cheese: [
        { id: 'productName', label: 'Наименование' },
        { id: 'cheeseType', label: 'Сорт сыра', isSelect: true },
        { id: 'manufacturer', label: 'Изготовитель' },
        { id: 'weightOrVolume', label: 'Масса нетто' },
        { id: 'batchNumber', label: 'Номер партии' },
        { id: 'dateManufacture', label: 'Дата изготовления' },
        { id: 'expiryDate', label: 'Срок годности' },
        { id: 'storageConditions', label: 'Условия хранения' },
        { id: 'ingredients', label: 'Состав (по убыванию)', isArray: true },
        { id: 'energyValue', label: 'Энерг. ценность' }
    ],
    beer: [
        { id: 'productName', label: 'Наименование' },
        { id: 'manufacturer', label: 'Изготовитель' },
        { id: 'volume', label: 'Объём' },
        { id: 'batchNumber', label: 'Номер партии' },
        { id: 'alcoholPercent', label: 'Крепость' },
        { id: 'dateManufacture', label: 'Дата розлива' },
        { id: 'expiryDate', label: 'Срок годности' },
        { id: 'storageConditions', label: 'Условия хранения' },
        { id: 'ingredients', label: 'Состав', isArray: true },
        { id: 'energyValue', label: 'Энерг. ценность' }
    ]
};

// ===== УТИЛИТЫ =====
window.escapeHtml = function(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, '<br>');
};

window.isAllergen = function(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return window.allergenList.some(a => lower.includes(a));
};

window.highlightAllergensInList = function(ingredients) {
    if (!ingredients || !ingredients.length) return '';
    return ingredients.map(ing => {
        const isAll = window.isAllergen(ing);
        return isAll ? `<span class="allergen-highlight">${window.escapeHtml(ing)}</span>` : window.escapeHtml(ing);
    }).join(', ');
};

window.applyDateMask = function(input) {
    input.addEventListener('input', function(e) {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 8) val = val.slice(0, 8);
        let formatted = '';
        if (val.length >= 2) {
            formatted += val.slice(0, 2) + '.';
            if (val.length >= 4) {
                formatted += val.slice(2, 4) + '.';
                if (val.length > 4) formatted += val.slice(4);
            } else if (val.length > 2) formatted += val.slice(2);
        } else formatted = val;
        e.target.value = formatted;
    });
};

window.applyTimeMask = function(input) {
    input.addEventListener('input', function(e) {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        let formatted = '';
        if (val.length >= 2) {
            formatted += val.slice(0, 2) + ':';
            if (val.length > 2) formatted += val.slice(2);
        } else formatted = val;
        e.target.value = formatted;
    });
};

window.replaceTemplateVars = function(str) {
    if (!str) return str;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return str.replace('{{YYYY}}', now.getFullYear())
        .replace('{{MM}}', pad(now.getMonth()+1))
        .replace('{{DD}}', pad(now.getDate()))
        .replace('{{TODAY}}', `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()}`)
        .replace('{{NN}}', String(Math.floor(Math.random()*900)+100));
};

// ===== ПРОВЕРКИ =====
window.checkPerishable = function() {
    const expiryHours = parseInt(window.formData.expiryHours) || 0;
    const isPerishable = expiryHours > 0 && expiryHours <= 72;
    
    const timeRow = document.getElementById('timeManufactureRow');
    const timeLabel = document.getElementById('timeManufactureLabel');
    
    if (timeRow) {
        timeRow.style.display = 'block';
        if (timeLabel) {
            timeLabel.innerHTML = isPerishable 
                ? '🕐 Время <span class="required-star">★</span>' 
                : '🕐 Время <span class="optional-mark">(для срока ≤72ч)</span>';
        }
    }
    
    const alertBox = document.getElementById('alertBox');
    if (isPerishable && window.productType === 'cheese') {
        alertBox.innerHTML = `<div class="alert-box alert-warning"><strong>⚠️ Скоропортящийся продукт!</strong><div>Срок ≤72 часа. Обязательно указание времени.</div></div>`;
    } else {
        alertBox.innerHTML = '';
    }
    
    return isPerishable;
};

window.checkBrinedCheese = function() {
    const isBrined = window.formData.cheeseType === 'brined';
    const brineRow = document.getElementById('brineWeightRow');
    if (brineRow) brineRow.style.display = isBrined ? 'block' : 'none';
    return isBrined;
};

// ===== КОНСТРУКТОР СОСТАВА =====
window.renderIngredientBuilder = function() {
    const listEl = document.getElementById('ingredientList');
    if (!listEl) return;
    
    listEl.innerHTML = '';
    const items = window.formData.ingredients || [];
    
    items.forEach((ing, idx) => {
        const isAll = window.isAllergen(ing);
        const li = document.createElement('li');
        li.className = `ingredient-item${isAll ? ' allergen' : ''}`;
        li.innerHTML = `
            <span class="ing-text${isAll ? ' allergen-highlight' : ''}">${idx + 1}. ${window.escapeHtml(ing)}</span>
            <div class="ing-controls">
                <button class="btn-icon" onclick="window.moveIngredient(${idx}, -1)" title="Выше">↑</button>
                <button class="btn-icon" onclick="window.moveIngredient(${idx}, 1)" title="Ниже">↓</button>
                <button class="btn-icon del" onclick="window.removeIngredient(${idx})" title="Удалить">✕</button>
            </div>
        `;
        listEl.appendChild(li);
    });
};

window.addIngredient = function() {
    const inp = document.getElementById('newIngredient');
    const select = document.getElementById('ingredientSelect');
    const val = inp?.value.trim() || select?.value;
    
    if (!val) {
        alert('Выберите или введите ингредиент!');
        return;
    }
    
    window.formData.ingredients.push(val);
    if (inp) inp.value = '';
    if (select) select.value = '';
    
    window.renderIngredientBuilder();
    window.updatePreview();
    window.saveDraft();
};

window.removeIngredient = function(index) {
    window.formData.ingredients.splice(index, 1);
    window.renderIngredientBuilder();
    window.updatePreview();
    window.saveDraft();
};

window.moveIngredient = function(index, dir) {
    if (index + dir < 0 || index + dir >= window.formData.ingredients.length) return;
    
    const temp = window.formData.ingredients[index];
    window.formData.ingredients[index] = window.formData.ingredients[index + dir];
    window.formData.ingredients[index + dir] = temp;
    
    window.renderIngredientBuilder();
    window.updatePreview();
    window.saveDraft();
};

// ===== РЕНДЕР ФОРМЫ =====
window.renderForm = function() {
    let html = '';
    
    if (window.productType === 'cheese') {
        const expiryHours = parseInt(window.formData.expiryHours) || 0;
        const isPerishable = expiryHours > 0 && expiryHours <= 72;
        const isBrined = window.formData.cheeseType === 'brined';
        
        html = `
            <div class="form-group"><label>🧀 Наименование <span class="required-star">★</span></label><input type="text" id="productName" placeholder="Сыр Гауда" value="${window.escapeHtml(window.formData.productName)}"></div>
            <div class="form-group">
                <label>📋 Сорт сыра <span class="required-star">★</span></label>
                <select id="cheeseType" onchange="window.updatePreview(); window.checkPerishable(); window.checkBrinedCheese();">
                    <option value="">— Выберите сорт —</option>
                    ${Object.entries(window.cheeseTypes).map(([k,v]) => `<option value="${k}" ${window.formData.cheeseType===k?'selected':''}>${v}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>🏭 Изготовитель <span class="required-star">★</span></label><input type="text" id="manufacturer" placeholder="ООО Сыр, г. Москва" value="${window.escapeHtml(window.formData.manufacturer)}"></div>
            <div class="row-2col">
                <div class="form-group"><label>⚖️ Масса нетто (г) ★</label><input type="text" id="weightOrVolume" placeholder="200 г" value="${window.escapeHtml(window.formData.weightOrVolume)}"></div>
                <div class="form-group"><label>📦 Партия ★</label><input type="text" id="batchNumber" placeholder="G-2026-01-123" value="${window.escapeHtml(window.formData.batchNumber)}"></div>
            </div>
            <div class="row-3col">
                <div class="form-group"><label>📅 Дата изготов. ★</label><input type="text" id="dateManufacture" placeholder="ДД.ММ.ГГГГ" class="date-input" value="${window.escapeHtml(window.formData.dateManufacture)}"></div>
                <div class="form-group" id="timeManufactureRow"><label id="timeManufactureLabel">🕐 Время ${isPerishable ? '<span class="required-star">★</span>' : '<span class="optional-mark">(для срока ≤72ч)</span>'}</label><input type="text" id="timeManufacture" placeholder="ЧЧ:ММ" class="time-input" value="${window.escapeHtml(window.formData.timeManufacture)}"></div>
                <div class="form-group"><label>⏳ Срок годности ★</label><input type="text" id="expiryDate" placeholder="45 суток" value="${window.escapeHtml(window.formData.expiryDate)}" oninput="window.updateExpiryHours()"></div>
            </div>
            <div class="form-group" id="brineWeightRow" style="display:${isBrined?'block':'none'}"><label>🧂 Масса с рассолом <span class="optional-mark">(для рассольных)</span></label><input type="text" id="brineWeight" placeholder="250 г с рассолом" value="${window.escapeHtml(window.formData.brineWeight)}"></div>
            <div class="form-group"><label>🌡️ Условия хранения ★</label><input type="text" id="storageConditions" placeholder="+2…+6°C" value="${window.escapeHtml(window.formData.storageConditions)}"></div>
            <div class="form-group">
                <label>📋 Состав (добавляйте в порядке убывания массы) ★</label>
                <div class="ingredient-builder">
                    <ul class="ingredient-list" id="ingredientList"></ul>
                    <div class="add-ing-row">
                        <select id="ingredientSelect">
                            <option value="" disabled selected>★ Популярное</option>
                            <option value="молоко пастеризованное коровье">Молоко пастеризованное</option>
                            <option value="соль пищевая">Соль пищевая</option>
                            <option value="закваска мезофильная">Закваска мезофильная</option>
                            <option value="закваска термофильная">Закваска термофильная</option>
                            <option value="молокосвертывающий фермент">Фермент сычужный</option>
                            <option value="хлористый кальций">Хлористый кальций</option>
                            <option value="вода подготовленная">Вода подготовленная</option>
                        </select>
                        <input type="text" id="newIngredient" placeholder="Или введите свой..." onkeydown="if(event.key==='Enter') window.addIngredient()">
                        <button type="button" class="btn-sm primary" onclick="window.addIngredient()">➕</button>
                    </div>
                    <div style="font-size:0.8rem; color:#666; margin-top:5px;">ℹ️ Стрелки ↑↓ меняют порядок (сверху — больше масса)</div>
                </div>
            </div>
            <div class="form-group"><label>🥛 Тип молока/жир</label><input type="text" id="milkType" value="${window.escapeHtml(window.formData.milkType)}"></div>
            <div class="row-3col">
                <div class="form-group"><label>🥩 Белки (г)</label><input type="text" id="protein" value="${window.escapeHtml(window.formData.protein)}"></div>
                <div class="form-group"><label>🔥 Жиры (г)</label><input type="text" id="fatContent" value="${window.escapeHtml(window.formData.fatContent)}"></div>
                <div class="form-group"><label>🍞 Углеводы (г)</label><input type="text" id="carbohydrate" value="${window.escapeHtml(window.formData.carbohydrate)}"></div>
            </div>
            <div class="form-group"><label>⚡ Ккал/100г ★</label><input type="text" id="energyValue" placeholder="350" value="${window.escapeHtml(window.formData.energyValue)}"></div>
        `;
    } else {
        html = `
            <div class="form-group"><label>🍺 Наименование ★</label><input type="text" id="productName" placeholder="IPA" value="${window.escapeHtml(window.formData.productName)}"></div>
            <div class="form-group"><label>🏭 Изготовитель ★</label><input type="text" id="manufacturer" placeholder="ИП Пивовар" value="${window.escapeHtml(window.formData.manufacturer)}"></div>
            <div class="row-2col">
                <div class="form-group"><label>📦 Объём ★</label><input type="text" id="volume" placeholder="0.5 л" value="${window.escapeHtml(window.formData.volume)}"></div>
                <div class="form-group"><label>📦 Партия ★</label><input type="text" id="batchNumber" placeholder="IPA-2026-01" value="${window.escapeHtml(window.formData.batchNumber)}"></div>
            </div>
            <div class="row-2col">
                <div class="form-group"><label>🍷 Крепость % ★</label><input type="text" id="alcoholPercent" placeholder="6.2" value="${window.escapeHtml(window.formData.alcoholPercent)}"></div>
                <div class="form-group"><label>📅 Дата розлива ★</label><input type="text" id="dateManufacture" placeholder="ДД.ММ.ГГГГ" class="date-input" value="${window.escapeHtml(window.formData.dateManufacture)}"></div>
            </div>
            <div class="row-2col">
                <div class="form-group"><label>⏳ Срок годности ★</label><input type="text" id="expiryDate" placeholder="6 мес." value="${window.escapeHtml(window.formData.expiryDate)}"></div>
                <div class="form-group"><label>🌡️ Условия ★</label><input type="text" id="storageConditions" placeholder="0…+15°C" value="${window.escapeHtml(window.formData.storageConditions)}"></div>
            </div>
            <div class="form-group">
                <label>📋 Состав (в порядке убывания) ★</label>
                <div class="ingredient-builder">
                    <ul class="ingredient-list" id="ingredientList"></ul>
                    <div class="add-ing-row">
                        <select id="ingredientSelect">
                            <option value="" disabled selected>★ Популярное</option>
                            <option value="вода подготовленная">Вода подготовленная</option>
                            <option value="солод ячменный светлый">Солод ячменный светлый</option>
                            <option value="солод ячменный жжёный">Солод жжёный</option>
                            <option value="хмель Cascade">Хмель Cascade</option>
                            <option value="дрожжи Saccharomyces cerevisiae">Дрожжи</option>
                        </select>
                        <input type="text" id="newIngredient" placeholder="Или введите свой..." onkeydown="if(event.key==='Enter') window.addIngredient()">
                        <button type="button" class="btn-sm primary" onclick="window.addIngredient()">➕</button>
                    </div>
                </div>
            </div>
            <div class="row-3col">
                <div class="form-group"><label>🥩 Белки (г)</label><input type="text" id="protein" value="${window.escapeHtml(window.formData.protein)}"></div>
                <div class="form-group"><label>🔥 Жиры (г)</label><input type="text" id="fatContent" value="${window.escapeHtml(window.formData.fatContent)}"></div>
                <div class="form-group"><label>🍞 Углеводы (г)</label><input type="text" id="carbohydrate" value="${window.escapeHtml(window.formData.carbohydrate)}"></div>
            </div>
            <div class="form-group"><label>⚡ Ккал/100мл ★</label><input type="text" id="energyValue" placeholder="45" value="${window.escapeHtml(window.formData.energyValue)}"></div>
        `;
    }
    
    document.getElementById('dynamicForm').innerHTML = html;
    window.populateFields();
    window.renderIngredientBuilder();
    document.querySelectorAll('.date-input').forEach(inp => window.applyDateMask(inp));
    document.querySelectorAll('.time-input').forEach(inp => window.applyTimeMask(inp));
    window.checkPerishable();
    window.checkBrinedCheese();
};

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====
window.updateExpiryHours = function() {
    const expiryText = document.getElementById('expiryDate')?.value || '';
    let hours = 0;
    const matchHours = expiryText.match(/(\d+)\s*(час|ч)/i);
    const matchDays = expiryText.match(/(\d+)\s*(сут|день|дн)/i);
    if (matchHours) hours = parseInt(matchHours[1]);
    else if (matchDays) hours = parseInt(matchDays[1]) * 24;
    window.formData.expiryHours = hours;
    window.checkPerishable();
    window.updatePreview();
};

window.populateFields = function() {
    const fields = ['productName','cheeseType','manufacturer','weightOrVolume','dateManufacture','timeManufacture','expiryDate','storageConditions','batchNumber','milkType','fatContent','protein','carbohydrate','energyValue','brineWeight','volume','alcoholPercent'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = window.formData[id] || '';
    });
};

window.collectFormData = function() {
    const get = id => document.getElementById(id)?.value?.trim() || '';
    window.formData.productName = get('productName');
    window.formData.cheeseType = get('cheeseType');
    window.formData.manufacturer = get('manufacturer');
    window.formData.weightOrVolume = get('weightOrVolume');
    window.formData.dateManufacture = get('dateManufacture');
    window.formData.timeManufacture = get('timeManufacture');
    window.formData.expiryDate = get('expiryDate');
    window.formData.storageConditions = get('storageConditions');
    window.formData.batchNumber = get('batchNumber');
    window.formData.milkType = get('milkType');
    window.formData.protein = get('protein');
    window.formData.fatContent = get('fatContent');
    window.formData.carbohydrate = get('carbohydrate');
    window.formData.energyValue = get('energyValue');
    window.formData.brineWeight = get('brineWeight');
    window.formData.volume = get('volume');
    window.formData.alcoholPercent = get('alcoholPercent');
    window.updateExpiryHours();
};

// ===== ВАЛИДАЦИЯ =====
window.validateRequired = function() {
    let errors = [];
    const req = window.productType === 'cheese'
        ? ['productName','cheeseType','manufacturer','weightOrVolume','dateManufacture','expiryDate','storageConditions','batchNumber','energyValue']
        : ['productName','manufacturer','volume','batchNumber','alcoholPercent','dateManufacture','expiryDate','storageConditions','energyValue'];
    
    req.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const isEmpty = !el.value.trim();
            if (isEmpty) { el.classList.add('input-error'); errors.push(id); }
            else el.classList.remove('input-error');
        }
    });
    
    if (window.formData.ingredients?.length === 0) errors.push('ingredients');
    
    const isPerishable = parseInt(window.formData.expiryHours) > 0 && parseInt(window.formData.expiryHours) <= 72;
    if (isPerishable && window.productType === 'cheese' && !window.formData.timeManufacture) {
        errors.push('timeManufacture (для ≤72ч)');
        const timeEl = document.getElementById('timeManufacture');
        if (timeEl) timeEl.classList.add('input-error');
    }
    
    document.getElementById('validationSummary').textContent = errors.length 
        ? '❗ Не заполнены: ' + errors.join(', ') 
        : '✅ Все обязательные поля заполнены';
    
    return errors.length === 0;
};

// ===== ЧЕК-ЛИСТ =====
window.updateChecklist = function() {
    const rules = window.checklistRules[window.productType];
    let done = 0, html = '';
    
    rules.forEach(r => {
        let ok = false;
        if (r.isArray) ok = window.formData.ingredients?.length > 0;
        else if (r.isSelect) ok = window.formData.cheeseType;
        else {
            const el = document.getElementById(r.id);
            ok = el?.value?.trim();
        }
        if (ok) done++;
        html += `<div class="checklist-item ${ok?'ok':'fail'}">${ok?'✓':'○'} ${r.label}</div>`;
    });
    
    const pct = Math.round((done/rules.length)*100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('checklistItems').innerHTML = html;
    document.getElementById('checklistPercent').textContent = pct + '%';
    return pct;
};

// ===== КОНТРАСТНОСТЬ =====
window.parseColor = function(c) {
    if (c.startsWith('#')) {
        let h = c.slice(1);
        if (h.length===3) h = h.split('').map(x=>x+x).join('');
        const n = parseInt(h,16);
        return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
    }
    if (c.startsWith('rgb')) {
        const m = c.match(/[\d.]+/g);
        if (m) return { r:+m[0], g:+m[1], b:+m[2] };
    }
    return { r:0, g:0, b:0 };
};

window.luminance = function(rgb) {
    const s = [rgb.r,rgb.g,rgb.b].map(v => {
        v/=255;
        return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4);
    });
    return 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
};

window.contrast = function(c1,c2) {
    const L1 = window.luminance(window.parseColor(c1));
    const L2 = window.luminance(window.parseColor(c2));
    const [lt,dk] = L1>L2 ? [L1,L2] : [L2,L1];
    return ((lt+0.05)/(dk+0.05)).toFixed(2);
};

window.checkContrast = function() {
    const lbl = document.getElementById('labelForExport');
    if (!lbl) return;
    
    const st = window.getComputedStyle(lbl);
    const ratio = window.contrast(st.color||'#000', st.backgroundColor||'#fff');
    const ok = ratio >= 4.5;
    
    document.getElementById('contrastResult').innerHTML = ok
        ? `<span class="contrast-badge contrast-ok">✅ ${ratio}:1 — WCAG AA</span>`
        : `<span class="contrast-badge contrast-fail">❌ ${ratio}:1 — ниже нормы</span>`;
    
    document.getElementById('contrastDetails').textContent = `Текст: ${st.color}, Фон: ${st.backgroundColor}. Требуется ≥4.5:1`;
    document.getElementById('complianceContrast').innerHTML = ok 
        ? '<span class="compliance-ok">✅ '+ratio+':1</span>' 
        : '<span class="compliance-fail">❌ '+ratio+':1</span>';
};

window.checkWarningFont = function() {
    if (window.productType !== 'beer') {
        document.getElementById('complianceFontWarn').textContent = '—';
        return;
    }
    const fontSizePx = 12;
    const dpi = 96;
    const fontSizeMm = (fontSizePx * 25.4 / dpi).toFixed(2);
    const ok = parseFloat(fontSizeMm) >= 2.5;
    document.getElementById('complianceFontWarn').innerHTML = ok 
        ? '<span class="compliance-ok">✅ '+fontSizeMm+' мм</span>' 
        : '<span class="compliance-fail">❌ '+fontSizeMm+' мм</span>';
};

// ===== ГЕНЕРАЦИЯ ЭТИКЕТКИ =====
window.generateLabelHTML = function() {
    if (window.productType === 'cheese') {
        const ingHtml = window.highlightAllergensInList(window.formData.ingredients);
        const cheeseTypeName = window.cheeseTypes[window.formData.cheeseType] 
            ? window.cheeseTypes[window.formData.cheeseType].split(' ')[0] 
            : '';
        
        return `
        <div class="label-preview" id="labelForExport">
            <div class="label-header"><span class="product-name-label">${window.escapeHtml(window.formData.productName||'Наименование')}</span><span class="eac-on-label">ЕАС</span></div>
            <div class="label-content">
                <div class="label-row"><span class="label-caption">Изготовитель:</span><span class="label-value">${window.escapeHtml(window.formData.manufacturer||'—')}</span></div>
                <div class="label-row"><span class="label-caption">Масса нетто:</span><span class="label-value">${window.escapeHtml(window.formData.weightOrVolume||'___ г')}${window.formData.brineWeight ? ` (с рассолом: ${window.escapeHtml(window.formData.brineWeight)})` : ''}</span></div>
                <div class="label-row"><span class="label-caption">Партия:</span><span class="label-value">${window.escapeHtml(window.formData.batchNumber||'—')}</span></div>
                <div class="label-row"><span class="label-caption">Дата изготов.:</span><span class="label-value">${window.escapeHtml(window.formData.dateManufacture||'ДД.ММ.ГГГГ')}${window.formData.timeManufacture ? ` ${window.formData.timeManufacture}` : ''}</span></div>
                <div class="label-row"><span class="label-caption">Срок годности:</span><span class="label-value">${window.escapeHtml(window.formData.expiryDate||'___')}</span></div>
                <div class="label-row"><span class="label-caption">Хранить при:</span><span class="label-value">${window.escapeHtml(window.formData.storageConditions||'___')}</span></div>
                <div class="ingredients-block"><strong>Состав:</strong> ${ingHtml||'не указан'}${window.formData.milkType?`<br><em>${window.escapeHtml(window.formData.milkType)}</em>`:''}</div>
                <div class="nutrition-table">
                    <strong>Пищевая ценность на 100 г:</strong>
                    <table>
                        ${window.formData.protein ? `<tr><td>Белки</td><td>${window.escapeHtml(window.formData.protein)} г</td></tr>` : ''}
                        ${window.formData.fatContent ? `<tr><td>Жиры</td><td>${window.escapeHtml(window.formData.fatContent)} г</td></tr>` : ''}
                        ${window.formData.carbohydrate ? `<tr><td>Углеводы</td><td>${window.escapeHtml(window.formData.carbohydrate)} г</td></tr>` : ''}
                        <tr><td><strong>Энергетическая ценность</strong></td><td><strong>${window.escapeHtml(window.formData.energyValue)||'—'} ккал</strong></td></tr>
                    </table>
                </div>
                <div class="footer-label"><span>ТР ТС 022/2011, 033/2013</span>${cheeseTypeName ? `<span>Сорт: ${cheeseTypeName}</span>` : ''}</div>
            </div>
        </div>`;
    } else {
        const ingHtml = window.highlightAllergensInList(window.formData.ingredients);
        const alc = parseFloat(window.formData.alcoholPercent) || 0;
        
        return `
        <div class="label-preview" id="labelForExport">
            <div class="label-header"><span class="product-name-label">${window.escapeHtml(window.formData.productName||'Пиво')}</span><span class="eac-on-label">ЕАС</span></div>
            <div class="label-content">
                <div class="label-row"><span class="label-caption">Изготовитель:</span><span class="label-value">${window.escapeHtml(window.formData.manufacturer||'—')}</span></div>
                <div class="label-row"><span class="label-caption">Объём:</span><span class="label-value">${window.escapeHtml(window.formData.volume||'___ л')}</span></div>
                <div class="label-row"><span class="label-caption">Партия:</span><span class="label-value">${window.escapeHtml(window.formData.batchNumber||'—')}</span></div>
                <div class="label-row"><span class="label-caption">Крепость:</span><span class="label-value">${window.escapeHtml(window.formData.alcoholPercent||'___%')}</span></div>
                <div class="label-row"><span class="label-caption">Дата розлива:</span><span class="label-value">${window.escapeHtml(window.formData.dateManufacture||'ДД.ММ.ГГГГ')}</span></div>
                <div class="label-row"><span class="label-caption">Срок / Условия:</span><span class="label-value">${window.escapeHtml(window.formData.expiryDate||'___')} / ${window.escapeHtml(window.formData.storageConditions||'___')}</span></div>
                <div class="ingredients-block"><strong>Состав:</strong> ${ingHtml||'не указан'}</div>
                <div class="nutrition-table">
                    <strong>Пищевая ценность на 100 мл:</strong>
                    <table>
                        ${window.formData.protein ? `<tr><td>Белки</td><td>${window.escapeHtml(window.formData.protein)} г</td></tr>` : ''}
                        ${window.formData.fatContent ? `<tr><td>Жиры</td><td>${window.escapeHtml(window.formData.fatContent)} г</td></tr>` : ''}
                        ${window.formData.carbohydrate ? `<tr><td>Углеводы</td><td>${window.escapeHtml(window.formData.carbohydrate)} г</td></tr>` : ''}
                        <tr><td><strong>Энергетическая ценность</strong></td><td><strong>${window.escapeHtml(window.formData.energyValue)||'—'} ккал</strong></td></tr>
                    </table>
                </div>
                ${alc > 0.5 ? `
                <div class="alcohol-warning">ЧРЕЗМЕРНОЕ УПОТРЕБЛЕНИЕ АЛКОГОЛЯ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ</div>
                <div class="alcohol-warning-small">НЕ РЕКОМЕНДУЕТСЯ УПОТРЕБЛЕНИЕ ЛИЦАМ МОЛОЖЕ 18 ЛЕТ, БЕРЕМЕННЫМ И КОРМЯЩИМ ЖЕНЩИНАМ, ЛИЦАМ С ЗАБОЛЕВАНИЯМИ НЕРВНОЙ СИСТЕМЫ</div>
                ` : ''}
                <div class="footer-label"><span>ТР ТС 022/2011, 047/2018</span></div>
            </div>
        </div>`;
    }
};

window.updatePreview = function() {
    document.getElementById('labelPreviewArea').innerHTML = window.generateLabelHTML();
    window.checkContrast();
    window.checkWarningFont();
    
    const hasNutrition = window.formData.energyValue;
    document.getElementById('complianceNutrition').innerHTML = hasNutrition 
        ? '<span class="compliance-ok">✅ Указана</span>' 
        : '<span class="compliance-fail">❌ Отсутствует</span>';
    
    document.getElementById('complianceIngredients').innerHTML = window.formData.ingredients?.length > 0
        ? '<span class="compliance-ok">✅ '+window.formData.ingredients.length+' инг.</span>'
        : '<span class="compliance-warn">⚠️ Пусто</span>';
    
    if (window.productType === 'cheese') {
        document.getElementById('complianceCheeseTypeRow').style.display = 'flex';
        document.getElementById('complianceCheeseType').innerHTML = window.formData.cheeseType
            ? '<span class="compliance-ok">✅ '+window.cheeseTypes[window.formData.cheeseType].split(' ')[0]+'</span>'
            : '<span class="compliance-fail">❌ Не указан</span>';
    } else {
        document.getElementById('complianceCheeseTypeRow').style.display = 'none';
    }
    
    const isPerishable = parseInt(window.formData.expiryHours) > 0 && parseInt(window.formData.expiryHours) <= 72;
    if (window.productType === 'cheese' && isPerishable) {
        document.getElementById('complianceTimeRow').style.display = 'flex';
        document.getElementById('complianceTime').innerHTML = window.formData.timeManufacture
            ? '<span class="compliance-ok">✅ '+window.formData.timeManufacture+'</span>'
            : '<span class="compliance-fail">❌ Требуется</span>';
    } else {
        document.getElementById('complianceTimeRow').style.display = 'none';
    }
    
    if (window.formData.cheeseType === 'brined') {
        document.getElementById('complianceBrineRow').style.display = 'flex';
        document.getElementById('complianceBrine').innerHTML = window.formData.brineWeight
            ? '<span class="compliance-ok">✅ '+window.formData.brineWeight+'</span>'
            : '<span class="compliance-warn">⚠️ Рекомендуется</span>';
    } else {
        document.getElementById('complianceBrineRow').style.display = 'none';
    }
    
    window.validateRequired();
    
    if (window.isDonated) {
        document.getElementById('exportPngBtn').disabled = false;
        document.getElementById('exportPdfBtn').disabled = false;
    } else {
        document.getElementById('exportPngBtn').disabled = true;
        document.getElementById('exportPdfBtn').disabled = true;
    }
};

// ===== ЭКСПОРТ =====
window.exportToPng = async function() {
    if (!window.isDonated) {
        alert('Доступно в полной версии!');
        document.getElementById('donateModal').classList.add('active');
        return;
    }
    
    const lbl = document.getElementById('labelForExport');
    if (!lbl) return;
    
    const btn = document.getElementById('exportPngBtn');
    btn.disabled = true;
    btn.textContent = '⏳...';
    
    try {
        const cvs = await html2canvas(lbl, { scale: 4, backgroundColor: '#fff', useCORS: true });
        const a = document.createElement('a');
        a.download = `etiketka-${window.productType}-${Date.now()}.png`;
        a.href = cvs.toDataURL('image/png');
        a.click();
    } catch(e) {
        alert('Ошибка PNG: '+e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '📸 PNG';
    }
};

window.exportToPdf = async function() {
    if (!window.isDonated) {
        alert('Доступно в полной версии!');
        document.getElementById('donateModal').classList.add('active');
        return;
    }
    
    const lbl = document.getElementById('labelForExport');
    if (!lbl) return;
    
    const btn = document.getElementById('exportPdfBtn');
    btn.disabled = true;
    btn.textContent = '⏳...';
    
    try {
        const cvs = await html2canvas(lbl, { scale: 4, backgroundColor: '#fff' });
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: cvs.width>cvs.height?'landscape':'portrait',
            unit:'mm',
            format: [cvs.width*0.264583, cvs.height*0.264583]
        });
        pdf.addImage(cvs.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.save(`etiketka-${window.productType}-${Date.now()}.pdf`);
    } catch(e) {
        alert('Ошибка PDF: '+e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '📄 PDF';
    }
};

// ===== LOCALSTORAGE =====
window.saveDraft = function() {
    window.collectFormData();
    localStorage.setItem('labelDraft_v32', JSON.stringify({
        productType: window.productType,
        formData: window.formData,
        ts: Date.now()
    }));
    document.getElementById('autosaveStatus').textContent = '✓ Сохранено ' + new Date().toLocaleTimeString('ru-RU');
    setTimeout(() => {
        if (document.getElementById('autosaveStatus').textContent?.includes('✓'))
            document.getElementById('autosaveStatus').textContent = '';
    }, 2500);
};

window.loadDraft = function() {
    try {
        const s = localStorage.getItem('labelDraft_v32');
        if (!s) return;
        const { productType: pt, formData: fd } = JSON.parse(s);
        if (confirm('Загрузить черновик?')) {
            window.productType = pt;
            window.formData = fd;
            document.querySelectorAll('.type-btn').forEach(b => 
                b.classList.toggle('active', b.dataset.type===window.productType)
            );
            window.renderForm();
            window.updatePreview();
            window.updateChecklist();
        }
    } catch(e) {
        console.warn('Draft load error:', e);
    }
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    window.checkDonationStatus();
    window.loadMyTemplates();
    window.loadDraft();
    window.renderForm();
    window.updateChecklist();
    window.renderTemplatesGrid();
    
    // Переключение типа продукта
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.productType = btn.dataset.type;
            window.selectedTemplateId = null;
            document.getElementById('applyTemplateBtn').disabled = true;
            window.renderForm();
            window.updatePreview();
            window.updateChecklist();
            window.renderTemplatesGrid();
            window.saveDraft();
        });
    });
    
    // Кнопки
    document.getElementById('generateBtn').addEventListener('click', () => {
        window.collectFormData();
        window.updatePreview();
        window.updateChecklist();
        window.saveDraft();
    });
    
    document.getElementById('exportPngBtn').addEventListener('click', window.exportToPng);
    document.getElementById('exportPdfBtn').addEventListener('click', window.exportToPdf);
    
    const saveAsTemplateBtn = document.getElementById('saveAsTemplateBtn');
    if (saveAsTemplateBtn) saveAsTemplateBtn.addEventListener('click', window.saveAsMyTemplate);
    
    document.getElementById('openTemplatesBtn').addEventListener('click', () => {
        window.selectedTemplateId = null;
        document.getElementById('applyTemplateBtn').disabled = true;
        window.templateSearch.value = '';
        window.templateTypeFilter.value = 'all';
        window.templateTagFilter.value = 'all';
        window.renderTemplatesGrid();
        document.getElementById('templatesModal').classList.add('active');
    });
    
    document.getElementById('closeTemplatesBtn').addEventListener('click', () => 
        document.getElementById('templatesModal').classList.remove('active')
    );
    
    document.getElementById('templatesModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('templatesModal')) 
            document.getElementById('templatesModal').classList.remove('active');
    });
    
    window.templateSearch.addEventListener('input', window.renderTemplatesGrid);
    window.templateTypeFilter.addEventListener('change', window.renderTemplatesGrid);
    window.templateTagFilter.addEventListener('change', window.renderTemplatesGrid);
    
    document.getElementById('applyTemplateBtn').addEventListener('click', () => {
        const tpl = window.builtInTemplates.find(t => t.id === window.selectedTemplateId);
        if (tpl) window.applyTemplate(tpl);
    });
    
    document.getElementById('exportTemplatesBtn').addEventListener('click', window.exportMyTemplates);
    document.getElementById('importTemplatesBtn').addEventListener('click', () => 
        document.getElementById('importFile').click()
    );
    document.getElementById('importFile').addEventListener('change', (e) => {
        if (e.target.files[0]) window.importMyTemplates(e.target.files[0]);
    });
    
    document.getElementById('clearMyTemplatesBtn').addEventListener('click', () => {
        if (!window.isDonated) {
            alert('Доступно в полной версии');
            return;
        }
        if (confirm('Удалить ВСЕ шаблоны?')) {
            window.myTemplates = [];
            localStorage.removeItem('label_my_templates');
            window.renderMyTemplates();
        }
    });
    
    // Автосохранение
    let saveTimer;
    document.addEventListener('input', (e) => {
        if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
            clearTimeout(saveTimer);
            document.getElementById('autosaveStatus').textContent = '⏳...';
            saveTimer = setTimeout(window.saveDraft, 700);
        }
    });
    
    // Инициализация модулей
    if (typeof window.initDonate === 'function') {
        window.initDonate();
    }
    
    // ← ДОБАВИТЬ ЭТУ СТРОКУ:
    if (typeof window.initBatchGenerator === 'function') {
        window.initBatchGenerator();
    }
    
    console.log('✅ Генератор этикеток запущен!');
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}