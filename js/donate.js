// ===== СИСТЕМА ДОНАТОВ И АКТИВАЦИИ =====

// База кодов активации (добавляйте сюда коды после выдачи)
const validActivationCodes = {
    'DEMO1234': 199,
    'DEMO5678': 199,
    'PREMIUM1': 499,
    'BUSINESS': 999
};

function checkDonationStatus() {
    try {
        const saved = localStorage.getItem('label_donated');
        if (saved === 'true') {
            window.isDonated = true;
            document.getElementById('donateBanner').style.display = 'none';
            document.getElementById('donateStatus').style.display = 'flex';
            document.getElementById('freeVersionBadge').style.display = 'none';
            document.getElementById('unlockFeaturesMessage').style.display = 'none';
            document.getElementById('activationCodeSection').style.display = 'none';
            
            if (document.getElementById('exportPngBtn')) document.getElementById('exportPngBtn').disabled = false;
            if (document.getElementById('exportPdfBtn')) document.getElementById('exportPdfBtn').disabled = false;
        } else {
            window.isDonated = false;
            document.getElementById('donateBanner').style.display = 'flex';
            document.getElementById('donateStatus').style.display = 'none';
            document.getElementById('freeVersionBadge').style.display = 'inline-block';
            document.getElementById('unlockFeaturesMessage').style.display = 'block';
            document.getElementById('activationCodeSection').style.display = 'block';
            
            if (document.getElementById('exportPngBtn')) document.getElementById('exportPngBtn').disabled = true;
            if (document.getElementById('exportPdfBtn')) document.getElementById('exportPdfBtn').disabled = true;
        }
    } catch(e) {
        console.warn('Donation check error:', e);
    }
}

function activateDonation() {
    window.isDonated = true;
    try {
        localStorage.setItem('label_donated', 'true');
    } catch(e) {}
    
    checkDonationStatus();
    document.getElementById('donateModal').classList.remove('active');
    document.getElementById('autosaveStatus').textContent = '✅ Полная версия активирована! Спасибо!';
}

function generateActivationCode(amount) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function isValidCode(code) {
    return validActivationCodes.hasOwnProperty(code.toUpperCase());
}

function initDonate() {
    // Открытие модального окна
    const openBtn = document.getElementById('openDonateModalBtn');
    const unlockBtn = document.getElementById('unlockDonateBtn');
    
    if (openBtn) openBtn.addEventListener('click', () => {
        document.getElementById('donateModal').classList.add('active');
    });
    
    if (unlockBtn) unlockBtn.addEventListener('click', () => {
        document.getElementById('donateModal').classList.add('active');
    });
    
    // Закрытие
    const closeBtn = document.getElementById('closeDonateBtn');
    const laterBtn = document.getElementById('donateLaterBtn');
    const modal = document.getElementById('donateModal');
    
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (laterBtn) laterBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    // Выбор суммы
    const donateOptions = document.querySelectorAll('.donate-option');
    const selectBtn = document.getElementById('selectDonateOptionBtn');
    
    donateOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            donateOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectBtn.disabled = false;
            window.selectedDonateAmount = parseInt(opt.dataset.amount);
        });
    });
    
    if (selectBtn) selectBtn.addEventListener('click', () => {
        document.getElementById('donateOptions').style.display = 'none';
        document.getElementById('paymentDetails').style.display = 'block';
        selectBtn.style.display = 'none';
        document.getElementById('paymentAmount').textContent = window.selectedDonateAmount;
        document.getElementById('paymentPurpose').textContent = 
            window.selectedDonateAmount === 199 ? 'Донат (базовый)' :
            (window.selectedDonateAmount === 499 ? 'Донат (премиум)' : 'Донат (бизнес)');
    });
    
    // Отмена
    const cancelBtn = document.getElementById('cancelDonateBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        document.getElementById('donateOptions').style.display = 'flex';
        document.getElementById('paymentDetails').style.display = 'none';
        selectBtn.style.display = 'inline-block';
        selectBtn.disabled = true;
        document.getElementById('generatedCode').style.display = 'none';
        donateOptions.forEach(o => o.classList.remove('selected'));
    });
    
    // Переход к коду
    const gotCodeBtn = document.getElementById('gotCodeBtn');
    if (gotCodeBtn) gotCodeBtn.addEventListener('click', () => {
        document.getElementById('activationCodeSection').scrollIntoView({ behavior: 'smooth' });
        modal.classList.remove('active');
    });
    
    // Активация по коду
    const activateBtn = document.getElementById('activateCodeBtn');
    if (activateBtn) activateBtn.addEventListener('click', () => {
        const code = document.getElementById('activationCode').value.trim().toUpperCase();
        if (!code) {
            alert('Введите код');
            return;
        }
        if (isValidCode(code)) {
            activateDonation();
            document.getElementById('activationCode').value = '';
            alert('✅ Код активирован! Спасибо за поддержку!');
        } else {
            alert('❌ Неверный код. Проверьте или напишите @nilitary');
        }
    });
}

// ===== ЭКСПОРТ ФУНКЦИЙ =====
window.checkDonationStatus = checkDonationStatus;
window.activateDonation = activateDonation;
window.generateActivationCode = generateActivationCode;
window.isValidCode = isValidCode;
window.initDonate = initDonate;
window.validActivationCodes = validActivationCodes;