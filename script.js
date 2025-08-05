// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
      themeToggle.textContent = '☀️';
    } else {
      themeToggle.textContent = '🌙';
    }
  });
}

// Animated CoEv intro logic
window.addEventListener('DOMContentLoaded', () => {
  // Fade-up animation for intro
  const intro = document.getElementById('coev-animated');
  const mission = document.getElementById('mission-section');
  const portal = document.getElementById('portal-section');
  const notice = document.getElementById('notice-section');
  const contact = document.getElementById('contact-section');

  // Animate CoEv in
  intro.style.opacity = 1;
  intro.style.transform = 'translateY(0)';

  // After 1.2s, fade out CoEv and show mission
  setTimeout(() => {
    intro.style.transition = 'opacity 0.7s, transform 0.7s';
    intro.style.opacity = 0;
    intro.style.transform = 'translateY(-48px)';
    // After fade out, hide intro and show mission
    setTimeout(() => {
      intro.style.display = 'none';
      if (mission) mission.style.display = '';
      if (portal) portal.style.display = '';
      if (notice) notice.style.display = '';
      if (contact) contact.style.display = '';
      // Animate in the rest
      [mission, portal, notice, contact].forEach((el, i) => {
        if (el) {
          el.classList.add('fade-up');
          el.style.animationDelay = (1.2 + i * 0.3) + 's';
        }
      });
    }, 700);
  }, 1200);

  // Fade-up animation for all elements
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animationDelay = (el.dataset.delay || 0) + 's';
    el.classList.add('animated');
  });
});

// Student Portal logic
if (window.location.pathname.includes('student.html')) {
  const authSection = document.getElementById('student-auth');
  const dashboard = document.getElementById('student-dashboard');
  const loginForm = document.getElementById('student-login-form');
  const signupForm = document.getElementById('student-signup-form');
  const showSignup = document.getElementById('show-student-signup');
  const authTitle = document.getElementById('student-auth-title');

  // Toggle signup/login
  showSignup.addEventListener('click', e => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = '';
    authTitle.textContent = 'Student Sign Up';
  });
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('student-signup-name').value;
    const usn = document.getElementById('student-signup-usn').value;
    const email = document.getElementById('student-signup-email').value;
    const pw = document.getElementById('student-signup-password').value;
    const confirm = document.getElementById('student-signup-confirm').value;
    if (pw !== confirm) {
      alert('Passwords do not match!');
      return;
    }
    // Save to localStorage
    localStorage.setItem('student_' + usn, JSON.stringify({ name, usn, email, pw, certs: [], history: [] }));
    alert('Sign up successful! Please log in.');
    signupForm.reset();
    signupForm.style.display = 'none';
    loginForm.style.display = '';
    authTitle.textContent = 'Student Login';
  });
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const usn = document.getElementById('student-login-usn').value;
    const pw = document.getElementById('student-login-password').value;
    const user = JSON.parse(localStorage.getItem('student_' + usn) || 'null');
    if (!user || user.pw !== pw) {
      alert('Invalid USN or password!');
      return;
    }
    // Show dashboard
    authSection.style.display = 'none';
    dashboard.style.display = '';
    loadStudentDashboard(user);
    localStorage.setItem('student_logged_in', usn);
  });
  // Auto-login if already logged in
  const loggedInUSN = localStorage.getItem('student_logged_in');
  if (loggedInUSN) {
    const user = JSON.parse(localStorage.getItem('student_' + loggedInUSN) || 'null');
    if (user) {
      authSection.style.display = 'none';
      dashboard.style.display = '';
      loadStudentDashboard(user);
    }
  }
  // Certificate upload
  function loadStudentDashboard(user) {
    // Certificates
    const certForm = document.getElementById('certificate-upload-form');
    const certList = document.getElementById('uploaded-certificates');
    certForm.onsubmit = function(e) {
      e.preventDefault();
      const file = document.getElementById('certificate-file').files[0];
      if (!file) return;
      const certs = user.certs || [];
      certs.push(file.name);
      user.certs = certs;
      localStorage.setItem('student_' + user.usn, JSON.stringify(user));
      renderCerts();
      certForm.reset();
    };
    function renderCerts() {
      certList.innerHTML = (user.certs||[]).map(c => `<div>📄 ${c}</div>`).join('') || '<span style="opacity:0.7;">No certificates uploaded yet.</span>';
    }
    renderCerts();
    // Notifications (sample events)
    const notifTable = document.getElementById('student-notification-table');
    const events = [
      { name: 'Sample Event 1', date: '22 May 2025' },
      { name: 'Sample Event 2', date: '29 May 2025' },
      { name: 'Sample Event 3', date: '16 Jun 2025' }
    ];
    notifTable.innerHTML = events.map(ev => `<tr><td><a href='events.html' style='color:#AD49E1;'>${ev.name}</a></td><td>${ev.date}</td></tr>`).join('');
    // Event history (sample)
    const historyDiv = document.getElementById('student-event-history');
    const history = user.history || [
      { name: 'Sample Event 1', date: '22 May 2025', cert: user.certs && user.certs[0] },
      { name: 'Sample Event 2', date: '29 May 2025', cert: user.certs && user.certs[1] }
    ];
    historyDiv.innerHTML = history.map(ev => `
      <div class='glass-card' style='margin-bottom:12px;'>
        <div><b>${ev.name}</b> <span style='opacity:0.7;'>(${ev.date})</span></div>
        <div style='margin-top:8px;'>
          <button class='neu-btn' style='font-size:0.9rem;padding:8px 18px;margin-right:8px;'>Upload Certificate</button>
          <button class='neu-btn' style='font-size:0.9rem;padding:8px 18px;'>Feedback</button>
        </div>
        ${ev.cert ? `<div style='margin-top:8px;font-size:0.95rem;'>Certificate: ${ev.cert}</div>` : ''}
      </div>
    `).join('');
  }
}

