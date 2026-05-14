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
  comenteeLanding: 'https://comentee.ru/landing',
  secretSanta:
    'https://www.behance.net/gallery/242551689/Secret-Santa-Mobile-App-for-gift-exchange',
  secretSantaAppStore: 'https://apps.apple.com/vn/app/surprise-santa-gift-exchange/id1185304926',
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
  href?: string;
  ariaLabel?: string;
};

type NavItem = {
  label: string;
  href: string;
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
  contributionsTitle?: string;
  resultsTitle?: string;
  image: string;
  imageAlt: string;
  compactImage?: boolean;
  hasChaosButton?: boolean;
};

type ModalType = 'resume' | 'chaos' | null;
type Language = 'ru' | 'en';

type PortfolioContent = {
  navItems: NavItem[];
  interestMetrics: Metric[];
  skills: Skill[];
  cases: CaseStudy[];
  hero: {
    title: string;
    portraitAlt: string;
    paragraphs: string[];
  };
  sections: {
    interests: string;
    skills: string;
    projects: string;
  };
  tiles: {
    projects: string;
    projectsNumber: string;
    projectsAria: string;
    resume: string;
    resumeNumber: string;
    resumeAria: string;
    skills: string;
    skillsNumber: string;
    skillsAria: string;
  };
  modal: {
    resumeTitle: string;
    resumeDescription: string[];
    chaosTitle: string;
    chaosDescription: string;
    chaosReset: string;
    chaosCases: string;
  };
  caseLabels: {
    behance: string;
    openBehance: (title: string) => string;
    danger: string;
    dangerButton: string;
    contributions: string;
    insights: string;
    results: string;
    slider: (title: string) => string;
    afterPercent: (value: number) => string;
  };
  footer: {
    copyright: string;
    casesNav: string;
    openCase: (name: string) => string;
    email: string;
    telegram: string;
    linkedin: string;
  };
  language: {
    current: (label: string) => string;
    menu: string;
  };
  skipLink: string;
};

const languageOptions: Array<{ code: Language; label: string; name: string }> = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
];

