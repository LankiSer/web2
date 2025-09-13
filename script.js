// Глобальные переменные
let currentDemo = null;
let apiKeys = {
    omdb: '',
    dadata: ''
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadApiKeys();
    initializeNavigation();
});

// Навигация
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Работа с демонстрациями
function startDemo(demoNumber) {
    currentDemo = demoNumber;
    const modal = document.getElementById('demoModal');
    const modalBody = document.getElementById('modalBody');
    
    switch(demoNumber) {
        case 1:
            loadOmdbDemo(modalBody);
            break;
        case 2:
            loadDadataDemo(modalBody);
            break;
        case 3:
            loadCombinedDemo(modalBody);
            break;
    }
    
    modal.style.display = 'block';
}

// Демонстрация OMDB API
function loadOmdbDemo(modalBody) {
    modalBody.innerHTML = `
        <div class="demo-content">
            <h2>🎬 OMDB API - Поиск фильмов</h2>
            <div class="demo-explanation">
                <h3>Что изучаем:</h3>
                <ul>
                    <li>Работа с внешними API</li>
                    <li>HTTP запросы и обработка JSON</li>
                    <li>Асинхронное программирование</li>
                    <li>Обработка ошибок API</li>
                </ul>
            </div>
            
            <div class="demo-interface">
                <div class="search-section">
                    <h3>Поиск фильма:</h3>
                    <div class="search-input">
                        <input type="text" id="movieSearch" placeholder="Введите название фильма">
                        <button onclick="searchMovie()">Найти</button>
                    </div>
                    <div class="api-status" id="omdbStatus">
                        ${apiKeys.omdb ? '✅ API ключ настроен' : '❌ Необходимо настроить API ключ'}
                    </div>
                </div>
                
                <div class="results-section" id="movieResults">
                    <!-- Результаты поиска будут здесь -->
                </div>
            </div>
            
            <div class="code-example">
                <h3>Пример кода:</h3>
                <pre><code>async function searchMovie(title) {
    const response = await fetch(
        \`http://www.omdbapi.com/?apikey=\${API_KEY}&t=\${title}\`
    );
    const data = await response.json();
    return data;
}</code></pre>
            </div>
        </div>
    `;
}

// Демонстрация DaData API
function loadDadataDemo(modalBody) {
    modalBody.innerHTML = `
        <div class="demo-content">
            <h2>🏠 DaData API - Работа с адресами</h2>
            <div class="demo-explanation">
                <h3>Что изучаем:</h3>
                <ul>
                    <li>Автодополнение адресов</li>
                    <li>Валидация данных</li>
                    <li>Работа с геоданными</li>
                    <li>UX для форм ввода</li>
                </ul>
            </div>
            
            <div class="demo-interface">
                <div class="address-section">
                    <h3>Поиск адреса:</h3>
                    <div class="address-input">
                        <input type="text" id="addressInput" placeholder="Начните вводить адрес">
                        <div class="suggestions" id="addressSuggestions"></div>
                    </div>
                    <div class="api-status" id="dadataStatus">
                        ${apiKeys.dadata ? '✅ API ключ настроен' : '❌ Необходимо настроить API ключ'}
                    </div>
                </div>
                
                <div class="address-info" id="addressInfo">
                    <!-- Информация об адресе будет здесь -->
                </div>
            </div>
            
            <div class="code-example">
                <h3>Пример кода:</h3>
                <pre><code>async function suggestAddress(query) {
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Token \${API_KEY}\`
        },
        body: JSON.stringify({ query })
    });
    return await response.json();
}</code></pre>
            </div>
        </div>
    `;
    
    // Добавить обработчик для автодополнения
    const addressInput = document.getElementById('addressInput');
    if (addressInput) {
        addressInput.addEventListener('input', handleAddressInput);
    }
}