// Club Portal logic
if (window.location.pathname.includes('club.html')) {
  // Color palette (20+)
  const colorPalette = [
    '#AD49E1', '#7A1CAC', '#1EBD3F', '#EBD3F8', '#2E073F', '#EBB434', '#F76E11', '#1CA7EC', '#FF61A6', '#FFB400',
    '#00C9A7', '#FF6F61', '#6B47DC', '#F44336', '#009688', '#FFC107', '#8BC34A', '#3F51B5', '#E91E63', '#00BCD4',
    '#FF9800', '#9C27B0', '#607D8B', '#4CAF50', '#795548'
  ];
  // Remove used colors
  function getAvailableColors() {
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    const used = clubs.map(c => c.color);
    return colorPalette.filter(c => !used.includes(c));
  }
  function renderColorOptions() {
    const select = document.getElementById('club-signup-color');
    select.innerHTML = '<option value="">Select Club Color</option>';
    getAvailableColors().forEach(color => {
      const opt = document.createElement('option');
      opt.value = color;
      opt.textContent = color;
      opt.style.background = color;
      select.appendChild(opt);
    });
  }
  renderColorOptions();

  const authSection = document.getElementById('club-auth');
  const dashboard = document.getElementById('club-dashboard');
  const loginForm = document.getElementById('club-login-form');
  const signupForm = document.getElementById('club-signup-form');
  const showSignup = document.getElementById('show-club-signup');
  const authTitle = document.getElementById('club-auth-title');

  // Toggle signup/login
  showSignup.addEventListener('click', e => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = '';
    authTitle.textContent = 'Club Sign Up';
    renderColorOptions();
  });
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('club-signup-name').value;
    const type = document.getElementById('club-signup-type').value;
    const code = document.getElementById('club-signup-code').value;
    const color = document.getElementById('club-signup-color').value;
    const cert = document.getElementById('club-signup-cert').files[0];
    if (!name || !type || !code || !color || !cert) {
      alert('Please fill all fields.');
      return;
    }
    // Unique code check
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    if (clubs.some(c => c.code === code)) {
      alert('Club code already exists!');
      return;
    }
    clubs.push({ name, type, code, color, cert: cert.name, events: [], recruitments: [] });
    localStorage.setItem('clubs', JSON.stringify(clubs));
    alert('Sign up successful! Please log in.');
    signupForm.reset();
    signupForm.style.display = 'none';
    loginForm.style.display = '';
    authTitle.textContent = 'Club Login';
    renderColorOptions();
  });
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('club-login-name').value;
    const code = document.getElementById('club-login-code').value;
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    const club = clubs.find(c => c.name === name && c.code === code);
    if (!club) {
      alert('Invalid club name or code!');
      return;
    }
    // Show dashboard
    authSection.style.display = 'none';
    dashboard.style.display = '';
    localStorage.setItem('club_logged_in', code);
    setupClubDashboard(club);
  });
  // Auto-login if already logged in
  const loggedInCode = localStorage.getItem('club_logged_in');
  if (loggedInCode) {
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    const club = clubs.find(c => c.code === loggedInCode);
    if (club) {
      authSection.style.display = 'none';
      dashboard.style.display = '';
      setupClubDashboard(club);
    }
  }
  // Dashboard interactivity
  function setupClubDashboard(club) {
    const eventBtn = document.getElementById('register-event-btn');
    const recruitBtn = document.getElementById('upload-recruitment-btn');
    const eventSection = document.getElementById('club-event-form-section');
    const recruitSection = document.getElementById('club-recruitment-form-section');
    eventBtn.onclick = () => {
      eventSection.style.display = '';
      recruitSection.style.display = 'none';
    };
    recruitBtn.onclick = () => {
      eventSection.style.display = 'none';
      recruitSection.style.display = '';
    };
    // Event form
    const eventForm = document.getElementById('club-event-form');
    eventForm.onsubmit = function(e) {
      e.preventDefault();
      const event = {
        club: club.name,
        clubType: club.type,
        clubColor: club.color,
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        venue: document.getElementById('event-venue').value,
        participants: document.getElementById('event-participants').value,
        prize: document.getElementById('event-prize').value,
        regLink: document.getElementById('event-reg-link').value,
        instaLink: document.getElementById('event-insta-link').value,
        websiteLink: document.getElementById('event-website-link').value,
        desc: document.getElementById('event-desc').value
      };
      // Save to club and global events
      const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
      const idx = clubs.findIndex(c => c.code === club.code);
      clubs[idx].events = clubs[idx].events || [];
      clubs[idx].events.push(event);
      localStorage.setItem('clubs', JSON.stringify(clubs));
      // Also save to global events
      const allEvents = JSON.parse(localStorage.getItem('all_events') || '[]');
      allEvents.push(event);
      localStorage.setItem('all_events', JSON.stringify(allEvents));
      alert('Event registered!');
      eventForm.reset();
      eventSection.style.display = 'none';
    };
    // Recruitment form
    const recruitForm = document.getElementById('club-recruitment-form');
    recruitForm.onsubmit = function(e) {
      e.preventDefault();
      const recruitment = {
        club: club.name,
        clubType: club.type,
        clubColor: club.color,
        position: document.getElementById('recruit-position').value,
        prereq: document.getElementById('recruit-prereq').value,
        regLink: document.getElementById('recruit-reg-link').value,
        websiteLink: document.getElementById('recruit-website-link').value,
        socialLink: document.getElementById('recruit-social-link').value
      };
      // Save to club and global recruitments
      const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
      const idx = clubs.findIndex(c => c.code === club.code);
      clubs[idx].recruitments = clubs[idx].recruitments || [];
      clubs[idx].recruitments.push(recruitment);
      localStorage.setItem('clubs', JSON.stringify(clubs));
      // Also save to global recruitments
      const allRecruits = JSON.parse(localStorage.getItem('all_recruitments') || '[]');
      allRecruits.push(recruitment);
      localStorage.setItem('all_recruitments', JSON.stringify(allRecruits));
      alert('Recruitment uploaded!');
      recruitForm.reset();
      recruitSection.style.display = 'none';
    };
  }
}

