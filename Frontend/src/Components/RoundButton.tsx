import './RoundButton.scss';

interface ButtonProps {
  className?:string;
  text:string;
  onClick:(e:any) => void;
}

export const RoundButton = (props:ButtonProps) => {
  return (
    <div 
      className={`${props.className !== undefined ? props.className : null} round-button`}
      onClick={e => props.onClick(e)}
    >
      <span className='button-text'>{props.text}</span>
    </div>
  )
}