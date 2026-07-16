export interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'small' | 'large';
  showEditButton?: boolean;
  onEditClick?: () => void;
}