// Events Page logic
if (window.location.pathname.includes('events.html')) {
  const eventCardsDiv = document.getElementById('event-cards');
  const searchInput = document.getElementById('event-search');
  const filterClub = document.getElementById('event-filter-club');
  const filterType = document.getElementById('event-filter-type');

  // Load events from localStorage or use demo
  let events = JSON.parse(localStorage.getItem('all_events') || 'null');
  if (!events || !Array.isArray(events) || events.length === 0) {
    events = [
      {
        club: 'Tech Club', clubType: 'Technical', clubColor: '#AD49E1',
        name: 'Sample Event 1', date: '2025-05-22', venue: 'Auditorium', participants: 120, prize: '10,000',
        regLink: '#', instaLink: '#', websiteLink: '#', desc: 'A technical event for all students.'
      },
      {
        club: 'Drama Club', clubType: 'Non-Technical', clubColor: '#FF61A6',
        name: 'Sample Event 2', date: '2025-05-29', venue: 'Main Hall', participants: 80, prize: '5,000',
        regLink: '#', instaLink: '#', websiteLink: '#', desc: 'A drama event for creative minds.'
      },
      {
        club: 'Music Club', clubType: 'Technical', clubColor: '#1CA7EC',
        name: 'Sample Event 3', date: '2025-06-16', venue: 'Open Stage', participants: 60, prize: '3,000',
        regLink: '#', instaLink: '#', websiteLink: '#', desc: 'A music event for all music lovers.'
      }
    ];
  }

  // Populate club filter
  const clubs = Array.from(new Set(events.map(ev => ev.club)));
  clubs.forEach(club => {
    const opt = document.createElement('option');
    opt.value = club;
    opt.textContent = club;
    filterClub.appendChild(opt);
  });

  function renderEvents() {
    let filtered = events;
    const search = (searchInput.value || '').toLowerCase();
    const club = filterClub.value;
    const type = filterType.value;
    if (search) {
      filtered = filtered.filter(ev =>
        ev.name.toLowerCase().includes(search) ||
        ev.club.toLowerCase().includes(search) ||
        (ev.desc && ev.desc.toLowerCase().includes(search))
      );
    }
    if (club) filtered = filtered.filter(ev => ev.club === club);
    if (type) filtered = filtered.filter(ev => ev.clubType === type);
    eventCardsDiv.innerHTML = filtered.map(ev => `
      <div class='event-card aspect-16-9 fade-up' style='border-color:${ev.clubColor}'>
        <div class='event-info'>
          <div class='event-title'>${ev.name}</div>
          <div class='event-meta'>${ev.participants || ''} participants &bull; Prize: ${ev.prize || '-'} </div>
          <div class='event-desc'>${ev.desc || ''}</div>
          <div class='event-links'>
            <a href='${ev.regLink}' class='event-link underglow' target='_blank'>Register</a>
            <a href='${ev.websiteLink}' class='event-link' target='_blank'>Website</a>
            <a href='${ev.instaLink}' class='event-link' target='_blank'>Instagram</a>
          </div>
        </div>
        <div class='event-side' style='background:rgba(173,73,225,0.08);border-left:2px solid ${ev.clubColor};'>
          <div class='event-club' style='color:${ev.clubColor}'>${ev.club}</div>
          <div class='event-date'>${ev.date}</div>
          <div class='event-venue'>${ev.venue}</div>
        </div>
      </div>
    `).join('') || '<div style="opacity:0.7;text-align:center;">No events found.</div>';
  }

  searchInput.addEventListener('input', renderEvents);
  filterClub.addEventListener('change', renderEvents);
  filterType.addEventListener('change', renderEvents);
  renderEvents();
}

