import React from 'react';
import style from './ToggleButton.module.css'; // 외부 CSS 파일

function ToggleButton({ isToggled, onToggleChange }) {
  const handleToggle = () => {
    const newState = !isToggled;
    onToggleChange(newState); // 상태 변경 함수 호출
  };

  return (
    <div
      className={`${style.toggleButton} ${isToggled ? style.toggled : style.untoggled}`}
      onClick={handleToggle}
    >
      <div className={`${style.circle} ${isToggled ? style.right : style.left}`} />
    </div>
  );
}

export default ToggleButton;
