import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { QuantitySelector } from '../QuantitySelector';

describe('QuantitySelector', () => {
  it('should render quantity selector', () => {
    render(<QuantitySelector quantity={1} onIncrement={jest.fn()} onDecrement={jest.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display current quantity', () => {
    render(<QuantitySelector quantity={5} onIncrement={jest.fn()} onDecrement={jest.fn()} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onIncrement when increment button is clicked', async () => {
    const handleIncrement = jest.fn();
    const user = userEvent.setup();
    render(
      <QuantitySelector quantity={1} onIncrement={handleIncrement} onDecrement={jest.fn()} />
    );
    
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons[1]; // Plus button is the second button
    await user.click(incrementButton);
    expect(handleIncrement).toHaveBeenCalledTimes(1);
  });

  it('should call onDecrement when decrement button is clicked', async () => {
    const handleDecrement = jest.fn();
    const user = userEvent.setup();
    render(
      <QuantitySelector quantity={2} onIncrement={jest.fn()} onDecrement={handleDecrement} />
    );
    
    const buttons = screen.getAllByRole('button');
    const decrementButton = buttons[0]; // Minus button is the first button
    await user.click(decrementButton);
    expect(handleDecrement).toHaveBeenCalledTimes(1);
  });

  it('should disable decrement button when quantity is at minimum', () => {
    render(<QuantitySelector quantity={1} onIncrement={jest.fn()} onDecrement={jest.fn()} min={1} />);
    const buttons = screen.getAllByRole('button');
    const decrementButton = buttons[0];
    expect(decrementButton).toBeDisabled();
  });

  it('should disable increment button when quantity is at maximum', () => {
    render(<QuantitySelector quantity={99} onIncrement={jest.fn()} onDecrement={jest.fn()} max={99} />);
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons[1];
    expect(incrementButton).toBeDisabled();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(
      <QuantitySelector quantity={1} onIncrement={jest.fn()} onDecrement={jest.fn()} size="sm" />
    );
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(
      <QuantitySelector quantity={1} onIncrement={jest.fn()} onDecrement={jest.fn()} size="md" />
    );
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(
      <QuantitySelector quantity={1} onIncrement={jest.fn()} onDecrement={jest.fn()} size="lg" />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <QuantitySelector
        quantity={1}
        onIncrement={jest.fn()}
        onDecrement={jest.fn()}
        className="custom-class"
      />
    );
    const container = screen.getByText('1').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});

