import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { Input, TextArea, Select } from '../Input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter username" />);
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('should display hint message', () => {
    render(<Input hint="Helpful hint" />);
    expect(screen.getByText(/helpful hint/i)).toBeInTheDocument();
  });

  it('should render with left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon">@</span>} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('should render with right icon', () => {
    render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test value');
    expect(input).toHaveValue('test value');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe('TextArea', () => {
  it('should render textarea element', () => {
    render(<TextArea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<TextArea error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    render(<TextArea />);
    const textarea = screen.getByRole('textbox');
    
    await user.type(textarea, 'test description');
    expect(textarea).toHaveValue('test description');
  });
});

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render select element', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select label="Choose option" options={options} />);
    expect(screen.getByLabelText(/choose option/i)).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: /option 1/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /option 2/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /option 3/i })).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    
    await user.selectOptions(select, 'option2');
    expect(select).toHaveValue('option2');
  });

  it('should display error message', () => {
    render(<Select options={options} error="Please select an option" />);
    expect(screen.getByText(/please select an option/i)).toBeInTheDocument();
  });
});

