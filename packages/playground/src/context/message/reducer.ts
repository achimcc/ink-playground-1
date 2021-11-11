export const defaultState: State = {
  messages: [
    { id: 1, prompt: 'SYSTEM', status: 'IN_PROGRESS', content: 'loading rust analyzer...' },
    { id: 2, prompt: 'COMPILE', status: 'IN_PROGRESS', content: 'compiling...' },
    { id: 3, prompt: 'GIST', status: 'IN_PROGRESS', content: 'creating gist...' },
    { id: 1, prompt: 'SYSTEM', status: 'DONE', content: 'rust analyzer ready' },
  ],
  nextId: 4,
};

// -> Components
type Prompt = 'COMPILE' | 'SYSTEM' | 'GIST';

// ->Components
type Status = 'IN_PROGRESS' | 'DONE' | 'ERROR';

// -> Components
type Message = {
  id: number;
  prompt: Prompt;
  status: Status;
  content?: string;
};

export type State = {
  messages: Array<Message>;
  nextId: number;
};

export type Action = {
  type: 'LOG_COMPILE' | 'LOG_SYSTEM' | 'LOG_GIST';
  payload: {
    status: Status;
    content: string;
  };
};

export type Dispatch = (action: Action) => void;

const lastId = (state: State, prompt: Prompt): number => {
  const id = Math.max(
    ...state.messages.filter(message => message.prompt === 'COMPILE').map(message => message.id)
  );
  return id;
};

export const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case 'LOG_COMPILE':
      if (payload.status === 'IN_PROGRESS') {
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'COMPILE',
          status: 'IN_PROGRESS',
          content: payload.content,
        };
        return {
          ...state,
          messages: [...state.messages, newMessage],
          nextId: state.nextId + 1,
        };
      } else {
        const id = lastId(state, 'COMPILE');
        const updateMessage: Message = {
          id,
          prompt: 'COMPILE',
          status: payload.status,
        };
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'COMPILE',
          status: payload.status,
          content: payload.content,
        };
        return {
          ...state,
          messages: [...state.messages, updateMessage],
          nextId: state.nextId + 1,
        };
      }
      break;
    case 'LOG_SYSTEM':
      return state;
      break;
    case 'LOG_GIST':
      return state;
      break;
    default:
      return state;
  }
};
