export interface NavItemProps {
  label: string;
  iconSrc: string;
  isActive?: boolean;
  isAvatar?: boolean;
  onClick?: () => void;
}
