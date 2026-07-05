# Инструкция: GitHub, Expo, APK

## 1. Что Брать

Бери только папку:

```text
english-a2-c1-cat-coach-github-ready
```

Не бери всю папку `new-chat` и не загружай старые архивы.

## 2. Проверка Перед GitHub

Внутри проекта должны быть:

- `App.tsx`
- `src/`
- `assets/`
- `backend/`
- `package.json`
- `pnpm-lock.yaml`
- `app.json`
- `eas.json`
- `.gitignore`

Не должно быть в репозитории:

- `node_modules`
- `dist`
- `.expo`
- `.env`
- `backend/.env`

## 3. Загрузка На GitHub

```powershell
cd C:\Users\Onesh\Documents\Codex\2026-07-04\new-chat\outputs\english-a2-c1-cat-coach-github-ready
git init
git add .
git commit -m "Initial English Cat Coach app"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/ТВОЙ_РЕПОЗИТОРИЙ.git
git push -u origin main
```

Если GitHub уже создал репозиторий с README, сначала лучше загрузить проект в пустой репозиторий.

## 4. Запуск Через Expo

```powershell
pnpm install
pnpm start
```

После запуска открой QR-код в Expo Go на телефоне.

## 5. APK

```powershell
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Expo даст ссылку на скачивание APK после завершения сборки.

## 6. Голосовое Распознавание

Для озвучки ничего отдельно не нужно: она работает через `expo-speech`.

Для распознавания речи нужен backend:

```powershell
copy backend\.env.example backend\.env
python -m pip install -r backend\requirements.txt
pnpm backend
```

В `.env` укажи адрес backend на своём компьютере:

```env
EXPO_PUBLIC_STT_ENDPOINT=http://192.168.1.10:8787/api/speech-to-text
```

Телефон и компьютер должны быть в одной Wi-Fi сети.
