const sections = ['dashboard', 'skills', 'tasks', 'resources', 'calendar', 'social', 'analytics'];
const sectionTitle = document.getElementById('sectionTitle');
const themeToggle = document.getElementById('themeToggle');
let skills = JSON.parse(localStorage.getItem('skills')) || [
    { name: 'JavaScript', level: 5.0, history: [] },
    { name: 'Python', level: 3.5, history: [] },
    { name: 'HTML', level: 4.5, history: [] },
    { name: 'CSS', level: 4.0, history: [] },
    { name: 'Node.js', level: 3.0, history: [] },
    { name: 'React', level: 2.5, history: [] }
];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
let resources = JSON.parse(localStorage.getItem('resources')) || [];
let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];
const profiles = [
    { name: 'Alice Smith', initials: 'AS', role: 'Frontend Developer' },
    { name: 'Bob Johnson', initials: 'BJ', role: 'Backend Developer' },
    { name: 'Carol White', initials: 'CW', role: 'UI/UX Designer' }
];
const currentDate = new Date(2025, 3, 1); // April 2025

// Theme toggle
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
    localStorage.setItem('darkMode', this.checked);
});

// Welcome toast
const welcomeToast = document.getElementById('welcomeToast');
welcomeToast.classList.remove('hidden');
setTimeout(() => {
    welcomeToast.style.opacity = '0';
    setTimeout(() => welcomeToast.classList.add('hidden'), 1000);
}, 3000);

// Sidebar navigation
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        const section = this.getAttribute('data-section');
        sections.forEach(s => {
            const sectionElement = document.getElementById(s);
            if (sectionElement) {
                sectionElement.classList.add('hidden');
            }
        });
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            sectionTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);
            if (section === 'calendar') renderCalendar();
            if (section === 'analytics') updateCharts();
        }
    });
});

// Skill Progress
function renderSkills() {
    const skillProgress = document.getElementById('skillProgress');
    const skillsList = document.getElementById('skillsList');
    skillProgress.innerHTML = '';
    skillsList.innerHTML = '';
    skills.forEach((skill, index) => {
        const percentage = (skill.level / 5) * 100;
        skillProgress.innerHTML += `
            <div class="mb-3">
                <div class="flex justify-between mb-1">
                    <span>${skill.name}</span>
                    <span>${skill.level.toFixed(1)}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-[15px] dark:bg-gray-600">
                    <div class="skill-level" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        skillsList.innerHTML += `
            <div class="skill-item flex justify-between items-center mb-2 p-2 border-b">
                <span>${skill.name} (Level: ${skill.level.toFixed(1)})</span>
                <button class="text-red-500 delete-skill" data-index="${index}">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;
    });
    document.querySelectorAll('.delete-skill').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            skills.splice(index, 1);
            localStorage.setItem('skills', JSON.stringify(skills));
            renderSkills();
            updateCharts();
        });
    });
}

// Add Skill
document.getElementById('addSkillButton').addEventListener('click', function() {
    const name = document.getElementById('newSkillInput').value.trim();
    const level = parseFloat(document.getElementById('skillLevelInput').value);
    if (name && level >= 0 && level <= 5) {
        skills.push({ name, level, history: [{ date: new Date().toISOString(), level }] });
        localStorage.setItem('skills', JSON.stringify(skills));
        document.getElementById('newSkillInput').value = '';
        document.getElementById('skillLevelInput').value = '';
        renderSkills();
        updateCharts();
    }
});

// Tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const tasksList = document.getElementById('tasksList');
    taskList.innerHTML = '';
    tasksList.innerHTML = '';
    tasks.forEach((task, index) => {
        taskList.innerHTML += `
            <div class="task-item flex justify-between items-center mb-2 p-2 border-b">
                <span>${task.text}</span>
                <div>
                    <button class="text-green-500 complete-task" data-index="${index}">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <button class="text-red-500 delete-task" data-index="${index}">
                        <svg class="w-4 h-4" fill="current fragmentaryColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        tasksList.innerHTML += `
            <div class="task-item flex justify-between items-center mb-2 p-2 border-b">
                <span>${task.text}</span>
                <div>
                    <button class="text-green-500 complete-task" data-index="${index}">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <button class="text-red-500 delete-task" data-index="${index}">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateCharts();
        });
    });
    document.querySelectorAll('.complete-task').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            completedTasks.push({ ...tasks[index], completedDate: new Date().toISOString() });
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
            renderTasks();
            updateCharts();
        });
    });
}

