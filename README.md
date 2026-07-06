# English Cat Coach

Expo / React Native приложение для разговорного английского B1-B2. Методика обновлена под Alex: теплый, прямой spoken-English coach, который заставляет ученика говорить больше, исправляет коротко и не превращает занятие в экзамен.

## Что внутри

- 60 разговорных сессий: 6 базовых тем x 10 вариаций практики.
- Примерно половина тем бытовые: выходные, мнения, спор, истории из поездок.
- Примерно половина тем business/freelance: discovery call, price objection, cold outreach follow-up.
- В каждой сессии: warm-up, main scenario, follow-up, phrase spotlight, wrap-up prep.
- В каждом диалоге 55 реплик и после него 15 проверочных заданий.
- В каждой теме есть phrase bank: 3-5 живых фраз, перевод, usage note и пример.
- Ответ можно напечатать или записать голосом.
- Feedback теперь в стиле Alex: сначала поддержка, потом 2-3 короткие правки формата `wrong -> right -> reason`.
- Русское меню и переключение RU/EN сохранены.
- Локальный прогресс, слабые фразы и история попыток сохраняются на устройстве.
- Версия приложения: `0.2.0`, Android `versionCode`: `2`.

## Голос

Озвучка работает через `expo-speech`, запись голоса через `expo-audio`.

Для настоящего speech-to-text нужен локальный backend:

```powershell
copy .env.example .env
copy backend\.env.example backend\.env
python -m pip install -r backend\requirements.txt
pnpm backend
```

В корневом `.env` укажи адрес backend:

```env
EXPO_PUBLIC_STT_ENDPOINT=http://192.168.1.10:8787/api/speech-to-text
```

Телефон и компьютер должны быть в одной Wi-Fi сети.

## Быстрый запуск

```powershell
cd C:\Users\Administrator\Desktop\eng v 01\english-b2-voice-prototype-source
corepack enable
pnpm install
pnpm start
```

Если `pnpm` недоступен:

```powershell
npm install
npm start
```

## GitHub

Загружай только папку проекта, не всю папку `new-chat`.

Не загружай:

- `node_modules/`
- `dist/`
- `.expo/`
- `.env`
- `backend/.env`
- `.zip`
- `.rar`
- логи

Файлы `.gitignore` и `.easignore` уже настроены.

## EAS и APK

В переносимом архиве нет `extra.eas.projectId`. Это правильно: EAS должен записать его на том компьютере и в том Expo-проекте, где ты собираешь APK.

```powershell
npx eas-cli login
npx eas-cli init
git add app.json
git commit -m "Link EAS project"
git push
npx eas-cli build -p android --profile preview
```

Профиль `preview` собирает APK.

Если Expo Dashboard пишет `eas-config-mismatch`, значит сборка запущена не из того Expo-проекта или GitHub подключен к старому проекту. Нужно собирать проект, чей `extra.eas.projectId` совпадает с `app.json`.

## Проверки

```powershell
pnpm run check
pnpm exec expo export --platform web
```

## Идентификаторы

- Expo slug: `english-a2-c1-cat-coach`
- Android package: `com.onesh.englishcatcoach`
- iOS bundle ID: `com.onesh.englishcatcoach`
