# Инструкция: GitHub, Expo, APK

## 1. Что изменилось в версии 0.2.0

- Методика заменена на Alex spoken coach для B1-B2.
- В приложении теперь 60 разговорных сессий.
- Половина фокуса: бытовой английский.
- Половина фокуса: freelance/business English для международных клиентов.
- Android `versionCode` поднят до `2`, чтобы новый APK отличался от первой сборки.

## 2. Что брать

Для старого пути на другом компьютере бери архив с папкой:

```text
eng v 01\english-b2-voice-prototype-source
```

Не загружай на GitHub всю папку `new-chat` и не добавляй старые архивы.

## 3. Что не должно попадать в GitHub

- `node_modules`
- `dist`
- `.expo`
- `.env`
- `backend/.env`
- `.zip`
- `.rar`
- логи

## 4. Обновление уже существующего репозитория

Если репозиторий уже создан, после распаковки новой версии:

```powershell
cd C:\Users\Administrator\Desktop\eng v 01\english-b2-voice-prototype-source
git status
git add App.tsx src app.json package.json README.md GITHUB_EXPO_APK_RU.md
git commit -m "Update app to Alex spoken coach method"
git push
```

## 5. EAS

Если `app.json` уже привязан через `npx eas-cli init`, оставь `extra.eas.projectId` как есть.

Если работаешь из чистого архива:

```powershell
npx eas-cli login
npx eas-cli init
git add app.json
git commit -m "Link EAS project"
git push
```

## 6. APK

```powershell
npx eas-cli build -p android --profile preview
```

Expo даст ссылку на скачивание APK после сборки.

## 7. Если APK не ставится поверх старого

В этой версии уже стоит:

```json
"version": "0.2.0",
"android": {
  "versionCode": 2
}
```

Если Android все равно ругается на конфликт пакетов, удали старую версию приложения с телефона и установи новый APK.

## 8. Голосовое распознавание

Озвучка работает через `expo-speech`, запись голоса через `expo-audio`.

Для распознавания речи:

```powershell
copy .env.example .env
copy backend\.env.example backend\.env
python -m pip install -r backend\requirements.txt
pnpm backend
```

В `.env`:

```env
EXPO_PUBLIC_STT_ENDPOINT=http://192.168.1.10:8787/api/speech-to-text
```
