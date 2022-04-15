import { useContext, createContext, useReducer } from "react";
import axios from "axios";
import { SharedReducer, InitialSharedState } from "../utils";

const WatchLaterContext = createContext(InitialSharedState);

const WatchLaterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SharedReducer, InitialSharedState);
  const {
    data: watchLaterVideos,
    loading: isWatchLaterVideoLoading,
    error: watchlaterVideoError,
  } = state;

  const config = {
    headers: {
      authorization: localStorage.getItem("videoToken"),
    },
  };

  const getWatchLaterVideos = async () => {
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.get("/api/user/watchlater", config);
      if (response.status === 200) {
        dispatch({ type: "SUCCESS", payload: response.data.watchlater });
      }
    } catch (error) {
      dispatch({ type: "ERROR", payload: error });
      console.error(error);
    }
  };

  const addItemToWatchLater = async (video) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.post(
        "/api/user/watchlater",
        { video },
        config
      );
      if (response.status === 201) {
        dispatch({ type: "SUCCESS", payload: response.data.watchlater });
      }
    } catch (error) {
      dispatch({ type: "ERROR", payload: error });
      console.error(error);
    }
  };

  const removeItemFromWatchLater = async (_id) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.delete(
        `/api/user/watchlater/${_id}`,
        config
      );
      if (response.status === 200) {
        dispatch({ type: "SUCCESS", payload: response.data.watchlater });
      }
    } catch (error) {
      dispatch({ type: "ERROR", payload: error });
    }
  };

  return (
    <WatchLaterContext.Provider
      value={{
        getWatchLaterVideos,
        removeItemFromWatchLater,
        addItemToWatchLater,
        watchLaterVideos,
        isWatchLaterVideoLoading,
        watchlaterVideoError,
      }}
    >
      {children}
    </WatchLaterContext.Provider>
  );
};

const useWatchLater = () => useContext(WatchLaterContext);

export { WatchLaterProvider, useWatchLater };
