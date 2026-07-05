# English Cat Coach

Expo / React Native приложение для обучения разговорному английскому с русским и английским меню, голосовой практикой, локальным прогрессом и уровневой методикой A2-C1.

## Что Внутри

- Методика A2, B1, B2, B2+, C1.
- 60 уроков: 5 уровней x 12 тем.
- В каждом уроке: роль ученика, цель Can Do, грамматика, лексика, произношение, фраза для живого общения, 55 шагов диалога и проверка из 15 заданий.
- Русские переводы и объяснения вычитаны вручную: фразы сделаны естественными, без машинного дословного перевода.
- Голосовая озвучка через `expo-speech`.
- Запись голосового ответа через `expo-audio`.
- Локальный backend для распознавания речи через `faster-whisper`.
- Локальный профиль, прогресс, ошибки и слабые фразы через AsyncStorage.

Материалы Cambridge использованы только как методическая опора: структура урока, прогрессия, повторение, продуктивные навыки и оценивание. Тексты, упражнения, ключи и задания из учебников не копировались.

## Зависимости Из Твоего Архива

Я сверил проект с архивом `eng v 01.rar` и сохранил те же основные модули и версии:

- `expo` 57.0.2
- `react` 19.2.3
- `react-native` 0.86.0
- `expo-audio` 57.0.0
- `expo-speech` 57.0.0
- `expo-linear-gradient` 57.0.0
- `@react-native-async-storage/async-storage` ^2.2.0
- `lucide-react-native` 1.23.0
- `react-native-svg` 15.15.4
- `typescript` 6.0.3

Backend также оставлен совместимым с архивом:

- `backend/package.json`
- `backend/server.mjs`
- `backend/transcribe.py`
- `backend/requirements.txt` с `faster-whisper>=1.1.0`

## Быстрый Запуск

```powershell
cd C:\Users\Onesh\Documents\Codex\2026-07-04\new-chat\outputs\english-a2-c1-cat-coach-github-ready
pnpm install
pnpm start
```

После запуска Expo можно открыть приложение на телефоне через Expo Go.

## Голосовое Распознавание

Озвучка и запись голоса работают в приложении. Для настоящего speech-to-text нужен backend:

```powershell
copy backend\.env.example backend\.env
python -m pip install -r backend\requirements.txt
pnpm backend
```

Для телефона укажи IP компьютера в одной Wi-Fi сети:

```env
EXPO_PUBLIC_STT_ENDPOINT=http://192.168.1.10:8787/api/speech-to-text
```

## Что Загружать На GitHub

Загружай содержимое папки:

```text
english-a2-c1-cat-coach-github-ready
```

Не загружай:

- `node_modules/`
- `dist/`
- `.expo/`
- `.env`
- `backend/.env`
- старые `.rar` и `.zip`
- логи

Файл `.gitignore` уже закрывает эти папки и секреты.

## APK Через Expo/EAS

В проекте уже есть `eas.json`. Для APK:

```powershell
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Профиль `preview` собирает APK:

```json
"buildType": "apk"
```

Для публикации в Google Play используется профиль `production`, который собирает Android App Bundle.

## Проверки

```powershell
pnpm run check
expo export --platform web
```

Если `expo` не найден, запускай через:

```powershell
pnpm exec expo export --platform web
```

## Важные Идентификаторы

- Expo slug: `english-a2-c1-cat-coach`
- Android package: `com.onesh.englishcatcoach`
- iOS bundle ID: `com.onesh.englishcatcoach`

Эти идентификаторы уже обновлены под новую версию приложения, чтобы в Expo и APK не оставалось старого `b2`-названия.