// Комбинированная демонстрация
function loadCombinedDemo(modalBody) {
    modalBody.innerHTML = `
        <div class="demo-content">
            <h2>🔗 Интеграция API - Полное приложение</h2>
            <div class="demo-explanation">
                <h3>Что изучаем:</h3>
                <ul>
                    <li>Комбинирование нескольких API</li>
                    <li>Управление состоянием приложения</li>
                    <li>Кэширование данных</li>
                    <li>Оптимизация производительности</li>
                </ul>
            </div>
            
            <div class="demo-interface">
                <div class="combined-section">
                    <h3>Найти кинотеатры рядом с адресом:</h3>
                    <div class="combined-input">
                        <input type="text" id="locationInput" placeholder="Введите адрес">
                        <button onclick="findNearbyCinemas()">Найти кинотеатры</button>
                    </div>
                </div>
                
                <div class="combined-results" id="cinemaResults">
                    <!-- Результаты будут здесь -->
                </div>
            </div>
            
            <div class="code-example">
                <h3>Пример кода:</h3>
                <pre><code>async function findCinemasNearAddress(address) {
    // 1. Получаем координаты адреса через DaData
    const coords = await geocodeAddress(address);
    
    // 2. Ищем кинотеатры рядом через Google Places API
    const cinemas = await findNearbyPlaces(coords, 'movie_theater');
    
    // 3. Получаем информацию о фильмах через OMDB
    const movies = await getPopularMovies();
    
    return { cinemas, movies };
}</code></pre>
            </div>
        </div>
    `;
}

// Функции для работы с OMDB API
async function searchMovie() {
    const searchInput = document.getElementById('movieSearch');
    const resultsDiv = document.getElementById('movieResults');
    
    if (!apiKeys.omdb) {
        showMessage('Ошибка: Необходимо настроить OMDB API ключ', 'error');
        return;
    }
    
    const movieTitle = searchInput.value.trim();
    if (!movieTitle) {
        showMessage('Введите название фильма', 'warning');
        return;
    }
    
    try {
        resultsDiv.innerHTML = '<div class="loading">🔍 Поиск фильма...</div>';
        
        const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKeys.omdb}&t=${encodeURIComponent(movieTitle)}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            displayMovieInfo(data);
        } else {
            resultsDiv.innerHTML = `<div class="error">❌ Фильм не найден: ${data.Error}</div>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error">❌ Ошибка при поиске: ${error.message}</div>`;
    }
}

function displayMovieInfo(movie) {
    const resultsDiv = document.getElementById('movieResults');
    
    resultsDiv.innerHTML = `
        <div class="movie-card">
            <div class="movie-poster">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Image'}" 
                     alt="${movie.Title}" 
                     onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
            </div>
            <div class="movie-info">
                <h3>${movie.Title} (${movie.Year})</h3>
                <p><strong>Жанр:</strong> ${movie.Genre}</p>
                <p><strong>Режиссер:</strong> ${movie.Director}</p>
                <p><strong>Актеры:</strong> ${movie.Actors}</p>
                <p><strong>Рейтинг IMDB:</strong> ${movie.imdbRating}/10</p>
                <p><strong>Сюжет:</strong> ${movie.Plot}</p>
                <div class="movie-details">
                    <span class="detail">⏱️ ${movie.Runtime}</span>
                    <span class="detail">🌍 ${movie.Country}</span>
                    <span class="detail">🗣️ ${movie.Language}</span>
                </div>
            </div>
        </div>
    `;
}

// Функции для работы с DaData API
let addressTimeout;

function handleAddressInput(event) {
    const query = event.target.value.trim();
    const suggestionsDiv = document.getElementById('addressSuggestions');
    
    clearTimeout(addressTimeout);
    
    if (query.length < 3) {
        suggestionsDiv.innerHTML = '';
        return;
    }
    
    addressTimeout = setTimeout(() => {
        suggestAddress(query);
    }, 300);
}

