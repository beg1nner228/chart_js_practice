import './style.css'
import Chart from 'chart.js/auto'; 

// 1. Получение DOM-элементов
const ctx = document.getElementById('myViteChart');
// ! ВАЖНО: ctx может быть null, если элемент CANVAS еще не загружен! 
// Если Vite не обрабатывает HTML, лучше обернуть все в DOMContentLoaded.
if (!ctx) {
    console.error("Элемент 'myViteChart' не найден!");
    // Здесь можно прервать выполнение, чтобы избежать ошибок.
}


const addNewAmountInput = document.querySelector("#amount");
const selectTypeInput = document.querySelector("#type"); // Добавили переменную для селекта
const form = document.querySelector(".expense-form");


// 2. Исходные данные для графика (пустые)
const chartData = {
    labels: [], 
    datasets: [{
        label: 'Расходы по категориям',
        data: [], 
        backgroundColor: [
            'rgba(255, 99, 132, 0.6)', // Красный
            'rgba(54, 162, 235, 0.6)', // Синий
            'rgba(255, 206, 86, 0.6)', // Желтый
            'rgba(75, 192, 192, 0.6)', // Зеленый
            'rgba(153, 102, 255, 0.6)', // Фиолетовый
            'rgba(255, 159, 64, 0.6)', // Оранжевый
        ],
        hoverOffset: 10
    }]
};

// 3. Создаем конфигурацию графика
const chartConfig = {
    type: 'doughnut', 
    data: chartData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Распределение Расходов'
            }
        }
    }
};

// 4. Инициализация графика (ОДИН РАЗ!)
// Проверяем, что ctx существует, прежде чем создавать график
let myChart;
if (ctx) {
    myChart = new Chart(ctx, chartConfig);
}
// 5. Обработчик формы
form.addEventListener("submit", createNewGraph);

function createNewGraph(e) {
    e.preventDefault();

    // 1. Получаем значения и конвертируем сумму в число
    const amountValue = parseFloat(addNewAmountInput.value);
    const categoryValue = selectTypeInput.value;

    // 2. Проверка данных
    if (isNaN(amountValue) || amountValue <= 0 || !categoryValue) {
        alert("Пожалуйста, введите корректную сумму и выберите категорию.");
        return; // Прекращаем выполнение, если данные неверны
    }
    
    // 3. Добавление данных в массивы
    
    // ПРОВЕРКА НА СУЩЕСТВОВАНИЕ КАТЕГОРИИ (ВАЖНО ДЛЯ КРУГОВЫХ ДИАГРАММ!)
    const existingIndex = chartData.labels.indexOf(categoryValue);

    if (existingIndex > -1) {
        // Категория уже есть: обновляем старое значение
        const oldAmount = chartData.datasets[0].data[existingIndex];
        chartData.datasets[0].data[existingIndex] = oldAmount + amountValue;
    } else {
        // Категории нет: добавляем новую
        chartData.labels.push(categoryValue);
        chartData.datasets[0].data.push(amountValue);
    }

    // 4. Обновление графика (САМЫЙ ВАЖНЫЙ ШАГ)
    // Мы передали myChart ссылку на chartData, поэтому достаточно вызвать update()
    if (myChart) {
        myChart.update();
    }
    
    // Очистка формы после отправки
    form.reset(); 
    
    console.log("Данные обновлены:", chartData.labels, chartData.datasets[0].data);
}