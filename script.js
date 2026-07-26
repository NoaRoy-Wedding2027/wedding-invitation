// ==========================================
// 1. הגדרות Supabase
// ==========================================
const SUPABASE_URL = 'https://hmafronrwuxjizfkhxju.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lTp_YIawnPvil699Ikc_Sw_5KnnJZPp';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. טיימר ספירה לאחור (06/01/2027 בשעה 19:30)
// ==========================================
const weddingDate = new Date('2027-01-06T19:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        const container = document.querySelector('.countdown-container');
        if (container) {
            container.innerHTML = '<div class="countdown-title">🎉 היום זה היום! 🎉</div>';
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
}

// הפעלת הטיימר בלולאה קבועה
updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================
// 3. ניהול הצגת/הסתרת שדה כמות המוזמנים
// ==========================================
function toggleCountField(show) {
    const countGroup = document.getElementById('countGroup');
    if (countGroup) {
        if (show) {
            countGroup.classList.remove('hidden');
        } else {
            countGroup.classList.add('hidden');
        }
    }
}

// ==========================================
// 4. שליחת הטופס ל-Supabase ופופ-אפ
// ==========================================
async function submitRSVP(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = 'שולח...';

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const attendingStatus = document.querySelector('input[name="attending"]:checked').value;
    const count = attendingStatus === 'yes' ? parseInt(document.getElementById('count').value) : 0;
    const notes = document.getElementById('notes').value;

    try {
        const { data, error } = await supabaseClient
            .from('rsvps')
            .insert([{ name, phone, attending: attendingStatus, count, notes }]);

        if (error) throw error;

        // הודעת תודה מותאמת אישית לפי תגובת האורח
        if (attendingStatus === 'yes') {
            showModal('🎉 איזה כיף!', 'תודה רבה! אישור ההגעה שלך התקבל בהצלחה. מחכים כבר לחגוג איתך!', '🥂');
        } else if (attendingStatus === 'maybe') {
            showModal('👍 הכל בסדר!', 'העדכון שלך התקבל. נשמח מאוד אם תצליח/י להגיע ומחכים לעדכון נוסף!', '📅');
        } else {
            showModal('תודה על העדכון', 'הודעתך התקבלה. נתגעגע אליך, אבל תודה רבה שעדכנת אותנו!', '❤️');
        }

        document.getElementById('rsvpForm').reset();
        toggleCountField(true);
    } catch (err) {
        console.error('Error submitting RSVP:', err);
        showModal('אופס...', 'אירעה שגיאה בשליחת הטופס, אנא נסה שוב.', '⚠️');
    } finally {
        btn.disabled = false;
        btn.innerText = 'אישור הגעה';
    }
}

// ==========================================
// 5. ניהול פופ-אפ (Modal)
// ==========================================
function showModal(title, text, icon = '🎉') {
    const modal = document.getElementById('customModal');
    if (modal) {
        document.getElementById('modalIcon').innerText = icon;
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalText').innerText = text;
        modal.style.display = 'flex';
    } else {
        alert(`${title}\n${text}`);
    }
}

function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==========================================
// 6. ניווט ב-Waze (קויה חולון)
// ==========================================
function openWaze() {
    const location = encodeURIComponent("קויה חולון");
    window.open(`https://waze.com/ul?q=${location}&navigate=yes`, '_blank');
}

// ==========================================
// 7. הוספה ל-Google Calendar (קויה חולון)
// ==========================================
function addToGoogleCalendar() {
    const title = encodeURIComponent("החתונה של רועי ונועה 🎉");
    const details = encodeURIComponent("נשמח מאוד לחגוג ולראותכם בין אורחינו!");
    const location = encodeURIComponent("קויה חולון (Coya)");
    const start = "20270106T193000";
    const end = "20270107T020000";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, '_blank');
}