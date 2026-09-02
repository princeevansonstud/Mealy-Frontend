import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FoodCard from './FoodCard';

test('shows the title, price, and description', () => {
  render(
    <FoodCard
      title="Chicken Pilau"
      price="KSH 400"
      description="Spiced rice with chicken"
    />
  );

  expect(screen.getByText('Chicken Pilau')).toBeInTheDocument();
  expect(screen.getByText('KSH 400')).toBeInTheDocument();
  expect(screen.getByText('Spiced rice with chicken')).toBeInTheDocument();
});

test('calls onBuy when "Buy Munchies" is clicked', () => {
  const onBuy = jest.fn();
  render(<FoodCard onBuy={onBuy} />);

  fireEvent.click(screen.getByText('Buy Munchies'));

  expect(onBuy).toHaveBeenCalledTimes(1);
});

test('calls onAddToCart when "Add To FoodCart" is clicked', () => {
  const onAddToCart = jest.fn();
  render(<FoodCard onAddToCart={onAddToCart} />);

  fireEvent.click(screen.getByText('Add To FoodCart'));

  expect(onAddToCart).toHaveBeenCalledTimes(1);
});
