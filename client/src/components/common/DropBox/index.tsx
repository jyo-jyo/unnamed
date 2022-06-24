import React, { useState, useRef } from "react";
import {
  DropBoxContainer,
  DropBoxButton,
  DropBoxItemBox,
  DropBoxItem,
} from "@components/common/DropBox/DropBox.style";
const DropBox = ({
  options,
  selected,
  setSelected,
}: {
  options: number[] | string[];
  selected: string | number | undefined;
  setSelected: Function;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isActive = useRef<boolean>(false);

  return (
    <DropBoxContainer
      onMouseOver={() => (isActive.current = true)}
      onMouseLeave={() => (isActive.current = false)}
    >
      <DropBoxButton onClick={() => setIsOpen((prev) => !prev)}>
        {selected}
      </DropBoxButton>
      <DropBoxItemBox isOpen={isOpen}>
        {options.map((option, index) => (
          <DropBoxItem
            onClick={() => {
              setSelected(option);
              setIsOpen(false);
            }}
            isFirst={index === 0}
            isLast={index === options.length - 1}
            key={index}
          >
            {option}
          </DropBoxItem>
        ))}
      </DropBoxItemBox>
    </DropBoxContainer>
  );
};

export default DropBox;
