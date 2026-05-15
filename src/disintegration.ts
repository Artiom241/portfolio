export type DisintegrationState = 'idle' | 'breaking' | 'broken' | 'rebuilding';

type PieceKind = 'text' | 'surface' | 'media' | 'line';

type Piece = {
  id: string;
  element: HTMLElement;
  x: number;
  y: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  angularVelocity: number;
  mass: number;
  delay: number;
  released: boolean;
};

type Segment = {
  kind: PieceKind;
  rect: DOMRect;
  createElement: () => HTMLElement;
};

type OrchestratorOptions = {
  onBroken: () => void;
  onStateChange: (state: DisintegrationState) => void;
  sourceRoots: HTMLElement[];
};

const BREAK_DURATION = 3000;
const JITTER_DURATION = 220;
const REBUILD_DURATION = 1500;
const MAX_PIECES = 240;
const VIEWPORT_PADDING = 120;

const SURFACE_SELECTORS = [
  '.action-tile',
  '.impact-card',
  '.case-slider',
  '.slot-machine-button',
  '.language-switcher',
  '.footer__socials a',
  '.metric__value-link',
  '.skill-item',
];

const MEDIA_SELECTORS = ['img', 'svg'];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const randomUnit = (seed: number) => {
  const value = Math.sin(seed * 9301.17) * 10000;
  return value - Math.floor(value);
};

const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 4);

const isTransparent = (color: string) => color === 'transparent' || color === 'rgba(0, 0, 0, 0)';

const isUsableRect = (rect: DOMRect) =>
  rect.width > 1 &&
  rect.height > 1 &&
  rect.right > -VIEWPORT_PADDING &&
  rect.left < window.innerWidth + VIEWPORT_PADDING &&
  rect.bottom > -VIEWPORT_PADDING &&
  rect.top < window.innerHeight + VIEWPORT_PADDING;

class DOMSegmentationAgent {
  collect(sourceRoots: HTMLElement[]) {
    const segments = [
      ...this.collectSurfaces(sourceRoots),
      ...this.collectMedia(sourceRoots),
      ...this.collectText(sourceRoots),
      ...this.collectLines(sourceRoots),
    ];

    return segments
      .filter((segment) => isUsableRect(segment.rect))
      .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left)
      .slice(0, MAX_PIECES);
  }

  private collectSurfaces(sourceRoots: HTMLElement[]) {
    const segments: Segment[] = [];
    const elements = this.queryUnique(sourceRoots, SURFACE_SELECTORS.join(','));

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (!isUsableRect(rect)) return;

      const style = window.getComputedStyle(element);
      const hasSurface =
        !isTransparent(style.backgroundColor) ||
        Number.parseFloat(style.borderTopWidth) > 0 ||
        Number.parseFloat(style.borderBottomWidth) > 0 ||
        Number.parseFloat(style.boxShadow.length ? '1' : '0') > 0;

      if (!hasSurface) return;

      const area = rect.width * rect.height;
      const columns = area > 360000 ? 3 : area > 150000 ? 2 : 1;
      const rows = columns;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const tileRect = new DOMRect(
            rect.left + (rect.width / columns) * column,
            rect.top + (rect.height / rows) * row,
            rect.width / columns,
            rect.height / rows,
          );

          segments.push({
            kind: 'surface',
            rect: tileRect,
            createElement: () => {
              const node = document.createElement('div');
              node.className = 'disintegration-piece disintegration-piece--surface';
              node.style.background = style.backgroundColor;
              node.style.borderRadius = rows === 1 && columns === 1 ? style.borderRadius : '0';
              node.style.border = style.border;
              node.style.boxShadow = style.boxShadow;
              return node;
            },
          });
        }
      }
    });

    return segments;
  }

  private collectMedia(sourceRoots: HTMLElement[]) {
    const elements = this.queryUnique(sourceRoots, MEDIA_SELECTORS.join(','));

    return elements.flatMap<Segment>((element) => {
      if (element.closest('.disintegration-overlay')) return [];
      const rect = element.getBoundingClientRect();
      if (!isUsableRect(rect)) return [];

      return [{
        kind: 'media',
        rect,
        createElement: () => {
          const wrapper = document.createElement('div');
          wrapper.className = 'disintegration-piece disintegration-piece--media';
          const clone = element.cloneNode(true) as HTMLElement;
          clone.removeAttribute('id');
          clone.setAttribute('aria-hidden', 'true');
          wrapper.append(clone);
          return wrapper;
        },
      }];
    });
  }

  private collectText(sourceRoots: HTMLElement[]) {
    const segments: Segment[] = [];

    sourceRoots.forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest('.visually-hidden, .disintegration-overlay, .modal-shell')) return NodeFilter.FILTER_REJECT;
          if (!node.textContent || !/\S/.test(node.textContent)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      while (walker.nextNode()) {
        const textNode = walker.currentNode as Text;
        const parent = textNode.parentElement;
        if (!parent || parent.closest('script, style, noscript')) continue;

        const text = textNode.textContent ?? '';
        const style = window.getComputedStyle(parent);
        const matches = [...text.matchAll(/\S+/g)];

        matches.forEach((match) => {
          const start = match.index ?? 0;
          const range = document.createRange();
          range.setStart(textNode, start);
          range.setEnd(textNode, start + match[0].length);
          const rect = range.getBoundingClientRect();
          range.detach();

          if (!isUsableRect(rect)) return;

          segments.push({
            kind: 'text',
            rect,
            createElement: () => {
              const span = document.createElement('span');
              span.className = 'disintegration-piece disintegration-piece--text';
              span.textContent = match[0];
              span.style.color = style.color;
              span.style.fontFamily = style.fontFamily;
              span.style.fontSize = style.fontSize;
              span.style.fontStyle = style.fontStyle;
              span.style.fontWeight = style.fontWeight;
              span.style.letterSpacing = style.letterSpacing;
              span.style.lineHeight = style.lineHeight;
              span.style.textTransform = style.textTransform;
              return span;
            },
          });
        });
      }
    });

    return segments;
  }

  private collectLines(sourceRoots: HTMLElement[]) {
    const segments: Segment[] = [];
    const elements = this.queryUnique(sourceRoots, '*');

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (!isUsableRect(rect)) return;

      const style = window.getComputedStyle(element);
      const borderBottom = Number.parseFloat(style.borderBottomWidth);
      const borderTop = Number.parseFloat(style.borderTopWidth);

      if (borderTop > 0) {
        segments.push(this.createLine(rect.left, rect.top, rect.width, borderTop, style.borderTopColor));
      }

      if (borderBottom > 0) {
        segments.push(this.createLine(rect.left, rect.bottom - borderBottom, rect.width, borderBottom, style.borderBottomColor));
      }
    });

    return segments;
  }

  private createLine(x: number, y: number, width: number, height: number, color: string): Segment {
    return {
      kind: 'line',
      rect: new DOMRect(x, y, width, Math.max(height, 1)),
      createElement: () => {
        const line = document.createElement('div');
        line.className = 'disintegration-piece disintegration-piece--line';
        line.style.background = color;
        return line;
      },
    };
  }

  private queryUnique(sourceRoots: HTMLElement[], selector: string) {
    const elements = new Set<HTMLElement>();
    sourceRoots.forEach((root) => {
      if (root.matches(selector)) elements.add(root);
      root.querySelectorAll<HTMLElement>(selector).forEach((element) => elements.add(element));
    });
    return [...elements];
  }
}

