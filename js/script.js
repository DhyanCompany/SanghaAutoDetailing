const ownerEmail = "sanghaautodetailing@gmail.com";
const ownerPhone = "16473239286";
let cart = [];

function initScrollAnimations() {
    const animated = document.querySelectorAll(".animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale");

    if (!("IntersectionObserver" in window)) {
        animated.forEach((el) => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    animated.forEach((el) => observer.observe(el));
}

function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem("sanghaCart")) || [];
    } catch (error) {
        cart = [];
    }
    updateCartCount();
}

function saveCart() {
    localStorage.setItem("sanghaCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
        el.textContent = totalItems;
    });
}

function addToCart(item) {
    const existing = cart.find((cartItem) => cartItem.id === item.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    showNotification(`${item.name} added to booking cart.`);
}

function removeFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    saveCart();
    displayCartItems();
}

function clearCart() {
    cart = [];
    saveCart();
}

function displayCartItems() {
    const cartList = document.getElementById("cart-items-list");
    const cartTotal = document.getElementById("cart-total");
    const emptyCartMsg = document.getElementById("empty-cart");

    if (!cartList || !cartTotal) return;

    cartList.innerHTML = "";

    if (cart.length === 0) {
        if (emptyCartMsg) emptyCartMsg.style.display = "block";
        cartTotal.textContent = "$0";
        return;
    }

    if (emptyCartMsg) emptyCartMsg.style.display = "none";

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cart.forEach((item) => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <span class="cart-item-name">${item.name} x${item.quantity}</span>
            <span class="cart-item-price">$${item.price * item.quantity}</span>
            <button class="cart-item-remove" type="button" data-id="${item.id}" aria-label="Remove ${item.name}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartList.appendChild(li);
    });

    cartTotal.textContent = `$${total}`;

    document.querySelectorAll(".cart-item-remove").forEach((button) => {
        button.addEventListener("click", () => removeFromCart(button.dataset.id));
    });
}

function encodeMessage(message) {
    return encodeURIComponent(message);
}

function buildContactMessage(data) {
    return [
        "Hi Sangha Auto Detailing, I would like to request a detailing service.",
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Package: ${data.packageName}`,
        `Details: ${data.details || "No extra details provided."}`
    ].join("\n");
}

function buildBookingMessage(data) {
    return [
        "Hi Sangha Auto Detailing, I would like to book a mobile detailing appointment.",
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Service: ${data.service}`,
        `Vehicle Size: ${data.carSize}`,
        `Preferred Date: ${data.date}`,
        `Preferred Time: ${data.time}`,
        `Address: ${data.address}`,
        `Promo Code: ${data.promo || "None"}`,
        `Notes: ${data.message || "None"}`,
        `Estimated Cart Total: ${data.total}`
    ].join("\n");
}

function whatsappUrl(message) {
    return `https://wa.me/${ownerPhone}?text=${encodeMessage(message)}`;
}

function emailUrl(subject, message) {
    return `mailto:${ownerEmail}?subject=${encodeMessage(subject)}&body=${encodeMessage(message)}`;
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function copyText(message) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = message;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 84px;
        right: 16px;
        max-width: min(360px, calc(100vw - 32px));
        z-index: 2000;
        padding: 0.9rem 1rem;
        border: 1px solid rgba(37, 211, 102, 0.35);
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(37, 211, 102, 0.96), rgba(20, 145, 72, 0.96));
        color: white;
        font-weight: 800;
        box-shadow: 0 18px 42px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.28s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3200);
}

function setButtonProgress(button, doneText) {
    if (!button) return;

    const originalHtml = button.innerHTML;
    button.disabled = true;
    button.classList.add("is-loading");
    button.innerHTML = '<span class="button-spinner" aria-hidden="true"></span> Preparing';

    setTimeout(() => {
        button.classList.remove("is-loading");
        button.classList.add("is-done");
        button.innerHTML = `<i class="fas fa-check"></i> ${doneText}`;
    }, 420);

    setTimeout(() => {
        button.disabled = false;
        button.classList.remove("is-done");
        button.innerHTML = originalHtml;
    }, 1900);
}

function initCartButtons() {
    document.querySelectorAll(".btn-add-to-cart").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            addToCart({
                id: button.dataset.id,
                name: button.dataset.name,
                price: Number(button.dataset.price)
            });
        });
    });
}

