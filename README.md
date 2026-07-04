# Fluent B2 Coach

Кроссплатформенный прототип приложения для разговорного английского уровня B2 и выше. Интерфейс вдохновлен чистой учебной логикой Skyeng: темы, диалоговая практика, голосовая помощь, тест и результат.

## Что уже есть

- Expo / React Native приложение для Android, iOS, планшетов и web-preview.
- Переключатель меню `RU / EN`.
- 50 уникальных тем.
- В каждой теме генерируется 55 Q/A обменов: вопрос + пример ответа.
- После диалога открывается тест из 15 заданий.
- Оценка считается по 10-балльной системе.
- Статистика показывается только после завершения теста.
- Голосовая озвучка через `expo-speech`.
- Голосовые ответы в тесте через `expo-audio`: запись с микрофона, распознавание через backend endpoint или demo fallback.
- Самостоятельные ответы в диалоге: текстом или голосом, с расшифровкой и обучающим разбором без начисления баллов.

## Как запустить

```powershell
cd C:\Users\Onesh\Documents\Codex\2026-07-04\new-chat\outputs\english-b2-voice-prototype
pnpm install
pnpm start
```

Если запускать из окружения Codex на этой машине:

```powershell
$env:Path = 'C:\Users\Onesh\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:Path
& 'C:\Users\Onesh\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd' install
& 'C:\Users\Onesh\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd' start
```

После запуска Expo:

- нажми `a`, чтобы открыть Android emulator;
- отсканируй QR-код через Expo Go на телефоне;
- нажми `w`, чтобы открыть web-preview.

## Как пользоваться

1. Открой приложение.
2. Переключи меню `RU / EN`, если нужно.
3. Выбери одну из 50 тем.
4. Пройди диалог: 55 Q/A обменов.
5. Нажимай динамик, чтобы прослушивать английский вопрос или пример ответа.
6. В блоке `Мой ответ` напиши свой ответ на английском или нажми `Ответить на вопрос голосом`.
7. После сохранения приложение покажет расшифровку, сильную сторону ответа, подсказку и лексику темы.
8. После последнего обмена открой тест.
9. В тесте можно выбрать ответ вручную или нажать `Ответить голосом`.
10. Голосовой ответ записывается, распознается и выбирает вариант ответа.
11. После 15 заданий появляется статистика.

## Speech-to-text

В приложении уже есть клиентская архитектура:

```text
microphone recording -> STT endpoint -> transcript -> dialogue feedback / test answer matching
```

Для реального распознавания речи нужен backend endpoint. Не храни API-ключи speech-to-text прямо в мобильном приложении.

Создай `.env` по примеру `.env.example`:

```env
EXPO_PUBLIC_STT_ENDPOINT=https://your-backend.example.com/api/speech-to-text
```

Endpoint должен принимать `multipart/form-data`:

- `audio`: файл записи;
- `promptId`: id диалогового вопроса или тестового задания;
- `questionId`: тот же id для совместимости с простым backend.

Ответ endpoint:

```json
{
  "text": "I choose option B because it sounds more natural."
}
```

Если `EXPO_PUBLIC_STT_ENDPOINT` не задан, включается demo fallback: приложение имитирует распознавание, чтобы можно было проверить UX без сервера.

## Структура

```text
App.tsx              Основные экраны, RU/EN меню, урок, самостоятельный ответ, тест, голосовой ответ, результат
src/content.ts       50 тем, генератор 55 Q/A обменов, генератор 15 тестовых заданий
src/dialogueFeedback.ts  Локальный разбор свободного ответа в диалоге
src/speechToText.ts  STT endpoint adapter, demo fallback, matching transcript to answer option
src/theme.ts         Цвета, общие стили, тени
app.json             Настройки Expo и permission микрофона
eas.json             Профиль сборки APK через EAS
```

## APK

В проект добавлен профиль APK-сборки:

```bash
eas build -p android --profile preview
```

Для облачной сборки нужен аккаунт Expo/EAS. Для локальной сборки нужен Android SDK и Java/JDK.

## Проверка

```bash
tsc --noEmit
expo install --check
expo export --platform web
```
