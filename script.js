// Timezone data with major cities
const TIMEZONES = {
    'Asia/Dubai': { name: 'دبي - Dubai', offset: '+03:00', city: 'Dubai' },
    'Asia/Baghdad': { name: 'بغداد - Baghdad', offset: '+03:00', city: 'Baghdad' },
    'Asia/Riyadh': { name: 'الرياض - Riyadh', offset: '+03:00', city: 'Riyadh' },
    'Asia/Kuwait': { name: 'الكويت - Kuwait', offset: '+03:00', city: 'Kuwait' },
    'Asia/Qatar': { name: 'قطر - Qatar', offset: '+03:00', city: 'Qatar' },
    'Asia/Bahrain': { name: 'البحرين - Bahrain', offset: '+03:00', city: 'Bahrain' },
    'Asia/Oman': { name: 'عمان - Oman', offset: '+04:00', city: 'Oman' },
    'Africa/Cairo': { name: 'القاهرة - Cairo', offset: '+02:00', city: 'Cairo' },
    'Africa/Johannesburg': { name: 'جوهانسبرج - Johannesburg', offset: '+02:00', city: 'Johannesburg' },
    'Europe/London': { name: 'لندن - London', offset: '+00:00', city: 'London' },
    'Europe/Paris': { name: 'باريس - Paris', offset: '+01:00', city: 'Paris' },
    'Europe/Berlin': { name: 'برلين - Berlin', offset: '+01:00', city: 'Berlin' },
    'Europe/Moscow': { name: 'موسكو - Moscow', offset: '+03:00', city: 'Moscow' },
    'Europe/Istanbul': { name: 'اسطنبول - Istanbul', offset: '+03:00', city: 'Istanbul' },
    'Asia/Tokyo': { name: 'طوكيو - Tokyo', offset: '+09:00', city: 'Tokyo' },
    'Asia/Hong_Kong': { name: 'هونج كونج - Hong Kong', offset: '+08:00', city: 'Hong Kong' },
    'Asia/Singapore': { name: 'سنغافورة - Singapore', offset: '+08:00', city: 'Singapore' },
    'Asia/Bangkok': { name: 'بانكوك - Bangkok', offset: '+07:00', city: 'Bangkok' },
    'Asia/Kolkata': { name: 'الهند - India', offset: '+05:30', city: 'India' },
    'Australia/Sydney': { name: 'سيدني - Sydney', offset: '+10:00', city: 'Sydney' },
    'America/New_York': { name: 'نيويورك - New York', offset: '-05:00', city: 'New York' },
    'America/Chicago': { name: 'شيكاغو - Chicago', offset: '-06:00', city: 'Chicago' },
    'America/Denver': { name: 'دنفر - Denver', offset: '-07:00', city: 'Denver' },
    'America/Los_Angeles': { name: 'لوس أنجلس - Los Angeles', offset: '-08:00', city: 'Los Angeles' },
    'America/Toronto': { name: 'تورونتو - Toronto', offset: '-05:00', city: 'Toronto' },
    'America/Mexico_City': { name: 'مكسيكو سيتي - Mexico City', offset: '-06:00', city: 'Mexico City' },
    'America/Sao_Paulo': { name: 'ساو باولو - São Paulo', offset: '-03:00', city: 'São Paulo' },
    'America/Buenos_Aires': { name: 'بوينس آيرس - Buenos Aires', offset: '-03:00', city: 'Buenos Aires' },
};

let selectedTimezones = [];

// Initialize
function init() {
    loadFromLocalStorage();
    setupEventListeners();
    updateClocks();
    setInterval(updateClocks, 1000);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', showTimezoneSearch);
    document.getElementById('searchTimezone').addEventListener('input', filterTimezones);
    document.getElementById('timezoneSearch').addEventListener('click', (e) => {
        if (e.target.id === 'timezoneSearch') {
            hideTimezoneSearch();
        }
    });
}

// Show timezone search dialog
function showTimezoneSearch() {
    document.getElementById('timezoneSearch').style.display = 'flex';
    document.getElementById('searchTimezone').value = '';
    renderTimezoneList();
    document.getElementById('searchTimezone').focus();
}

