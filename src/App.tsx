import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type ReactNode,
} from 'react';

const A = `${import.meta.env.BASE_URL}assets/`;

const links = {
  comentee: 'https://www.behance.net/gallery/249094675/Comentee',
  secretSanta:
    'https://www.behance.net/gallery/242551689/Secret-Santa-Mobile-App-for-gift-exchange',
  tommy: 'https://www.behance.net/gallery/168742491/TOMMY-HILFIGER-E-commerce-redesign',
  linkedin: 'https://www.linkedin.com/in/artiom-popov-03512a2a0/?locale=ru_RU',
  email: 'mailto:tredl241@gmail.com',
  telegram: 'https://t.me/Freedom_in',
  resumeRu: `${A}resume_ru.pdf`,
  resumeEn: `${A}resume_en.pdf`,
};

type Metric = {
  label: string;
  value: string;
  icon?: IconName;
};

type Skill = {
  id: string;
  number: string;
  title: string;
  text: string;
  chips: string[];
};

type CaseStudy = {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
  metrics: Metric[];
  contributions: string[];
  results?: string[];
  image: string;
  imageAlt: string;
  compactImage?: boolean;
  hasChaosButton?: boolean;
};

type ModalType = 'resume' | 'chaos' | null;

const navItems = [
  { label: 'Обо мне', href: '#about' },
  { label: 'Навыки', href: '#skills' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contacts' },
];

const interestMetrics: Metric[] = [
  { label: 'Опыт в продукте', value: '2.5+ года\nB2C и SaaS' },
  { label: 'Платформы', value: 'Web +\nMobile' },
  { label: 'Роль', value: 'Product\u00A0designer\n(end-to-end)' },
  { label: 'Фокус', value: 'MVP, Growth' },
];

const skills: Skill[] = [
  {
    id: 'logic',
    number: '[01]',
    title: 'Формирую продуктовую логику',
    text: 'Проектирую не экраны, а пользовательские сценарии. Формирую решения через понимание задач пользователя и бизнес-контекста, снижая когнитивную нагрузку и ускоряя достижение цели.',
    chips: ['JTBD', 'User Flows', 'CJM', 'UX Logic', 'Information Architecture'],
  },
  {
    id: 'product',
    number: '[02]',
    title: 'Комплексное проектирование продукта',
    text: 'Веду дизайн полного цикла: от исследования и гипотез до финальной реализации. Работаю в условиях неопределенности, быстро формирую и валидирую решения.',
    chips: ['Discovery', 'Wireframes', 'Prototyping', 'MVP Design', 'Iteration'],
  },
  {
    id: 'growth',
    number: '[03]',
    title: 'Показатели роста и эффективности продукта',
    text: 'Работаю с продуктовыми метриками и влияю на них через дизайн. Оптимизирую сценарии, снижаю трение и повышаю конверсию ключевых действий.',
    chips: ['Conversion Rate', 'Activation', 'Funnel Optimization', 'A/B Testing', 'Analytics'],
  },
  {
    id: 'systems',
    number: '[04]',
    title: 'Дизайн системы и консистентность',
    text: 'Строю системный дизайн: повышаю консистентность интерфейса и ускоряю разработку через дизайн-системы и единые паттерны.',
    chips: ['Design Systems', 'Atomic approach', 'Components', 'Consistency', 'Scalability'],
  },
  {
    id: 'handoff',
    number: '[05]',
    title: 'Кросс-функциональное взаимодействие',
    text: 'Работаю на стыке дизайна, разработки и продукта. Участвую в принятии решений, защищаю гипотезы и обеспечиваю качественную реализацию.',
    chips: ['Design Review', 'Stakeholder Communication', 'Handoff', 'Product Discussions'],
  },
];

const cases: CaseStudy[] = [
  {
    id: 'comentee',
    number: '[01]',
    title: 'Comentee — сервис для взаимодействия ментора и менти',
    description:
      'Перепроектировал продуктовую модель, устранив несоответствие между логикой системы и ожиданиями пользователей. Перевёл интерфейс из role-based в action-based подход, снизив когнитивную нагрузку и упростив вход в сценарии.',
    href: links.comentee,
    metrics: [
      { label: 'Год', value: '2025-2026' },
      { label: 'Платформы', value: 'Web' },
      { label: 'Роль', value: 'Product designer' },
      { label: 'Посмотреть', value: 'Comentee.ru', icon: 'arrow-right' },
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
    number: '[02]',
    title: 'Secret Santa — мобильное приложение для обмена подарками',
    description:
      'Участвовал в создании продукта с нуля — от формирования структуры и пользовательских сценариев до запуска и последующей оптимизации. После релиза сфокусировался на снижении трения в onboarding и ключевом сценарии.',
    href: links.secretSanta,
    metrics: [
      { label: 'Год', value: '2024-2025' },
      { label: 'Платформы', value: 'Web, mobile' },
      { label: 'Роль', value: 'Product designer' },
      { label: 'Посмотреть', value: 'App Store', icon: 'arrow-right' },
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
    number: '[03]',
    title: 'Tommy Hilfiger — интернет магазин',
    description:
      'Один из первых проектов — редизайн интернет-магазина. Работал с базовыми принципами UX: структурой каталога, карточкой товара и сценариями покупки. Проект стал отправной точкой в понимании интерфейсов и их влияния на поведение пользователей.',
    href: links.tommy,
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

const shortWords =
  'а|без|бы|в|во|для|до|же|за|и|из|к|ко|ли|между|на|над|не|ни|но|о|об|обо|от|перед|по|под|после|при|с|со|у|через';
const danglingWordPattern = new RegExp(`(^|[\\s([{«„"—-])(${shortWords})[ \\t]+`, 'giu');

function noDangling(text: string) {
  let result = text;
  let next = result.replace(danglingWordPattern, (_match, prefix: string, word: string) => `${prefix}${word}\u00A0`);

  while (next !== result) {
    result = next;
    next = result.replace(danglingWordPattern, (_match, prefix: string, word: string) => `${prefix}${word}\u00A0`);
  }

  return result;
}

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

function useModalA11y<T extends HTMLElement>(
  isOpen: boolean,
  dialogRef: RefObject<T | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousActive = document.activeElement as HTMLElement | null;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);

    document.body.classList.add('modal-lock');
    window.setTimeout(() => focusable()[0]?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
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
  }, [dialogRef, isOpen, onClose]);
}

function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chaosActive, setChaosActive] = useState(false);
  const [openSkillId, setOpenSkillId] = useState(skills[0].id);
  const modalRef = useRef<HTMLDivElement>(null);
  const chaosButtonRef = useRef<HTMLButtonElement>(null);
  const resumeButtonRef = useRef<HTMLButtonElement>(null);
  const skillButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useReveal();

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setChaosActive(false);
  }, []);

  useModalA11y(Boolean(activeModal), modalRef, closeModal);

  const triggerChaos = () => {
    if (chaosActive || activeModal) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-chaos-part]'));

    if (!reduced) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const seed = (index + 1) * 9301 + (element.textContent?.length ?? 1) * 49297;
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
    window.setTimeout(() => setActiveModal('chaos'), reduced ? 40 : 760);
  };

  const openCasesFromChaos = () => {
    closeModal();
    window.setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleSkillKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = skills.length - 1;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowDown') nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === 'ArrowUp') nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = lastIndex;

    if (nextIndex === null) return;
    event.preventDefault();
    skillButtonRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={`portfolio ${chaosActive ? 'portfolio--chaos' : ''}`}>
      <a className="skip-link" href="#main">
        {noDangling('Перейти к основному содержанию')}
      </a>

      <header className="site-header" role="banner" data-chaos-part>
        <a className="site-header__logo" href="#top" aria-label="FRDM DSGNR — на главную">
          <img src={`${A}logo-header.svg`} alt="" width="113" height="24" />
        </a>

        <div className="site-header__content">
          <nav className="site-nav" aria-label="Основная навигация">
            {navItems.map((item) => (
              <a className="site-nav__link" href={item.href} key={item.href}>
                {noDangling(item.label)}
              </a>
            ))}
          </nav>

          <button className="language-switcher" type="button" aria-label="Текущий язык: русский">
            <span>Ru</span>
            <Icon name="chevron-down" className="language-switcher__icon" />
          </button>
        </div>
      </header>

      <main className="portfolio__main" id="main">
        <section className="hero" id="top" aria-labelledby="intro-title" data-motion-scope data-chaos-part>
          <div className="hero__media reveal reveal--media">
            <img
              className="hero__portrait"
              src={`${A}photo-main.jpg`}
              alt="Артем, продуктовый дизайнер"
              width="240"
              height="240"
              fetchPriority="high"
            />

            <div className="action-grid hero__actions">
              <ActionTile
                number="[01 - 03]"
                label="Проекты"
                href="#projects"
                icon="arrow-down-right"
                ariaLabel="Перейти к проектам"
              />
              <ActionTile
                number="[RU, EN]"
                label="Резюме"
                icon="download"
                onClick={() => setActiveModal('resume')}
                ariaLabel="Выбрать язык резюме"
                buttonRef={resumeButtonRef}
              />
            </div>
          </div>

          <div className="hero__copy reveal">
            <h1 className="visually-hidden" id="intro-title">
              Артем, продуктовый дизайнер
            </h1>
            <p>{noDangling('Привет! Я Артем, продуктовый дизайнер с опытом в B2C и SaaS.')}</p>
            <p>
              {noDangling(
                'Проектирую пользовательские сценарии и помогаю продуктам развиваться — от запуска MVP до последующих этапов роста, работая на стыке пользовательского опыта и бизнес-задач.',
              )}
            </p>
            <p>
              {noDangling(
                'Фокусируюсь на моментах, где пользователь теряется, и превращаю сложную логику в понятные действия, опираясь на пользовательские сигналы, поведение и продуктовые метрики.',
              )}
            </p>
          </div>
        </section>

        <section className="section-block interests" id="about" aria-labelledby="about-title" data-motion-scope data-chaos-part>
          <SectionHeader title="Интересы" titleId="about-title" />
          <div className="section-grid interests__body">
            <div className="rail-action reveal">
              <ActionTile
                number="[01 - 05]"
                label="Навыки"
                href="#skills"
                icon="arrow-down-right"
                ariaLabel="Перейти к навыкам"
              />
            </div>

            <div className="interests__content reveal">
              <p className="lead">
                {noDangling(
                  'Люблю работать в стартапах так как в них можно влиять не только на интерфейс, но и на саму логику продукта: от первых сценариев до запуска и роста.',
                )}
              </p>

              <MetricsList metrics={interestMetrics} className="metrics--interests" />
            </div>
          </div>
        </section>

        <section className="section-block skills" id="skills" aria-labelledby="skills-title" data-motion-scope data-chaos-part>
          <SectionHeader title="Навыки" titleId="skills-title" />
          <div className="skill-accordion reveal">
            {skills.map((skill, index) => (
              <SkillAccordionItem
                index={index}
                isOpen={openSkillId === skill.id}
                key={skill.id}
                onKeyDown={handleSkillKeyDown}
                onToggle={() => setOpenSkillId((current) => (current === skill.id ? '' : skill.id))}
                setButtonRef={(node) => {
                  skillButtonRefs.current[index] = node;
                }}
                skill={skill}
              />
            ))}
          </div>
        </section>

        <section className="section-block cases" id="projects" aria-labelledby="projects-title" data-motion-scope data-chaos-part>
          <SectionHeader title="Проекты" titleId="projects-title" />
          <div className="cases__list">
            {cases.map((caseStudy) => (
              <CaseCard caseStudy={caseStudy} key={caseStudy.id} onChaos={triggerChaos} chaosButtonRef={chaosButtonRef} />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {activeModal === 'resume' && (
        <ModalShell onClose={closeModal}>
          <div
            className="modal modal--choice"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
            aria-describedby="resume-modal-description"
            ref={modalRef}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal__content">
              <div className="modal__copy">
                <h2 id="resume-modal-title">Выберите нужный язык</h2>
                <p id="resume-modal-description">
                  {noDangling('Хорошего вам дня и настроения. Это все. А еще улыбнитесь.')}
                  <br />
                  {noDangling('О, и не забудьте выбрать язык.')}
                </p>
              </div>
              <div className="modal__actions">
                <a className="modal__button" href={links.resumeRu} download="Artiom_Popov_CV_RU.pdf" onClick={closeModal}>
                  RU
                </a>
                <a className="modal__button" href={links.resumeEn} download="Artiom_Popov_CV_EN.pdf" onClick={closeModal}>
                  EN
                </a>
              </div>
            </div>
          </div>
        </ModalShell>
      )}

      {activeModal === 'chaos' && (
        <ModalShell onClose={closeModal}>
          <div
            className="modal modal--choice"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ux-modal-title"
            aria-describedby="ux-modal-description"
            ref={modalRef}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal__content">
              <div className="modal__copy">
                <h2 id="ux-modal-title">Поздравляю, вы только что сломали интерфейс!</h2>
                <p id="ux-modal-description">
                  {noDangling(
                    'Не волнуйтесь, серьезно, любой интерфейс можно сломать. Хороший же интерфейс легко собрать обратно.',
                  )}
                </p>
              </div>
              <div className="modal__actions">
                <button className="modal__button" type="button" onClick={closeModal}>
                  Собрать обратно
                </button>
                <button className="modal__button" type="button" onClick={openCasesFromChaos}>
                  {noDangling('Посмотреть кейсы')}
                </button>
              </div>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function SectionHeader({ title, titleId }: { title: string; titleId: string }) {
  return (
    <div className="section-header section-grid reveal">
      <div aria-hidden="true" />
      <h2 id={titleId}>{title}</h2>
    </div>
  );
}

type ActionTileProps = {
  number: string;
  label: string;
  icon: IconName;
  href?: string;
  targetBlank?: boolean;
  onClick?: () => void;
  ariaLabel: string;
  buttonRef?: RefObject<HTMLButtonElement | null>;
};

function ActionTile({ number, label, icon, href, targetBlank, onClick, ariaLabel, buttonRef }: ActionTileProps) {
  const content = (
    <>
      <span className="action-tile__number">{number}</span>
      <span className="action-tile__label">{label}</span>
      <span className="action-tile__icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className="action-tile"
        href={href}
        target={targetBlank ? '_blank' : undefined}
        rel={targetBlank ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button className="action-tile" type="button" onClick={onClick} aria-label={ariaLabel} ref={buttonRef}>
      {content}
    </button>
  );
}

function MetricsList({ metrics, className = '' }: { metrics: Metric[]; className?: string }) {
  return (
    <dl className={`metrics ${className}`}>
      {metrics.map((metric) => (
        <div className="metric" key={metric.label}>
          <dt>{noDangling(metric.label)}</dt>
          <dd>
            {metric.icon ? (
              <span className="metric__value-with-icon">
                <span>{noDangling(metric.value)}</span>
                <Icon name={metric.icon} />
              </span>
            ) : (
              noDangling(metric.value)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SkillAccordionItem({
  index,
  isOpen,
  onKeyDown,
  onToggle,
  setButtonRef,
  skill,
}: {
  index: number;
  isOpen: boolean;
  onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => void;
  onToggle: () => void;
  setButtonRef: (node: HTMLButtonElement | null) => void;
  skill: Skill;
}) {
  const triggerId = `skill-trigger-${skill.id}`;
  const panelId = `skill-panel-${skill.id}`;

  return (
    <article className={`skill-item ${isOpen ? 'skill-item--open' : ''}`}>
      <h3 className="skill-item__heading">
        <button
          aria-controls={panelId}
          aria-expanded={isOpen}
          className="skill-item__trigger"
          id={triggerId}
          onClick={onToggle}
          onKeyDown={(event) => onKeyDown(event, index)}
          ref={setButtonRef}
          type="button"
        >
          <span className="skill-item__number">{skill.number}</span>
          <span className="skill-item__body">
            <span className="skill-item__title">{noDangling(skill.title)}</span>
            <span className="skill-item__icon" aria-hidden="true">
              <Icon name={isOpen ? 'minus' : 'plus'} />
            </span>
          </span>
        </button>
      </h3>

      <div
        aria-labelledby={triggerId}
        className="skill-item__panel"
        hidden={!isOpen}
        id={panelId}
        role="region"
      >
        <div aria-hidden="true" />
        <div className="skill-item__content">
          <p>{noDangling(skill.text)}</p>
          <ChipList chips={skill.chips} />
        </div>
      </div>
    </article>
  );
}

type IconName = 'arrow-down-right' | 'arrow-right' | 'arrow-up-right' | 'chevron-down' | 'download' | 'minus' | 'plus';

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const common = {
    className: `icon ${className}`.trim(),
    fill: 'none',
    focusable: false,
    'aria-hidden': true,
  };

  switch (name) {
    case 'arrow-down-right':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M7 7 17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 7v10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'arrow-up-right':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M7 17 17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7h10v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...common} viewBox="0 0 16 16">
          <path d="m3 5.5 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'download':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m7 11 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'minus':
      return (
        <svg {...common} viewBox="0 0 36 36">
          <path d="M10 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common} viewBox="0 0 36 36">
          <path d="M10 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 10v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

function ChipList({ chips }: { chips: string[] }) {
  return (
    <ul className="chip-list">
      {chips.map((chip) => (
        <li className="chip" key={chip}>
          {chip}
        </li>
      ))}
    </ul>
  );
}

function CaseCard({
  caseStudy,
  chaosButtonRef,
  onChaos,
}: {
  caseStudy: CaseStudy;
  chaosButtonRef: RefObject<HTMLButtonElement | null>;
  onChaos: () => void;
}) {
  const [leverPulled, setLeverPulled] = useState(false);

  const handleChaosButtonClick = () => {
    if (leverPulled) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLeverPulled(true);
    window.setTimeout(() => setLeverPulled(false), reduced ? 1 : 620);
    window.setTimeout(onChaos, reduced ? 0 : 520);
  };

  return (
    <article className="case-card" id={caseStudy.id} data-motion-scope data-chaos-part>
      <div className="case-card__heading section-grid reveal">
        <div className="rail-action">
          <ActionTile
            number={caseStudy.number}
            label="Behance"
            icon="arrow-up-right"
            href={caseStudy.href}
            targetBlank
            ariaLabel={`Открыть кейс ${caseStudy.title} на Behance`}
          />
        </div>

        <div className="case-card__summary">
          <div className="case-card__copy">
            <h3>{noDangling(caseStudy.title)}</h3>
            <p>{noDangling(caseStudy.description)}</p>
          </div>

          <div className="case-card__meta">
            <MetricsList metrics={caseStudy.metrics} />
            {caseStudy.hasChaosButton && (
              <div className="metric metric--danger">
                <dt>Пасхалка</dt>
                <dd>
                  <button
                    className={`danger-button ${leverPulled ? 'danger-button--pulled' : ''}`}
                    type="button"
                    onClick={handleChaosButtonClick}
                    ref={chaosButtonRef}
                  >
                    <span>{noDangling('Не нажимать')}</span>
                    <img className="danger-button__lever" src={`${A}machineLever.svg`} alt="" aria-hidden="true" />
                  </button>
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="case-card__content section-grid reveal">
        <div className="impact-list">
          <ImpactCard title={caseStudy.hasChaosButton ? 'Выводы и рост' : 'Достижения и вклад'} items={caseStudy.contributions} />
          {caseStudy.results && <ImpactCard title="Результаты" items={caseStudy.results} />}
        </div>

        <BeforeAfterSlider
          afterAlt={`${caseStudy.imageAlt}: версия после`}
          afterSrc={caseStudy.image}
          beforeAlt={`${caseStudy.imageAlt}: версия до`}
          beforeSrc={caseStudy.image}
          compact={caseStudy.compactImage}
          label={`Сравнение до и после: ${caseStudy.title}`}
        />
      </div>
    </article>
  );
}

function ImpactCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="impact-card" aria-label={title}>
      <h4>{noDangling(title)}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{noDangling(item)}</li>
        ))}
      </ul>
    </section>
  );
}

function BeforeAfterSlider({
  afterAlt,
  afterSrc,
  beforeAlt,
  beforeSrc,
  compact,
  label,
}: {
  afterAlt: string;
  afterSrc: string;
  beforeAlt: string;
  beforeSrc: string;
  compact?: boolean;
  label: string;
}) {
  const [value, setValue] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const pendingClientXRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const clamp = (next: number) => Math.min(100, Math.max(0, next));

  const updateFromPending = useCallback(() => {
    rafRef.current = null;
    const track = trackRef.current;
    const clientX = pendingClientXRef.current;
    if (!track || clientX === null) return;

    const rect = track.getBoundingClientRect();
    const next = clamp(((clientX - rect.left) / rect.width) * 100);
    setValue(next);
  }, []);

  const queueUpdate = useCallback(
    (clientX: number) => {
      pendingClientXRef.current = clientX;
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(updateFromPending);
      }
    },
    [updateFromPending],
  );

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      event.preventDefault();
      queueUpdate(event.clientX);
    };

    const stopDrag = () => {
      draggingRef.current = false;
      document.body.classList.remove('is-slider-dragging');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      document.body.classList.remove('is-slider-dragging');
    };
  }, [queueUpdate]);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    draggingRef.current = true;
    document.body.classList.add('is-slider-dragging');
    queueUpdate(event.clientX);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const keySteps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10,
    };

    if (event.key === 'Home') {
      event.preventDefault();
      setValue(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setValue(100);
      return;
    }

    const step = keySteps[event.key];
    if (!step) return;
    event.preventDefault();
    setValue((current) => clamp(current + step));
  };

  const sliderStyle = { '--slider-value': `${value}%` } as CSSProperties;

  return (
    <div
      className={`case-slider case-card--slider ${compact ? 'case-slider--compact' : ''}`}
      onPointerDown={startDrag}
      ref={trackRef}
      style={sliderStyle}
    >
      <img className="case-slider__image case-slider__image--before" src={beforeSrc} alt={beforeAlt} loading="lazy" />
      <div className="case-slider__overlay" aria-hidden="true">
        <img className="case-slider__image" src={afterSrc} alt="" loading="lazy" />
      </div>
      <button
        aria-label={noDangling(label)}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(value)}
        aria-valuetext={noDangling(`${Math.round(value)}% после`)}
        className="case-slider__handle"
        onKeyDown={handleKeyDown}
        role="slider"
        type="button"
      >
        <span className="visually-hidden">{noDangling(label)}</span>
      </button>
    </div>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-shell" role="presentation" onMouseDown={onClose}>
      {children}
    </div>
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
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                key={link.name}
                aria-label={`Открыть кейс ${link.name} на Behance`}
              >
                <span>{noDangling(link.type)}</span>
                <span className="footer__dot" aria-hidden="true" />
                <span>{noDangling(link.name)}</span>
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
