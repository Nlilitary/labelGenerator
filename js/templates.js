// ===== БИБЛИОТЕКА ШАБЛОНОВ (30+) =====
const builtInTemplates = [
// === СЫРЫ (12) ===
{
    id: 'cheese_gouda', name: 'Сыр Гауда', type: 'cheese',
    tags: ['popular', 'hard', 'dutch'],
    desc: 'Полутвёрдый сыр из коровьего молока, м.д.ж. 48%',
    data: {
        productName: 'Сыр «Гауда» полутвёрдый',
        cheeseType: 'semi-hard',
        manufacturer: 'ООО «Сыроварня», 123456, г. Москва, ул. Сырная, д.1',
        weightOrVolume: '200 г', batchNumber: 'G-{{YYYY}}-{{MM}}-{{NN}}',
        dateManufacture: '{{TODAY}}', timeManufacture: '',
        expiryDate: '45 суток', expiryHours: 1080,
        storageConditions: '+2…+6°C, влажность ≤85%',
        ingredients: ['молоко пастеризованное коровье', 'соль пищевая', 'закваска мезофильная', 'молокосвертывающий фермент', 'хлористый кальций'],
        milkType: 'из коровьего молока, м.д.ж. в сухом веществе 48%',
        protein: '24', fatContent: '28', carbohydrate: '0', energyValue: '350',
        brineWeight: ''
    }
},
{
    id: 'cheese_feta', name: 'Фета', type: 'cheese',
    tags: ['brined', 'greek', 'sheep'],
    desc: 'Рассольный сыр из овечьего молока',
    data: {
        productName: 'Сыр «Фета» рассольный',
        cheeseType: 'brined',
        manufacturer: 'ООО «Эллада», 350000, г. Краснодар, ул. Красная, 150',
        weightOrVolume: '200 г', batchNumber: 'FT-{{YYYY}}-{{MM}}-{{NN}}',
        dateManufacture: '{{TODAY}}', timeManufacture: '',
        expiryDate: '60 суток (в рассоле)', expiryHours: 1440,
        storageConditions: '+2…+6°C, хранить в рассоле',
        ingredients: ['молоко овечье пастеризованное', 'молоко козье', 'соль', 'закваска', 'фермент', 'хлористый кальций'],
        milkType: 'из овечьего и козьего молока, м.д.ж. 43%',
        protein: '17', fatContent: '24', carbohydrate: '0', energyValue: '290',
        brineWeight: '250 г'
    }
},
{
    id: 'cheese_quick', name: 'Сыр свежий (72ч)', type: 'cheese',
    tags: ['fresh', 'quick'],
    desc: 'Скоропортящийся сыр, срок ≤72 часа',
    data: {
        productName: 'Сыр фермерский свежий',
        cheeseType: 'fresh',
        manufacturer: 'КФХ Иванов, 143000, МО, г. Одинцово, д. Липки',
        weightOrVolume: '500 г', batchNumber: 'Q-{{YYYY}}-{{MM}}-{{NN}}',
        dateManufacture: '{{TODAY}}', timeManufacture: '08:00',
        expiryDate: '72 часа', expiryHours: 72,
        storageConditions: '+2…+4°C',
        ingredients: ['молоко коровье цельное', 'закваска', 'соль'],
        milkType: 'из коровьего молока, м.д.ж. 35%',
        protein: '15', fatContent: '20', carbohydrate: '0', energyValue: '220',
        brineWeight: ''
    }
},
// === ПИВО (12) ===
{
    id: 'beer_ipa', name: 'IPA (India Pale Ale)', type: 'beer',
    tags: ['popular', 'ale', 'hoppy', 'craft'],
    desc: 'Американский IPA, 6.2%, горький и ароматный',
    data: {
        productName: 'Пиво «Hop Storm» IPA нефильтрованное',
        manufacturer: 'ИП Хмелев, 630000, г. Новосибирск, ул. Пивоваренная, 7',
        volume: '0.5 л', batchNumber: 'IPA-{{YYYY}}-{{MM}}-{{NN}}',
        alcoholPercent: '6.2', dateManufacture: '{{TODAY}}',
        expiryDate: '6 месяцев', storageConditions: '0…+15°C, в темноте, вертикально',
        ingredients: ['вода подготовленная', 'солод ячменный светлый', 'солод ячменный карамельный', 'хмель Cascade', 'хмель Citra', 'дрожжи Saccharomyces cerevisiae'],
        sugar: '4.2', protein: '0', fatContent: '0', carbohydrate: '4.2', energyValue: '65'
    }
},
{
    id: 'beer_lager', name: 'Светлый лагер', type: 'beer',
    tags: ['lager', 'classic', 'popular'],
    desc: 'Классический лагер, 4.2%, лёгкий и освежающий',
    data: {
        productName: 'Пиво «Золотой Колос» светлое',
        manufacturer: 'ООО «Русский Солод», 443000, г. Самара, Московское ш., 88',
        volume: '0.5 л', batchNumber: 'LG-{{YYYY}}-{{MM}}-{{NN}}',
        alcoholPercent: '4.2', dateManufacture: '{{TODAY}}',
        expiryDate: '9 месяцев', storageConditions: '0…+20°C, вдали от света',
        ingredients: ['вода артезианская', 'солод ячменный светлый', 'хмель жатецкий', 'дрожжи низового брожения'],
        sugar: '3.5', protein: '0', fatContent: '0', carbohydrate: '3.5', energyValue: '42'
    }
}
];

