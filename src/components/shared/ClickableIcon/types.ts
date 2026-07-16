export interface ClickableIconProps {
  src: string;
  alt?: string;
  size?: 'medium' | 'small';
  onClick?: () => void;
}
