import '@testing-library/jest-dom';
import React from 'react';

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
  const createMotionComponent = (element) => {
    const MotionComponent = React.forwardRef((props, ref) => {
      // Filter out all motion-specific props to prevent React warnings
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        initial: _initial,
        animate: _animate,
        exit: _exit,
        transition: _transition,
        whileHover: _whileHover,
        whileTap: _whileTap,
        whileFocus: _whileFocus,
        whileDrag: _whileDrag,
        whileInView: _whileInView,
        viewport: _viewport,
        layout: _layout,
        layoutId: _layoutId,
        layoutDependency: _layoutDependency,
        layoutRoot: _layoutRoot,
        drag: _drag,
        dragConstraints: _dragConstraints,
        dragElastic: _dragElastic,
        dragMomentum: _dragMomentum,
        dragPropagation: _dragPropagation,
        dragDirectionLock: _dragDirectionLock,
        dragTransition: _dragTransition,
        onDrag: _onDrag,
        onDragStart: _onDragStart,
        onDragEnd: _onDragEnd,
        animateProps: _animateProps,
        ...cleanProps
      } = props;
      return React.createElement(element, { ...cleanProps, ref });
    });
    MotionComponent.displayName = `MotionComponent(${element})`;
    return MotionComponent;
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
  const ImageComponent = (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement('img', props);
  ImageComponent.displayName = 'Image';
  return {
    __esModule: true,
    default: ImageComponent,
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

