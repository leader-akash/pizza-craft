import '@testing-library/jest-dom';

// Mock global fetch for RTK Query - must be set up before any imports
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
  })
);

// Set up fetch in both global and window for RTK Query
global.fetch = mockFetch;
if (typeof window !== 'undefined') {
  window.fetch = mockFetch;
}

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  
  // Filter out motion-specific props
  const filterMotionProps = (props) => {
    const {
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      whileFocus,
      whileDrag,
      whileInView,
      viewport,
      layout,
      layoutId,
      layoutDependency,
      layoutRoot,
      drag,
      dragConstraints,
      dragElastic,
      dragMomentum,
      dragPropagation,
      dragDirectionLock,
      dragTransition,
      onDrag,
      onDragStart,
      onDragEnd,
      animateProps,
      ...domProps
    } = props;
    return domProps;
  };

  const createMotionComponent = (element) => {
    return React.forwardRef((props, ref) => {
      // Filter out all motion-specific props to prevent React warnings
      const {
        initial,
        animate,
        exit,
        transition,
        whileHover,
        whileTap,
        whileFocus,
        whileDrag,
        whileInView,
        viewport,
        layout,
        layoutId,
        layoutDependency,
        layoutRoot,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        dragPropagation,
        dragDirectionLock,
        dragTransition,
        onDrag,
        onDragStart,
        onDragEnd,
        animateProps,
        ...cleanProps
      } = props;
      return React.createElement(element, { ...cleanProps, ref });
    });
  };

  return {
    motion: {
      button: createMotionComponent('button'),
      span: createMotionComponent('span'),
      div: createMotionComponent('div'),
      p: createMotionComponent('p'),
    },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
    }),
    useInView: () => false,
  };
});

// Mock next/image
jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('img', props),
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