class PieceModelAgent {
  createPieces(segments: Segment[]) {
    return segments.map<Piece>((segment, index) => {
      const element = segment.createElement();
      const seed = index + segment.rect.left * 0.37 + segment.rect.top * 0.19;
      const mass = this.massFor(segment);
      const horizontal = (randomUnit(seed + 1) - 0.5) * 0.55;

      return {
        id: `${segment.kind}-${index}`,
        element,
        x: segment.rect.left,
        y: segment.rect.top,
        originX: segment.rect.left,
        originY: segment.rect.top,
        width: segment.rect.width,
        height: segment.rect.height,
        velocityX: horizontal / mass,
        velocityY: (-0.18 + randomUnit(seed + 2) * 0.18) / mass,
        rotation: 0,
        angularVelocity: ((randomUnit(seed + 3) - 0.5) * 0.18) / mass,
        mass,
        delay: randomUnit(seed + 4) * 560 + index * 8,
        released: false,
      };
    });
  }

  private massFor(segment: Segment) {
    const areaMass = clamp(Math.sqrt(segment.rect.width * segment.rect.height) / 320, 0, 1.4);
    if (segment.kind === 'text') return 0.72 + areaMass * 0.18;
    if (segment.kind === 'line') return 0.52 + areaMass * 0.08;
    if (segment.kind === 'media') return 1.05 + areaMass * 0.5;
    return 1.25 + areaMass * 0.75;
  }
}

class LayoutDetachAgent {
  private overlay: HTMLElement | null = null;

