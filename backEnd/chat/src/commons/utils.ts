import { HttpStatus } from '@nestjs/common';

export const SOCKET = {
  NAME_SPACE: 'chat',
  EMPTY_ROOM: 0,
};

export const SOCKET_EVENT = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  NEW_MESSAGE: 'new_message',
  SEND_MESSAGE: 'send_message',
};

export const ERRORS = {
  ROOM_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '방 이름을 입력해주세요.',
  },
  MESSAGE_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '메시지를 입력해주세요.',
  },
};