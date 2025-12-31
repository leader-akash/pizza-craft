import { render, screen } from '@/test-utils';
import { Badge, SpicyBadge, VegetarianBadge, PopularBadge, CategoryBadge } from '../Badge';

describe('Badge', () => {
  it('should render badge with children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText(/test badge/i)).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText(/default/i)).toBeInTheDocument();

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText(/success/i)).toBeInTheDocument();

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText(/warning/i)).toBeInTheDocument();

    rerender(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText(/danger/i)).toBeInTheDocument();

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText(/info/i)).toBeInTheDocument();

    rerender(<Badge variant="pizza">Pizza</Badge>);
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText(/small/i)).toBeInTheDocument();

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText(/medium/i)).toBeInTheDocument();

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText(/large/i)).toBeInTheDocument();
  });

  it('should render with icon', () => {
    render(<Badge icon={<span data-testid="icon">⭐</span>}>With Icon</Badge>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText(/custom/i);
    expect(badge).toHaveClass('custom-class');
  });

  it('should animate when animate prop is true', () => {
    render(<Badge animate>Animated</Badge>);
    expect(screen.getByText(/animated/i)).toBeInTheDocument();
  });
});

describe('SpicyBadge', () => {
  it('should not render when level is 0', () => {
    const { container } = render(<SpicyBadge level={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render for level 1', () => {
    render(<SpicyBadge level={1} />);
    expect(screen.getByText(/🌶️/)).toBeInTheDocument();
    expect(screen.getByText(/mild/i)).toBeInTheDocument();
  });

  it('should render for level 2', () => {
    render(<SpicyBadge level={2} />);
    expect(screen.getByText(/🌶️🌶️/)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it('should render for level 3', () => {
    render(<SpicyBadge level={3} />);
    expect(screen.getByText(/🌶️🌶️🌶️/)).toBeInTheDocument();
    expect(screen.getByText(/hot/i)).toBeInTheDocument();
  });

  it('should hide label when showLabel is false', () => {
    render(<SpicyBadge level={2} showLabel={false} />);
    expect(screen.queryByText(/medium/i)).not.toBeInTheDocument();
    expect(screen.getByText(/🌶️🌶️/)).toBeInTheDocument();
  });
});

describe('VegetarianBadge', () => {
  it('should render vegetarian badge', () => {
    render(<VegetarianBadge />);
    expect(screen.getByText(/vegetarian/i)).toBeInTheDocument();
    expect(screen.getByText(/🥬/)).toBeInTheDocument();
  });
});

describe('PopularBadge', () => {
  it('should render popular badge', () => {
    render(<PopularBadge />);
    expect(screen.getByText(/popular/i)).toBeInTheDocument();
    expect(screen.getByText(/⭐/)).toBeInTheDocument();
  });
});

describe('CategoryBadge', () => {
  it('should render category badge for classic', () => {
    render(<CategoryBadge category="classic" />);
    expect(screen.getByText(/classic/i)).toBeInTheDocument();
    expect(screen.getByText(/🍕/)).toBeInTheDocument();
  });

  it('should render category badge for meat', () => {
    render(<CategoryBadge category="meat" />);
    expect(screen.getByText(/meat/i)).toBeInTheDocument();
    expect(screen.getByText(/🥩/)).toBeInTheDocument();
  });

  it('should render category badge for vegetarian', () => {
    render(<CategoryBadge category="vegetarian" />);
    expect(screen.getByText(/vegetarian/i)).toBeInTheDocument();
    expect(screen.getByText(/🥗/)).toBeInTheDocument();
  });

  it('should render category badge for specialty', () => {
    render(<CategoryBadge category="specialty" />);
    expect(screen.getByText(/specialty/i)).toBeInTheDocument();
    expect(screen.getByText(/✨/)).toBeInTheDocument();
  });
});

