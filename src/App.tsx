const sections = ['Обо мне', 'Работы', 'Контакты'];

function App() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Главная навигация">
        <a className="brand" href="#top">
          Portfolio
        </a>
        <nav>
          {sections.map((section) => (
            <a key={section} href={`#${section.toLowerCase().replace(' ', '-')}`}>
              {section}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero" id="top">
        <p className="overline">Figma to GitHub Pages</p>
        <h1>Каркас портфолио готов к переносу дизайна.</h1>
        <p>
          Здесь можно быстро заменить разметку и стили на финальный макет,
          подключить ассеты из Figma и опубликовать сайт через GitHub Actions.
        </p>
        <a className="primary-link" href="#работы">
          Перейти к секциям
        </a>
      </section>

      <section className="content-grid" aria-label="Стартовые секции сайта">
        <article id="обо-мне">
          <span>01</span>
          <h2>Обо мне</h2>
          <p>Короткий блок для биографии, специализации и сильной первой мысли.</p>
        </article>
        <article id="работы">
          <span>02</span>
          <h2>Работы</h2>
          <p>Место для кейсов, карточек проектов, ссылок и изображений из макета.</p>
        </article>
        <article id="контакты">
          <span>03</span>
          <h2>Контакты</h2>
          <p>Финальный блок с почтой, соцсетями, CTA или формой обратной связи.</p>
        </article>
      </section>
    </main>
  );
}

export default App;