function initContactComposer() {
    const form = document.getElementById("contactComposer");
    if (!form) return;

    const panel = document.getElementById("preparedPanel");
    const messageOutput = document.getElementById("preparedMessage");
    const whatsAppLink = document.getElementById("preparedWhatsApp");
    const emailLink = document.getElementById("preparedEmail");
    const copyButton = document.getElementById("copyPreparedMessage");
    let preparedMessage = "";

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        setButtonProgress(form.querySelector("button[type='submit']"), "Message Ready");

        preparedMessage = buildContactMessage({
            name: document.getElementById("contact-name").value.trim(),
            email: document.getElementById("contact-email").value.trim(),
            phone: document.getElementById("contact-phone").value.trim(),
            packageName: document.getElementById("contact-package").value,
            details: document.getElementById("contact-details").value.trim()
        });

        messageOutput.textContent = preparedMessage;
        whatsAppLink.href = whatsappUrl(preparedMessage);
        emailLink.href = emailUrl("Detailing Service Request", preparedMessage);
        panel.classList.add("is-visible");
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        showNotification("Message prepared. Choose WhatsApp, email, copy, or call.");
    });

    copyButton.addEventListener("click", async () => {
        if (!preparedMessage) return;
        await copyText(preparedMessage);
        showNotification("Message copied.");
    });
}

function initBookingForm() {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    const success = document.getElementById("bookingSuccess");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        setButtonProgress(form.querySelector("button[type='submit']"), "Request Ready");

        const cartItems = cart.map((item) => `${item.name} x${item.quantity}`).join(", ");
        const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const selectedService = document.getElementById("book-service").value;

        const bookingMessage = buildBookingMessage({
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            service: cartItems || selectedService || "Not specified",
            carSize: document.getElementById("car-size").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            address: document.getElementById("address").value.trim(),
            promo: document.getElementById("promo").value.trim(),
            message: document.getElementById("message").value.trim(),
            total: cartItems ? `$${cartTotal}` : "To be confirmed"
        });

        const safeBookingMessage = escapeHtml(bookingMessage).replace(/\n/g, "<br>");

        success.innerHTML = `
            <h3>Booking request prepared.</h3>
            <p>Send it through WhatsApp or email so we can confirm your appointment.</p>
            <div class="prepared-message">${safeBookingMessage}</div>
            <div class="prepared-actions">
                <a class="btn btn-whatsapp" href="${whatsappUrl(bookingMessage)}" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i> Send via WhatsApp</a>
                <a class="btn btn-secondary" href="${emailUrl("Mobile Detailing Booking Request", bookingMessage)}"><i class="fas fa-envelope"></i> Send via Email</a>
                <button id="copyBookingMessage" type="button" class="btn btn-ghost"><i class="fas fa-copy"></i> Copy Message</button>
            </div>
        `;
        success.style.display = "block";
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });

        const copyButton = document.getElementById("copyBookingMessage");
        copyButton.addEventListener("click", async () => {
            await copyText(bookingMessage);
            showNotification("Booking message copied.");
        });
    });
}

function initQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const promo = params.get("promo");
    const plan = params.get("plan");
    const promoInput = document.getElementById("promo");
    const serviceSelect = document.getElementById("book-service");

    if (promo && promoInput) {
        promoInput.value = promo.toUpperCase();
    }

    if (plan === "membership" && serviceSelect) {
        serviceSelect.value = "Monthly Membership";
    }
}

function initMobileNavClose() {
    const toggle = document.getElementById("nav-toggle");
    if (!toggle) return;

    document.querySelectorAll(".navbar a").forEach((link) => {
        link.addEventListener("click", () => {
            toggle.checked = false;
        });
    });
}

function initBubbleParallax() {
    const bubbleLayer = document.querySelector(".soap-bubbles");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!bubbleLayer || prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameRequested = false;

    function render() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        bubbleLayer.style.setProperty("--bubble-shift-x", `${currentX.toFixed(2)}px`);
        bubbleLayer.style.setProperty("--bubble-shift-y", `${currentY.toFixed(2)}px`);

        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
            requestAnimationFrame(render);
        } else {
            frameRequested = false;
        }
    }

    function updateFromPoint(clientX, clientY) {
        const x = clientX / window.innerWidth - 0.5;
        const y = clientY / window.innerHeight - 0.5;
        targetX = x * -28;
        targetY = y * -22;

        if (!frameRequested) {
            frameRequested = true;
            requestAnimationFrame(render);
        }
    }

    window.addEventListener("pointermove", (event) => updateFromPoint(event.clientX, event.clientY), { passive: true });
    window.addEventListener("deviceorientation", (event) => {
        if (typeof event.gamma !== "number" || typeof event.beta !== "number") return;
        targetX = Math.max(-18, Math.min(18, event.gamma * -0.8));
        targetY = Math.max(-14, Math.min(14, (event.beta - 45) * -0.35));

        if (!frameRequested) {
            frameRequested = true;
            requestAnimationFrame(render);
        }
    }, { passive: true });
}

