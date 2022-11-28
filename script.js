class Search {

  constructor() {

    this.parser = document.querySelector('.parser');

    this.search = document.querySelector('.search');
    this.searchInput = this.search.querySelector('.search__input');
    this.searchSuggestions = this.search.querySelector('.search__suggestions');

    this.results = this.parser.querySelector('.results');

    this.searchInput.addEventListener('keyup', this.debounce(this.searchRepositories.bind(this), 500));
  }

  //создание DOM элемента

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  // Функция, которая создает предложенные репозитории

  createSuggestions(repoData) {

    const suggestion = this.createElement('li', 'search__item');

    suggestion.addEventListener('click', () => {

      this.addRepository(repoData);
      this.searchInput.value = '';
      this.searchSuggestions.innerHTML = '';
    });

    suggestion.innerHTML = `<li class="repo__item">${repoData.name}</li>`;
    this.searchSuggestions.append(suggestion);
  }

  // Функция, которая добавляет выбранный репозиторий в контейнер

  addRepository(repoData) {

    const repoContainer = this.createElement('div', 'results__repository');

    repoContainer.addEventListener('click', (event) => {
      if (event.target.tagName !== 'BUTTON') return;

      const container = event.target.closest('.results__repository');
      container.remove();
    })

    repoContainer.innerHTML = `<div><p class="results__item">Name: ${repoData.name}</p><p class="results__item">Owner: ${repoData.owner.login}</p><p class="results__item">Stars: ${repoData.stargazers_count}</p></div><button class="button"></button>`;

    this.results.append(repoContainer);


  }

  // Фетчим нужные репозитории

  async searchRepositories() {
    if (this.searchInput.value) {
      return await fetch(`https://api.github.com/search/repositories?q=${this.searchInput.value}&per_page=5`)
      .then(result => {
        if (result.ok) {
          result.json().then(element => {
            this.searchSuggestions.innerHTML = '';
            element.items.forEach(repository => this.createSuggestions(repository));
          });
        }
      })
    } else {
      this.searchSuggestions.innerHTML = '';
    }
  }

  // реализуем плавное отображение предложенных вариантов через дебаунс

  debounce(fn, ms) {

    let timeout;

    return function () {
        const debouncedFn = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(debouncedFn, ms);
    };
  }
  
}

new Search();