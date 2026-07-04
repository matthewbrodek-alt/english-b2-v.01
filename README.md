# English Cat Coach

Кроссплатформенный прототип приложения для разговорного английского уровня B2 и выше. Интерфейс вдохновлен чистой учебной логикой Skyeng: темы, диалоговая практика, голосовая помощь, тест и результат.

## Что уже есть

- Expo / React Native приложение для Android, iOS, планшетов и web-preview.
- Бренд и внутренняя тема `английский кот ученый`: иконка приложения, mascot в интерфейсе, учительские подсказки.
- Переключатель меню `RU / EN`.
- 50 уникальных тем.
- В каждой теме генерируется 55 Q/A обменов: вопрос + пример ответа.
- В каждом диалоговом обмене есть перевод вопроса, разбор полезных фраз и 3 правильных варианта ответа.
- Каждый правильный вариант ответа сопровождается переводом и объяснением на русском, как от преподавателя.
- После диалога открывается тест из 15 заданий.
- Оценка считается по 10-балльной системе.
- Статистика показывается только после завершения теста.
- Голосовая озвучка через `expo-speech`.
- Голосовые ответы в тесте через `expo-audio`: запись с микрофона, распознавание через backend endpoint или demo fallback.
- Самостоятельные ответы в диалоге: текстом или голосом, с расшифровкой и обучающим разбором без начисления баллов.
- App icon, adaptive Android icon, splash image и favicon лежат в `assets/`.
- Локальная авторизация: профиль ученика создается по имени и email и хранится на устройстве.
- Личный прогресс: после теста сохраняются попытки, лучший балл, последний результат и ошибки.
- Повторение слабых фраз: приложение собирает лексику из ошибочных тем и дает отдельный экран повторения.
- Бесплатный локальный backend для speech-to-text находится в `backend/`: он использует `faster-whisper` и принимает аудио через `/api/speech-to-text`.

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

## Как запустить бесплатный backend распознавания речи

Backend работает локально через `faster-whisper`, поэтому OpenAI API-ключ для распознавания речи не нужен. Первый запуск может скачать модель Whisper.

```powershell
cd C:\Users\Onesh\Documents\Codex\2026-07-04\new-chat\outputs\english-b2-voice-prototype
copy backend\.env.example backend\.env
python -m pip install -r backend\requirements.txt
```

В `backend\.env` можно выбрать модель и режим:

```env
PORT=8787
PYTHON_BIN=python
LOCAL_STT_MODEL=base.en
LOCAL_STT_DEVICE=cpu
LOCAL_STT_COMPUTE_TYPE=int8
LOCAL_STT_LANGUAGE=en
```

Рекомендация:

- `base.en` - хороший быстрый старт для английского;
- `small.en` - лучше качество, но медленнее;
- `medium.en` - еще лучше, но тяжелее для слабого компьютера.

Запуск backend:

```powershell
pnpm backend
```

Проверка:

```powershell
Invoke-WebRequest http://localhost:8787/health
```

В мобильном приложении endpoint задается в `.env`:

```env
EXPO_PUBLIC_STT_ENDPOINT=http://localhost:8787/api/speech-to-text
```

Для физического телефона вместо `localhost` обычно нужен IP компьютера в локальной сети, например:

```env
EXPO_PUBLIC_STT_ENDPOINT=http://192.168.1.10:8787/api/speech-to-text
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
5. Нажимай динамик, чтобы прослушивать английский вопрос или правильные варианты ответа.
6. В блоке `Мой ответ` напиши свой ответ на английском или нажми `Ответить на вопрос голосом`.
7. Изучи блок `Разбор фраз`: перевод, смысл и пример употребления.
8. Сравни свой ответ с тремя правильными вариантами и русскими объяснениями.
9. После сохранения приложение покажет расшифровку, сильную сторону ответа, подсказку и лексику темы.
10. После последнего обмена открой тест.
11. В тесте можно выбрать ответ вручную или нажать `Ответить голосом`.
12. Голосовой ответ записывается, распознается и выбирает вариант ответа.
13. После 15 заданий появляется статистика, прогресс и список слабых фраз.

## Speech-to-text

В приложении уже есть клиентская архитектура:

```text
microphone recording -> STT endpoint -> transcript -> dialogue feedback / test answer matching
```

Для реального распознавания речи нужен backend endpoint. В текущей версии backend использует бесплатный локальный `faster-whisper`, поэтому ключи speech-to-text не нужны.

Создай `.env` по примеру `.env.example`:

```env
EXPO_PUBLIC_STT_ENDPOINT=http://localhost:8787/api/speech-to-text
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
App.tsx              Основные экраны, RU/EN меню, вход, профиль, прогресс, повторение, урок, тест, результат
assets/              Иконка и mascot English Cat Coach для устройства, splash и web favicon
backend/             Node + Python backend для бесплатного локального faster-whisper speech-to-text
src/content.ts       50 тем, генератор 55 Q/A обменов с переводами и объяснениями, генератор 15 тестовых заданий
src/dialogueFeedback.ts  Локальный разбор свободного ответа в диалоге
src/learningStore.ts Локальный профиль, прогресс, ошибки и слабые фразы через AsyncStorage
src/speechToText.ts  STT endpoint adapter, demo fallback, matching transcript to answer option
src/theme.ts         Цвета, общие стили, тени
app.json             Настройки Expo и permission микрофона
eas.json             Профиль сборки APK через EAS
tsconfig.json        TypeScript-настройки; dist и временные папки исключены из проверки
```

## APK

В проект добавлен профиль APK-сборки:

```bash
eas build -p android --profile preview
```

Для облачной сборки нужен аккаунт Expo/EAS. Для локальной сборки нужен Android SDK и Java/JDK.

## Что еще нужно для полноценного приложения

- Перенести локальную авторизацию на production backend: email-пароль, Google/Apple, восстановление аккаунта.
- Перенести локальный прогресс в облачную базу, чтобы данные сохранялись между устройствами.
- Улучшить speech-to-text backend: rate limiting, user auth middleware, логирование ошибок, очередь обработки аудио, прогрев модели при старте.
- Offline-пакеты уроков и кеш аудио.
- Нативная APK/AAB сборка через EAS или локальный Android SDK.
- Платежи/подписка, если приложение будет коммерческим.
- Проверка UX на реальных Android-устройствах: микрофон, разрешения, размер текста, производительность.

## Проверка

```bash
tsc --noEmit
expo install --check
expo export --platform web
```