// Calendar Page logic
if (window.location.pathname.includes('calendar.html')) {
  const calendarGrid = document.getElementById('calendar-grid');
  const yearSpan = document.getElementById('calendar-year');
  const prevYearBtn = document.getElementById('prev-year');
  const nextYearBtn = document.getElementById('next-year');
  const eventsListSection = document.getElementById('calendar-events-list');
  const eventsDetailsDiv = document.getElementById('calendar-events-details');
  const selectedDateSpan = document.getElementById('calendar-selected-date');

  let currentYear = new Date().getFullYear();
  let selectedDate = null;

  // Load events from localStorage or demo
  let events = JSON.parse(localStorage.getItem('all_events') || 'null');
  if (!events || !Array.isArray(events) || events.length === 0) {
    events = [
      {
        club: 'Tech Club', clubType: 'Technical', clubColor: '#AD49E1',
        name: 'Sample Event 1', date: '2025-05-22', venue: 'Auditorium', participants: 120, prize: '10,000',
        regLink: '#', instaLink: '#', websiteLink: '#', desc: 'A technical event for all students.'
      },
      {
        club: 'Drama Club', clubType: 'Non-Technical', clubColor: '#FF61A6',
        name: 'Sample Event 2', date: '2025-05-29', venue: 'Main Hall', participants: 80, prize: '5,000',
        regLink: '#', instaLink: '#', websiteLink: '#', desc: 'A drama event for creative minds.'
      },
      {
        club: 'Music Club', clubType: 'Technical', clubColor: '#1CA7EC',
        name: 'Sample Event 3', date: '2025-06-16', venue: 'Open Stage', participants: 60, prize: '3,000',
        regLink: '#', instaLink: '#', websiteLink: '#', desc: 'A music event for all music lovers.'
      }
    ];
  }

  function renderCalendar(year) {
    yearSpan.textContent = year;
    calendarGrid.innerHTML = '';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    for (let m = 0; m < 12; m++) {
      const monthBox = document.createElement('div');
      monthBox.className = 'calendar-month fade-up';
      monthBox.style.animationDelay = (0.2 + m * 0.04) + 's';
      const monthTitle = document.createElement('div');
      monthTitle.className = 'calendar-month-title';
      monthTitle.textContent = months[m] + ' ' + year;
      monthBox.appendChild(monthTitle);
      const daysGrid = document.createElement('div');
      daysGrid.className = 'calendar-days';
      // Days in month
      const firstDay = new Date(year, m, 1).getDay();
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      // Fill blanks
      for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        blank.className = 'calendar-day';
        blank.style.visibility = 'hidden';
        daysGrid.appendChild(blank);
      }
      // Days
      for (let d = 1; d <= daysInMonth; d++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        const dateStr = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        // Check if event on this day
        const dayEvents = events.filter(ev => ev.date === dateStr);
        if (dayEvents.length > 0) {
          day.classList.add('event-day');
          day.style.borderColor = dayEvents[0].clubColor;
          day.style.boxShadow = `0 0 12px 2px ${dayEvents[0].clubColor}`;
          day.style.background = `linear-gradient(135deg, ${dayEvents[0].clubColor} 60%, #EBD3F8 100%)`;
          day.setAttribute('data-color', dayEvents[0].clubColor);
        }
        day.textContent = d;
        day.onclick = () => {
          selectedDate = dateStr;
          showEventsForDate(dateStr);
          // Highlight selected
          document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
          day.classList.add('selected');
        };
        daysGrid.appendChild(day);
      }
      monthBox.appendChild(daysGrid);
      calendarGrid.appendChild(monthBox);
    }
  }

  function showEventsForDate(dateStr) {
    const dayEvents = events.filter(ev => ev.date === dateStr);
    if (dayEvents.length === 0) {
      eventsListSection.style.display = 'none';
      return;
    }
    selectedDateSpan.textContent = dateStr;
    eventsDetailsDiv.innerHTML = dayEvents.map(ev => `
      <div class='event-card' style='border-color:${ev.clubColor};margin-bottom:18px;'>
        <div class='event-club' style='color:${ev.clubColor}'>${ev.club}</div>
        <div class='event-title'>${ev.name}</div>
        <div class='event-meta'>${ev.date} &bull; ${ev.venue} &bull; ${ev.participants} participants</div>
        <div class='event-desc'>${ev.desc || ''}</div>
        <div class='event-links'>
          <a href='${ev.regLink}' class='event-link underglow' target='_blank'>Register</a>
          <a href='${ev.websiteLink}' class='event-link' target='_blank'>Website</a>
          <a href='${ev.instaLink}' class='event-link' target='_blank'>Instagram</a>
        </div>
      </div>
    `).join('');
    eventsListSection.style.display = '';
  }

  prevYearBtn.onclick = () => {
    currentYear--;
    renderCalendar(currentYear);
    eventsListSection.style.display = 'none';
  };
  nextYearBtn.onclick = () => {
    currentYear++;
    renderCalendar(currentYear);
    eventsListSection.style.display = 'none';
  };

  // Default to 2025 if demo data
  if (events.some(ev => ev.date.startsWith('2025'))) currentYear = 2025;
  renderCalendar(currentYear);
}

