import { GET_COMMENT } from '../Actions/Types';

const initialState = {
  comments: [],
  loading: true,
};

const CommentReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMENT:
      return {
        ...state,
        comments: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default CommentReducers;
