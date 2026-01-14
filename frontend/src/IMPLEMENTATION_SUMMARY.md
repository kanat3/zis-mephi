# Резюме реализации функциональных требований

## ✅ Полностью реализованные функции (с использованием существующих endpoints)

### Управление проектами
1. **Поиск и просмотр списка проектов** ✅
   - Компонент: `ProjectsView` в `/components/MainPage.tsx`
   - API: `GET /projects`
   - Функции: поиск по названию и ответственному, фильтрация активных/архивных

2. **Создание проекта** ✅
   - Модальное окно с формой создания
   - API: `POST /project`
   - Валидация обязательных полей

3. **Удаление проекта** ✅
   - Кнопка удаления с подтверждением
   - API: `DELETE /project?id={id}`

4. **Архивирование проекта** ✅
   - Кнопка архивации
   - API: `POST /project/archive?id={id}`

5. **Установка даты срока** ✅
   - Модальное окно установки даты (`SetCompletionDateModal`)
   - API: `POST /project/set-completion-date?id={id}`

### Управление тест-кейсами
6. **Создание тест-кейса** 
   - Модальное окно в детальном виде проекта
   - API: `POST /test-case`

7. **Удаление тест-кейса** 
   - API: `DELETE /test-case?id={id}`

### Управление тест-планами
8. **Создание тест-плана** 
   - Модальное окно с формой
   - API: `POST /test-plan`

9. **Удаление тест-плана** 
   - API: `DELETE /test-plan?id={id}`

### Управление требованиями
10. **Добавление требования к тест-кейсу** 
    - API: `POST /test-case/add-requirement`

11. **Удаление требования из тест-кейса** 
    - API: `POST /test-case/remove-requirement`

### Управление тестовыми наборами
12. **Просмотр тестовых наборов** 
    - Компонент: `TestSuiteManagement`
    - API: `GET /test-suites`

13. **Добавление тест-кейса в набор** 
    - API: `POST /test-suite/add-test-case`

14. **Удаление тест-кейса из набора** 
    - API: `POST /test-suite/remove-test-case`

### Отчеты
15. **Запуск тестового набора** 
    - API: `POST /run-tests`

16. **Просмотр отчетов** 
    - Компонент: `ReportsView`
    - API: `GET /test-reports`

17. **Поиск отчета** 
    - Реализован поиск в `ReportsView`

## ⚠️ Функции с UI, ожидающие реализации на бекенде

### Редактирование сущностей
18. **Редактирование проекта** ⚠️
    - UI: Модальное окно `EditProjectModal` в `/components/Modals.tsx`
    - Backend: TODO - требуется `PUT /project`
    - При попытке использования показывается сообщение о необходимости реализации на бекенде

19. **Редактирование тест-кейса** ⚠️
    - UI: Модальное окно `EditTestCaseModal` в `/components/Modals.tsx`
    - Backend: TODO - требуется `PUT /test-case`
    - Включает: название, статус, описание, шаги, ожидаемый результат

20. **Редактирование тест-плана** ⚠️
    - UI: Модальное окно `EditTestPlanModal` в `/components/Modals.tsx`
    - Backend: TODO - требуется `PUT /test-plan`

21. **Редактирование тестового набора** ⚠️
    - UI: Компонент `TestSuiteManagement` в `/components/TestSuiteManagement.tsx`
    - Backend: TODO - требуется `PUT /test-suite`

### Управление тестовыми наборами
22. **Создание тестового набора** ⚠️
    - UI: Реализован в `TestSuiteManagement`
    - Backend: TODO - требуется `POST /test-suite`

23. **Удаление тестового набора** ⚠️
    - UI: Реализован в `TestSuiteManagement`
    - Backend: TODO - требуется `DELETE /test-suite`

### Утверждение тест-планов
24. **Утверждение тест-плана** ⚠️
    - UI: Модальное окно `ApproveRejectTestPlanModal` в `/components/Modals.tsx`
    - Backend: TODO - требуется `POST /test-plan/approve`

25. **Возврат тест-плана с замечаниями** ⚠️
    - UI: Модальное окно `ApproveRejectTestPlanModal` в `/components/Modals.tsx`
    - Backend: TODO - требуется `POST /test-plan/reject`
    - Параметры: комментарии с замечаниями