import {
  SET_MESSAGES,
  AllActions,
  SET_MEMBERS,
  SET_MM,
  SET_CG,
  SPIN,
  SET_STATE,
} from './types';
import { State } from './context';

export const reducer = (state: State, action: AllActions) => {
  switch (action.type) {
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case SPIN:
      return { ...state, spin: action.payload };

    case SET_CG:
      return {
        ...state,
        ...action.payload,
      };

    case SET_MEMBERS:
      return {
        ...state,
        members: [...action.payload],
      };

    case SET_MESSAGES:
      return {
        ...state,
        messages: [...action.payload],
      };

    case SET_MM:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
