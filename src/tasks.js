export default function tasksRender(tasks) {
    let element = document.querySelector('.todos-wrapper')
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    class Tasks {
        constructor(description, state, index) {
            this.description = description;
            this.state = state;
            this.index = index;
            this.parent = document.querySelector('.todos-wrapper');
        }

        render() {
            const element = document.createElement('div');

            element.innerHTML = `
            <div class="todo-item ${this.state == 'done' ? 'checked' : ''}" id='${this.index}'>
                <div class="description">${this.description}</div>
                <div class="buttons">
                    <input class="btn-complete" type="checkbox" ${this.state == 'done' ? 'checked' : ''}>
                    <button class="btn-delete">Удалить</button>
                </div>
            </div>
            `;
            this.parent.append(element);
        }
    }

    function renderTasks() {
        tasks.forEach(({ description, state }, index) => {
            new Tasks(description, state, index).render();
        })
    }
    renderTasks()
}