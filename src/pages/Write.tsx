import {
  Button, Dialog, DialogActions, DialogContent,
} from '@material-ui/core';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import React, { useRef, useState } from 'react';
import Cookies from 'react-cookies';
import { useHistory } from 'react-router-dom';
import TextAreaAutoSize from 'react-textarea-autosize';
import styled from 'styled-components';

import Authorization from '../components/Authorization';
import DialogText from '../components/DialogText';
import DialogTitle from '../components/DialogTitle';

const Card = styled.div`
  display: flex;
  margin: auto;
  flex-flow: column;
  width: 13rem;
  border: 1px solid #ededf0;
  box-shadow: 12px 12px 12px #0000000a;
  background-color: #ffffff;
`;

const Title = styled.input`
  border: none;
  text-align: center;
  margin: 1rem auto;
  font-weight: bold;
`;

const Content = styled(TextAreaAutoSize)`
  border: none;
  margin: -1rem 2rem 0.5rem auto;
  white-space: pre-wrap;
  margin: 0 1rem 2rem 1rem;
  font-size: 0.625rem;
  resize: none;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonEx = styled(Button)`
  margin: 3rem !important;
`;

const Write: React.FC = () => {
  const poemTitle = useRef<HTMLInputElement>(null);
  const poemContent = useRef<HTMLTextAreaElement>(null);
  const goToHome = useRef<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContentText, setDialogContentText] = useState('');
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const write = async () => {
    try {
      const token = await Cookies.load('accessToken');
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/card`,
        { title: poemTitle.current!.value, content: poemContent.current!.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === StatusCodes.OK) {
        goToHome.current = true;
        handleOpen('저장 완료', '성공적으로 시를 저장했습니다.');
      }
    } catch (err) {
      switch (err.response.status) {
        case StatusCodes.BAD_REQUEST:
          handleOpen('저장 실패', err.response.data);
          break;
        default:
          handleOpen('저장 실패', err.toString());
          break;
      }
    }
  };

  const handleOpen = (title: string, contentText: string) => {
    setDialogTitle(title);
    setDialogContentText(contentText);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (goToHome) {
      history.push('/');
    }
  };

  return (
    <Authorization>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogText>{dialogContentText}</DialogText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <Container>
        <Card>
          <Title type="text" ref={poemTitle} placeholder="제목" />
          <Content role="textbox" ref={poemContent} placeholder="내용" />
        </Card>
        <ButtonEx variant="contained" disableElevation onClick={write}>
          저장
        </ButtonEx>
      </Container>
    </Authorization>
  );
};

export default Write;