// Recruitments Page logic
if (window.location.pathname.includes('recruitments.html')) {
  const recruitCardsDiv = document.getElementById('recruitment-cards');
  // Load recruitments from localStorage or demo
  let recruitments = JSON.parse(localStorage.getItem('all_recruitments') || 'null');
  if (!recruitments || !Array.isArray(recruitments) || recruitments.length === 0) {
    recruitments = [
      {
        club: 'Tech Club', clubType: 'Technical', clubColor: '#AD49E1',
        position: 'Web Developer', prereq: 'HTML, CSS, JS',
        regLink: '#', websiteLink: '#', socialLink: '#'
      },
      {
        club: 'Drama Club', clubType: 'Non-Technical', clubColor: '#FF61A6',
        position: 'Actor', prereq: 'Stage presence',
        regLink: '#', websiteLink: '#', socialLink: '#'
      },
      {
        club: 'Music Club', clubType: 'Technical', clubColor: '#1CA7EC',
        position: 'Guitarist', prereq: 'Guitar skills',
        regLink: '#', websiteLink: '#', socialLink: '#'
      }
    ];
  }
  recruitCardsDiv.innerHTML = recruitments.map((rec, i) => `
    <div class='recruitment-card fade-up' style='border-color:${rec.clubColor};box-shadow:0 0 16px 2px ${rec.clubColor},0 8px 32px rgba(46,7,63,0.18);animation-delay:${0.2 + i*0.08}s;'>
      <div class='recruitment-club' style='color:${rec.clubColor}'>${rec.club}</div>
      <div class='recruitment-title'>${rec.position}</div>
      <div class='recruitment-meta'>${rec.clubType} &bull; Pre-req: ${rec.prereq || 'None'}</div>
      <div class='recruitment-links'>
        <a href='${rec.regLink}' class='recruitment-link underglow' target='_blank'>Apply Now</a>
        <a href='${rec.websiteLink}' class='recruitment-link' target='_blank'>Website</a>
        <a href='${rec.socialLink}' class='recruitment-link' target='_blank'>Social</a>
      </div>
    </div>
  `).join('') || '<div style="opacity:0.7;text-align:center;">No recruitments found.</div>';
}