async function suggestAddress(query) {
    const suggestionsDiv = document.getElementById('addressSuggestions');
    
    if (!apiKeys.dadata) {
        suggestionsDiv.innerHTML = '<div class="error">Необходимо настроить DaData API ключ</div>';
        return;
    }
    
    try {
        const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKeys.dadata}`
            },
            body: JSON.stringify({
                query: query,
                count: 5
            })
        });
        
        const data = await response.json();
        
        if (data.suggestions && data.suggestions.length > 0) {
            suggestionsDiv.innerHTML = data.suggestions.map(suggestion => `
                <div class="suggestion-item" onclick="selectAddress('${suggestion.value}', '${suggestion.data.geo_lat || ''}', '${suggestion.data.geo_lon || ''}')">
                    ${suggestion.value}
                </div>
            `).join('');
        } else {
            suggestionsDiv.innerHTML = '<div class="no-results">Адреса не найдены</div>';
        }
    } catch (error) {
        suggestionsDiv.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

function selectAddress(address, lat, lon) {
    const addressInput = document.getElementById('addressInput');
    const suggestionsDiv = document.getElementById('addressSuggestions');
    const addressInfo = document.getElementById('addressInfo');
    
    addressInput.value = address;
    suggestionsDiv.innerHTML = '';
    
    if (lat && lon) {
        addressInfo.innerHTML = `
            <div class="address-details">
                <h4>📍 Информация об адресе:</h4>
                <p><strong>Адрес:</strong> ${address}</p>
                <p><strong>Координаты:</strong> ${lat}, ${lon}</p>
                <div class="map-link">
                    <a href="https://yandex.ru/maps/?ll=${lon},${lat}&z=15" target="_blank">
                        📍 Открыть на карте
                    </a>
                </div>
            </div>
        `;
    }
}

// Функции для комбинированной демонстрации
async function findNearbyCinemas() {
    const locationInput = document.getElementById('locationInput');
    const resultsDiv = document.getElementById('cinemaResults');
    
    const address = locationInput.value.trim();
    if (!address) {
        showMessage('Введите адрес для поиска', 'warning');
        return;
    }
    
    resultsDiv.innerHTML = '<div class="loading">🔍 Поиск кинотеатров...</div>';
    
    try {
        // Симуляция работы с API (так как у нас нет реальных API для поиска кинотеатров)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockCinemas = [
            {
                name: 'Кинотеатр "Синема Парк"',
                address: 'ТЦ "Мега", ул. Ленина, 123',
                distance: '0.5 км',
                movies: ['Дюна 2', 'Мстители', 'Человек-паук']
            },
            {
                name: 'Кинотеатр "Художественный"',
                address: 'ул. Пушкина, 45',
                distance: '1.2 км',
                movies: ['Дюна 2', 'Кунг-фу Панда 4', 'Джон Уик 5']
            },
            {
                name: 'Кинотеатр "Империя"',
                address: 'пр. Мира, 78',
                distance: '2.1 км',
                movies: ['Дюна 2', 'Топ Ган: Мэверик', 'Аватар 2']
            }
        ];
        
        displayCinemas(mockCinemas);
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error">❌ Ошибка при поиске: ${error.message}</div>`;
    }
}

