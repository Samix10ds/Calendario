// js/app.js

const STORAGE_KEY_EVENTS = "family_time_ultra_events";
const STORAGE_KEY_PROFILE = "family_time_ultra_active_profile";
const STORAGE_KEY_NOTES = "family_time_ultra_notes";

const profiles = [
  {
    id: "sara",
    name: "Sara",
    role: "Madre",
    theme: "Aurora calma",
    accent: "#22c55e",
    accentSoft: "rgba(34, 197, 94, 0.25)",
    quotesKey: "sara"
  },
  {
    id: "sofia",
    name: "Sofia",
    role: "Sorella",
    theme: "Neon serale",
    accent: "#6366f1",
    accentSoft: "rgba(99, 102, 241, 0.28)",
    quotesKey: "sofia"
  },
  {
    id: "simone",
    name: "Simone",
    role: "Padre",
    theme: "Notte tattica",
    accent: "#0ea5e9",
    accentSoft: "rgba(14, 165, 233, 0.25)",
    quotesKey: "simone"
  },
  {
    id: "samuele",
    name: "Samuele",
    role: "Io",
    theme: "Terminale stellare",
    accent: "#ec4899",
    accentSoft: "rgba(236, 72, 153, 0.25)",
    quotesKey: "samuele"
  },
  {
    id: "pesca",
    name: "Pesca",
    role: "Bassotto di casa",
    theme: "Modalità passeggiata",
    accent: "#f97316",
    accentSoft: "rgba(249, 115, 22, 0.3)",
    quotesKey: "pesca",
    isDog: true
  }
];

let quotesData = {};
let events = [];
let dayNotes = {};
let activeProfileId = null;
let calendarCurrentDate = new Date();
let eventsViewMode = "all";

const profilesListEl = document.getElementById("profilesList");
const activeProfileLabelEl = document.getElementById("activeProfileLabel");

const navButtons = document.querySelectorAll(".nav-btn");
const pages = {
  dashboard: document.getElementById("page-dashboard"),
  calendar: document.getElementById("page-calendar"),
  events: document.getElementById("page-events"),
  clock: document.getElementById("page-clock")
};

const mainSectionTitleEl = document.getElementById("mainSectionTitle");
const mainSectionSubEl = document.getElementById("mainSectionSub");
const sectionTagTextEl = document.getElementById("sectionTagText");

const clockTimeEl = document.getElementById("clockTime");
const clockSecondsEl = document.getElementById("clockSeconds");
const clockDateEl = document.getElementById("clockDate");
const lastUpdateTimeEl = document.getElementById("lastUpdateTime");
const tzTextEl = document.getElementById("tzText");

const clockTime2El = document.getElementById("clockTime2");
const clockSeconds2El = document.getElementById("clockSeconds2");
const clockDate2El = document.getElementById("clockDate2");

const quoteTextEl = document.getElementById("quoteText");
const quoteAuthorEl = document.getElementById("quoteAuthor");
const quoteRefreshBtn = document.getElementById("quoteRefreshBtn");

const todayEventsListEl = document.getElementById("todayEventsList");
const todayEventsMetaEl = document.getElementById("todayEventsMeta");

const calendarMonthLabelEl = document.getElementById("calendarMonthLabel");
const calendarGridEl = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const todayMonthBtn = document.getElementById("todayMonthBtn");

const eventsListEl = document.getElementById("eventsList");
const eventsViewButtons = document.querySelectorAll(".events-view-btn");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventDateInput = document.getElementById("eventDateInput");
const eventTimeInput = document.getElementById("eventTimeInput");
const eventSharedInput = document.getElementById("eventSharedInput");
const addEventBtn = document.getElementById("addEventBtn");

const summaryProfileNameEl = document.getElementById("summaryProfileName");
const summaryUpcomingProfileEl = document.getElementById("summaryUpcomingProfile");
const summaryUpcomingSharedEl = document.getElementById("summaryUpcomingShared");

