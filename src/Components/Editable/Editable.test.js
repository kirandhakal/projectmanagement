import React from 'react';
import { render, screen } from '@testing-library/react';
import Editable from './Editable';

test('renders Editable component', () => {
	render(<Editable />);
	const element = screen.getByText(/editable/i);
	expect(element).toBeInTheDocument();
});