import React from 'react';
import { render, screen } from '@testing-library/react';
import Board from './Board';

test('renders Board component', () => {
	render(<Board />);
	const linkElement = screen.getByText(/board/i);
	expect(linkElement).toBeInTheDocument();
});