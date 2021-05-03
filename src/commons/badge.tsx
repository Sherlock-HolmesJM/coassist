import styled from 'styled-components';

export interface BadgeProps {
  color:
    | 'warning'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'dark'
    | 'light'
    | 'info';
  text: string;
  classes?: string;
}

export interface DisplayBadge extends BadgeProps {
  count: number;
}

export interface ClickBadgeI extends BadgeProps {
  onClick: () => void;
}

const Badge: React.FC<DisplayBadge> = (props: DisplayBadge) => {
  const { color, text, count } = props;

  return (
    <span className={`badge bg-${color}`}>
      {text}: {count}
    </span>
  );
};

const ClickBadge: React.FC<ClickBadgeI> = (props: ClickBadgeI) => {
  const { color, text, onClick, classes } = props;

  return (
    <Span className={`fading-3 badge bg-${color} ${classes}`} onClick={onClick}>
      {text}
    </Span>
  );
};

const Span = styled.span`
  color: white;
  cursor: pointer;
  margin: 3px;
  font-size: 14px;
`;

export { Badge, ClickBadge };