  mount(pieces: Piece[], sourceRoots: HTMLElement[]) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'disintegration-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');

    pieces.forEach((piece) => {
      const style = piece.element.style;
      style.left = `${piece.originX}px`;
      style.top = `${piece.originY}px`;
      style.width = `${piece.width}px`;
      style.height = `${piece.height}px`;
      style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      style.zIndex = piece.element.classList.contains('disintegration-piece--text') ? '3' : '2';
      this.overlay?.append(piece.element);
    });

    document.body.append(this.overlay);
    sourceRoots.forEach((root) => root.classList.add('disintegration-source-hidden'));
    document.body.classList.add('disintegration-lock');
  }

  reveal(sourceRoots: HTMLElement[]) {
    sourceRoots.forEach((root) => root.classList.remove('disintegration-source-hidden'));
    document.body.classList.remove('disintegration-lock');
  }

  remove() {
    this.overlay?.remove();
    this.overlay = null;
  }
}

class PhysicsEngineAgent {
  step(piece: Piece, deltaMs: number) {
    const resistance = Math.pow(0.982, deltaMs / 16.67);
    const gravity = 0.00135 / piece.mass;

    piece.velocityY += gravity * deltaMs;
    piece.velocityX *= resistance;
    piece.velocityY *= resistance;
    piece.angularVelocity *= resistance;

    piece.x += piece.velocityX * deltaMs;
    piece.y += piece.velocityY * deltaMs;
    piece.rotation += piece.angularVelocity * deltaMs;
  }
}

export class DisintegrationOrchestrator {
  private animationFrame = 0;
  private readonly layoutAgent = new LayoutDetachAgent();
  private readonly physicsAgent = new PhysicsEngineAgent();
  private readonly pieceAgent = new PieceModelAgent();
  private readonly segmentationAgent = new DOMSegmentationAgent();
  private pieces: Piece[] = [];
  private state: DisintegrationState = 'idle';

  constructor(private readonly options: OrchestratorOptions) {}

  disintegrate() {
    if (this.state !== 'idle') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.setState('broken');
      this.options.onBroken();
      return;
    }

    const segments = this.segmentationAgent.collect(this.options.sourceRoots);
    this.pieces = this.pieceAgent.createPieces(segments);

    if (this.pieces.length === 0) {
      this.setState('broken');
      this.options.onBroken();
      return;
    }

    this.layoutAgent.mount(this.pieces, this.options.sourceRoots);
    this.setState('breaking');

    let previousTime = performance.now();
    const startTime = previousTime;

    const tick = (time: number) => {
      const elapsed = time - startTime;
      const delta = clamp(time - previousTime, 0, 32);
      previousTime = time;

      this.pieces.forEach((piece, index) => {
        if (elapsed < JITTER_DURATION) {
          const progress = elapsed / JITTER_DURATION;
          const jitter = Math.sin(progress * Math.PI * 5 + index) * 3 * (1 - progress);
          piece.element.style.transform = `translate3d(${jitter}px, ${-jitter * 0.6}px, 0) scale(${1 - Math.sin(progress * Math.PI) * 0.025})`;
          return;
        }

        const fallTime = elapsed - JITTER_DURATION;
        if (fallTime >= piece.delay) piece.released = true;

        if (piece.released) {
          this.physicsAgent.step(piece, delta);
        }

        piece.element.style.transform = `translate3d(${piece.x - piece.originX}px, ${piece.y - piece.originY}px, 0) rotate(${piece.rotation}deg)`;
      });

      if (elapsed < BREAK_DURATION) {
        this.animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      this.setState('broken');
      this.options.onBroken();
    };

    this.animationFrame = window.requestAnimationFrame(tick);
  }

  async rebuild() {
    if (this.state !== 'broken' && this.state !== 'breaking') return;

    window.cancelAnimationFrame(this.animationFrame);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || this.pieces.length === 0) {
      this.cleanup();
      return;
    }

    this.setState('rebuilding');

    const animations = this.pieces.map((piece, index) => {
      const currentTransform = `translate3d(${piece.x - piece.originX}px, ${piece.y - piece.originY}px, 0) rotate(${piece.rotation}deg)`;
      const animation = piece.element.animate(
        [
          { transform: currentTransform, offset: 0 },
          { transform: `translate3d(${(piece.x - piece.originX) * -0.04}px, -10px, 0) rotate(${piece.rotation * -0.08}deg)`, offset: 0.84 },
          { transform: 'translate3d(0, 0, 0) rotate(0deg)', offset: 1 },
        ],
        {
          delay: clamp(index * 3, 0, 260),
          duration: REBUILD_DURATION,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          fill: 'forwards',
        },
      );

      return animation.finished.catch(() => undefined);
    });

    await Promise.all(animations);
    this.cleanup();
  }

  destroy() {
    window.cancelAnimationFrame(this.animationFrame);
    this.cleanup();
  }

  private cleanup() {
    this.layoutAgent.reveal(this.options.sourceRoots);
    this.layoutAgent.remove();
    this.pieces = [];
    this.setState('idle');
  }

  private setState(state: DisintegrationState) {
    this.state = state;
    this.options.onStateChange(state);
  }
}