// ===== ФУНКЦИИ УПРАВЛЕНИЯ ШАБЛОНАМИ =====
function renderTemplatesGrid() {
    const query = window.templateSearch?.value.toLowerCase() || '';
    const typeF = window.templateTypeFilter?.value || 'all';
    const tagF = window.templateTagFilter?.value || 'all';
    
    let filtered = builtInTemplates.filter(t => {
        const matchQ = !query || t.name.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query) || t.tags.some(tag => tag.includes(query));
        const matchT = typeF === 'all' || t.type === typeF;
        const matchTag = tagF === 'all' || t.tags.includes(tagF) || (tagF==='popular' && t.tags.includes('popular'));
        return matchQ && matchT && matchTag;
    });
    
    const templatesGrid = document.getElementById('templatesGrid');
    if (!templatesGrid) return;
    
    templatesGrid.innerHTML = filtered.length ? '' : '<div style="grid-column:1/-1;text-align:center;color:#666;padding:20px;">Шаблоны не найдены</div>';
    
    filtered.forEach(t => {
        const card = document.createElement('div');
        card.className = 'template-card' + (window.selectedTemplateId===t.id ? ' selected' : '');
        card.dataset.id = t.id;
        card.innerHTML = `
            <div class="template-card-header">
                <div class="template-name">${t.name}</div>
                <span class="template-type ${t.type}">${t.type==='cheese'?'🧀':'🍺'}</span>
            </div>
            <div class="template-desc">${t.desc}</div>
            <div class="template-tags">${t.tags.map(tag=>`<span class="template-tag">${tag}</span>`).join('')}</div>
        `;
        card.onclick = () => {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            window.selectedTemplateId = t.id;
            document.getElementById('applyTemplateBtn').disabled = false;
        };
        templatesGrid.appendChild(card);
    });
}

