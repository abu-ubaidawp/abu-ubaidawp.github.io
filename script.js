// ===== POLITICIAN PROFILE WEBSITE — PUBLIC SCRIPT (Template v2.0) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ===== PRELOADER (runs before async, always) =====
function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hide');
}
setTimeout(hidePreloader, 4500);
if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1500);
} else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 1500));
}

(async () => {
    try {

    // ===== 1. LOAD CONFIG =====
    const config = await fetch('./config.json').then(r => r.json());

    // ===== 2. INIT FIREBASE =====
    const app = initializeApp(config.firebase);
    const db = getDatabase(app);

    // ===== 3. XSS ESCAPE =====
    const esc = (s = '') => String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    // ===== 4. CUSTOM CURSOR =====
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();
    }

    // ===== 5. NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const tickerBar = document.getElementById('tickerBar');
    const scrollTop = document.getElementById('scrollTop');
    tickerBar.style.transition = 'transform 0.3s ease';

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            tickerBar.style.transform = 'translateY(-100%)';
        } else {
            navbar.classList.remove('scrolled');
            tickerBar.style.transform = 'translateY(0)';
        }
        scrollTop.classList.toggle('show', window.scrollY > 400);
        updateActiveNavLink();
    });

    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== 6. ACTIVE NAV LINK =====
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    // ===== 7. MOBILE SIDEBAR =====
    const hamburger = document.getElementById('hamburger');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');

    const openSidebar = () => {
        mobileSidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const closeSidebar = () => {
        mobileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    document.querySelectorAll('.sidebar-links a').forEach(link => link.addEventListener('click', closeSidebar));

    // ===== 8. THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });
    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // ===== 9. HERO PARTICLES =====
    const canvas = document.getElementById('heroParticles');
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.6 + 0.2;
        }
        update() {
            this.y -= this.speedY; this.x += this.speedX;
            if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 162, 39, ${this.opacity})`;
            ctx.fill();
        }
    }
    const particles = Array.from({ length: 80 }, () => new Particle());
    (function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    })();

    // ===== 10. COUNTER ANIMATION — BUG FIXED =====
    // দুটো flag: hero দেখা গেছে কিনা + Firebase stats এসেছে কিনা
    // দুটোই true হলেই counter চলবে, যেটা আগে তৈরি সেটা অপেক্ষা করবে
    let heroInView = false;
    let statsReady = false;

    function animateCounter(el, target) {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        el.textContent = '0+';
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + '+';
            if (current >= target) clearInterval(timer);
        }, 16);
    }

    function tryRunCounters() {
        if (!heroInView || !statsReady) return;
        const yearsEl = document.getElementById('statYears');
        const projEl = document.getElementById('statProjects');
        const yearsTarget = parseInt(yearsEl.dataset.target);
        const projTarget = parseInt(projEl.dataset.target);
        if (!isNaN(yearsTarget)) animateCounter(yearsEl, yearsTarget);
        if (!isNaN(projTarget)) animateCounter(projEl, projTarget);
    }

    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            heroInView = true;
            heroObserver.disconnect();
            tryRunCounters();
        }
    }, { threshold: 0.3 });
    heroObserver.observe(document.querySelector('.hero-stats'));

    // ===== 11. AOS (Intersection Observer) =====
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
                setTimeout(() => entry.target.classList.add('aos-animate'), delay);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

    // ===== 12. RIPPLE EFFECT =====
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = btn.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    // ===== 13. TOAST =====
    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ===== 14. FIREBASE — SITE SETTINGS =====
    onValue(ref(db, 'siteSettings'), (snap) => {
        const d = snap.val();
        if (!d) return;

        const name = d.nameBn || 'দায়িত্বশীলের নাম';
        const party = d.party || 'বাংলাদেশ ইসলামী ছাত্রশিবির';

        document.getElementById('pageTitle').textContent = name + ' — ' + party;
        document.title = name + ' — ' + party;
        document.getElementById('heroName').textContent = name;
        document.getElementById('heroDesignation').textContent = d.designation || 'সাংগঠনিক পদবী';
        document.getElementById('heroParty').textContent = party;
        document.getElementById('heroBadgeText').textContent = party;
        document.getElementById('heroSlogan').textContent = '"' + (d.slogan || 'ইসলাম ও মানবতার সেবায় নিবেদিত') + '"';
        document.getElementById('navName').textContent = name;
        document.getElementById('sidebarName').textContent = name;
        document.getElementById('footerName').textContent = name;
        document.getElementById('footerCopyName').textContent = name;
        document.querySelector('.preloader-name').textContent = name;

        if (d.heroPhoto) document.getElementById('heroPhoto').src = d.heroPhoto;
        if (d.navIcon) {
            document.getElementById('navIcon').textContent = d.navIcon;
            document.getElementById('sidebarIcon').textContent = d.navIcon;
            document.getElementById('footerIcon').textContent = d.navIcon;
        }
        if (d.faviconUrl) {
            document.getElementById('favicon').href = d.faviconUrl;
            document.getElementById('faviconShort').href = d.faviconUrl;
            document.getElementById('faviconApple').href = d.faviconUrl;
        }
        if (d.metaDesc) {
            document.getElementById('metaDesc').content = d.metaDesc;
            document.getElementById('ogDesc').content = d.metaDesc;
            document.getElementById('twDesc').content = d.metaDesc;
        }
        if (d.heroPhoto) {
            document.getElementById('ogImage').content = d.heroPhoto;
            document.getElementById('twImage').content = d.heroPhoto;
        }
        // meta title tags
        const fullTitle = name + ' | ' + (d.designation || '') + ' | ' + party;
        document.getElementById('metaTitle').content = fullTitle;
        document.getElementById('ogTitle').content = fullTitle;
        document.getElementById('twTitle').content = fullTitle;
    });

    // ===== 15. FIREBASE — STATS (counter fix এখানে) =====
    onValue(ref(db, 'stats'), (snap) => {
        const d = snap.val();
        if (!d) return;

        const yearsEl = document.getElementById('statYears');
        const projEl = document.getElementById('statProjects');

        // data-target set করো, counter পরে চলবে
        if (d.yearsActive) yearsEl.dataset.target = d.yearsActive;
        if (d.projects) projEl.dataset.target = d.projects;
        if (d.constituency) document.getElementById('statConstituency').textContent = d.constituency;
        if (d.followers) document.getElementById('statFollowers').textContent = d.followers;
        if (d.yearsLabel) document.getElementById('statYearsLabel').textContent = d.yearsLabel;

        // Firebase data ready, now try counter
        statsReady = true;
        tryRunCounters();
    });

    // ===== 16. FIREBASE — ABOUT =====
    onValue(ref(db, 'about'), (snap) => {
        const d = snap.val();
        if (!d) return;
        document.getElementById('aboutBio').textContent = d.bio || '';
        if (d.photo) document.getElementById('aboutPhoto').src = d.photo;
        document.getElementById('aboutBirth').textContent = d.birthDate || '—';
        document.getElementById('aboutPlace').textContent = d.birthPlace || '—';
        document.getElementById('aboutEdu').textContent = d.education || '—';
        document.getElementById('aboutProfession').textContent = d.profession || '—';
        document.getElementById('aboutParty').textContent = d.party || '—';

        // About social links
        if (d.facebook) document.getElementById('aboutFb').href = d.facebook;
        if (d.youtube) document.getElementById('aboutYt').href = d.youtube;
        if (d.twitter) document.getElementById('aboutTw').href = d.twitter;

        // ✅ BUG FIX: Footer social links — admin 'about' node-এ save করে
        if (d.facebook) document.getElementById('footerFb').href = d.facebook;
        if (d.youtube) document.getElementById('footerYt').href = d.youtube;
        if (d.twitter) document.getElementById('footerTw').href = d.twitter;
    });

    // ===== 17. FIREBASE — TICKER =====
    onValue(ref(db, 'ticker'), (snap) => {
        const d = snap.val();
        const container = document.getElementById('tickerContent');
        if (!d) { container.innerHTML = '<span>📢 কোনো নোটিশ নেই</span>'; return; }
        let html = '';
        Object.values(d).forEach(item => {
            if (item.active) html += `<span>${esc(item.text)}</span>`;
        });
        if (!html) html = '<span>📢 কোনো নোটিশ নেই</span>';
        container.innerHTML = html + html; // duplicate for seamless scroll
    });

    // ===== 18. FIREBASE — NEWS =====
    let allNews = [];
    onValue(ref(db, 'news'), (snap) => {
        const d = snap.val();
        const grid = document.getElementById('newsGrid');
        if (!d) {
            grid.innerHTML = '<div class="news-placeholder"><i class="fas fa-newspaper"></i><p>কোনো পোস্ট নেই</p></div>';
            return;
        }
        allNews = Object.values(d).filter(item => item.active);
        renderNews('all');
    });

    function renderNews(filter) {
        const grid = document.getElementById('newsGrid');
        const filtered = filter === 'all' ? allNews : allNews.filter(n => n.category === filter);
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="news-placeholder"><i class="fas fa-newspaper"></i><p>এই ক্যাটাগরিতে কোনো পোস্ট নেই</p></div>';
            return;
        }
        grid.innerHTML = filtered.map(item => `
            <div class="news-card" data-aos="fade-up">
                <img src="${esc(item.imageUrl || 'https://via.placeholder.com/400x200?text=News')}"
                     alt="${esc(item.title)}" class="news-card-img"
                     onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
                <div class="news-card-body">
                    <div class="news-card-date"><i class="fas fa-calendar-alt"></i> ${esc(item.date || '')}</div>
                    <h3 class="news-card-title">${esc(item.title)}</h3>
                    <p class="news-card-text">${esc(item.body)}</p>
                    ${item.link ? `<a href="${esc(item.link)}" target="_blank" class="news-card-link">বিস্তারিত পড়ুন <i class="fas fa-arrow-right"></i></a>` : ''}
                </div>
            </div>
        `).join('');
        grid.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));
    }

    document.getElementById('newsFilters').addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;
        document.querySelectorAll('#newsFilters .filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderNews(e.target.getAttribute('data-filter'));
    });

    // ===== 19. FIREBASE — GALLERY =====
    let allGallery = [];
    onValue(ref(db, 'gallery'), (snap) => {
        const d = snap.val();
        const grid = document.getElementById('galleryGrid');
        if (!d) {
            grid.innerHTML = '<div class="news-placeholder"><i class="fas fa-images"></i><p>কোনো ছবি নেই</p></div>';
            return;
        }
        allGallery = Object.values(d).filter(item => item.active);
        renderGallery('all');
    });

    function renderGallery(filter) {
        const grid = document.getElementById('galleryGrid');
        const filtered = filter === 'all' ? allGallery : allGallery.filter(g => g.category === filter);
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="news-placeholder"><i class="fas fa-images"></i><p>এই ক্যাটাগরিতে কোনো ছবি নেই</p></div>';
            return;
        }
        grid.innerHTML = filtered.map(item => `
            <div class="gallery-item" data-aos="zoom-in"
                 onclick="window._openLightbox('${esc(item.url)}', '${esc(item.title || '')}')">
                <img src="${esc(item.url)}" alt="${esc(item.title || 'Gallery Photo')}"
                     onerror="this.parentElement.style.display='none'">
                <div class="gallery-item-overlay">${esc(item.title || '')}</div>
            </div>
        `).join('');
        grid.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));
    }

    document.getElementById('galleryFilters').addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;
        document.querySelectorAll('#galleryFilters .filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderGallery(e.target.getAttribute('data-filter'));
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    window._openLightbox = function(url, title) {
        lightboxImg.src = url;
        lightboxCaption.textContent = title;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    // ===== 20. FIREBASE — CONTACT =====
    onValue(ref(db, 'contact'), (snap) => {
        const d = snap.val();
        if (!d) return;
        document.getElementById('contactAddress').textContent = d.address || '—';
        document.getElementById('contactPhone').textContent = d.phone || '—';
        document.getElementById('contactEmail').textContent = d.email || '—';
        document.getElementById('contactHours').textContent = d.hours || '—';
        if (d.mapUrl) document.getElementById('contactMap').src = d.mapUrl;
        if (d.whatsapp) document.getElementById('floatWhatsApp').href = `https://wa.me/${d.whatsapp}`;
        if (d.callNumber) document.getElementById('floatCall').href = `tel:${d.callNumber}`;
        document.getElementById('footerAddress').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${esc(d.addressShort || d.address || '')}`;
        document.getElementById('footerPhone').innerHTML = `<i class="fas fa-phone-alt"></i> ${esc(d.phoneShort || d.phone || '')}`;
        document.getElementById('footerEmail').innerHTML = `<i class="fas fa-envelope"></i> ${esc(d.email || '')}`;
    });

    // ===== 21. CONTACT FORM SUBMIT =====
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('msgName').value.trim();
        const phone = document.getElementById('msgPhone').value.trim();
        const subject = document.getElementById('msgSubject').value.trim();
        const message = document.getElementById('msgBody').value.trim();

        if (!name || !phone || !subject || !message) {
            showToast('⚠️ সকল ঘর পূরণ করুন');
            return;
        }
        try {
            await push(ref(db, 'messages'), {
                name, phone, subject, message,
                createdAt: Date.now(),
                dateText: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
            });
            showToast('✅ আপনার বার্তা সফলভাবে পাঠানো হয়েছে!');
            e.target.reset();
        } catch (err) {
            showToast('❌ বার্তা পাঠাতে সমস্যা হয়েছে।');
            console.error(err);
        }
    });

    // ===== 22. FOOTER YEAR =====
    document.getElementById('footerYear').textContent = new Date().getFullYear();

    } catch(err) {
        console.error('Script error:', err);
        document.getElementById('preloader')?.classList.add('hide');
    }
})();