const eventModalBackdrop = document.getElementById("eventModalBackdrop");
const modalDateTitleEl = document.getElementById("modalDateTitle");
const modalEventsContainerEl = document.getElementById("modalEventsContainer");
const modalNoteTextEl = document.getElementById("modalNoteText");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveModalBtn = document.getElementById("saveModalBtn");
const deleteAllDayEventsBtn = document.getElementById("deleteAllDayEventsBtn");

const profileMoodLabelEl = document.getElementById("profileMoodLabel");
const profileNameLabelEl = document.getElementById("profileNameLabel");
const profileRoleLabelEl = document.getElementById("profileRoleLabel");
const profileThemeLabelEl = document.getElementById("profileThemeLabel");
const profileEventsCountLabelEl = document.getElementById("profileEventsCountLabel");

const resetDataBtn = document.getElementById("resetDataBtn");

let modalCurrentDateKey = null;

// UTIL

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseDateKey(key) {
  const [y, m, d] = key.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}
function getTodayKey() {
  return formatDateKey(new Date());
}
function getActiveProfile() {
  return profiles.find(p => p.id === activeProfileId) || profiles[0];
}

// LOCAL STORAGE

function loadLocalData() {
  const eventsRaw = localStorage.getItem(STORAGE_KEY_EVENTS);
  if (eventsRaw) {
    try { events = JSON.parse(eventsRaw) || []; } catch { events = []; }
  }
  const notesRaw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (notesRaw) {
    try { dayNotes = JSON.parse(notesRaw) || {}; } catch { dayNotes = {}; }
  }
  const profileRaw = localStorage.getItem(STORAGE_KEY_PROFILE);
  if (profileRaw && profiles.some(p => p.id === profileRaw)) {
    activeProfileId = profileRaw;
  } else {
    activeProfileId = "samuele";
  }
}
function saveLocalEvents() {
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
}
function saveLocalNotes() {
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(dayNotes));
}
function saveLocalProfile() {
  if (activeProfileId) localStorage.setItem(STORAGE_KEY_PROFILE, activeProfileId);
}

// TEMA

function applyTheme() {
  const profile = getActiveProfile();
  document.documentElement.style.setProperty("--accent", profile.accent);
  document.documentElement.style.setProperty("--accent-soft", profile.accentSoft);
  if (profile.isDog) {
    document.body.style.background =
      "radial-gradient(circle at top, #451a03 0, #020617 55%, #020617 100%)";
    profileMoodLabelEl.textContent = "Modalità passeggiata attiva";
  } else {
    document.body.style.background =
      "radial-gradient(circle at top, #111827 0, #020617 52%, #020617 100%)";
    profileMoodLabelEl.textContent = "Profilo attivo";
  }
}

// PROFILI UI

function renderProfilesList() {
  profilesListEl.innerHTML = "";
  const activeProfile = getActiveProfile();
  activeProfileLabelEl.textContent = activeProfile.name;

  profiles.forEach(profile => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "profile-btn";
    btn.dataset.id = profile.id;
    if (profile.id === activeProfile.id) btn.classList.add("active");

    const avatar = document.createElement("div");
    avatar.className = "avatar " + (profile.isDog ? "avatar-dog" : "avatar-human");
    avatar.textContent = profile.isDog
      ? "🐶"
      : profile.name.charAt(0).toUpperCase();

    const main = document.createElement("div");
    main.className = "profile-main";

    const nameEl = document.createElement("div");
    nameEl.className = "profile-name";
    nameEl.textContent = profile.name;

    const roleEl = document.createElement("div");
    roleEl.className = "profile-role";
    roleEl.textContent = profile.role;

    const tagEl = document.createElement("div");
    tagEl.className = "profile-tag" + (profile.isDog ? " profile-tag-pesca" : "");
    tagEl.textContent = profile.theme;

    main.appendChild(nameEl);
    main.appendChild(roleEl);
    main.appendChild(tagEl);

    btn.appendChild(avatar);
    btn.appendChild(main);

    btn.addEventListener("click", async () => {
      activeProfileId = profile.id;
      saveLocalProfile();
      applyTheme();
      renderProfilesList();
      await refreshFromCloud();
      refreshAllView();
    });

    profilesListEl.appendChild(btn);
  });
}

