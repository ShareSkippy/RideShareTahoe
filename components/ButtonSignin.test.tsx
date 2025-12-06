import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonSignin from './ButtonSignin';

describe('ButtonSignin', () => {
  it('should render the button with default text and style', () => {
    render(<ButtonSignin />);

    const button = screen.getByRole('link', { name: 'Sign In' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/login');
    // Check that default class is applied (partial match since we have many classes)
    expect(button.className).toContain('inline-flex');
  });

  it('should render the button with custom text and style', () => {
    const customText = 'Log In Now';
    const customStyle = 'btn-lg btn-primary';

    render(<ButtonSignin text={customText} extraStyle={customStyle} />);

    const button = screen.getByRole('link', { name: customText });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/login');
    // Check that custom text and styles are applied
    expect(button.className).toContain(customStyle);
  });
});
