import { useEffect, useRef, useState } from 'react';

const A = `${import.meta.env.BASE_URL}assets/`;

const links = {
  behanceMain: 'https://www.behance.net/gallery/249094675/Comentee',
  comentee: 'https://www.behance.net/gallery/249094675/Comentee',
  secretSanta:
    'https://www.behance.net/gallery/242551689/Secret-Santa-Mobile-App-for-gift-exchange',
  tommy: 'https://www.behance.net/gallery/168742491/TOMMY-HILFIGER-E-commerce-redesign',
  linkedin: 'https://www.linkedin.com/in/artiom-popov-03512a2a0/?locale=ru_RU',
  email: 'mailto:tredl241@gmail.com',
  telegram: 'https://t.me/Freedom_in',
};

type Metric = {
  label: string;
  value: string;
};

type Skill = {
  number: string;
  title: string;
  text: string;
  chips: string[];
};

type CaseStudy = {
  id: string;
  title: string;
  eyebrow: string;
  heading: string;
  description: string[];
  href: string;
  linkLabel: string;
  metrics: Metric[];
  contributions: string[];
  results?: string[];
  image: string;
  imageAlt: string;
  compactImage?: boolean;
  hasChaosButton?: boolean;
};

const navItems = [
  { label: 'Обо мне', href: '#about' },
  { label: 'Навыки', href: '#skills' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contacts' },
];

const interestMetrics: Metric[] = [
  { label: 'Опыт в продукте', value: '2.5+ года в B2C и стартапах' },
  { label: 'Платформы', value: 'Web + Mobile' },
  { label: 'Роль', value: 'Product designer\n(end-to-end)' },
  { label: 'Фокус', value: 'MVP, Growth' },
];

const skills: Skill[] = [
  {
    number: '[01]',
    title: 'Формирую продуктовую логику',
    text: 'Проектирую не экраны, а пользовательские сценарии. Формирую решения через понимание задач пользователя и бизнес-контекста, снижая когнитивную нагрузку и ускоряя достижение цели.',
    chips: ['JTBD', 'User Flows', 'CJM', 'UX Logic', 'Information Architecture'],
  },
  {
    number: '[02]',
    title: 'Комплексное проектирование продукта',
    text: 'Веду дизайн полного цикла: от исследования и гипотез до финальной реализации. Работаю в условиях неопределенности, быстро формирую и валидирую решения.',
    chips: ['Discovery', 'Wireframes', 'Prototyping', 'MVP Design', 'Iteration'],
  },
  {
    number: '[03]',
    title: 'Показатели роста и эффективности продукта',
    text: 'Работаю с продуктовыми метриками и влияю на них через дизайн. Оптимизирую сценарии, снижаю трение и повышаю конверсию ключевых действий.',
    chips: ['Conversion Rate', 'Activation', 'Funnel Optimization', 'A/B Testing', 'Analytics'],
  },
  {
    number: '[04]',
    title: 'Дизайн системы и консистентность',
    text: 'Строю системный дизайн: повышаю консистентность интерфейса и ускоряю разработку через дизайн-системы и единые паттерны.',
    chips: ['Design Systems', 'Atomic approach', 'Components', 'Consistency', 'Scalability'],
  },
  {
    number: '[05]',
    title: 'Кросс-функциональное взаимодействие',
    text: 'Работаю на стыке дизайна, разработки и продукта. Участвую в принятии решений, защищаю гипотезы и обеспечиваю качественную реализацию.',
    chips: ['Design Review', 'Stakeholder Communication', 'Handoff', 'Product Discussions'],
  },
];

const cases: CaseStudy[] = [
  {
    id: 'comentee',
    title: 'Comentee',
    eyebrow: 'Стартап, B2C',
    heading: 'Платформа для взаимодействия ментора и менти',
    description: [
      'Перепроектировал продуктовую модель, устранив несоответствие между логикой системы и ожиданиями пользователей. Перевёл интерфейс из role-based в action-based подход, снизив когнитивную нагрузку и упростив вход в сценарии.',
      'За счет оптимизации первого экрана и сокращения CJM удалось сделать продукт понятнее, минимизировать путаницу с выбором ролей, а так же увеличить процент завершения ключевого флоу.',
    ],
    href: links.comentee,
    linkLabel: 'Comentee.ru',
    metrics: [
      { label: 'Год', value: '2025-2026' },
      { label: 'Платформы', value: 'Web' },
      { label: 'Роль', value: 'Product designer' },
      { label: 'Посмотреть', value: 'Comentee.ru' },
    ],
    contributions: [
      'Провёл анализ пользовательских сценариев и выявил проблему в ролевой модели',
      'Сформулировал гипотезу перехода от role-based к action-based логике',
      'Переработал структуру главного экрана и навигацию',
      'Упростил сценарии создания запроса и отклика',
    ],
    results: [
      'Устранена путаница в ролях и точке входа',
      'Снижен когнитивный порог входа в продукт',
      'Подготовил продукт к масштабированию',
    ],
    image: `${A}case-comentee.jpg`,
    imageAlt: 'Обложка кейса Comentee: интерфейс веб-приложения',
  },
  {
    id: 'secret-santa',
    title: 'Secret Santa',
    eyebrow: 'Стартап, B2C',
    heading: 'Мобильное приложение для обмена подарками',
    description: [
      'Участвовал в создании продукта с нуля — от формирования структуры и пользовательских сценариев до запуска и последующей оптимизации.',
      'После релиза сфокусировался на снижении трения в onboarding и ключевом сценарии, что позволило существенно повысить конверсию и вовлечённость.',
    ],
    href: links.secretSanta,
    linkLabel: 'App Store',
    metrics: [
      { label: 'Год', value: '2024-2025' },
      { label: 'Платформы', value: 'Web, mobile' },
      { label: 'Роль', value: 'Product designer' },
      { label: 'Посмотреть', value: 'App Store' },
    ],
    contributions: [
      'Переработал entry point и флоу авторизации',
      'Упростил основной флоу создания игры',
      'Пересобрал ролевую модель',
      'Подготовил дизайн имейлов и скринов ASO',
    ],
    results: [
      'Снижен отток при авторизации (~45% до 25%)',
      'Увеличен CR ключевого сценария (55% до 85%)',
      'Продукт масштабирован на 25 языков',
    ],
    image: `${A}case-secret-santa.jpg`,
    imageAlt: 'Обложка кейса Secret Santa: мобильное приложение для обмена подарками',
  },
  {
    id: 'tommy-hilfiger',
    title: 'Tommy Hilfiger',
    eyebrow: 'Ранний проект (точка роста)',
    heading: 'E-commerce',
    description: [
      'Один из моих первых проектов. Редизайн интернет-магазина. В нём я работал с базовыми принципами UX: структурой каталога, карточкой товара и пользовательскими сценариями покупки.',
      'Сегодня я рассматриваю этот проект как отправную точку. Он помог сформировать понимание интерфейсов и их влияние на поведение пользователей.',
    ],
    href: links.tommy,
    linkLabel: 'Behance',
    metrics: [
      { label: 'Год', value: '2023' },
      { label: 'Платформы', value: 'Web' },
      { label: 'Роль', value: 'UX/UI designer' },
    ],
    contributions: [
      'Важно проектировать не экраны, а пользовательские сценарии',
      'Структура каталога влияет на скорость принятия решения',
      'Простота интерфейса напрямую влияет на конверсию',
      'Пользователь не должен “думать”, чтобы купить',
    ],
    image: `${A}case-tommy.jpg`,
    imageAlt: 'Обложка кейса Tommy Hilfiger: редизайн e-commerce',
    compactImage: true,
    hasChaosButton: true,
  },
];

function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scopes = Array.from(document.querySelectorAll<HTMLElement>('[data-motion-scope]'));

    if (reduced) {
      document.documentElement.classList.add('motion-reduced');
      document.querySelectorAll('.reveal').forEach((element) => {
        element.classList.add('reveal--visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const items = Array.from(entry.target.querySelectorAll<HTMLElement>('.reveal'));
          items.forEach((item, index) => {
            item.style.setProperty('--reveal-index', String(index));
            item.classList.add('reveal--visible');
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -12% 0px' },
    );

    scopes.forEach((scope) => observer.observe(scope));
    return () => observer.disconnect();
  }, []);
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [chaosActive, setChaosActive] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const chaosButtonRef = useRef<HTMLButtonElement>(null);
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const qrDialogRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useReveal();

  useEffect(() => {
    if (!modalOpen) return undefined;

    const previousActive = document.activeElement as HTMLElement | null;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = () =>
      Array.from(modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);

    document.body.classList.add('modal-lock');
    setTimeout(() => focusable()[0]?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeChaos();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('modal-lock');
      document.removeEventListener('keydown', onKeyDown);
      previousActive?.focus();
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!qrOpen) return undefined;

    const previousActive = document.activeElement as HTMLElement | null;
    document.body.classList.add('modal-lock');
    setTimeout(() => qrDialogRef.current?.querySelector('button')?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeQr();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('modal-lock');
      document.removeEventListener('keydown', onKeyDown);
      previousActive?.focus();
    };
  }, [qrOpen]);

  const triggerChaos = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-chaos-part]'));

    if (!reduced) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const seed = (index + 1) * 9301 + element.textContent!.length * 49297;
        const random = (step: number) => {
          const value = Math.sin(seed + step * 233) * 10000;
          return value - Math.floor(value);
        };
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(centerY - height / 2, centerX - width / 2) + (random(1) - 0.5) * 0.9;
        const distance = Math.min(Math.max(width * 0.26, 180), 620) + random(2) * 220;

        element.style.setProperty('--chaos-x', `${Math.cos(angle) * distance + (random(3) - 0.5) * 120}px`);
        element.style.setProperty('--chaos-y', `${Math.sin(angle) * distance + (random(4) - 0.5) * 160}px`);
        element.style.setProperty('--chaos-r', `${(random(5) - 0.5) * 42}deg`);
        element.style.setProperty('--chaos-scale', `${0.92 + random(6) * 0.14}`);
        element.style.setProperty('--chaos-delay', `${index * 8 + random(7) * 80}ms`);
      });
    }

    setChaosActive(true);
    window.setTimeout(() => setModalOpen(true), reduced ? 40 : 760);
  };

  const closeChaos = () => {
    setModalOpen(false);
    setChaosActive(false);
    window.setTimeout(() => chaosButtonRef.current?.focus(), 0);
  };

  const openCasesFromModal = () => {
    setModalOpen(false);
    setChaosActive(false);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const closeQr = () => {
    setQrOpen(false);
    window.setTimeout(() => qrButtonRef.current?.focus(), 0);
  };

  return (
    <div className={`portfolio ${chaosActive ? 'portfolio--chaos' : ''}`}>
      <a className="skip-link" href="#main">
        Перейти к основному содержанию
      </a>

      <header className="site-header" role="banner" data-chaos-part>
        <a className="site-header__logo" href="#top" aria-label="FRDM DSGNR — на главную">
          <img src={`${A}logo-header.svg`} alt="" width="113" height="24" />
        </a>

        <div className="site-header__content">
          <nav className="site-nav" aria-label="Основная навигация">
            {navItems.map((item) => (
              <a className="site-nav__link" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <button className="language-switcher" type="button" aria-label="Текущий язык: русский">
            <span>Ru</span>
            <img src={`${A}chevron.svg`} alt="" aria-hidden="true" width="16" height="16" />
          </button>
        </div>
      </header>

      <main className="portfolio__main" id="main">
        <section className="hero" id="top" aria-labelledby="intro-title" data-motion-scope data-chaos-part>
          <div className="hero__media">
            <img
              className="hero__portrait reveal reveal--media"
              src={`${A}photo-main.jpg`}
              alt="Артем, продуктовый дизайнер"
              width="240"
              height="240"
              fetchPriority="high"
            />

            <div className="hero__tiles">
              <a
                className="hero-tile hero-tile--cta reveal"
                href="#projects"
                aria-label="Перейти к блоку кейсов"
              >
                <span>Кейсы</span>
              </a>

              <button
                className="hero-tile hero-tile--qr reveal"
                type="button"
                onClick={() => setQrOpen(true)}
                aria-label="Увеличить QR-код для сканирования"
                ref={qrButtonRef}
              >
                <img src={`${A}qr-code.png`} alt="QR-код для перехода к кейсам" width="240" height="240" />
              </button>
            </div>
          </div>

          <div className="hero__copy reveal">
            <h1 className="visually-hidden" id="intro-title">
              Артем, продуктовый дизайнер
            </h1>
            <p>Привет! Я Артем, продуктовый дизайнер с опытом в B2C и SaaS.</p>
            <p>
              Проектирую пользовательские сценарии и помогаю продуктам развиваться — от запуска MVP до последующих
              этапов роста, работая на стыке пользовательского опыта и бизнес-задач.
            </p>
            <p>
              Фокусируюсь на моментах, где пользователь теряется, и превращаю сложную логику в понятные действия,
              опираясь на пользовательские сигналы, поведение и продуктовые метрики.
            </p>
          </div>
        </section>

        <section className="section-grid interests" id="about" aria-labelledby="about-title" data-motion-scope data-chaos-part>
          <h2 className="section-title reveal" id="about-title">
            Зона интересов
          </h2>

          <div className="interests__content">
            <p className="lead reveal">
              Люблю работать в стартапах так как в них можно влиять не только на интерфейс, но и на саму логику
              продукта: от первых сценариев до запуска и роста.
            </p>

            <dl className="metrics metrics--interests">
              {interestMetrics.map((metric) => (
                <div className="metric reveal" key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="skills" id="skills" aria-labelledby="skills-title" data-motion-scope data-chaos-part>
          <h2 className="visually-hidden" id="skills-title">
            Навыки
          </h2>

          <div className="divider reveal reveal--line" />
          {skills.map((skill) => (
            <article className="skill-row reveal" key={skill.number}>
              <p className="skill-row__number">{skill.number}</p>
              <div className="skill-row__content">
                <h3>{skill.title}</h3>
                <p>{skill.text}</p>
                <ul className="chip-list" aria-label={`Навыки: ${skill.title}`}>
                  {skill.chips.map((chip) => (
                    <li className="chip" key={chip}>
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="cases" id="projects" aria-labelledby="projects-title">
          <h2 className="visually-hidden" id="projects-title">
            Проекты
          </h2>
          {cases.map((caseStudy) => (
            <CaseSection
              caseStudy={caseStudy}
              key={caseStudy.id}
              onChaos={triggerChaos}
              chaosButtonRef={caseStudy.hasChaosButton ? chaosButtonRef : undefined}
            />
          ))}
        </section>
      </main>

      <Footer />

      {modalOpen && (
        <div className="modal-shell" role="presentation" onMouseDown={closeChaos}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ux-modal-title"
            ref={modalRef}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="ux-modal-title">Это тоже UX.</h2>
            <p>
              Ты только что взаимодействовал с системой, которая нарушает правила. И всё равно понял, что происходит. Я
              проектирую такие вещи осознанно.
            </p>
            <div className="modal__actions">
              <button type="button" onClick={closeChaos}>
                Вернуть интерфейс
              </button>
              <button type="button" className="modal__primary" onClick={openCasesFromModal}>
                Посмотреть кейсы
              </button>
            </div>
          </div>
        </div>
      )}

      {qrOpen && (
        <div className="qr-shell" role="presentation" onMouseDown={closeQr}>
          <div
            className="qr-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="QR-код для сканирования"
            ref={qrDialogRef}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="qr-dialog__close" type="button" aria-label="Закрыть QR-код" onClick={closeQr}>
              ×
            </button>
            <img src={`${A}qr-code.png`} alt="QR-код для перехода к кейсам" width="600" height="600" />
          </div>
        </div>
      )}
    </div>
  );
}

function CaseSection({
  caseStudy,
  onChaos,
  chaosButtonRef,
}: {
  caseStudy: CaseStudy;
  onChaos: () => void;
  chaosButtonRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <article className="case" id={caseStudy.id} data-motion-scope data-chaos-part>
      <div className="case__heading section-grid">
        <div className="case__label reveal">
          <h3>{caseStudy.title}</h3>
          <p>{caseStudy.eyebrow}</p>
        </div>

        <div className="case__text reveal">
          <h4>{caseStudy.heading}</h4>
          {caseStudy.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <dl className="metrics case__metrics">
            {caseStudy.metrics.map((metric) => (
              <div className="metric" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  {metric.label === 'Посмотреть' ? (
                    <a href={caseStudy.href} target="_blank" rel="noopener noreferrer">
                      {metric.value}
                      <img src={`${A}arrow.svg`} alt="" aria-hidden="true" width="22" height="22" />
                    </a>
                  ) : (
                    metric.value
                  )}
                </dd>
              </div>
            ))}

            {caseStudy.hasChaosButton && (
              <div className="metric metric--danger">
                <dt>Не нажимать</dt>
                <dd>
                  <button className="danger-button" type="button" onClick={onChaos} ref={chaosButtonRef}>
                    <span>Не надо</span>
                  </button>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="case__content section-grid">
        <div className="impact-list reveal">
          <ImpactCard title={caseStudy.hasChaosButton ? 'Выводы и рост' : 'Достижения и вклад'} items={caseStudy.contributions} />
          {caseStudy.results && <ImpactCard title="Результаты" items={caseStudy.results} />}
        </div>

        <a
          className={`case-cover reveal reveal--media ${caseStudy.compactImage ? 'case-cover--compact' : ''}`}
          href={caseStudy.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Открыть кейс ${caseStudy.title} на Behance`}
        >
          <img src={caseStudy.image} alt={caseStudy.imageAlt} loading="lazy" width="800" height={caseStudy.compactImage ? 435 : 486} />
          <span>Open on Behance →</span>
        </a>
      </div>
    </article>
  );
}

function ImpactCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="impact-card" aria-label={title}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function Footer() {
  const footerLinks = [
    { type: 'Web App', name: 'Comentee', href: links.comentee },
    { type: 'Mobile App', name: 'Secret Santa', href: links.secretSanta },
    { type: 'E-commerce', name: 'Tommy Hilfiger', href: links.tommy },
  ];

  const socials = [
    { label: 'Написать на email', href: links.email, icon: 'email-icon.svg' },
    { label: 'Открыть Telegram', href: links.telegram, icon: 'telegram-icon.svg' },
    { label: 'Открыть LinkedIn', href: links.linkedin, icon: 'linkedin-icon.svg' },
  ];

  return (
    <footer className="footer" id="contacts" aria-labelledby="contacts-title" data-motion-scope data-chaos-part>
      <div className="divider reveal reveal--line" />
      <div className="footer__content section-grid reveal">
        <h2 id="contacts-title">© 2026</h2>
        <div className="footer__right">
          <nav className="footer__links" aria-label="Кейсы в Behance">
            {footerLinks.map((link) => (
              <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.name}>
                <span>{link.type}</span>
                <span className="footer__dot" aria-hidden="true" />
                <span>{link.name}</span>
              </a>
            ))}
          </nav>

          <div className="footer__socials">
            {socials.map((social) => (
              <a
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                key={social.label}
              >
                <img src={`${A}${social.icon}`} alt="" aria-hidden="true" width="67" height="67" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <img className="footer__logo reveal reveal--media" src={`${A}footer-logo.svg`} alt="FRDM DSGNR" width="1360" height="144" loading="lazy" />
    </footer>
  );
}

export default App;
