document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('reservationForm');
    const modal = document.getElementById('modalOverlay');
    const summary = document.getElementById('bookingSummary');
    const submitBtn = document.getElementById('submitBtn');

    /* ============ VALIDATION HELPERS ============ */
    function showError(inputId, errId, msg) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errId);
        if (input) input.classList.add('invalid');
        if (err) err.textContent = msg;
    }

    function clearError(inputId, errId) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errId);
        if (input) input.classList.remove('invalid');
        if (err) err.textContent = '';
    }

    /* ============ VALIDATE FORM ============ */
    function validateForm() {
        let valid = true;

        // Name
        const name = document.getElementById('name').value.trim();
        if (name.length < 3) {
            showError('name', 'errName', 'Please enter your full name (min 3 chars)');
            valid = false;
        } else clearError('name', 'errName');

        // Phone (11 digits, starts with 01)
        const phone = document.getElementById('phone').value.trim();
        if (!/^01[0-9]{9}$/.test(phone)) {
            showError('phone', 'errPhone', 'Phone must be 11 digits starting with 01');
            valid = false;
        } else clearError('phone', 'errPhone');

        // Email
        const email = document.getElementById('email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'errEmail', 'Please enter a valid email');
            valid = false;
        } else clearError('email', 'errEmail');

        // Date (not in past)
        const date = document.getElementById('date').value;
        if (!date) {
            showError('date', 'errDate', 'Please select a date');
            valid = false;
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selected = new Date(date);
            if (selected < today) {
                showError('date', 'errDate', 'Date cannot be in the past');
                valid = false;
            } else clearError('date', 'errDate');
        }

        // Time
        const time = document.getElementById('time').value;
        if (!time) {
            showError('time', 'errTime', 'Please select a time');
            valid = false;
        } else clearError('time', 'errTime');

        // Persons
        const persons = document.getElementById('persons').value;
        if (!persons) {
            showError('persons', 'errPersons', 'Please select number of guests');
            valid = false;
        } else clearError('persons', 'errPersons');

        // Terms
        const terms = document.getElementById('terms').checked;
        if (!terms) {
            document.getElementById('errTerms').textContent = 'You must agree to the terms';
            valid = false;
        } else {
            document.getElementById('errTerms').textContent = '';
        }

        return valid;
    }

    /* ============ BUILD MESSAGE ============ */
    function buildMessage(data) {
        return `🍽️ *New Table Reservation*%0A%0A` +
            `👤 *Name:* ${data.name}%0A` +
            `📞 *Phone:* ${data.phone}%0A` +
            `📧 *Email:* ${data.email}%0A` +
            `📅 *Date:* ${data.date}%0A` +
            `🕐 *Time:* ${data.time}%0A` +
            `👥 *Guests:* ${data.persons}%0A` +
            `🪑 *Table:* ${data.tableType}%0A` +
            `🎉 *Occasion:* ${data.occasion}%0A` +
            `${data.promo ? '🎟️ *Promo:* ' + data.promo + '%0A' : ''}` +
            `${data.notes ? '📝 *Notes:* ' + data.notes : ''}`;
    }

    /* ============ SUBMIT ============ */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const data = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            persons: document.getElementById('persons').value,
            tableType: document.getElementById('tableType').value,
            occasion: document.getElementById('occasion').value,
            promo: document.getElementById('promo').value.trim(),
            notes: document.getElementById('notes').value.trim()
        };

        /* نعرض المودال */
        summary.innerHTML = `
            <strong>Name:</strong> ${data.name}<br>
            <strong>Phone:</strong> ${data.phone}<br>
            <strong>Email:</strong> ${data.email}<br>
            <strong>Date:</strong> ${data.date}<br>
            <strong>Time:</strong> ${data.time}<br>
            <strong>Guests:</strong> ${data.persons}<br>
            <strong>Table:</strong> ${data.tableType}<br>
            <strong>Occasion:</strong> ${data.occasion}
        `;

        modal.classList.add('active');

        sendToWhatsApp(data);

        setTimeout(() => form.reset(), 2000);
    });

    /* ============ WHATSAPP ============ */
    function sendToWhatsApp(data) {
        // ⚠️ حط رقمك هنا (بصيغة دولية بدون + أو 00)
        const restaurantPhone = '201234567890';
        const message = buildMessage(data);
        const url = `https://wa.me/${restaurantPhone}?text=${message}`;

        console.log('WhatsApp URL:', url);

        // لو عايز واتساب يفتح أوتوماتيك بعد الحجز، شيل التعليق:
        // window.open(url, '_blank');
    }

    /* ============ CLOSE MODAL ============ */
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
});
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('orderForm');
    const modal = document.getElementById('modalOverlay');
    const summary = document.getElementById('bookingSummary');
    const submitBtn = document.getElementById('submitBtn');

    /* ============================================
       ORDER STATE
    ============================================ */
    let order = []; // [{ id, name, price, qty }]

    /* ============ VALIDATION HELPERS ============ */
    function showError(inputId, errId, msg) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errId);
        if (input) input.classList.add('invalid');
        if (err) err.textContent = msg;
    }

    function clearError(inputId, errId) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errId);
        if (input) input.classList.remove('invalid');
        if (err) err.textContent = '';
    }

    /* ============================================
       DISHES — ADD / REMOVE / UPDATE
    ============================================ */
    function renderOrder() {
        const list = document.getElementById('orderList');
        const total = document.getElementById('orderTotal');
        const sec = document.getElementById('orderSummarySection');

        if (order.length === 0) {
            sec.style.display = 'none';
            return;
        }

        sec.style.display = 'block';
        list.innerHTML = '';

        let sum = 0;

        order.forEach(item => {
            sum += item.price * item.qty;

            const row = document.createElement('div');
            row.className = 'order-item';
            row.innerHTML = `
                <div class="order-item-info">
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-price">$${item.price.toFixed(2)} each</span>
                </div>
                <div class="order-item-controls">
                    <button type="button" class="qty-btn minus" data-id="${item.id}">−</button>
                    <span class="qty">${item.qty}</span>
                    <button type="button" class="qty-btn plus" data-id="${item.id}">+</button>
                    <button type="button" class="remove-btn" data-id="${item.id}">✕</button>
                </div>
            `;
            list.appendChild(row);
        });

        total.textContent = '$' + sum.toFixed(2);

        // ربط أزرار التحكم
        list.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', () => changeQty(+btn.dataset.id, +1));
        });
        list.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', () => changeQty(+btn.dataset.id, -1));
        });
        list.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => removeItem(+btn.dataset.id));
        });
    }

    function addItem(id, name, price) {
        const existing = order.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            order.push({ id, name, price, qty: 1 });
        }
        renderOrder();
        document.getElementById('errDishes').textContent = '';
    }

    function changeQty(id, delta) {
        const item = order.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) removeItem(id);
        else renderOrder();
    }

    function removeItem(id) {
        order = order.filter(item => item.id !== id);
        renderOrder();
    }

    /* ربط أزرار "Add +" على كروت الأطباق */
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.dish-card');
            const id = +card.dataset.id;
            const name = card.dataset.name;
            const price = +card.dataset.price;
            addItem(id, name, price);

            // feedback بصري
            btn.textContent = 'Added ✓';
            btn.classList.add('added');
            setTimeout(() => {
                btn.textContent = 'Add +';
                btn.classList.remove('added');
            }, 900);
        });
    });

    /* ============ VALIDATE FORM ============ */
    function validateForm() {
        let valid = true;

        // Name
        const name = document.getElementById('name').value.trim();
        if (name.length < 3) {
            showError('name', 'errName', 'Please enter your full name (min 3 chars)');
            valid = false;
        } else clearError('name', 'errName');

        // Phone
        const phone = document.getElementById('phone').value.trim();
        if (!/^01[0-9]{9}$/.test(phone)) {
            showError('phone', 'errPhone', 'Phone must be 11 digits starting with 01');
            valid = false;
        } else clearError('phone', 'errPhone');

        // Email
        const email = document.getElementById('email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'errEmail', 'Please enter a valid email');
            valid = false;
        } else clearError('email', 'errEmail');

        // Dishes (على الأقل طبق واحد)
        if (order.length === 0) {
            document.getElementById('errDishes').textContent = 'Please select at least one dish';
            valid = false;
        } else {
            document.getElementById('errDishes').textContent = '';
        }

        // Date
        const date = document.getElementById('date').value;
        if (!date) {
            showError('date', 'errDate', 'Please select a date');
            valid = false;
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selected = new Date(date);
            if (selected < today) {
                showError('date', 'errDate', 'Date cannot be in the past');
                valid = false;
            } else clearError('date', 'errDate');
        }

        // Time
        const time = document.getElementById('time').value;
        if (!time) {
            showError('time', 'errTime', 'Please select a time');
            valid = false;
        } else clearError('time', 'errTime');

        // Terms
        const terms = document.getElementById('terms').checked;
        if (!terms) {
            document.getElementById('errTerms').textContent = 'You must agree to the terms';
            valid = false;
        } else {
            document.getElementById('errTerms').textContent = '';
        }

        return valid;
    }

    /* ============ BUILD MESSAGE ============ */
    function buildMessage(data) {
        let msg = `🍽️ *New Food Order*%0A%0A`;
        msg += `👤 *Name:* ${data.name}%0A`;
        msg += `📞 *Phone:* ${data.phone}%0A`;
        msg += `📧 *Email:* ${data.email}%0A`;
        msg += `%0A🛒 *Order:*%0A`;

        let total = 0;
        data.items.forEach(item => {
            const sub = item.price * item.qty;
            total += sub;
            msg += `• ${item.name} × ${item.qty} = $${sub.toFixed(2)}%0A`;
        });

        msg += `%0A💰 *Total:* $${total.toFixed(2)}%0A`;
        msg += `📅 *Pickup:* ${data.date} at ${data.time}%0A`;
        msg += `🎉 *Occasion:* ${data.occasion}%0A`;

        if (data.promo) msg += `🎟️ *Promo:* ${data.promo}%0A`;
        if (data.notes) msg += `📝 *Notes:* ${data.notes}`;

        return msg;
    }

    /* ============ SUBMIT ============ */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // scroll لأول خطأ
            const firstErr = document.querySelector('.invalid');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const data = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            occasion: document.getElementById('occasion').value,
            promo: document.getElementById('promo').value.trim(),
            notes: document.getElementById('notes').value.trim(),
            items: order.map(i => ({...i }))
        };

        /* بناء ملخص المودال */
        let itemsHtml = '';
        let total = 0;
        data.items.forEach(item => {
            const sub = item.price * item.qty;
            total += sub;
            itemsHtml += `<strong>${item.name}</strong> × ${item.qty} = $${sub.toFixed(2)}<br>`;
        });

        summary.innerHTML = `
            <strong>Name:</strong> ${data.name}<br>
            <strong>Phone:</strong> ${data.phone}<br>
            <strong>Email:</strong> ${data.email}<br>
            <strong>Pickup:</strong> ${data.date} at ${data.time}<br>
            <hr style="margin:10px 0;border:none;border-top:1px dashed #ccc;">
            ${itemsHtml}
            <hr style="margin:10px 0;border:none;border-top:1px dashed #ccc;">
            <strong>Total:</strong> $${total.toFixed(2)}
        `;

        modal.classList.add('active');

        sendToWhatsApp(data);

        // نفضّي الفورم
        setTimeout(() => {
            form.reset();
            order = [];
            renderOrder();
        }, 2000);
    });

    /* ============ WHATSAPP ============ */
    function sendToWhatsApp(data) {
        const restaurantPhone = '201234567890'; // ← حط رقمك
        const message = buildMessage(data);
        const url = `https://wa.me/${restaurantPhone}?text=${message}`;

        console.log('WhatsApp URL:', url);

        // window.open(url, '_blank');
    }

    /* ============ CLOSE MODAL ============ */
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
});