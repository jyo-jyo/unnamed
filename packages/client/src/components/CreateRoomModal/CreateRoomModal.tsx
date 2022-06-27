import React, { useRef, useState } from "react";
import { DropBox, Modal } from "@components/common";
import {
  CreateRoomModalContainer,
  DropBoxInputBox,
  InputBox,
} from "./CreateRoomModal.style";
import { USER_OPTIONS, ROUND_OPTIONS } from "@constants/constant";

const CreateRoomModal = ({
  isOpen,
  closeModal,
  createRoom,
}: {
  isOpen: boolean;
  closeModal: Function;
  createRoom: Function;
}) => {
  const roomName = useRef<HTMLInputElement>(null);
  const [maximumOfUser, setMaximum] = useState<number>();
  const [totalRound, setRound] = useState<number>();
  const isLocked = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    try {
      if (!roomName.current || !isLocked.current || !password.current) return;

      if (!roomName.current.value) throw new Error("방제목");
      if (!maximumOfUser) throw new Error("인원수");
      if (!totalRound) throw new Error("라운드");
      if (isLocked.current.checked && !password.current.value)
        throw new Error("password");
      createRoom({
        roomName: roomName.current.value,
        maximumOfUser,
        totalRound,
        isLocked: isLocked.current.checked,
        password: password.current.value,
      });
    } catch (error: any) {
      alert(`${error.message}를 입력해주세요`);
    }
  };
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <CreateRoomModalContainer>
        <InputBox>
          <span>방제목</span>
          <input ref={roomName}></input>
        </InputBox>
        <DropBoxInputBox>
          <InputBox>
            <span>인원수</span>
            <DropBox
              options={USER_OPTIONS}
              selected={maximumOfUser}
              setSelected={setMaximum}
            />
          </InputBox>
          <InputBox>
            <span>라운드</span>
            <DropBox
              options={ROUND_OPTIONS}
              selected={totalRound}
              setSelected={setRound}
            />
          </InputBox>
        </DropBoxInputBox>
        <div>
          <span>비밀번호 설정</span>
          <input ref={isLocked} type={"checkbox"}></input>
          <input ref={password} type={"password"}></input>
        </div>
        <button onClick={handleClick}>생성</button>
      </CreateRoomModalContainer>
    </Modal>
  );
};

export default CreateRoomModal;