// Feedback Page logic
if (window.location.pathname.includes('feedback.html')) {
  const clubDropdownsDiv = document.getElementById('club-dropdowns');
  const feedbackFormSection = document.getElementById('feedback-form-section');
  const seeFeedbackSection = document.getElementById('see-feedback-section');

  // Load clubs/events from localStorage or demo
  let clubs = JSON.parse(localStorage.getItem('clubs') || 'null');
  let events = JSON.parse(localStorage.getItem('all_events') || 'null');
  if (!clubs || !Array.isArray(clubs) || clubs.length === 0) {
    clubs = [
      { name: 'Tech Club', type: 'Technical', code: 'T123', color: '#AD49E1' },
      { name: 'Drama Club', type: 'Non-Technical', code: 'D456', color: '#FF61A6' },
      { name: 'Music Club', type: 'Technical', code: 'M789', color: '#1CA7EC' }
    ];
  }
  if (!events || !Array.isArray(events) || events.length === 0) {
    events = [
      { club: 'Tech Club', name: 'Sample Event 1', date: '2025-05-22' },
      { club: 'Drama Club', name: 'Sample Event 2', date: '2025-05-29' },
      { club: 'Music Club', name: 'Sample Event 3', date: '2025-06-16' }
    ];
  }

  // Render club dropdowns and event lists
  clubDropdownsDiv.innerHTML = clubs.map((club, i) => {
    const clubEvents = events.filter(ev => ev.club === club.name);
    return `
      <div class='glass-card' style='margin-bottom:12px;'>
        <button class='neu-btn' style='width:100%;background:${club.color};color:#fff;' onclick='window.showClubEvents(${i})'>${club.name}</button>
        <div id='club-events-list-${i}' style='display:none;margin-top:10px;'>
          ${clubEvents.map((ev, j) => `
            <button class='feedback-dropdown' style='width:100%;margin-bottom:6px;' onclick='window.selectFeedbackEvent(${i},${j})'>${ev.name} (${ev.date})</button>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Expose functions for event selection
  window.showClubEvents = function(idx) {
    clubs.forEach((_, i) => {
      document.getElementById('club-events-list-' + i).style.display = (i === idx ? '' : 'none');
    });
    feedbackFormSection.style.display = 'none';
    seeFeedbackSection.style.display = 'none';
  };
  window.selectFeedbackEvent = function(clubIdx, eventIdx) {
    const club = clubs[clubIdx];
    const clubEvents = events.filter(ev => ev.club === club.name);
    const ev = clubEvents[eventIdx];
    renderFeedbackForm(club, ev);
    renderSeeFeedback(club, ev);
    feedbackFormSection.style.display = '';
    seeFeedbackSection.style.display = '';
  };

  // Feedback form
  function renderFeedbackForm(club, ev) {
    feedbackFormSection.innerHTML = `
      <form id='feedback-form' class='glass-card' style='margin-bottom:18px;'>
        <div class='feedback-form-label'>Event: <b>${ev.name}</b> (${club.name})</div>
        <label class='feedback-form-label'>Name</label>
        <input type='text' id='fb-name' class='input-field' required>
        <label class='feedback-form-label'>USN</label>
        <input type='text' id='fb-usn' class='input-field' required>
        <label class='feedback-form-label'>Branch</label>
        <input type='text' id='fb-branch' class='input-field' required>
        <label class='feedback-form-label'>Year</label>
        <input type='text' id='fb-year' class='input-field' required>
        <label class='feedback-form-label'>Upload Certificate</label>
        <input type='file' id='fb-cert' class='input-field' accept='.pdf,.jpg,.jpeg,.png'>
        <label class='feedback-form-label'>How was the overall event?</label>
        <div class='feedback-rating'>
          <label><input type='radio' name='fb-overall' value='1' required> 1</label>
          <label><input type='radio' name='fb-overall' value='2'> 2</label>
          <label><input type='radio' name='fb-overall' value='3'> 3</label>
          <label><input type='radio' name='fb-overall' value='4'> 4</label>
          <label><input type='radio' name='fb-overall' value='5'> 5</label>
        </div>
        <label class='feedback-form-label'>How was the management?</label>
        <div class='feedback-rating'>
          <label><input type='radio' name='fb-management' value='1' required> 1</label>
          <label><input type='radio' name='fb-management' value='2'> 2</label>
          <label><input type='radio' name='fb-management' value='3'> 3</label>
          <label><input type='radio' name='fb-management' value='4'> 4</label>
          <label><input type='radio' name='fb-management' value='5'> 5</label>
        </div>
        <label class='feedback-form-label'>How was the engagement?</label>
        <div class='feedback-rating'>
          <label><input type='radio' name='fb-engagement' value='1' required> 1</label>
          <label><input type='radio' name='fb-engagement' value='2'> 2</label>
          <label><input type='radio' name='fb-engagement' value='3'> 3</label>
          <label><input type='radio' name='fb-engagement' value='4'> 4</label>
          <label><input type='radio' name='fb-engagement' value='5'> 5</label>
        </div>
        <label class='feedback-form-label'>How was the content?</label>
        <div class='feedback-rating'>
          <label><input type='radio' name='fb-content' value='1' required> 1</label>
          <label><input type='radio' name='fb-content' value='2'> 2</label>
          <label><input type='radio' name='fb-content' value='3'> 3</label>
          <label><input type='radio' name='fb-content' value='4'> 4</label>
          <label><input type='radio' name='fb-content' value='5'> 5</label>
        </div>
        <label class='feedback-form-label'>How was the relevance?</label>
        <div class='feedback-rating'>
          <label><input type='radio' name='fb-relevance' value='1' required> 1</label>
          <label><input type='radio' name='fb-relevance' value='2'> 2</label>
          <label><input type='radio' name='fb-relevance' value='3'> 3</label>
          <label><input type='radio' name='fb-relevance' value='4'> 4</label>
          <label><input type='radio' name='fb-relevance' value='5'> 5</label>
        </div>
        <label class='feedback-form-label'>Additional Comments</label>
        <textarea id='fb-comments' class='input-field' style='height:60px;'></textarea>
        <button type='submit' class='neu-btn' style='margin-top:12px;'>Submit Feedback</button>
      </form>
    `;
    document.getElementById('feedback-form').onsubmit = function(e) {
      e.preventDefault();
      const fb = {
        club: club.name,
        event: ev.name,
        name: document.getElementById('fb-name').value,
        usn: document.getElementById('fb-usn').value,
        branch: document.getElementById('fb-branch').value,
        year: document.getElementById('fb-year').value,
        cert: document.getElementById('fb-cert').files[0]?.name || '',
        overall: document.querySelector('input[name="fb-overall"]:checked').value,
        management: document.querySelector('input[name="fb-management"]:checked').value,
        engagement: document.querySelector('input[name="fb-engagement"]:checked').value,
        content: document.querySelector('input[name="fb-content"]:checked').value,
        relevance: document.querySelector('input[name="fb-relevance"]:checked').value,
        comments: document.getElementById('fb-comments').value
      };
      // Save to localStorage
      const allFeedback = JSON.parse(localStorage.getItem('all_feedback') || '[]');
      allFeedback.push(fb);
      localStorage.setItem('all_feedback', JSON.stringify(allFeedback));
      alert('Feedback submitted!');
      this.reset();
      renderSeeFeedback(club, ev);
    };
  }

  // See feedback
  function renderSeeFeedback(club, ev) {
    const allFeedback = JSON.parse(localStorage.getItem('all_feedback') || '[]');
    const feedbacks = allFeedback.filter(fb => fb.club === club.name && fb.event === ev.name);
    seeFeedbackSection.innerHTML = `
      <div class='glass-card feedback-list'>
        <h3>See Feedback for <b>${ev.name}</b></h3>
        ${feedbacks.length === 0 ? '<div style="opacity:0.7;">No feedback yet.</div>' : feedbacks.map(fb => `
          <div class='feedback-item'>
            <div><b>${fb.name}</b> (${fb.usn}, ${fb.branch}, Year: ${fb.year})</div>
            <div>Overall: ${fb.overall} | Management: ${fb.management} | Engagement: ${fb.engagement} | Content: ${fb.content} | Relevance: ${fb.relevance}</div>
            <div>Comments: ${fb.comments || '<i>No comments</i>'}</div>
            ${fb.cert ? `<span class='feedback-cert'>Certificate: ${fb.cert}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }
} 