import React, { useState } from "react";
import {
  DropBoxContainer,
  DropBoxButton,
  DropBoxItemBox,
  DropBoxItem,
} from "./DropBox.style";
const DropBox = (
  options: [],
  selected: string | undefined,
  setSelected: Function
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <DropBoxContainer>
      <DropBoxButton>{selected}</DropBoxButton>
      <DropBoxItemBox isOpen={isOpen}>
        {options.map((option) => (
          <DropBoxItem
            onClick={() => {
              setSelected(option);
              setIsOpen(false);
            }}
          >
            {option}
          </DropBoxItem>
        ))}
      </DropBoxItemBox>
    </DropBoxContainer>
  );
};

export default DropBox;