function initCoverflow() {
    const coverflow = document.querySelector("[data-coverflow]");
    if (!coverflow) return;

    const cards = Array.from(coverflow.querySelectorAll(".coverflow-card"));
    const dots = Array.from(coverflow.querySelectorAll("[data-coverflow-dot]"));
    const prevButton = coverflow.querySelector("[data-coverflow-prev]");
    const nextButton = coverflow.querySelector("[data-coverflow-next]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeIndex = 0;
    let autoTimer;
    let touchStartX = 0;

    function orbitOffset(cardIndex) {
        const rawOffset = cardIndex - activeIndex;
        const half = cards.length / 2;
        if (rawOffset > half) return rawOffset - cards.length;
        if (rawOffset < -half) return rawOffset + cards.length;
        return rawOffset;
    }

    function setActive(index) {
        activeIndex = (index + cards.length) % cards.length;

        cards.forEach((card, cardIndex) => {
            card.classList.remove("is-active", "is-prev", "is-next", "is-back");
            const offset = orbitOffset(cardIndex);
            const angle = offset * 120;
            const angleRad = angle * Math.PI / 180;
            const radiusX = Math.min(window.innerWidth * 0.32, 360);
            const radiusZ = 270;
            const x = Math.sin(angleRad) * radiusX;
            const z = Math.cos(angleRad) * radiusZ;
            const y = Math.abs(offset) * 18;
            const scale = offset === 0 ? 1 : 0.74;
            const opacity = offset === 0 ? 1 : 0.42;
            const rotateY = -angle * 0.72;
            const blur = offset === 0 ? 0 : 0.7;
            const zIndex = Math.round(z + 400);

            card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
            card.style.filter = `blur(${blur}px) saturate(${offset === 0 ? 1 : 0.78})`;
            card.style.pointerEvents = offset === 0 ? "auto" : "none";

            if (cardIndex === activeIndex) {
                card.classList.add("is-active");
            } else if (cardIndex === (activeIndex + cards.length - 1) % cards.length) {
                card.classList.add("is-prev");
            } else if (cardIndex === (activeIndex + 1) % cards.length) {
                card.classList.add("is-next");
            } else {
                card.classList.add("is-back");
            }
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
    }

    function restartAuto() {
        if (prefersReducedMotion) return;
        clearInterval(autoTimer);
        autoTimer = setInterval(() => setActive(activeIndex + 1), 5200);
    }

    prevButton?.addEventListener("click", () => {
        setActive(activeIndex - 1);
        restartAuto();
    });

    nextButton?.addEventListener("click", () => {
        setActive(activeIndex + 1);
        restartAuto();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            setActive(Number(dot.dataset.coverflowDot));
            restartAuto();
        });
    });

    coverflow.addEventListener("pointerdown", (event) => {
        touchStartX = event.clientX;
    }, { passive: true });

    coverflow.addEventListener("pointerup", (event) => {
        const deltaX = event.clientX - touchStartX;
        if (Math.abs(deltaX) < 40) return;
        setActive(activeIndex + (deltaX < 0 ? 1 : -1));
        restartAuto();
    }, { passive: true });

    coverflow.addEventListener("mouseenter", () => clearInterval(autoTimer));
    coverflow.addEventListener("mouseleave", restartAuto);
    window.addEventListener("resize", () => setActive(activeIndex), { passive: true });

    setActive(0);
    restartAuto();
}

function initThemeToggle() {
    const toggles = document.querySelectorAll("[data-theme-toggle]");
    const savedTheme = localStorage.getItem("sanghaTheme");
    const initialTheme = savedTheme || "dark";

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("sanghaTheme", theme);
        toggles.forEach((toggle) => {
            toggle.innerHTML = theme === "light" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            toggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
        });
    }

    applyTheme(initialTheme);

    toggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
            applyTheme(nextTheme);
        });
    });
}

function initMagneticButtons() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReducedMotion || !canHover) return;

    const magneticItems = document.querySelectorAll(".btn, .btn-add-to-cart, .btn-addon, .coverflow-btn, .theme-toggle");

    magneticItems.forEach((item) => {
        item.addEventListener("pointermove", (event) => {
            const rect = item.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            item.style.transform = `translate(${(x * 0.14).toFixed(1)}px, ${(y * 0.18).toFixed(1)}px)`;
        });

        item.addEventListener("pointerleave", () => {
            item.style.transform = "";
        });
    });
}

function initCustomCursor() {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || prefersReducedMotion) return;

    const cursor = document.createElement("div");
    cursor.className = "bubble-cursor";
    document.body.appendChild(cursor);
    document.body.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let currentX = x;
    let currentY = y;

    function render() {
        currentX += (x - currentX) * 0.22;
        currentY += (y - currentY) * 0.22;
        cursor.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
        requestAnimationFrame(render);
    }

    window.addEventListener("pointermove", (event) => {
        x = event.clientX;
        y = event.clientY;
    }, { passive: true });

    document.querySelectorAll("a, button, .coverflow-card").forEach((item) => {
        item.addEventListener("pointerenter", () => cursor.classList.add("is-expanded"));
        item.addEventListener("pointerleave", () => cursor.classList.remove("is-expanded"));
    });

    requestAnimationFrame(render);
}

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    loadCart();
    initScrollAnimations();
    initCartButtons();
    initContactComposer();
    initBookingForm();
    initQueryParams();
    initMobileNavClose();
    initBubbleParallax();
    initCoverflow();
    initMagneticButtons();
    initCustomCursor();
    displayCartItems();
});
