# Вступ
Ласкаво просимо до керівництва з використання Retold! Цей проєкт створений для спрощення доступу до розкладу занять та консультацій. У цьому документі ви знайдете інформацію про те, як використовувати веб-додаток та телеграм бота для керування вашими розкладами.

# Алгоритм використання сайта
## Реєстрація та вхід

### Для нових користувачів
1. Перейдіть на сторінку реєстрації.
2. Введіть у форму ваші дані та зареєструйтесь.
3. Ви будете перенаправлені на сторінку авторизації.
4. Введіть ваші облікові дані (електронну пошту та пароль).
5. Після успішного входу ви будете перенаправлені на головну сторінку.

### Для зареєстрованих користувачів
1. Перейдіть на сторінку входу.
2. Введіть ваші облікові дані (електронну пошту та пароль).
3. Після успішного входу ви будете перенаправлені на головну сторінку.

## Профіль користувача
На сторінці профілю ви можете переглянути та змінити дані, які ви вказали під час реєстрації та отримати телеграм токен, який необхідно вказати в боті.

## Створення розкладу занять та консультацій
Після авторизації, ви отримаєте доступ до панелі керування блоками, з неї ви зможете:
- створити новий блок, редагувати або видалити існуючий;
- в створеному блоці під час редагування можна: 
	- додати, відредагувати та видалити розклад занять; 
	- додати, відредагувати та видалити розклад консультацій.

### Заповнення розкладу занять
На сторінці розкладу занять у форму створення введіть необхідну інформацію про предмет:
- Тип тижня (загальне, чисельник, знаменник), якщо заняття проводиться в тиждень чисельника або знаменника оберіть відповідний тип тижня, якщо заняття проводиться незалежно від типу тижня оберіть "загальне";
- День тижня, коли проходить заняття;
- Час початку заняття;
- Час завершення заняття;
- Назва заняття;
- Тип заняття, практика або лекція;
- Номер кабінету;
- Посилання для першої підгрупи;
- Посилання для другої підгрупи.

### Редагування
Ви можете змінити необхідне вам поле, для вже створенного заняття, для цього натисніть на кнопку редагування біля необхідного заняття.

### Заповнення розкладу консультацій
На сторінці розкладу консультацій у форму створення введіть необхідну інформацію про предмет:
- Назва консультації;
- Ім'я викладача, який проводить консультацію;
- День тижня, коли проходить консультація;
- Час початку консультації;
- Номер кабінету;
- Посилання.

### Редагування
Ви можете змінити необхідне вам поле, для вже створенного заняття, для цього натисніть на кнопку редагування біля необхідного заняття.

### Після створення розкладу занять або консультацій, ви можете отримати цей розклад в телеграм боті

## Алгоритм використання бота
### Початок
### Посилання на бота: https://t.me/RetoldTgBot
Вперше відкривши чат з ботом, або додавши його до групи, користувачу потрібно ввести команду `/start`, яка запустить бота в чаті. Бот запитає у користувача токен, який він повинен був отримати на сайті. Також на запиті токена є інлайн кнопка, яка містить посилання на профіль на сайті.
Користувач повинен відправити свій токен у чат звичайним повідомленям або переслати повідомлення з іншого чата.
Після чого бот перевіряє наявність токена в базі даних, далі працює за трьома можливими розвитками:
1. Користувач правильно ввів токен, а також створив хоча б один блок – бот перейде до наступного кроку;
2. Користувач правильно ввів токен, але не створи жодного блоку – бот повідомить користувача, що токен існує, але до нього не прив'язано жодного блоку;
3. Користувач не правильно ввів токен, або його вже не існує – бот повідомить користувача, що такого токена не існує та буде очікувати на повторне введене валідного токена;
### Вибір блоку
Після того, як користувач вірно ввів токен, бот запитає до якого блоку прив'язати чат і виведе всі прив'язані блоки до цього токена у вигляді повідомлення з інлайн кнопками, де будуть відображатися усі можливі варіанти.
Користувачу достатньо натиснути на будь-яку кнопку, щоби прив'язати блок до чату. Після успішного прив'язання, бот повідомить користувача про успішну операцію та виведе клавіатуру.
### Клавіатура




## Команди бота
### `/start`
Команда `/start` запускає бота і відображає вітальне повідомлення. Це початкова точка взаємодії з ботом.
### `/schedule`
Команда `/schedule` відображає розклад у вигляді повідомлення, де зазначені наступні параметри:
- Тип тижня;
- День тижня;
- Час заняття;
- Назва заняття;
- Місце проведення заняття, за наявністю;
- Тип заняття, що містить посилання.
### `/nextschedule`
Команда `/nextschedule` відображає розклад за наступним типом тижня у вигляді повідомлення, де зазначені наступні параметри:
- Наступний тип тижня;
- День тижня;
- Час заняття;
- Назва заняття;
- Місце проведення заняття, за наявністю;
- Тип заняття, що містить посилання.
### `/consultations`
Команда `/consultations` відображає таблицю консультацій, в якій зазначені наступні параметри:
- День тижня;
- Час початку;
- Назва предмета, яка може містити посилання;
- Ім'я викладача, що може бути пустим;
- Місце проведення, що може бути пустим;
### `/now`
Команда `/now` відображає інформацію про заняття, яке наразі проходить, у вигляді повідомлення, де зазначені наступні параметри:
- Назва заняття;
- Час початку та кінця заняття;
- Місце проведення заняття, за наявністю;
- Тип заняття, що містить посилання;
- Стан повітряної тривоги у місті Дніпро;
### `/next`
Команда `/next` відображає інформацію про заняття, яке буде проходити наступним, у вигляді повідомлення, де зазначені наступні параметри:
- Назва заняття;
- Час початку та кінця заняття;
- Місце проведення заняття, за наявністю;
- Тип заняття, що містить посилання;
- Стан повітряної тривоги у місті Дніпро;