function displayCinemas(cinemas) {
    const resultsDiv = document.getElementById('cinemaResults');
    
    resultsDiv.innerHTML = `
        <div class="cinemas-list">
            <h4>🎬 Найденные кинотеатры:</h4>
            ${cinemas.map(cinema => `
                <div class="cinema-card">
                    <h5>${cinema.name}</h5>
                    <p><strong>Адрес:</strong> ${cinema.address}</p>
                    <p><strong>Расстояние:</strong> ${cinema.distance}</p>
                    <div class="cinema-movies">
                        <strong>Идут фильмы:</strong>
                        <ul>
                            ${cinema.movies.map(movie => `<li>🎬 ${movie}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Управление API ключами
function saveApiKey(apiType, inputId) {
    const input = document.getElementById(inputId);
    const key = input.value.trim();
    
    if (!key) {
        showMessage('Введите API ключ', 'warning');
        return;
    }
    
    apiKeys[apiType] = key;
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    
    showMessage(`✅ API ключ для ${apiType.toUpperCase()} сохранен`, 'success');
    
    // Обновить статус в открытых демо
    updateApiStatus();
}

function loadApiKeys() {
    const saved = localStorage.getItem('apiKeys');
    if (saved) {
        apiKeys = JSON.parse(saved);
    }
    
    // Заполнить поля ввода
    const omdbInput = document.getElementById('omdbKey');
    const dadataInput = document.getElementById('dadataKey');
    
    if (omdbInput) omdbInput.value = apiKeys.omdb;
    if (dadataInput) dadataInput.value = apiKeys.dadata;
}

function updateApiStatus() {
    const omdbStatus = document.getElementById('omdbStatus');
    const dadataStatus = document.getElementById('dadataStatus');
    
    if (omdbStatus) {
        omdbStatus.innerHTML = apiKeys.omdb ? '✅ API ключ настроен' : '❌ Необходимо настроить API ключ';
    }
    
    if (dadataStatus) {
        dadataStatus.innerHTML = apiKeys.dadata ? '✅ API ключ настроен' : '❌ Необходимо настроить API ключ';
    }
}

// Вспомогательные функции
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    switch(type) {
        case 'success':
            messageDiv.style.background = '#4CAF50';
            break;
        case 'error':
            messageDiv.style.background = '#f44336';
            break;
        case 'warning':
            messageDiv.style.background = '#ff9800';
            break;
        default:
            messageDiv.style.background = '#2196F3';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

function closeModal() {
    const modal = document.getElementById('demoModal');
    modal.style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('demoModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Добавить CSS для демонстраций
const demoStyles = `
    <style>
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .demo-content {
            padding: 1rem;
        }
        
        .demo-explanation {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        
        .demo-interface {
            margin-bottom: 2rem;
        }
        
        .search-section, .address-section, .combined-section {
            margin-bottom: 2rem;
        }
        
        .search-input, .address-input, .combined-input {
            display: flex;
            gap: 10px;
            margin-bottom: 1rem;
        }
        
        .search-input input, .address-input input, .combined-input input {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
        }
        
        .search-input input:focus, .address-input input:focus, .combined-input input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .search-input button, .combined-input button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .search-input button:hover, .combined-input button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .api-status {
            padding: 10px;
            border-radius: 5px;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .loading {
            text-align: center;
            padding: 2rem;
            font-size: 1.1rem;
            color: #667eea;
        }
        
        .error {
            color: #f44336;
            font-weight: 600;
        }
        
        .movie-card {
            display: flex;
            gap: 2rem;
            background: white;
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            margin-top: 1rem;
        }
        
        .movie-poster img {
            width: 200px;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .movie-info {
            flex: 1;
        }
        
        .movie-info h3 {
            color: #333;
            margin-bottom: 1rem;
        }
        
        .movie-info p {
            margin-bottom: 0.5rem;
            line-height: 1.5;
        }
        
        .movie-details {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            flex-wrap: wrap;
        }
        
        .detail {
            background: #f0f2ff;
            color: #667eea;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9rem;
        }
        
        .address-input {
            position: relative;
        }
        
        .suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .suggestion-item {
            padding: 12px 15px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.2s ease;
        }
        
        .suggestion-item:hover {
            background: #f8f9fa;
        }
        
        .suggestion-item:last-child {
            border-bottom: none;
        }
        
        .no-results {
            padding: 12px 15px;
            color: #666;
            text-align: center;
        }
        
        .address-details {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            margin-top: 1rem;
        }
        
        .map-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        
        .map-link a:hover {
            text-decoration: underline;
        }
        
        .cinemas-list {
            margin-top: 1rem;
        }
        
        .cinema-card {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .cinema-card h5 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .cinema-movies ul {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
        }
        
        .cinema-movies li {
            margin-bottom: 0.3rem;
        }
        
        .code-example {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: 10px;
            margin-top: 2rem;
            overflow-x: auto;
        }
        
        .code-example h3 {
            color: #e2e8f0;
            margin-bottom: 1rem;
        }
        
        .code-example pre {
            margin: 0;
            font-family: 'Courier New', monospace;
            line-height: 1.5;
        }
        
        .code-example code {
            font-family: inherit;
        }
    </style>
`;

// Добавить стили в head
document.head.insertAdjacentHTML('beforeend', demoStyles);