// NAV

function setActivePage(pageId) {
  Object.entries(pages).forEach(([id, el]) => {
    el.style.display = id === pageId ? "block" : "none";
  });
  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });

  const profile = getActiveProfile();
  if (pageId === "dashboard") {
    mainSectionTitleEl.textContent = "Dashboard";
    mainSectionSubEl.textContent =
      "Panoramica del tempo, del giorno e dell’energia del profilo.";
    sectionTagTextEl.textContent = "Vista principale";
  } else if (pageId === "calendar") {
    mainSectionTitleEl.textContent = "Calendario";
    mainSectionSubEl.textContent =
      "Eventi personali e condivisi per " + profile.name + ".";
    sectionTagTextEl.textContent = "Giorni ed eventi";
  } else if (pageId === "events") {
    mainSectionTitleEl.textContent = "Eventi";
    mainSectionSubEl.textContent =
      "Lista completa degli eventi filtrata per profilo o condivisione.";
    sectionTagTextEl.textContent = "Lista eventi";
  } else if (pageId === "clock") {
    mainSectionTitleEl.textContent = "Orologio";
    mainSectionSubEl.textContent =
      "Vista focalizzata su tempo e statistiche di " + profile.name + ".";
    sectionTagTextEl.textContent = "Dettaglio tempo";
  }
}

// OROLOGIO

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  const giorni = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
  const mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const dayName = giorni[now.getDay()];
  const day = String(now.getDate()).padStart(2, "0");
  const monthName = mesi[now.getMonth()];
  const year = now.getFullYear();
  const dateStr = `${dayName} ${day} ${monthName} ${year}`;

  clockTimeEl.textContent = `${h}:${m}`;
  clockSecondsEl.textContent = s;
  clockDateEl.textContent = dateStr;

  clockTime2El.textContent = `${h}:${m}`;
  clockSeconds2El.textContent = s;
  clockDate2El.textContent = dateStr;

  lastUpdateTimeEl.textContent = `${h}:${m}:${s}`;
}
function initTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    tzTextEl.textContent = tz || "Fuso orario locale";
  } catch {
    tzTextEl.textContent = "Fuso orario locale";
  }
}

// QUOTES

function getRandomQuote(profileId) {
  const key = profiles.find(p => p.id === profileId)?.quotesKey;
  if (!key) return null;
  const arr = quotesData[key] || [];
  if (!arr.length) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}
function updateQuote() {
  const profile = getActiveProfile();
  const q = getRandomQuote(profile.id);
  if (!q) {
    quoteTextEl.textContent = "Questo profilo non ha ancora frasi definite.";
    quoteAuthorEl.textContent = "— Family Time Ultra";
  } else {
    quoteTextEl.textContent = q;
    quoteAuthorEl.textContent = "— " + profile.name;
  }
}

// EVENTI

function getEventsForDate(dateKey) {
  const profile = getActiveProfile();
  return events.filter(
    e => e.date === dateKey && (e.shared || e.profileId === profile.id)
  );
}
function getEventsForDateAll(dateKey) {
  return events.filter(e => e.date === dateKey);
}

function refreshTodayEvents() {
  const todayKey = getTodayKey();
  const todayEvents = getEventsForDate(todayKey);
  todayEventsListEl.innerHTML = "";
  if (!todayEvents.length) {
    const div = document.createElement("div");
    div.className = "events-empty";
    div.textContent = "Nessun evento per oggi ancora.";
    todayEventsListEl.appendChild(div);
  } else {
    todayEvents.forEach(ev => {
      const item = document.createElement("div");
      item.className = "event-item";

      const main = document.createElement("div");
      main.className = "event-main";

      const title = document.createElement("div");
      title.className = "event-title";
      title.textContent = ev.title;

      const meta = document.createElement("div");
      meta.className = "event-meta";
      const timeText = ev.time || "Tutto il giorno";
      const whoText = ev.shared
        ? "Condiviso"
        : "Solo " + (profiles.find(p => p.id === ev.profileId)?.name || "profilo");
      meta.textContent = `${timeText} · ${whoText}`;

      main.appendChild(title);
      main.appendChild(meta);

      const badge = document.createElement("div");
      badge.className = ev.shared ? "event-badge-shared" : "event-badge-private";
      badge.textContent = ev.shared ? "Condiviso" : "Personale";

      item.appendChild(main);
      item.appendChild(badge);
      todayEventsListEl.appendChild(item);
    });
  }
  todayEventsMetaEl.textContent =
    todayEvents.length + (todayEvents.length === 1 ? " evento" : " eventi");
}