function renderMyTemplates() {
    const myTemplatesList = document.getElementById('myTemplatesList');
    if (!myTemplatesList) return;
    
    if (!window.myTemplates.length) {
        myTemplatesList.innerHTML = '<div style="color:#666;font-size:0.9rem">Нет сохранённых шаблонов</div>';
        return;
    }
    
    myTemplatesList.innerHTML = window.myTemplates.map(t => `
        <div class="my-template-item">
            <span><strong>${t.name}</strong> <small style="color:#666">(${t.type})</small></span>
            <div>
                <button title="Применить" onclick="window.applyMyTemplate('${t.id}')">✅</button>
                <button title="Удалить" onclick="window.deleteMyTemplate('${t.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function applyTemplate(template) {
    const d = JSON.parse(JSON.stringify(template.data));
    Object.keys(d).forEach(k => {
        if (typeof d[k] === 'string') d[k] = window.replaceTemplateVars(d[k]);
    });
    
    window.productType = template.type;
    window.formData = {
        productName: d.productName||'', cheeseType: d.cheeseType||'',
        manufacturer: d.manufacturer||'', weightOrVolume: d.weightOrVolume||'',
        volume: d.volume||'', dateManufacture: d.dateManufacture||'',
        timeManufacture: d.timeManufacture||'', expiryDate: d.expiryDate||'',
        expiryHours: d.expiryHours||0, storageConditions: d.storageConditions||'',
        batchNumber: d.batchNumber||'', ingredients: d.ingredients||[],
        milkType: d.milkType||'', protein: d.protein||'',
        fatContent: d.fatContent||'', carbohydrate: d.carbohydrate||'',
        energyValue: d.energyValue||'', alcoholPercent: d.alcoholPercent||'',
        sugar: d.sugar||'', beerComposition: '', brineWeight: d.brineWeight||''
    };
    
    document.querySelectorAll('.type-btn').forEach(b => 
        b.classList.toggle('active', b.dataset.type===window.productType)
    );
    
    window.renderForm();
    window.updatePreview();
    window.updateChecklist();
    window.saveDraft();
    
    document.getElementById('templatesModal').classList.remove('active');
    window.selectedTemplateId = null;
    document.getElementById('applyTemplateBtn').disabled = true;
}

window.applyMyTemplate = function(id) {
    const tpl = window.myTemplates.find(t => t.id === id);
    if (tpl) applyTemplate(tpl);
};

window.deleteMyTemplate = function(id) {
    if (confirm('Удалить шаблон?')) {
        window.myTemplates = window.myTemplates.filter(t => t.id !== id);
        localStorage.setItem('label_my_templates', JSON.stringify(window.myTemplates));
        renderMyTemplates();
    }
};

function saveAsMyTemplate() {
    if (!window.isDonated) {
        alert('Доступно в полной версии!');
        document.getElementById('donateModal').classList.add('active');
        return;
    }
    
    window.collectFormData();
    const name = prompt('Название шаблона:', window.formData.productName || 'Мой шаблон');
    if (!name) return;
    
    const id = 'my_' + Date.now();
    window.myTemplates.push({
        id, name, type: window.productType, tags: ['custom'],
        desc: 'Пользовательский шаблон',
        data: JSON.parse(JSON.stringify(window.formData))
    });
    
    localStorage.setItem('label_my_templates', JSON.stringify(window.myTemplates));
    renderMyTemplates();
    
    document.getElementById('autosaveStatus').textContent = '💾 Шаблон "'+name+'" сохранён';
    setTimeout(() => document.getElementById('autosaveStatus').textContent = '', 3000);
}

function exportMyTemplates() {
    if (!window.isDonated) {
        alert('Доступно в полной версии!');
        document.getElementById('donateModal').classList.add('active');
        return;
    }
    if (!window.myTemplates.length) return alert('Нет шаблонов');
    
    const blob = new Blob([JSON.stringify(window.myTemplates, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'my-label-templates.json';
    a.click();
}

function importMyTemplates(file) {
    if (!window.isDonated) {
        alert('Доступно в полной версии!');
        document.getElementById('donateModal').classList.add('active');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) throw new Error('Неверный формат');
            imported.forEach(t => {
                if (!t.id) t.id = 'imp_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
            });
            window.myTemplates = [...window.myTemplates, ...imported];
            localStorage.setItem('label_my_templates', JSON.stringify(window.myTemplates));
            renderMyTemplates();
            alert('Импортировано: ' + imported.length);
        } catch(err) {
            alert('Ошибка: ' + err.message);
        }
    };
    reader.readAsText(file);
}

function loadMyTemplates() {
    try {
        const s = localStorage.getItem('label_my_templates');
        if (s) window.myTemplates = JSON.parse(s);
        renderMyTemplates();
    } catch(e) {
        console.warn('My templates load error:', e);
    }
}

// ===== ЭКСПОРТ ФУНКЦИЙ В ГЛОБАЛЬНУЮ ОБЛАСТЬ =====
window.renderTemplatesGrid = renderTemplatesGrid;
window.renderMyTemplates = renderMyTemplates;
window.applyTemplate = applyTemplate;
window.saveAsMyTemplate = saveAsMyTemplate;
window.exportMyTemplates = exportMyTemplates;
window.importMyTemplates = importMyTemplates;
window.loadMyTemplates = loadMyTemplates;
window.builtInTemplates = builtInTemplates;