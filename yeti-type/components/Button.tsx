import { MouseEventHandler } from "react";

type Props = {
  text: string;
  variant: string;
  handleClick: MouseEventHandler;
};

const Button = ({ text, variant, handleClick }: Props) => {
  return <button onClick={handleClick}>{text}</button>;
};

export default Button;
