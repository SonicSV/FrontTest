class TodoService {
  _apiBase = 'http://127.0.0.1:1080/';
  headers = {
    'Content-Type': 'application/json'
  };

  request = async (urlEndPoint, method, headers, body = null) => {
    try {
      const response = await fetch(`${this._apiBase}${urlEndPoint}`, {
        method,
        headers,
        body,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Could not fetch ${this._apiBase}${urlEndPoint}, status: ${response.status}`);
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  login = async (username) => {
    return await this.request('login', 'POST', this.headers, username);
  }

  getTasks = async () => {
    return await this.request('task', 'GET', this.headers);
  }

  updateTasks = async (task) => {
    return await this.request('task', 'PUT', this.headers, task);
  }

  addTasks = async (task) => {
    return await this.request('task', 'POST', this.headers, task);
  }

  deleteTasks = async (task) => {
    return await this.request('task', 'DELETE', this.headers, task);
  }
}

export default TodoService;