const navItems: NavItem[] = [
  { label: 'Обо мне', href: '#about' },
  { label: 'Навыки', href: '#skills' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contacts' },
];

const interestMetrics: Metric[] = [
  { label: 'Опыт в продукте', value: '2.5+ года\nB2C и SaaS' },
  { label: 'Платформы', value: 'Web +\nMobile' },
  { label: 'Роль', value: 'Product\u00A0designer\n(End-to-end)' },
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
      {
        label: 'Посмотреть',
        value: 'Comentee.ru',
        icon: 'arrow-right',
        href: links.comenteeLanding,
        ariaLabel: 'Открыть сайт Comentee',
      },
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
      {
        label: 'Посмотреть',
        value: 'App Store',
        icon: 'arrow-right',
        href: links.secretSantaAppStore,
        ariaLabel: 'Открыть Secret Santa в App Store',
      },
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

const content: Record<Language, PortfolioContent> = {
  ru: {
    navItems,
    interestMetrics,
    skills,
    cases,
    hero: {
      title: 'Артем, продуктовый дизайнер',
      portraitAlt: 'Артем, продуктовый дизайнер',
      paragraphs: [
        'Привет! Я Артем, продуктовый дизайнер с опытом в B2C и SaaS.',
        'Проектирую пользовательские сценарии и помогаю продуктам развиваться — от запуска MVP до последующих этапов роста, работая на стыке пользовательского опыта и бизнес-задач.',
        'Фокусируюсь на моментах, где пользователь теряется, и превращаю сложную логику в понятные действия, опираясь на пользовательские сигналы, поведение и продуктовые метрики.',
      ],
    },
    sections: {
      interests: 'Интересы',
      skills: 'Навыки',
      projects: 'Проекты',
    },
    tiles: {
      projects: 'Проекты',
      projectsNumber: '[01 - 03]',
      projectsAria: 'Перейти к проектам',
      resume: 'Резюме',
      resumeNumber: '[RU, EN]',
      resumeAria: 'Выбрать язык резюме',
      skills: 'Навыки',
      skillsNumber: '[01 - 05]',
      skillsAria: 'Перейти к навыкам',
    },
    modal: {
      resumeTitle: 'Выберите нужный язык',
      resumeDescription: ['Хорошего вам дня и настроения. Это все. А еще улыбнитесь.', 'О, и не забудьте выбрать язык.'],
      chaosTitle: 'Поздравляю, вы только что сломали интерфейс!',
      chaosDescription: 'Не волнуйтесь, серьезно, любой интерфейс можно сломать. Хороший же интерфейс легко собрать обратно.',
      chaosReset: 'Собрать обратно',
      chaosCases: 'Посмотреть кейсы',
    },
    caseLabels: {
      behance: 'Behance',
      openBehance: (title) => `Открыть кейс ${title} на Behance`,
      danger: 'Пасхалка',
      dangerButton: 'Не нажимать',
      contributions: 'Достижения и вклад',
      insights: 'Выводы и рост',
      results: 'Результаты',
      slider: (title) => `Сравнение до и после: ${title}`,
      afterPercent: (value) => `${value}% после`,
    },
    footer: {
      copyright: '© 2026',
      casesNav: 'Кейсы в Behance',
      openCase: (name) => `Открыть кейс ${name} на Behance`,
      email: 'Написать на email',
      telegram: 'Открыть Telegram',
      linkedin: 'Открыть LinkedIn',
    },
    language: {
      current: (label) => `Текущий язык: ${label}`,
      menu: 'Выбор языка',
    },
    skipLink: 'Перейти к основному содержанию',
  },
  en: {
    navItems: [
      { label: 'About Me', href: '#about' },
      { label: 'Skills', href: '#skills' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contacts', href: '#contacts' },
    ],
    interestMetrics: [
      { label: 'Product Experience', value: '2.5+ years in\u00A0B2C\u00A0& SaaS' },
      { label: 'Platforms', value: 'Web + Mobile' },
      { label: 'Role', value: 'Product\u00A0designer\n(End-to-end)' },
      { label: 'Focus', value: 'MVP, Growth' },
    ],
    skills: [
      {
        id: 'logic',
        number: '[01]',
        title: 'I shape product logic',
        text: 'I design not screens, but user scenarios. I create solutions through understanding user tasks and\u00A0business context, reducing cognitive load and accelerating goal achievement.',
        chips: ['JTBD', 'User Flows', 'CJM', 'UX Logic', 'Information Architecture'],
      },
      {
        id: 'product',
        number: '[02]',
        title: 'Comprehensive product design',
        text: 'I lead the full-cycle design: from research and hypotheses to final implementation. I work in conditions of uncertainty, quickly forming and validating solutions.',
        chips: ['Discovery', 'Wireframes', 'Prototyping', 'MVP Design', 'Iteration'],
      },
      {
        id: 'growth',
        number: '[03]',
        title: 'Growth and product effectiveness metrics',
        text: 'I work with product metrics and influence them through design. I optimize scenarios, reduce friction, and increase conversion of key actions.',
        chips: ['Conversion Rate', 'Activation', 'Funnel Optimization', 'A/B Testing', 'Analytics'],
      },
      {
        id: 'systems',
        number: '[04]',
        title: 'Design system and consistency',
        text: 'I build systematic design: enhancing interface consistency and accelerating development through design systems and unified patterns.',
        chips: ['Design Systems', 'Atomic approach', 'Components', 'Consistency', 'Scalability'],
      },
      {
        id: 'handoff',
        number: '[05]',
        title: 'Cross-functional collaboration',
        text: 'I work at the intersection of design, development, and product. I participate in decision-making, defend hypotheses, and ensure quality implementation.',
        chips: ['Design Review', 'Stakeholder Communication', 'Handoff', 'Product Discussions'],
      },
    ],
    cases: [
      {
        id: 'comentee',
        number: '[01]',
        title: 'Comentee - service for mentor and mentee interaction',
        description:
          'Redesigned the product model, bridging the gap between system logic and user expectations. Transitioned from a role-based to an action-based approach, reducing cognitive load and\u00A0simplifying entry into scenarios. Optimized the first screen and shortened the CJM, enhancing the product\'s "understandability" and increasing the completion of key flows.',
        href: links.comentee,
        metrics: [
          { label: 'Year', value: '2025-2026' },
          { label: 'Platforms', value: 'Web' },
          { label: 'Role', value: 'Product designer' },
          {
            label: 'View',
            value: 'Comentee.ru',
            icon: 'arrow-right',
            href: links.comenteeLanding,
            ariaLabel: 'Open Comentee website',
          },
        ],
        contributions: [
          'Conducted an analysis of user scenarios and identified an issue in the role model.',
          'Formulated a hypothesis for transitioning from role-based to action-based logic.',
          'Redesigned the main screen structure and navigation.',
          'Simplified the scenarios for creating requests and\u00A0responses.',
        ],
        results: [
          'Eliminated confusion regarding roles and entry points.',
          'Reduced the cognitive entry threshold for the product.',
          'Prepared the product for scaling.',
        ],
        contributionsTitle: 'Achievements and Contributions',
        resultsTitle: 'Results',
        image: `${A}case-comentee.jpg`,
        imageAlt: 'Comentee case cover: web app interface',
      },
      {
        id: 'secret-santa',
        number: '[02]',
        title: 'Secret Santa - mobile app for gift exchange',
        description:
          'Participated in creating the product from scratch — from structure and user scenarios to launch and optimization. After the release, reduced friction in onboarding and key scenarios, increasing conversion and engagement.',
        href: links.secretSanta,
        metrics: [
          { label: 'Year', value: '2024-2025' },
          { label: 'Platforms', value: 'Web, mobile' },
          { label: 'Role', value: 'Product designer' },
          {
            label: 'View',
            value: 'App Store',
            icon: 'arrow-right',
            href: links.secretSantaAppStore,
            ariaLabel: 'Open Secret Santa in the App Store',
          },
        ],
        contributions: [
          'Redesigned the entry point and authorization flow',
          'Simplified the main game creation flow',
          'Rebuilt the role model',
          'Prepared email designs and ASO screenshots',
        ],
        results: [
          'Reduced drop-off during authorization (~45% to 25%)',
          'Increased CR of the key scenario (55% to 85%)',
          'The product has been scaled to 25 languages',
        ],
        contributionsTitle: 'Achievements and contributions',
        resultsTitle: 'Results',
        image: `${A}case-secret-santa.jpg`,
        imageAlt: 'Secret Santa case cover: mobile gift exchange app',
      },
      {
        id: 'tommy-hilfiger',
        number: '[03]',
        title: 'Tommy Hilfiger - online store',
        description:
          'One of the first projects was the redesign of an online store. I worked with the basic principles of\u00A0UX: catalog structure, product card, and purchasing scenarios. The project became a starting point in understanding interfaces and their impact on user behavior.',
        href: links.tommy,
        metrics: [
          { label: 'Year', value: '2023' },
          { label: 'Platforms', value: 'Web' },
          { label: 'Role', value: 'UX/UI designer' },
        ],
        contributions: [
          'It is important to design not screens, but user scenarios.',
          'The catalog structure affects the speed of decision-making.',
          'The simplicity of the interface directly impacts conversion.',
          'The user should not have to "think" to make a purchase.',
        ],
        contributionsTitle: 'Insights and growth',
        image: `${A}case-tommy.jpg`,
        imageAlt: 'Tommy Hilfiger case cover: e-commerce redesign',
        compactImage: true,
        hasChaosButton: true,
      },
    ],
    hero: {
      title: 'Artiom, product designer',
      portraitAlt: 'Artiom, product designer',
      paragraphs: [
        'Hi, I’m Artem, a product designer with\u00A0experience in both B2C and SaaS products.',
        'I design user journeys and flows, helping products evolve — from MVP launch through later stages of growth, working at the intersection of user experience, product logic, and business goals.',
        'I focus on moments where users get lost or drop off, translating complex systems into clear and actionable interactions, guided by user signals, behavior, and\u00A0product metrics.',
      ],
    },
    sections: {
      interests: 'Interests',
      skills: 'Skills',
      projects: 'Projects',
    },
    tiles: {
      projects: 'Projects',
      projectsNumber: '[01 - 03]',
      projectsAria: 'Go to projects',
      resume: 'Resume',
      resumeNumber: '[EN, RU]',
      resumeAria: 'Choose resume language',
      skills: 'Skills',
      skillsNumber: '[01 - 05]',
      skillsAria: 'Go to skills',
    },
    modal: {
      resumeTitle: 'Choose a language',
      resumeDescription: ['Have a nice day and a good mood. That is all. Also, smile.', 'Oh, and do not forget to choose a language.'],
      chaosTitle: 'Congratulations, you just broke the interface!',
      chaosDescription: 'Do not worry, really, any interface can be broken. A good interface is easy to put back together.',
      chaosReset: 'Put it back',
      chaosCases: 'View cases',
    },
    caseLabels: {
      behance: 'Behance',
      openBehance: (title) => `Open ${title} on Behance`,
      danger: 'Easter egg',
      dangerButton: 'Do not click',
      contributions: 'Achievements and contributions',
      insights: 'Insights and growth',
      results: 'Results',
      slider: (title) => `Before and after comparison: ${title}`,
      afterPercent: (value) => `${value}% after`,
    },
    footer: {
      copyright: '© 2026',
      casesNav: 'Cases on Behance',
      openCase: (name) => `Open ${name} case on Behance`,
      email: 'Send an email',
      telegram: 'Open Telegram',
      linkedin: 'Open LinkedIn',
    },
    language: {
      current: (label) => `Current language: ${label}`,
      menu: 'Language selection',
    },
    skipLink: 'Skip to main content',
  },
};

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

function isLanguage(value: string | null): value is Language {
  return value === 'ru' || value === 'en';
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
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ru';
    const savedLanguage = window.localStorage.getItem('portfolio-language');
    return isLanguage(savedLanguage) ? savedLanguage : 'ru';
  });
  const [isLanguageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [openSkillId, setOpenSkillId] = useState('logic');
  const modalRef = useRef<HTMLDivElement>(null);
  const languageControlRef = useRef<HTMLDivElement>(null);
  const chaosButtonRef = useRef<HTMLButtonElement>(null);
  const resumeButtonRef = useRef<HTMLButtonElement>(null);
  const skillButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const copy = content[language];

  useReveal();

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('portfolio-language', language);
  }, [language]);

  useEffect(() => {
    if (!isLanguageMenuOpen) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (languageControlRef.current?.contains(event.target as Node)) return;
      setLanguageMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setLanguageMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isLanguageMenuOpen]);

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
    const lastIndex = copy.skills.length - 1;
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
        {noDangling(copy.skipLink)}
      </a>

      <header className="site-header" role="banner" data-chaos-part>
        <a className="site-header__logo" href="#top" aria-label="FRDM DSGNR — на главную">
          <img src={`${A}logo-header.svg`} alt="" width="113" height="24" />
        </a>

        <div className="site-header__content">
          <nav className="site-nav" aria-label="Основная навигация">
            {copy.navItems.map((item) => (
              <a className="site-nav__link" href={item.href} key={item.href}>
                {noDangling(item.label)}
              </a>
            ))}
          </nav>

          <div className="language-control" ref={languageControlRef}>
            <button
              className="language-switcher"
              type="button"
              aria-expanded={isLanguageMenuOpen}
              aria-controls="language-menu"
              aria-haspopup="true"
              aria-label={copy.language.current(languageOptions.find((option) => option.code === language)?.name ?? language)}
              onClick={() => setLanguageMenuOpen((current) => !current)}
            >
              <span>{language.toUpperCase()}</span>
              <Icon name="chevron-down" className="language-switcher__icon" />
            </button>

            <div
              className={`language-menu ${isLanguageMenuOpen ? 'language-menu--open' : ''}`}
              id="language-menu"
              role="radiogroup"
              aria-label={copy.language.menu}
              aria-hidden={!isLanguageMenuOpen}
            >
              {languageOptions.map((option) => (
                <label
                  className="language-option"
                  key={option.code}
                  onClick={() => {
                    setLanguage(option.code);
                    setLanguageMenuOpen(false);
                  }}
                >
                  <input
                    type="radio"
                    name="portfolio-language"
                    value={option.code}
                    checked={language === option.code}
                    tabIndex={isLanguageMenuOpen ? 0 : -1}
                    onChange={() => {
                      setLanguage(option.code);
                      setLanguageMenuOpen(false);
                    }}
                  />
                  <span>{option.label}</span>
                  <span className="language-option__control" aria-hidden="true" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="portfolio__main" id="main">
        <section className="hero" id="top" aria-labelledby="intro-title" data-motion-scope data-chaos-part>
          <div className="hero__media reveal reveal--media">
            <img
              className="hero__portrait"
              src={`${A}photo-main.jpg`}
              alt={copy.hero.portraitAlt}
              width="240"
              height="240"
              fetchPriority="high"
            />

            <div className="action-grid hero__actions">
              <ActionTile
                number={copy.tiles.projectsNumber}
                label={copy.tiles.projects}
                href="#projects"
                icon="arrow-down-right"
                ariaLabel={copy.tiles.projectsAria}
              />
              <ActionTile
                number={copy.tiles.resumeNumber}
                label={copy.tiles.resume}
                icon="download"
                onClick={() => setActiveModal('resume')}
                ariaLabel={copy.tiles.resumeAria}
                buttonRef={resumeButtonRef}
              />
            </div>
          </div>

          <div className="hero__copy reveal">
            <h1 className="visually-hidden" id="intro-title">
              {noDangling(copy.hero.title)}
            </h1>
            {copy.hero.paragraphs.map((paragraph) => (
              <p key={paragraph}>{noDangling(paragraph)}</p>
            ))}
          </div>
        </section>

        <section className="section-block interests" id="about" aria-labelledby="about-title" data-motion-scope data-chaos-part>
          <SectionHeader title={copy.sections.interests} titleId="about-title" />
          <div className="section-grid interests__body">
            <div className="rail-action reveal">
              <ActionTile
                number={copy.tiles.skillsNumber}
                label={copy.tiles.skills}
                href="#skills"
                icon="arrow-down-right"
                ariaLabel={copy.tiles.skillsAria}
              />
            </div>

            <div className="interests__content reveal">
              <p className="lead">
                {noDangling(
                  language === 'ru'
                    ? 'Люблю работать в стартапах так как в них можно влиять не только на интерфейс, но и на саму логику продукта: от первых сценариев до запуска и роста.'
                    : 'I love working in startups because you can influence not only the interface but also the logic of the product: from the initial scenarios to launch and growth.',
                )}
              </p>

              <MetricsList metrics={copy.interestMetrics} className="metrics--interests" />
            </div>
          </div>
        </section>

        <section className="section-block skills" id="skills" aria-labelledby="skills-title" data-motion-scope data-chaos-part>
          <SectionHeader title={copy.sections.skills} titleId="skills-title" />
          <div className="skill-accordion reveal">
            {copy.skills.map((skill, index) => (
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
          <SectionHeader title={copy.sections.projects} titleId="projects-title" />
          <div className="cases__list">
            {copy.cases.map((caseStudy) => (
              <CaseCard
                caseStudy={caseStudy}
                key={caseStudy.id}
                onChaos={triggerChaos}
                chaosButtonRef={chaosButtonRef}
                labels={copy.caseLabels}
                dangerButtonAsset={language === 'en' ? 'special-button-en.svg' : 'special-button.svg'}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer labels={copy.footer} />

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
                <h2 id="resume-modal-title">{noDangling(copy.modal.resumeTitle)}</h2>
                <p id="resume-modal-description">
                  {noDangling(copy.modal.resumeDescription[0])}
                  <br />
                  {noDangling(copy.modal.resumeDescription[1])}
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
                <h2 id="ux-modal-title">{noDangling(copy.modal.chaosTitle)}</h2>
                <p id="ux-modal-description">
                  {noDangling(copy.modal.chaosDescription)}
                </p>
              </div>
              <div className="modal__actions">
                <button className="modal__button" type="button" onClick={closeModal}>
                  {noDangling(copy.modal.chaosReset)}
                </button>
                <button className="modal__button" type="button" onClick={openCasesFromChaos}>
                  {noDangling(copy.modal.chaosCases)}
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
            {metric.href || metric.icon ? (
              <MetricValue metric={metric} />
            ) : (
              noDangling(metric.value)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MetricValue({ metric }: { metric: Metric }) {
  const content = (
    <>
      <span>{noDangling(metric.value)}</span>
      {metric.icon && <Icon name={metric.icon} />}
    </>
  );

  if (metric.href) {
    return (
      <a
        className="metric__value-with-icon metric__value-link"
        href={metric.href}
        aria-label={metric.ariaLabel ?? metric.value}
      >
        {content}
      </a>
    );
  }

  return (
    <span className="metric__value-with-icon">
      {content}
    </span>
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
        aria-hidden={!isOpen}
        aria-labelledby={triggerId}
        className={`skill-item__panel ${isOpen ? 'skill-item__panel--open' : ''}`}
        id={panelId}
        role="region"
      >
        <div className="skill-item__panel-inner">
          <div aria-hidden="true" />
          <div className="skill-item__content">
            <p>{noDangling(skill.text)}</p>
            <ChipList chips={skill.chips} />
          </div>
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
  dangerButtonAsset,
  labels,
  onChaos,
}: {
  caseStudy: CaseStudy;
  chaosButtonRef: RefObject<HTMLButtonElement | null>;
  dangerButtonAsset: string;
  labels: PortfolioContent['caseLabels'];
  onChaos: () => void;
}) {
  const [leverPulled, setLeverPulled] = useState(false);
  const dangerButtonSrc = `${A}${dangerButtonAsset}`;

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
            label={labels.behance}
            icon="arrow-up-right"
            href={caseStudy.href}
            targetBlank
            ariaLabel={labels.openBehance(caseStudy.title)}
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
                <dt>{noDangling(labels.danger)}</dt>
                <dd>
                  <button
                    className={`danger-button ${leverPulled ? 'danger-button--pulled' : ''}`}
                    type="button"
                    onClick={handleChaosButtonClick}
                    ref={chaosButtonRef}
                  >
                    <span className="visually-hidden">{noDangling(labels.dangerButton)}</span>
                    <span className="danger-button__body" aria-hidden="true">
                      <img src={dangerButtonSrc} alt="" />
                    </span>
                    <span className="danger-button__lever" aria-hidden="true">
                      <img src={dangerButtonSrc} alt="" />
                    </span>
                  </button>
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="case-card__content section-grid reveal">
        <div className="impact-list">
          <ImpactCard
            title={caseStudy.contributionsTitle ?? (caseStudy.hasChaosButton ? labels.insights : labels.contributions)}
            items={caseStudy.contributions}
          />
          {caseStudy.results && <ImpactCard title={caseStudy.resultsTitle ?? labels.results} items={caseStudy.results} />}
        </div>

        <BeforeAfterSlider
          afterAlt={`${caseStudy.imageAlt}: версия после`}
          afterSrc={caseStudy.image}
          afterValueText={labels.afterPercent}
          beforeAlt={`${caseStudy.imageAlt}: версия до`}
          beforeSrc={caseStudy.image}
          compact={caseStudy.compactImage}
          label={labels.slider(caseStudy.title)}
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
  afterValueText,
  beforeAlt,
  beforeSrc,
  compact,
  label,
}: {
  afterAlt: string;
  afterSrc: string;
  afterValueText: (value: number) => string;
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
        aria-valuetext={noDangling(afterValueText(Math.round(value)))}
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

function Footer({ labels }: { labels: PortfolioContent['footer'] }) {
  const footerLinks = [
    { type: 'Web App', name: 'Comentee', href: links.comentee },
    { type: 'Mobile App', name: 'Secret Santa', href: links.secretSanta },
    { type: 'E-commerce', name: 'Tommy Hilfiger', href: links.tommy },
  ];

  const socials = [
    { label: labels.email, href: links.email, icon: 'email-icon.svg' },
    { label: labels.telegram, href: links.telegram, icon: 'telegram-icon.svg' },
    { label: labels.linkedin, href: links.linkedin, icon: 'linkedin-icon.svg' },
  ];

  return (
    <footer className="footer" id="contacts" aria-labelledby="contacts-title" data-motion-scope data-chaos-part>
      <div className="divider reveal reveal--line" />
      <div className="footer__content section-grid reveal">
        <h2 id="contacts-title">{labels.copyright}</h2>
        <div className="footer__right">
          <nav className="footer__links" aria-label={labels.casesNav}>
            {footerLinks.map((link) => (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                key={link.name}
                aria-label={labels.openCase(link.name)}
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