// Hide timezone search dialog
function hideTimezoneSearch() {
    document.getElementById('timezoneSearch').style.display = 'none';
}

// Render timezone list
function renderTimezoneList(filter = '') {
    const list = document.getElementById('timezoneList');
    list.innerHTML = '';

    Object.entries(TIMEZONES).forEach(([tz, data]) => {
        if (selectedTimezones.includes(tz)) return; // Skip already selected

        const searchText = `${data.name} ${data.city}`.toLowerCase();
        if (filter && !searchText.includes(filter.toLowerCase())) return;

        const item = document.createElement('div');
        item.className = 'timezone-item';
        item.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
            <div style="font-size: 12px; color: #999;">${tz}</div>
        `;
        item.addEventListener('click', () => addTimezone(tz));
        list.appendChild(item);
    });
}

// Filter timezones
function filterTimezones() {
    const filter = document.getElementById('searchTimezone').value;
    renderTimezoneList(filter);
}

// Add timezone
function addTimezone(tz) {
    if (!selectedTimezones.includes(tz)) {
        selectedTimezones.push(tz);
        saveToLocalStorage();
        renderClocks();
        hideTimezoneSearch();
    }
}

// Remove timezone
function removeTimezone(tz) {
    selectedTimezones = selectedTimezones.filter(t => t !== tz);
    saveToLocalStorage();
    renderClocks();
}

// Render all clocks
function renderClocks() {
    const container = document.getElementById('clocksContainer');
    const emptyState = document.getElementById('emptyState');

    container.innerHTML = '';

    if (selectedTimezones.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    selectedTimezones.forEach(tz => {
        const data = TIMEZONES[tz];
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.innerHTML = `
            <div class="clock-header">
                <div>
                    <div class="city-name">${data.name}</div>
                    <div class="timezone-offset" id="offset-${tz}">${data.offset}</div>
                </div>
                <button class="delete-btn" onclick="removeTimezone('${tz}')">حذف</button>
            </div>
            <div class="clock-display">
                <div class="digital-time" id="time-${tz}">00:00:00</div>
                <div class="time-period" id="period-${tz}">AM</div>
                <div class="date-info" id="date-${tz}">Loading...</div>
            </div>
            <div class="analog-clock">
                <div class="clock-center"></div>
                <div class="hand hour-hand" id="hour-${tz}"></div>
                <div class="hand minute-hand" id="minute-${tz}"></div>
                <div class="hand second-hand" id="second-${tz}"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Update all clocks
function updateClocks() {
    selectedTimezones.forEach(tz => {
        updateClock(tz);
    });
}

// Update single clock
function updateClock(tz) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('ar-SA', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const parts = formatter.formatToParts(now);
    const timeObj = {};
    parts.forEach(part => {
        timeObj[part.type] = part.value;
    });

    // Digital time
    const timeStr = `${timeObj.hour}:${timeObj.minute}:${timeObj.second}`;
    document.getElementById(`time-${tz}`).textContent = timeStr;
    document.getElementById(`period-${tz}`).textContent = timeObj.dayPeriod || 'AM';

    // Date
    const dateStr = `${timeObj.day}/${timeObj.month}/${timeObj.year}`;
    document.getElementById(`date-${tz}`).textContent = dateStr;

    // Analog clock hands
    const hours = parseInt(timeObj.hour) % 12;
    const minutes = parseInt(timeObj.minute);
    const seconds = parseInt(timeObj.second);

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

    document.getElementById(`second-${tz}`).style.transform = `rotate(${secondDegrees}deg)`;
    document.getElementById(`minute-${tz}`).style.transform = `rotate(${minuteDegrees}deg)`;
    document.getElementById(`hour-${tz}`).style.transform = `rotate(${hourDegrees}deg)`;
}

// Local storage
function saveToLocalStorage() {
    localStorage.setItem('selectedTimezones', JSON.stringify(selectedTimezones));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('selectedTimezones');
    if (saved) {
        selectedTimezones = JSON.parse(saved);
        renderClocks();
    }
}

// Start the app
init();