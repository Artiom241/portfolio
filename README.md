# Portfolio Site

Стартовый фронтенд для портфолио: React, TypeScript, Vite и готовый workflow для публикации на GitHub Pages.

## Команды

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Как переносить дизайн из Figma

1. Экспортируйте изображения, иконки и прочие ассеты в `public/` или `src/assets/`.
2. Перенесите структуру секций в `src/App.tsx` либо разнесите их по компонентам в `src/`.
3. Замените базовые токены и стили в `src/styles.css` на цвета, типографику, сетку и состояния из макета.
4. Проверьте `npm run build` перед пушем.

## Публикация через GitHub Pages

1. Создайте пустой репозиторий на GitHub.
2. Подключите remote:

```bash
git remote add origin git@github.com:<user>/<repo>.git
git add .
git commit -m "Set up portfolio site"
git push -u origin main
```

3. В GitHub откройте `Settings -> Pages` и выберите `GitHub Actions` как источник публикации.
4. После пуша workflow `.github/workflows/deploy.yml` соберет сайт и опубликует `dist`.

Vite автоматически выставляет корректный `base` для обычного репозитория GitHub Pages (`/<repo>/`) и для `<user>.github.io` (`/`).
