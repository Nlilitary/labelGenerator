// ===== ГЕНЕРАТОР ПАРТИЙ (МАССОВАЯ ПЕЧАТЬ) =====

// Функция обновления предпросмотра
function updateBatchPreview() {
    const startTime = document.getElementById('batchStartTime')?.value || '08:00';
    const quantity = parseInt(document.getElementById('batchQuantity')?.value) || 30;
    const interval = parseInt(document.getElementById('batchInterval')?.value) || 15;
    const prefix = document.getElementById('batchPrefix')?.value || 'CH-2026-01-';
    
    // Обновляем статистику
    const batchTotalCount = document.getElementById('batchTotalCount');
    const batchTimeSpan = document.getElementById('batchTimeSpan');
    const batchLastTime = document.getElementById('batchLastTime');
    
    if (batchTotalCount) batchTotalCount.textContent = quantity;
    
    const totalMinutes = (quantity - 1) * interval;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (batchTimeSpan) batchTimeSpan.textContent = `${hours} ч ${mins} мин`;
    
    // Рассчитываем последнее время
    const [startHours, startMins] = startTime.split(':').map(Number);
    const lastTotalMins = startHours * 60 + startMins + totalMinutes;
    const lastHours = Math.floor(lastTotalMins / 60) % 24;
    const lastMins = lastTotalMins % 60;
    if (batchLastTime) batchLastTime.textContent = 
        `${String(lastHours).padStart(2,'0')}:${String(lastMins).padStart(2,'0')}`;
    
    // Предпросмотр списка
    const previewList = document.getElementById('batchPreviewList');
    if (!previewList) return;
    
    previewList.innerHTML = '';
    for (let i = 0; i < Math.min(quantity, 10); i++) {
        const batchNum = String(i + 1).padStart(3, '0');
        const totalMins = startHours * 60 + startMins + (i * interval);
        const hours = Math.floor(totalMins / 60) % 24;
        const mins = totalMins % 60;
        const time = `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}`;
        
        const item = document.createElement('div');
        item.className = 'batch-preview-item';
        item.innerHTML = `<span>Партия ${prefix}${batchNum}</span><span>${time}</span>`;
        previewList.appendChild(item);
    }
    
    if (quantity > 10) {
        const more = document.createElement('div');
        more.className = 'batch-preview-item';
        more.style.color = '#666';
        more.style.fontStyle = 'italic';
        more.textContent = `... и ещё ${quantity - 10} партий`;
        previewList.appendChild(more);
    }
}

// Функция генерации PDF
async function generateBatchPDF() {
    if (!window.isDonated) {
        alert('Доступно в полной версии!');
        if (window.donateModal) window.donateModal.classList.add('active');
        return;
    }
    
    const startTime = document.getElementById('batchStartTime')?.value || '08:00';
    const quantity = parseInt(document.getElementById('batchQuantity')?.value) || 30;
    const interval = parseInt(document.getElementById('batchInterval')?.value) || 15;
    const prefix = document.getElementById('batchPrefix')?.value || 'CH-2026-01-';
    const [startHours, startMins] = startTime.split(':').map(Number);
    
    const generateBtn = document.getElementById('generateBatchBtn');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.textContent = '⏳ Генерация...';
    }
    
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) throw new Error('jsPDF не загружен');
        
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        for (let i = 0; i < quantity; i++) {
            if (i > 0) pdf.addPage();
            
            const batchNum = String(i + 1).padStart(3, '0');
            const totalMins = startHours * 60 + startMins + (i * interval);
            const hours = Math.floor(totalMins / 60) % 24;
            const mins = totalMins % 60;
            const time = `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}`;
            
            // Сохраняем оригинальные данные
            const originalBatchNumber = window.formData?.batchNumber || '';
            const originalTime = window.formData?.timeManufacture || '';
            
            // Временно меняем данные
            if (window.formData) {
                window.formData.batchNumber = `${prefix}${batchNum}`;
                window.formData.timeManufacture = time;
            }
            
            // Генерируем этикетку
            if (typeof window.generateLabelHTML === 'function') {
                const previewArea = document.getElementById('labelPreviewArea');
                if (previewArea) {
                    previewArea.innerHTML = window.generateLabelHTML();
                    const lbl = document.getElementById('labelForExport');
                    
                    if (lbl && window.html2canvas) {
                        const cvs = await window.html2canvas(lbl, { scale: 4, backgroundColor: '#fff' });
                        const imgData = cvs.toDataURL('image/png');
                        const imgWidth = 210;
                        const imgHeight = (cvs.height * imgWidth) / cvs.width;
                        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                    }
                }
            }
            
            // Возвращаем оригинальные данные
            if (window.formData) {
                window.formData.batchNumber = originalBatchNumber;
                window.formData.timeManufacture = originalTime;
            }
        }
        
        pdf.save(`partiya-${window.productType || 'cheese'}-${Date.now()}.pdf`);
        
        const autosaveStatus = document.getElementById('autosaveStatus');
        if (autosaveStatus) {
            autosaveStatus.textContent = `✅ Создано ${quantity} этикеток!`;
            setTimeout(() => { if (autosaveStatus) autosaveStatus.textContent = ''; }, 3000);
        }
        
    } catch(e) {
        console.error('Batch PDF error:', e);
        alert('Ошибка генерации: ' + e.message);
    } finally {
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.textContent = '📦 Создать PDF';
        }
        const modal = document.getElementById('batchGeneratorModal');
        if (modal) modal.classList.remove('active');
    }
}

// Функция инициализации
function initBatchGenerator() {
    const openBtn = document.getElementById('openBatchGeneratorBtn');
    const closeBtn = document.getElementById('closeBatchGeneratorBtn');
    const cancelBtn = document.getElementById('cancelBatchBtn');
    const generateBtn = document.getElementById('generateBatchBtn');
    const modal = document.getElementById('batchGeneratorModal');
    
    // Открытие
    if (openBtn) openBtn.addEventListener('click', () => {
        if (typeof updateBatchPreview === 'function') updateBatchPreview();
        if (modal) modal.classList.add('active');
    });
    
    // Закрытие
    if (closeBtn) closeBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('active');
    });
    
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('active');
    });
    
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    // Обновление предпросмотра при изменении полей
    ['batchStartTime', 'batchQuantity', 'batchInterval', 'batchPrefix'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => {
            if (typeof updateBatchPreview === 'function') updateBatchPreview();
        });
    });
    
    // Генерация
    if (generateBtn) generateBtn.addEventListener('click', () => {
        if (typeof generateBatchPDF === 'function') generateBatchPDF();
    });
    
    console.log('✅ Генератор партий инициализирован');
}

// ===== ЭКСПОРТ ФУНКЦИЙ В ГЛОБАЛЬНУЮ ОБЛАСТЬ =====
window.updateBatchPreview = updateBatchPreview;
window.generateBatchPDF = generateBatchPDF;
window.initBatchGenerator = initBatchGenerator;