document.getElementById('quickAddButton').addEventListener('click', function() {
    const newTask = document.getElementById('quickAddInput').value.trim();
    if (newTask) {
        tasks.push({ text: newTask, createdDate: new Date().toISOString() });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.getElementById('quickAddInput').value = '';
        renderTasks();
        updateCharts();
    }
});

document.getElementById('addTaskButton').addEventListener('click', function() {
    const newTask = document.getElementById('newTaskInput').value.trim();
    if (newTask) {
        tasks.push({ text: newTask, createdDate: new Date().toISOString() });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.getElementById('newTaskInput').value = '';
        renderTasks();
        updateCharts();
    }
});

document.getElementById('quickAddInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('quickAddButton').click();
    }
});

document.getElementById('newTaskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('addTaskButton').click();
    }
});

// Resources
function renderResources() {
    const resourcesList = document.getElementById('resourcesList');
    resourcesList.innerHTML = '';
    resources.forEach((resource, index) => {
        resourcesList.innerHTML += `
            <div class="resource-item flex justify-between items-center mb-2 p-2 border-b">
                <a href="${resource.url}" target="_blank" class="text-blue-500 hover:underline">${resource.name}</a>
                <button class="text-red-500 delete-resource" data-index="${index}">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;
    });
    document.querySelectorAll('.delete-resource').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            resources.splice(index, 1);
            localStorage.setItem('resources', JSON.stringify(resources));
            renderResources();
        });
    });
}

document.getElementById('resourceUpload').addEventListener('change', function(e) {
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            resources.push({ name: file.name, url: event.target.result });
            localStorage.setItem('resources', JSON.stringify(resources));
            renderResources();
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
});

// Calendar
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar() {
    const calendarMonth = document.getElementById('calendarMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    const date = new Date(currentYear, currentMonth, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    calendarMonth.textContent = `${monthName} ${currentYear}`;

    const firstDay = date.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    calendarGrid.innerHTML = `
        <div class="font-semibold">Sun</div>
        <div class="font-semibold">Mon</div>
        <div class="font-semibold">Tue</div>
        <div class="font-semibold">Wed</div>
        <div class="font-semibold">Thu</div>
        <div class="font-semibold">Fri</div>
        <div class="font-semibold">Sat</div>
    `;

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDeadlines = deadlines.filter(d => {
            const dDate = new Date(d.date);
            return dDate.getDate() === day && dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
        });
        let deadlinesHtml = '';
        dayDeadlines.forEach(d => {
            deadlinesHtml += `<div class="deadline text-sm">${d.text}</div>`;
        });
        calendarGrid.innerHTML += `
            <div class="calendar-day relative">
                <span>${day}</span>
                ${deadlinesHtml}
            </div>
        `;
    }

    renderDeadlines();
}

document.getElementById('prevMonth').addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

function renderDeadlines() {
    const deadlinesList = document.getElementById('deadlinesList');
    deadlinesList.innerHTML = '';
    deadlines.forEach((deadline, index) => {
        const dDate = new Date(deadline.date);
        if (dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear) {
            deadlinesList.innerHTML += `
                <div class="deadline-item flex justify-between items-center mb-2 p-2 border-b">
                    <span>${deadline.text} (${dDate.toLocaleDateString()})</span>
                    <button class="text-red-500 delete-deadline" data-index="${index}">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            `;
        }
    });
    document.querySelectorAll('.delete-deadline').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deadlines.splice(index, 1);
            localStorage.setItem('deadlines', JSON.stringify(deadlines));
            renderCalendar();
        });
    });
}

document.getElementById('addDeadlineButton').addEventListener('click', function() {
    const text = document.getElementById('deadlineInput').value.trim();
    const date = document.getElementById('deadlineDate').value;
    if (text && date) {
        deadlines.push({ text, date });
        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        document.getElementById('deadlineInput').value = '';
        document.getElementById('deadlineDate').value = '';
        renderCalendar();
    }
});

document.getElementById('deadlineInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('addDeadlineButton').click();
    }
});

// Social
function renderSocial() {
    const socialProfiles = document.getElementById('socialProfiles');
    socialProfiles.innerHTML = '';
    profiles.forEach(profile => {
        socialProfiles.innerHTML += `
            <div class="profile-card p-4 bg-gray-100 dark:bg-gray-800 rounded-md mb-4 flex items-center">
                <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span class="text-gray-600">${profile.initials}</span>
                </div>
                <div>
                    <div class="font-semibold">${profile.name}</div>
                    <div class="text-gray-500 dark:text-gray-400">${profile.role}</div>
                </div>
            </div>
        `;
    });
}

// Analytics
let tasksChart, skillsChart;

function getTimeFilteredData(period) {
    const now = new Date();
    const tasksData = { pending: [], completed: [] };
    const skillsData = skills.map(s => ({ name: s.name, levels: [] }));

    if (period === 'daily') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        tasksData.pending = tasks.filter(t => {
            const tDate = new Date(t.createdDate);
            return tDate.toDateString() === today.toDateString();
        }).length;
        tasksData.completed = completedTasks.filter(t => {
            const tDate = new Date(t.completedDate);
            return tDate.toDateString() === today.toDateString();
        }).length;
        skillsData.forEach(s => {
            const todayLevel = s.history.find(h => {
                const hDate = new Date(h.date);
                return hDate.toDateString() === today.toDateString();
            });
            s.levels.push(todayLevel ? todayLevel.level : s.level);
        });
    } else if (period === 'weekly') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            tasksData.pending.push(tasks.filter(t => {
                const tDate = new Date(t.createdDate);
                return tDate.toDateString() === day.toDateString();
            }).length);
            tasksData.completed.push(completedTasks.filter(t => {
                const tDate = new Date(t.completedDate);
                return tDate.toDateString() === day.toDateString();
            }).length);
            skillsData.forEach(s => {
                const dayLevel = s.history.find(h => {
                    const hDate = new Date(h.date);
                    return hDate.toDateString() === day.toDateString();
                });
                s.levels.push(dayLevel ? dayLevel.level : s.level);
            });
        }
    } else if (period === 'monthly') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        for (let i = 0; i < daysInMonth; i++) {
            const day = new Date(startOfMonth);
            day.setDate(startOfMonth.getDate() + i);
            tasksData.pending.push(tasks.filter(t => {
                const tDate = new Date(t.createdDate);
                return tDate.toDateString() === day.toDateString();
            }).length);
            tasksData.completed.push(completedTasks.filter(t => {
                const tDate = new Date(t.completedDate);
                return tDate.toDateString() === day.toDateString();
            }).length);
            skillsData.forEach(s => {
                const dayLevel = s.history.find(h => {
                    const hDate = new Date(h.date);
                    return hDate.toDateString() === day.toDateString();
                });
                s.levels.push(dayLevel ? dayLevel.level : s.level);
            });
        }
    }

    return { tasksData, skillsData };
}

function updateCharts() {
    const timePeriod = document.getElementById('timePeriod').value;
    const chartType = document.getElementById('chartType').value;
    const { tasksData, skillsData } = getTimeFilteredData(timePeriod);
    const tasksCtx = document.getElementById('tasksChart').getContext('2d');
    const skillsCtx = document.getElementById('skillsChart').getContext('2d');

    if (tasksChart) tasksChart.destroy();
    if (skillsChart) skillsChart.destroy();

    let labels = ['Pending', 'Completed'];
    let taskData = [tasksData.pending, tasksData.completed];
    if (timePeriod === 'weekly') {
        labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        taskData = [{
            label: 'Pending',
            data: tasksData.pending,
            backgroundColor: '#f97316',
            borderColor: '#f97316',
            fill: chartType === 'line'
        }, {
            label: 'Completed',
            data: tasksData.completed,
            backgroundColor: '#e11d48',
            borderColor: '#e11d48',
            fill: chartType === 'line'
        }];
    } else if (timePeriod === 'monthly') {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        taskData = [{
            label: 'Pending',
            data: tasksData.pending,
            backgroundColor: '#f97316',
            borderColor: '#f97316',
            fill: chartType === 'line'
        }, {
            label: 'Completed',
            data: tasksData.completed,
            backgroundColor: '#e11d48',
            borderColor: '#e11d48',
            fill: chartType === 'line'
        }];
    }

    tasksChart = new Chart(tasksCtx, {
        type: chartType,
        data: {
            labels,
            datasets: timePeriod === 'daily' ? [{
                label: 'Tasks',
                data: taskData,
                backgroundColor: ['#f97316', '#e11d48'],
                borderColor: ['#f97316', '#e11d48'],
                borderWidth: 2
            }] : taskData
        },
        options: {
            scales: chartType !== 'pie' && chartType !== 'radar' ? {
                y: { beginAtZero: true }
            } : {},
            plugins: {
                legend: {
                    display: chartType !== 'pie'
                }
            }
        }
    });

    labels = timePeriod === 'daily' ? skillsData.map(s => s.name) :
             timePeriod === 'weekly' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] :
             Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => (i + 1).toString());

    const skillDatasets = timePeriod === 'daily' ? [{
        label: 'Skill Levels',
        data: skillsData.map(s => s.levels[0]),
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        borderColor: '#f97316',
        borderWidth: 2
    }] : skillsData.map(s => ({
        label: s.name,
        data: s.levels,
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
        borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        borderWidth: 2,
        fill: chartType === 'line'
    }));

    skillsChart = new Chart(skillsCtx, {
        type: chartType,
        data: {
            labels,
            datasets: skillDatasets
        },
        options: {
            scales: chartType !== 'pie' && chartType !== 'radar' ? {
                y: { beginAtZero: true, max: 5 }
            } : chartType === 'radar' ? {
                r: { beginAtZero: true, max: 5 }
            } : {},
            plugins: {
                legend: {
                    display: chartType !== 'pie'
                }
            }
        }
    });
}

document.getElementById('timePeriod').addEventListener('change', updateCharts);
document.getElementById('chartType').addEventListener('change', updateCharts);

// Timer
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
let seconds = 0;
let timerId;
let isRunning = false;

function updateTimer() {
    seconds++;
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timerElement.textContent = `${hours}:${minutes}:${secs}`;
}

startButton.addEventListener('click', function() {
    if (!isRunning) {
        isRunning = true;
        timerId = setInterval(updateTimer, 1000);
        startButton.textContent = "Running...";
    }
});

pauseButton.addEventListener('click', function() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerId);
        startButton.textContent = "Start";
    }
});

resetButton.addEventListener('click', function() {
    isRunning = false;
    clearInterval(timerId);
    seconds = 0;
    timerElement.textContent = "00:00:00";
    startButton.textContent = "Start";
});

// Next Task
document.getElementById('startTaskButton').addEventListener('click', function() {
    alert('Starting: Complete JavaScript Basics course');
});

// Quick Tip
const tips = [
    "Teach what you've learned to solidify your understanding.",
    "Break tasks into smaller, manageable chunks.",
    "Review your progress weekly to stay on track.",
    "Collaborate with peers to gain new perspectives."
];
document.getElementById('quickTip').textContent = tips[Math.floor(Math.random() * tips.length)];

// Initialize
renderSkills();
renderTasks();
renderResources();
renderSocial();
renderCalendar();
updateCharts();