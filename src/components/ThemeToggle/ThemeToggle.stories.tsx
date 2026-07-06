import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
// Asumiendo que existe un ThemeProvider en la aplicación que podemos usar o simular
// En este caso, ThemeToggle usa hooks, por lo que es posible que necesite el proveedor de contexto.

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Esta historia básica funcionará si el ThemeToggle es agnóstico, o puede fallar 
// temporalmente en Storybook si el hook de contexto `useTheme` lanza error por no estar envuelto.
// En caso de que se necesite, se añadiría un Decorator aquí.
export const Default: Story = {
  args: {},
};
