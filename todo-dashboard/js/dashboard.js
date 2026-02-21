// Dashboard rendering and interaction
class Dashboard {
    constructor() {
        this.data = null;
    }

    async init() {
        await this.refresh();
    }

    async refresh() {
        this.data = await loadTodoData();
        this.render();
        this.updateSyncStatus();
    }

    render() {
        this.renderStats();
        this.renderTimeline();
        this.renderProjects();
        this.renderNextActions();
    }

    renderStats() {
        const { total, completed, ongoing, percentage } = this.data.stats;
        
        // Total progress circle
        const circle = document.querySelector('.circle');
        const percentageText = document.querySelector('.percentage');
        circle.style.strokeDasharray = `${percentage}, 100`;
        percentageText.textContent = `${percentage}%`;

        // Counts
        document.getElementById('completed-count').textContent = completed;
        document.getElementById('total-count').textContent = total;
        document.getElementById('active-projects').textContent = ongoing;
    }

    renderTimeline() {
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';

        // Combine all projects with dates/progress
        const allProjects = [
            ...this.data.completed.map(p => ({ ...p, timeStatus: 'completed' })),
            ...this.data.projects.map(p => ({ ...p, timeStatus: 'in-progress' })),
            ...this.data.future.map(p => ({ ...p, timeStatus: 'future' }))
        ];

        allProjects.forEach(project => {
            const item = document.createElement('div');
            item.className = `timeline-item ${project.timeStatus}`;
            
            const completedSteps = project.steps.filter(s => s.done).length;
            const totalSteps = project.steps.length;
            const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

            item.innerHTML = `
                <h3>${project.title}</h3>
                <p style="color: var(--text-muted); margin: 0.5rem 0;">${project.description || 'Ingen beskrivning'}</p>
                <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
                    <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); width: ${progress}%; transition: width 0.3s;"></div>
                    </div>
                    <span style="color: var(--text-muted); font-size: 0.875rem;">${completedSteps}/${totalSteps}</span>
                </div>
            `;
            timeline.appendChild(item);
        });
    }

    renderProjects() {
        const container = document.getElementById('projects-list');
        container.innerHTML = '';

        this.data.projects.forEach(project => {
            const projectEl = this.createProjectElement(project);
            container.appendChild(projectEl);
        });

        // Also show completed if any
        if (this.data.completed.length > 0) {
            const completedHeader = document.createElement('h3');
            completedHeader.textContent = '✅ Slutförda projekt';
            completedHeader.style.marginTop = '2rem';
            completedHeader.style.marginBottom = '1rem';
            container.appendChild(completedHeader);

            this.data.completed.forEach(project => {
                const projectEl = this.createProjectElement(project);
                container.appendChild(projectEl);
            });
        }
    }

    createProjectElement(project) {
        const div = document.createElement('div');
        div.className = 'project';

        const statusClass = project.status || 'ongoing';
        const statusText = statusClass === 'ongoing' ? 'Pågående' : 
                          statusClass === 'done' ? 'Klart' : 'Planerat';

        let stepsHTML = '';
        project.steps.forEach(step => {
            const icon = step.done ? '✅' : '⏳';
            const doneClass = step.done ? 'done' : '';
            stepsHTML += `
                <li class="step-item ${doneClass}">
                    <span class="step-icon">${icon}</span>
                    <span>${step.text}</span>
                </li>
            `;
        });

        div.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-status ${statusClass}">${statusText}</span>
            </div>
            ${project.description ? `<p style="color: var(--text-muted); margin-bottom: 1rem;">${project.description}</p>` : ''}
            <ul class="steps-list">
                ${stepsHTML}
            </ul>
            ${project.files ? `
                <details style="margin-top: 1rem; color: var(--text-muted);">
                    <summary style="cursor: pointer;">📁 Filer (${project.files.length})</summary>
                    <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                        ${project.files.map(f => `<li style="font-family: monospace; font-size: 0.875rem;">${f}</li>`).join('')}
                    </ul>
                </details>
            ` : ''}
        `;

        return div;
    }

    renderNextActions() {
        const container = document.getElementById('next-actions-list');
        container.innerHTML = '';

        // Find all incomplete steps from ongoing projects
        const nextActions = [];
        this.data.projects.forEach(project => {
            const nextStep = project.steps.find(s => !s.done);
            if (nextStep) {
                nextActions.push({
                    project: project.title,
                    action: nextStep.text,
                    priority: nextStep.number === 1 ? 'high' : 'normal'
                });
            }
        });

        // Limit to top 5
        nextActions.slice(0, 5).forEach((action, index) => {
            const div = document.createElement('div');
            div.className = 'action-item';
            div.innerHTML = `
                <span style="font-size: 1.5rem;">⚡</span>
                <div style="flex: 1;">
                    <div class="action-priority">${action.project}</div>
        <div>${action.action}</div>
                </div>
            `;
            container.appendChild(div);
        });

        if (nextActions.length === 0) {
            container.innerHTML = '<p style="color: white; opacity: 0.7;">Inga pending actions! 🎉</p>';
        }
    }

    updateSyncStatus() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('last-sync').textContent = `Senast uppdaterad: ${timeStr}`;
    }
}

// Initialize dashboard on load
const dashboard = new Dashboard();
window.addEventListener('DOMContentLoaded', () => dashboard.init());
window.loadTodoData = () => dashboard.refresh();