function renderEventsList() {
  eventsListEl.innerHTML = "";
  const profile = getActiveProfile();
  let filtered = events.slice();

  if (eventsViewMode === "profile") {
    filtered = filtered.filter(e => e.profileId === profile.id);
  } else if (eventsViewMode === "shared") {
    filtered = filtered.filter(e => e.shared);
  }

  if (!filtered.length) {
    const div = document.createElement("div");
    div.className = "events-empty";
    div.textContent = "Nessun evento ancora. Inizia aggiungendone uno qui sotto.";
    eventsListEl.appendChild(div);
    return;
  }

  filtered.sort((a, b) => {
    if (a.date === b.date) return (a.time || "").localeCompare(b.time || "");
    return a.date.localeCompare(b.date);
  });

  filtered.forEach(ev => {
    const item = document.createElement("div");
    item.className = "event-item";

    const main = document.createElement("div");
    main.className = "event-main";

    const title = document.createElement("div");
    title.className = "event-title";
    title.textContent = ev.title;

    const meta = document.createElement("div");
    meta.className = "event-meta";
    const timeText = ev.time || "Tutto il giorno";
    const profileName =
      profiles.find(p => p.id === ev.profileId)?.name || "Profilo";
    meta.textContent = `${ev.date} · ${timeText} · ${profileName}`;

    const tags = document.createElement("div");
    tags.className = "event-small-meta";
    tags.textContent = ev.shared ? "Condiviso" : "Personale";

    main.appendChild(title);
    main.appendChild(meta);
    main.appendChild(tags);

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.flexDirection = "column";
    right.style.alignItems = "flex-end";
    right.style.gap = "4px";

    const badge = document.createElement("div");
    badge.className = ev.shared ? "event-badge-shared" : "event-badge-private";
    badge.textContent = ev.shared ? "Condiviso" : "Personale";

    const delBtn = document.createElement("button");
    delBtn.className = "event-delete-btn";
    delBtn.textContent = "Cancella";
    delBtn.addEventListener("click", async () => {
      events = events.filter(e => e !== ev);
      saveLocalEvents();
      await FamilyCloud.syncEventsToCloud(events);
      refreshAllView();
    });

    right.appendChild(badge);
    right.appendChild(delBtn);

    item.appendChild(main);
    item.appendChild(right);
    eventsListEl.appendChild(item);
  });
}

// CALENDARIO

function renderCalendar() {
  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();
  const monthNames = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  calendarMonthLabelEl.textContent = `${monthNames[month]} ${year}`;
  calendarGridEl.innerHTML = "";

  const dayNames = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
  dayNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "calendar-day-name";
    div.textContent = name;
    calendarGridEl.appendChild(div);
  });

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  if (startDay === 0) startDay = 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i < startDay; i++) {
    const empty = document.createElement("div");
    calendarGridEl.appendChild(empty);
  }

  const todayKey = getTodayKey();
  const profile = getActiveProfile();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateKey = formatDateKey(date);

    const cell = document.createElement("div");
    cell.className = "calendar-day-cell";
    if (dateKey === todayKey) cell.classList.add("calendar-day-today");

    const numberRow = document.createElement("div");
    numberRow.className = "calendar-day-number-row";

    const number = document.createElement("div");
    number.className = "calendar-day-number";
    number.textContent = d;

    const dot = document.createElement("div");
    dot.className = "calendar-day-dot";
    const dayEvents = getEventsForDateAll(dateKey);
    if (dayEvents.length > 0) dot.classList.add("has-events");

    numberRow.appendChild(number);
    numberRow.appendChild(dot);

    const preview = document.createElement("div");
    preview.className = "calendar-day-preview";
    const firstEvent = dayEvents[0];
    if (firstEvent) {
      preview.textContent =
        (firstEvent.shared ? "• [C] " : "• ") + firstEvent.title;
    } else {
      const noteKey = `${dateKey}|${profile.id}`;
      if (dayNotes[noteKey]) {
        preview.textContent = "Nota: " + dayNotes[noteKey].slice(0, 22);
      } else {
        preview.textContent = "";
      }
    }

    cell.appendChild(numberRow);
    cell.appendChild(preview);
    cell.addEventListener("click", () => openDayModal(dateKey));
    calendarGridEl.appendChild(cell);
  }
}

// MODAL GIORNO

function openDayModal(dateKey) {
  modalCurrentDateKey = dateKey;
  const date = parseDateKey(dateKey);
  const options = { weekday:"long", year:"numeric", month:"long", day:"numeric" };
  const formatted = date.toLocaleDateString("it-IT", options);
  modalDateTitleEl.textContent =
    formatted.charAt(0).toUpperCase() + formatted.slice(1);

  modalEventsContainerEl.innerHTML = "";
  const profile = getActiveProfile();
  const dayEvents = getEventsForDateAll(dateKey);

  if (!dayEvents.length) {
    const div = document.createElement("div");
    div.className = "events-empty";
    div.textContent = "Nessun evento in questo giorno (ancora).";
    modalEventsContainerEl.appendChild(div);
  } else {
    dayEvents.forEach(ev => {
      const item = document.createElement("div");
      item.className = "event-item";
      item.style.fontSize = "0.76rem";

      const main = document.createElement("div");
      main.className = "event-main";

      const title = document.createElement("div");
      title.className = "event-title";
      title.textContent = ev.title;

      const meta = document.createElement("div");
      meta.className = "event-meta";
      const timeText = ev.time || "Tutto il giorno";
      const profileName =
        profiles.find(p => p.id === ev.profileId)?.name || "Profilo";
      meta.textContent = `${timeText} · ${profileName}`;

      main.appendChild(title);
      main.appendChild(meta);

      const badge = document.createElement("div");
      badge.className = ev.shared ? "event-badge-shared" : "event-badge-private";
      badge.textContent = ev.shared ? "Condiviso" : "Personale";

      item.appendChild(main);
      item.appendChild(badge);
      modalEventsContainerEl.appendChild(item);
    });
  }

  const noteKey = `${dateKey}|${profile.id}`;
  modalNoteTextEl.value = dayNotes[noteKey] || "";

  eventModalBackdrop.style.display = "flex";
}
function closeDayModal() {
  eventModalBackdrop.style.display = "none";
  modalCurrentDateKey = null;
}

// PROFILO SUMMARY

function updateProfileSummary() {
  const profile = getActiveProfile();
  profileNameLabelEl.textContent = profile.name;
  profileRoleLabelEl.textContent = profile.role;
  profileThemeLabelEl.textContent = profile.theme;

  const profileEvents = events.filter(e => e.profileId === profile.id);
  profileEventsCountLabelEl.textContent = profileEvents.length;

  summaryProfileNameEl.textContent = profile.name;

  const todayKey = getTodayKey();
  let upcomingProfile = 0;
  let upcomingShared = 0;
  events.forEach(e => {
    if (e.date >= todayKey) {
      if (e.shared) upcomingShared++;
      if (e.profileId === profile.id) upcomingProfile++;
    }
  });
  summaryUpcomingProfileEl.textContent = upcomingProfile;
  summaryUpcomingSharedEl.textContent = upcomingShared;
}

// RESET LOCALE

function resetLocalData() {
  if (!confirm("Vuoi cancellare i dati sul dispositivo? (Cloud non toccato)")) return;
  localStorage.removeItem(STORAGE_KEY_EVENTS);
  localStorage.removeItem(STORAGE_KEY_NOTES);
  localStorage.removeItem(STORAGE_KEY_PROFILE);
  events = [];
  dayNotes = {};
  activeProfileId = "samuele";
  saveLocalProfile();
  applyTheme();
  renderProfilesList();
  refreshAllView();
}

// SYNC CLOUD

async function refreshFromCloud() {
  try {
    const cloudEvents = await FamilyCloud.loadEventsFromCloud();
    if (cloudEvents && cloudEvents.length) {
      events = cloudEvents;
      saveLocalEvents();
    }
    const cloudNotes = await FamilyCloud.loadNotesFromCloud();
    if (cloudNotes) {
      dayNotes = cloudNotes;
      saveLocalNotes();
    }
  } catch (e) {
    console.warn("Sync cloud fallita, uso solo locale:", e);
  }
}

// REFRESH

function refreshAllView() {
  updateClock();
  updateQuote();
  refreshTodayEvents();
  renderCalendar();
  renderEventsList();
  updateProfileSummary();
}

// INIT

async function initApp() {
  FamilyCloud.initFirebaseSync();
  loadLocalData();
  applyTheme();
  initTimezone();
  renderProfilesList();
  updateClock();

  try {
    const res = await fetch("data/quotes.json");
    quotesData = await res.json();
  } catch {
    quotesData = {};
  }

  await refreshFromCloud();
  refreshAllView();
  updateQuote();

  setInterval(updateClock, 1000);

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setActivePage(btn.dataset.page);
    });
  });

  quoteRefreshBtn.addEventListener("click", () => updateQuote());

  prevMonthBtn.addEventListener("click", () => {
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener("click", () => {
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
    renderCalendar();
  });
  todayMonthBtn.addEventListener("click", () => {
    calendarCurrentDate = new Date();
    renderCalendar();
  });

  eventsViewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      eventsViewMode = btn.dataset.view;
      eventsViewButtons.forEach(b => b.classList.toggle("active", b === btn));
      renderEventsList();
    });
  });

  addEventBtn.addEventListener("click", async () => {
    const title = eventTitleInput.value.trim();
    let date = eventDateInput.value;
    const time = eventTimeInput.value.trim();
    const shared = eventSharedInput.checked;
    const profile = getActiveProfile();

    if (!title) {
      alert("Inserisci un titolo per l’evento.");
      return;
    }
    if (!date) date = getTodayKey();

    const ev = {
      id: Date.now().toString(),
      title,
      date,
      time,
      shared,
      profileId: profile.id
    };
    events.push(ev);
    saveLocalEvents();
    await FamilyCloud.syncEventsToCloud(events);

    eventTitleInput.value = "";
    eventDateInput.value = "";
    eventTimeInput.value = "";
    eventSharedInput.checked = false;

    refreshAllView();
  });

  closeModalBtn.addEventListener("click", () => closeDayModal());

  saveModalBtn.addEventListener("click", async () => {
    if (!modalCurrentDateKey) return;
    const noteText = modalNoteTextEl.value.trim();
    const profile = getActiveProfile();
    const key = `${modalCurrentDateKey}|${profile.id}`;
    if (noteText) dayNotes[key] = noteText;
    else delete dayNotes[key];
    saveLocalNotes();
    await FamilyCloud.syncNotesToCloud(dayNotes);
    closeDayModal();
    renderCalendar();
  });

  deleteAllDayEventsBtn.addEventListener("click", async () => {
    if (!modalCurrentDateKey) return;
    if (!confirm("Vuoi davvero cancellare tutti gli eventi di questo giorno (cloud + locale)?")) return;
    events = events.filter(e => e.date !== modalCurrentDateKey);
    saveLocalEvents();
    await FamilyCloud.syncEventsToCloud(events);
    closeDayModal();
    refreshAllView();
  });

  eventModalBackdrop.addEventListener("click", e => {
    if (e.target === eventModalBackdrop) closeDayModal();
  });

  resetDataBtn.addEventListener("click", () => resetLocalData());
}

initApp();
